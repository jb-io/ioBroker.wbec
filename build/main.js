"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_wbecDevice = __toESM(require("./wbecDevice"));
var import_lodash = __toESM(require("lodash"));
class Wbec extends utils.Adapter {
  requestInterval = void 0;
  _wbecDevice = null;
  _wbecConfig = null;
  constructor(options = {}) {
    super({
      ...options,
      name: "wbec"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.update = import_lodash.default.throttle(this.update.bind(this), 1e3);
  }
  get wbecDevice() {
    return this._wbecDevice;
  }
  get wbecConfig() {
    return this._wbecConfig;
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    await this.setState("info.connection", false, true);
    if (!this.config.host) {
      return;
    }
    try {
      this._wbecDevice = new import_wbecDevice.default(this.config.host);
      this._wbecConfig = await this.wbecDevice.requestConfig();
    } catch (e) {
      this.log.error(`${e}`);
      return;
    }
    if (this.config.energyMeterId) {
      this.onEnergyMeterChange = import_lodash.default.throttle(this.onEnergyMeterChange.bind(this), this.wbecConfig.cfgPvCycleTime * 1e3);
      this.subscribeForeignStates(this.config.energyMeterId);
    }
    await this.createConfigStates();
    await this.createStates();
    this.requestInterval = this.setInterval(this.onInterval.bind(this), this.config.requestInterval * 1e3);
    this.update();
    for (let boxId = 0; boxId < this.wbecConfig.cfgCntWb; boxId++) {
      this.setTimeout(() => this.updateChargeLog(boxId), (3 + boxId) * 1e3);
    }
  }
  update() {
    this.setTimeout(this.onInterval.bind(this), 1e3);
  }
  async onInterval() {
    try {
      const response = await this.wbecDevice.requestJson();
      await this.setState("info.connection", true, true);
      for (const boxKey in response.box) {
        const boxState = response.box[boxKey];
        if (boxState) {
          for (const state in boxState) {
            let val = boxState[state];
            switch (state) {
              case "currLim":
              case "currFs":
              case "currL1":
              case "currL2":
              case "currL3":
              case "lmReq":
              case "lmLim":
              case "pcbTemp":
                val = val ? val / 10 : val;
                break;
            }
            await this.setState(`box${boxKey}.${state}`, val, true);
          }
          let phases = 0;
          for (const key of ["currL1", "currL2", "currL3"]) {
            if (+boxState[key] > 60) {
              phases++;
            }
          }
          await this.setState(`box${boxKey}.phases`, phases, true);
        }
      }
      for (const key in response.rfid) {
        const val = response.rfid[key];
        await this.setState(`rfid.${key}`, val, true);
      }
      for (const key in response.wbec) {
        const val = response.wbec[key];
        await this.setState(`wbec.${key}`, val, true);
      }
      for (const key in response.pv) {
        const val = response.pv[key];
        await this.setState(`pv.${key}`, val, true);
      }
      for (const key in response.wifi) {
        const val = response.wifi[key];
        await this.setState(`wifi.${key}`, val, true);
      }
      for (const key in response.modbus.state) {
        const val = response.modbus.state[key];
        await this.setState(`modbus.state.${key}`, val, true);
      }
    } catch {
      await this.setState("info.connection", false, true);
    }
  }
  async updateChargeLog(boxId) {
    this.log.debug(`Update charge log for Box: ${boxId}`);
    const chargeLog = await this.wbecDevice.requestChargeLog(boxId, 10);
    const chargeLogPrefix = `box${boxId}.chargeLog`;
    await this.delObjectAsync(chargeLogPrefix, { recursive: true });
    let index = chargeLog.line.length - 1;
    for (const line of chargeLog.line) {
      const idPrefix = `${chargeLogPrefix}.${index--}`;
      await this.extendObject(idPrefix + ".timestamp", {
        type: "state",
        common: {
          name: "Zeitstempel",
          type: "number",
          role: "timestamp",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".timestamp", line.timestamp, true));
      await this.extendObject(idPrefix + ".duration", {
        type: "state",
        common: {
          name: "Ladedauer",
          type: "number",
          role: "interval",
          unit: "s",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".duration", line.duration, true));
      await this.extendObject(idPrefix + ".energy", {
        type: "state",
        common: {
          name: "Lademenge",
          type: "number",
          role: "value.energy",
          unit: "Wh",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".energy", line.energy, true));
      await this.extendObject(idPrefix + ".user", {
        type: "state",
        common: {
          name: "Benutzer",
          type: "number",
          role: "value",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".user", line.user, true));
    }
  }
  async onBoxStateChange(boxId, parameter, state) {
    switch (parameter) {
      case "currLim": {
        await this.wbecDevice.setCurrentLimit(boxId, state.val * 10);
        break;
      }
      case "chgStat": {
        this.setTimeout(() => this.updateChargeLog(boxId), 1e3);
        break;
      }
    }
  }
  async onPvStateChange(parameter, state) {
    const value = state.val;
    switch (parameter) {
      case "mode": {
        await this.wbecDevice.setPvValue({ pvMode: value });
        break;
      }
      case "watt": {
        await this.wbecDevice.setPvValue({ pvWatt: value });
        break;
      }
      case "wbId": {
        await this.wbecDevice.setPvValue({ pvWbId: value });
        break;
      }
    }
  }
  async onEnergyMeterChange(state) {
    if (state.ack && null !== state.val) {
      this.log.info(JSON.stringify(await this.wbecDevice.setPvValue({ pvWatt: +state.val })));
    }
  }
  /**
   * Is called if a subscribed state changes
   */
  async onStateChange(id, state) {
    if (state) {
      if (id === this.config.energyMeterId) {
        await this.onEnergyMeterChange(state);
        return;
      }
      if (state.ack) {
        return;
      }
      const boxExpressionMatch = id.match(/.box(\d+).(\w+)$/);
      if (boxExpressionMatch && boxExpressionMatch.length > 0) {
        const boxId = parseInt(boxExpressionMatch[1]);
        const parameter = boxExpressionMatch[2];
        await this.onBoxStateChange(boxId, parameter, state);
        this.update();
        return;
      }
      const pvExpressionMatch = id.match(/.pv.(\w+)$/);
      if (pvExpressionMatch && pvExpressionMatch.length > 0) {
        const parameter = pvExpressionMatch[1];
        await this.onPvStateChange(parameter, state);
        this.update();
        return;
      }
    } else {
      this.log.debug(`state ${id} deleted`);
      this.setTimeout(this.createStates.bind(this), 1e3);
    }
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  onUnload(callback) {
    try {
      this.clearInterval(this.requestInterval);
      callback();
    } catch {
      callback();
    }
  }
  async createConfigStates() {
    const promises = [];
    if (await this.objectExists(`cfg`)) {
      await this.delObjectAsync(`cfg`, { recursive: true });
    }
    await this.extendObject(`cfg`, {
      type: "device"
    });
    for (const wbecConfigKey in this.wbecConfig) {
      const id = `cfg.${wbecConfigKey}`;
      const value = this.wbecConfig[wbecConfigKey];
      promises.push(this.extendObject(id, {
        type: "state",
        common: {
          name: wbecConfigKey,
          write: false,
          type: typeof value
        }
      }).then(() => this.setState(id, value, true)));
    }
    return Promise.any(promises);
  }
  // Only Create states after this line:
  async createStates() {
    const initPromises = [];
    initPromises.push(this.createWbecStates());
    for (let boxId = 0; boxId < this.wbecConfig.cfgCntWb; boxId++) {
      initPromises.push(this.createBoxStates(boxId));
    }
    await Promise.all(initPromises);
  }
  async createWbecStates() {
    let idPrefix = "";
    idPrefix = "wbec";
    await this.extendObject(idPrefix, {
      type: "device"
    });
    await this.extendObject(`${idPrefix}.version`, {
      type: "state",
      common: {
        name: "version",
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.bldDate`, {
      type: "state",
      common: {
        name: "bldDate",
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.timeNow`, {
      type: "state",
      common: {
        name: "timeNow",
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.enwg14a`, {
      type: "state",
      common: {
        name: "enwg14a",
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.enwgErr`, {
      type: "state",
      common: {
        name: "enwgErr",
        role: "value",
        type: "number",
        write: false
      }
    });
    idPrefix = "modbus";
    await this.extendObject(idPrefix, {
      type: "device"
    });
    await this.extendObject(`${idPrefix}.state.lastTm`, {
      type: "state",
      common: {
        name: "lastTm",
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.state.millis`, {
      type: "state",
      common: {
        name: "millis",
        role: "value.interval",
        type: "number",
        unit: "ms",
        write: false
      }
    });
    idPrefix = "rfid";
    await this.extendObject(idPrefix, {
      type: "device"
    });
    await this.extendObject(`${idPrefix}.enabled`, {
      type: "state",
      common: {
        name: "enabled",
        role: "indicator",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.release`, {
      type: "state",
      common: {
        name: "release",
        role: "indicator",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.lastId`, {
      type: "state",
      common: {
        name: "lastId",
        role: "text",
        type: "string",
        write: false
      }
    });
    idPrefix = "pv";
    await this.extendObject(idPrefix, {
      type: "device"
    });
    await this.extendObject(`${idPrefix}.mode`, {
      type: "state",
      common: {
        name: "mode",
        role: "inditator",
        type: "number",
        states: {
          0: "Disabled",
          1: "Off",
          2: "Pv",
          3: "PvWithMin"
        },
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.watt`, {
      type: "state",
      common: {
        name: "watt",
        role: "value.energy",
        type: "number",
        unit: "W",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.wbId`, {
      type: "state",
      common: {
        name: "wbId",
        role: "value",
        type: "number",
        write: true
      }
    });
    this.subscribeStates(`${idPrefix}.*`);
    idPrefix = "wifi";
    await this.extendObject(idPrefix, {
      type: "device"
    });
    await this.extendObject(`${idPrefix}.mac`, {
      type: "state",
      common: {
        name: "mac",
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.rssi`, {
      type: "state",
      common: {
        name: "rssi",
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.signal`, {
      type: "state",
      common: {
        name: "signal",
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.channel`, {
      type: "state",
      common: {
        name: "channel",
        role: "value",
        type: "number",
        write: false
      }
    });
  }
  async createBoxStates(boxId) {
    const idPrefix = `box${boxId}`;
    await this.extendObject(idPrefix, {
      type: "device"
    });
    await this.extendObject(`${idPrefix}.busId`, {
      type: "state",
      common: {
        name: "Bus Id",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.version`, {
      type: "state",
      common: {
        name: "version",
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.chgStat`, {
      type: "state",
      common: {
        name: "chgStat",
        role: "indicator",
        type: "number",
        write: false
      }
      /*
      switch (message.chgStat) {
          case  2: / carStat = 'nein'; wbStat = 'nein'; break;              // A1
          case  3: / carStat = 'nein'; wbStat = 'ja'; break;                // A2
          case  4: / carStat = 'ja, ohne Ladeanf.'; wbStat = 'nein'; break; // B1
          case  5: / carStat = 'ja, ohne Ladeanf.'; wbStat = 'ja'; break;   // B2
          case  6: / carStat = 'ja,  mit Ladeanf.'; wbStat = 'nein'; break; // C1
          case  7: / carStat = 'ja,  mit Ladeanf.'; wbStat = 'ja'; break;   // C2
          default: carStat = message.chgStat; wbStat = '-';
       */
    });
    await this.extendObject(`${idPrefix}.currL1`, {
      type: "state",
      common: {
        name: "Strom Phase 1",
        role: "value.current",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currL2`, {
      type: "state",
      common: {
        name: "Strom Phase 2",
        role: "value.current",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currL3`, {
      type: "state",
      common: {
        name: "Strom Phase 3",
        role: "value.current",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.pcbTemp`, {
      type: "state",
      common: {
        name: "Controller Temperatur",
        role: "value.temp",
        type: "number",
        unit: "\xB0C",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.voltL1`, {
      type: "state",
      common: {
        name: "Spannung Phase 1",
        role: "value.voltage",
        type: "number",
        unit: "V",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.voltL2`, {
      type: "state",
      common: {
        name: "Spannung Phase 2",
        role: "value.voltage",
        type: "number",
        unit: "V",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.voltL3`, {
      type: "state",
      common: {
        name: "Spannung Phase 3",
        role: "value.voltage",
        type: "number",
        unit: "V",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.extLock`, {
      type: "state",
      common: {
        name: "extLock",
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.power`, {
      type: "state",
      common: {
        name: "Power",
        type: "number",
        write: false,
        role: "value.power.consumed",
        unit: "W"
      }
    });
    await this.extendObject(`${idPrefix}.energyP`, {
      type: "state",
      common: {
        name: "energyP",
        role: "value.energy",
        type: "number",
        unit: "kWh",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.energyI`, {
      type: "state",
      common: {
        name: "Energiez\xE4hler",
        role: "value.energy",
        type: "number",
        unit: "kWh",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.energyC`, {
      type: "state",
      common: {
        name: "Ladevorgang",
        role: "value.energy",
        type: "number",
        unit: "kWh",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currMax`, {
      type: "state",
      common: {
        name: "currMax",
        role: "value.current",
        type: "number",
        unit: "A",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currMin`, {
      type: "state",
      common: {
        name: "currMin",
        role: "value.current",
        type: "number",
        unit: "A",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.logStr`, {
      type: "state",
      common: {
        name: "logStr",
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.wdTmOut`, {
      type: "state",
      common: {
        name: "wdTmOut",
        role: "value.interval",
        type: "number",
        unit: "ms",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.standby`, {
      type: "state",
      common: {
        name: "standby",
        role: "state",
        type: "number",
        desc: "Reg. 258: Standby Function Control",
        states: {
          0: "enable standby",
          4: "disable standby"
        },
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.remLock`, {
      type: "state",
      common: {
        name: "remLock",
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currLim`, {
      type: "state",
      common: {
        name: "currLim",
        role: "value.current",
        type: "number",
        unit: "A",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.currFs`, {
      type: "state",
      common: {
        name: "currFs",
        role: "value.current",
        type: "number",
        unit: "A",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.lmReq`, {
      type: "state",
      common: {
        name: "lmReq",
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.lmLim`, {
      type: "state",
      common: {
        name: "lmLim",
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.resCode`, {
      type: "state",
      common: {
        name: "resCode",
        role: "state",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.failCnt`, {
      type: "state",
      common: {
        name: "failCnt",
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.phases`, {
      type: "state",
      common: {
        name: "Phasen",
        role: "value",
        type: "number",
        write: false
      }
    });
    this.subscribeStates(`${idPrefix}.currLim`);
    this.subscribeStates(`${idPrefix}.chgStat`);
  }
}
if (require.main !== module) {
  module.exports = (options) => new Wbec(options);
} else {
  (() => new Wbec())();
}
//# sourceMappingURL=main.js.map
