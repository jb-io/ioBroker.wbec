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
var import_lodash = __toESM(require("lodash"));
var import_wbec_client = require("wbec-client/dist/wbec-client");
class Wbec extends utils.Adapter {
  requestInterval = void 0;
  updateTimeout = void 0;
  _wbecDevice = null;
  _wbecConfig = null;
  _enableChargeLog = false;
  _previousStates = {};
  constructor(options = {}) {
    super({
      ...options,
      name: "wbec"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.update = import_lodash.default.throttle(this.update.bind(this), this.config.maxRequestInterval * 1.1);
  }
  get wbecDevice() {
    return this._wbecDevice;
  }
  get wbecConfig() {
    return this._wbecConfig;
  }
  roundCurrent(current) {
    if (current < 6) {
      return 0;
    }
    if (current >= 16) {
      return 16;
    }
    return Math.round(current * 10) / 10;
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    await this.setState("info.connection", false, true);
    if (!this.config.host) {
      this.log.error(`Exit because host is not configured`);
      return;
    }
    try {
      this._wbecDevice = new import_wbec_client.WbecClient(this.config.host, {
        timeout: this.config.requestTimeout,
        maxRequestInterval: this.config.maxRequestInterval
      });
      this.log.debug(`Request wbec config`);
      this._wbecConfig = await this.wbecDevice.requestConfig();
      this.log.debug(`Received wbec config`);
      this.log.silly(`wbec config:
${JSON.stringify(this._wbecConfig, null, 2)}`);
      this._enableChargeLog = !!(this._wbecConfig.cfgChargeLog || 0);
    } catch (e) {
      this.log.error(`${e}`);
      return;
    }
    await this.createConfigStates();
    await this.createStates();
    this.requestInterval = this.setInterval(this.onInterval.bind(this), Math.max(this.config.maxRequestInterval * 1.1, this.config.requestInterval * 1e3));
    this.update();
    if (this.config.energyMeterId) {
      this.onEnergyMeterChange = import_lodash.default.throttle(this.onEnergyMeterChange.bind(this), Math.max(this.config.maxRequestInterval * 1.1, this.wbecConfig.cfgPvCycleTime * 1e3));
      this.subscribeForeignStates(this.config.energyMeterId);
    }
    if (this._enableChargeLog) {
      for (let boxId = 0; boxId < this.wbecConfig.cfgCntWb; boxId++) {
        this.setTimeout(() => this.updateChargeLog(boxId), (3 + boxId) * this.config.maxRequestInterval);
      }
    }
  }
  update() {
    this.updateTimeout = this.setTimeout(this.onInterval.bind(this), 1e3);
  }
  async onInterval() {
    try {
      this.log.debug("Request json data from wbecDevice");
      const response = await this.wbecDevice.requestJson();
      this.log.debug("Received json data from wbecDevice for boxes: " + Object.keys(response.box).join(","));
      this.log.silly(`wbec json data:
${JSON.stringify(response, null, 2)}`);
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
          if (phases) {
            await this.setState(`box${boxKey}.phasesAvailable`, phases, true);
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
    } catch (error) {
      await this.setState("info.connection", false, true);
      this.log.error(`Error while updating data:
${error}`);
    }
  }
  async updateChargeLog(boxId) {
    let chargeLog;
    try {
      this.log.debug(`Request charge log for Box: ${boxId}`);
      chargeLog = await this.wbecDevice.requestChargeLog(boxId, 10);
      this.log.debug(`Received charge log for Box: ${boxId}`);
      this.log.silly(`Charge log for Box: ${boxId}:
${JSON.stringify(chargeLog, null, 2)}`);
    } catch (error) {
      this.log.error(`Error while updating charge log for Box: ${boxId}
${error}`);
      return;
    }
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
  async onBoxStateChange(boxId, parameter, newState, oldState, ack) {
    switch (parameter) {
      case "currLim":
        if (!ack) {
          await this.setState(`box${boxId}.powerTarget`, null, true);
          await this.setBoxCurrLim(boxId, newState.val);
          return true;
        }
        break;
      case "powerTarget":
        if (!ack) {
          await this.recalculatePowerTarget(boxId);
          return true;
        }
        break;
      case "phasesAvailable":
        if (newState.val !== (oldState == null ? void 0 : oldState.val)) {
          await this.recalculatePowerTarget(boxId);
          return true;
        }
        break;
      case "chgStat":
        if (oldState && newState.val !== (oldState == null ? void 0 : oldState.val)) {
          if (this._enableChargeLog) {
            await this.updateChargeLog(boxId);
          }
          if ((newState == null ? void 0 : newState.val) <= 3) {
            await this.setState(`box${boxId}.phasesAvailable`, 1, true);
          }
          return true;
        }
        break;
    }
    return false;
  }
  async onPvStateChange(parameter, state) {
    const value = state.val;
    try {
      switch (parameter) {
        case "mode": {
          this.log.debug(`Set pv value "${parameter}" to ${value}`);
          const response = await this.wbecDevice.setPvValue({ pvMode: value });
          this.log.debug(`Received pv response`);
          this.log.silly(`pv response:
${JSON.stringify(response, null, 2)}`);
          return true;
        }
        case "watt": {
          this.log.debug(`Set pv value "${parameter}" to ${value}`);
          const response = await this.wbecDevice.setPvValue({ pvWatt: value });
          this.log.debug(`Received pv response`);
          this.log.silly(`pv response:
${JSON.stringify(response, null, 2)}`);
          return true;
        }
        case "wbId": {
          this.log.debug(`Set pv value "${parameter}" to ${value}`);
          const response = await this.wbecDevice.setPvValue({ pvWbId: value });
          this.log.debug(`Received pv response`);
          this.log.silly(`pv response:
${JSON.stringify(response, null, 2)}`);
          return true;
        }
      }
    } catch (error) {
      this.log.error(`Error while setting pv value for parameter: ${parameter} to ${value}
${error}`);
    }
    return false;
  }
  async onEnergyMeterChange(state) {
    if (state.ack && null !== state.val) {
      try {
        this.log.debug(`Set pv value "pvWatt" to ${state.val} due to energy meter change`);
        const wbecPvResponse = await this.wbecDevice.setPvValue({ pvWatt: +state.val });
        this.log.debug(`Received pv response`);
        this.log.silly(`pv response:
${JSON.stringify(wbecPvResponse, null, 2)}`);
      } catch (error) {
        this.log.error(`Error while setting pv value for parameter: watt} to ${state.val}
${error}`);
      }
    }
  }
  matchBoxId(id) {
    const regexMatch = id.match(/.box(\d+).(\w+)$/);
    if (regexMatch && regexMatch.length >= 3) {
      return {
        boxId: parseInt(regexMatch[1]),
        parameter: regexMatch[2]
      };
    } else {
      return null;
    }
  }
  matchPvId(id) {
    const regexMatch = id.match(/.pv.(\w+)$/);
    if (regexMatch && regexMatch.length >= 2) {
      return {
        parameter: regexMatch[1]
      };
    } else {
      return null;
    }
  }
  async handleStateChange(id, newState, oldState) {
    const ack = newState.ack;
    const boxIdMatch = this.matchBoxId(id);
    if (boxIdMatch) {
      if (await this.onBoxStateChange(boxIdMatch.boxId, boxIdMatch.parameter, newState, oldState, ack)) {
        this.update();
      }
      return;
    }
    if (ack) {
      return;
    }
    if (id === this.config.energyMeterId) {
      await this.onEnergyMeterChange(newState);
      return;
    }
    const pvIdMatch = this.matchPvId(id);
    if (pvIdMatch) {
      if (await this.onPvStateChange(pvIdMatch.parameter, newState)) {
        this.update();
      }
      return;
    }
  }
  /**
   * Is called if a subscribed state changes
   */
  async onStateChange(id, state) {
    const oldState = this._previousStates[id] || null;
    this._previousStates[id] = state || null;
    if (!state) {
      this.log.debug(`newState ${id} deleted`);
      this.setTimeout(this.createStates.bind(this), 1e3);
    }
    await this.handleStateChange(id, state, oldState);
  }
  async onMessage(obj) {
    if (obj) {
      let boxId;
      switch (obj.command) {
        case "setCurrLim":
          if (typeof obj.message.id === "undefined") {
            this.log.warn('No value "id" found in message');
            return;
          }
          if (typeof obj.message.currLim === "undefined") {
            this.log.warn('No value "currLim" found in message');
            return;
          }
          boxId = obj.message.id;
          const currLim = obj.message.currLim;
          this.log.debug(`Received setCurrent message (id=${boxId}, currLim=${currLim})`);
          await this.setState(`box${boxId}.powerTarget`, null, true);
          await this.setBoxCurrLim(boxId, currLim);
          return;
        case "setPowerTarget":
          if (typeof obj.message.id === "undefined") {
            this.log.warn('No value "id" found in message');
            return;
          }
          if (typeof obj.message.powerTarget === "undefined") {
            this.log.warn('No value "powerTarget" found in message');
            return;
          }
          boxId = obj.message.id;
          const powerTarget = obj.message.powerTarget;
          this.log.debug(`Received setCurrent message (id=${boxId}, powerTarget=${powerTarget})`);
          await this.setState(`box${boxId}.powerTarget`, powerTarget, false);
          return;
        default:
          this.log.warn(`Received unknown message: ${obj.command}`);
      }
    }
  }
  async setBoxCurrLim(boxId, current) {
    try {
      current = this.roundCurrent(current);
      this.log.debug(`set currentLimit to ${current}A for Box: ${boxId}`);
      const response = await this.wbecDevice.setCurrentLimit(boxId, current * 10);
      this.log.debug(`Received setCurrentLimit response`);
      this.log.silly(`setCurrentLimit response:
${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      this.log.error(`Error while setting current limit for Box: ${boxId} to ${current}
${error}`);
    }
  }
  async recalculatePowerTarget(boxId) {
    var _a, _b, _c, _d, _e;
    const phases = (_a = await this.getStateAsync(`box${boxId}.phasesAvailable`)) == null ? void 0 : _a.val;
    const powerTarget = (_b = await this.getStateAsync(`box${boxId}.powerTarget`)) == null ? void 0 : _b.val;
    if (null === powerTarget) {
      return;
    }
    const voltages = [
      (_c = await this.getStateAsync(`box${boxId}.voltL1`)) == null ? void 0 : _c.val,
      (_d = await this.getStateAsync(`box${boxId}.voltL2`)) == null ? void 0 : _d.val,
      (_e = await this.getStateAsync(`box${boxId}.voltL3`)) == null ? void 0 : _e.val
    ].filter((v) => v !== void 0);
    const avgVolt = voltages.reduce((a, b) => a + b, 0) / (voltages.length || 1);
    const currLim = !avgVolt || !phases ? 0 : this.roundCurrent(powerTarget / phases / avgVolt);
    this.log.debug(`Recalculating power target for Box: ${boxId} to ${currLim}A, avgVolt=${avgVolt}V, powerTarget=${powerTarget}W, phases=${phases}`);
    await this.setState(`box${boxId}.powerTarget`, powerTarget, true);
    await this.setBoxCurrLim(boxId, currLim);
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  onUnload(callback) {
    try {
      this.clearInterval(this.requestInterval);
      this.clearTimeout(this.updateTimeout);
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
    let idPrefix = "wbec";
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
    await this.extendObject(`${idPrefix}.powerTarget`, {
      type: "state",
      common: {
        name: "Power Target",
        type: "number",
        write: true,
        role: "value.power",
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
    await this.extendObject(`${idPrefix}.phasesAvailable`, {
      type: "state",
      common: {
        name: "Phasen verf\xFCgbar",
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.setState(`${idPrefix}.powerTarget`, null, true);
    await this.setState(`${idPrefix}.phasesAvailable`, 1, true);
    this.subscribeStates(`${idPrefix}.currLim`);
    this.subscribeStates(`${idPrefix}.chgStat`);
    this.subscribeStates(`${idPrefix}.powerTarget`);
    this.subscribeStates(`${idPrefix}.phasesAvailable`);
  }
}
if (require.main !== module) {
  module.exports = (options) => new Wbec(options);
} else {
  (() => new Wbec())();
}
//# sourceMappingURL=main.js.map
