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
var import_WbecClient = __toESM(require("wbec-client/dist/WbecClient"));
var i18n = __toESM(require("./i18n"));
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
    const throttleMs = this.config.maxRequestInterval * 1.1;
    this.update = import_lodash.default.throttle(this.update.bind(this), this.boundTimeoutValue(throttleMs));
  }
  get wbecDevice() {
    return this._wbecDevice;
  }
  get wbecConfig() {
    return this._wbecConfig;
  }
  boundTimeoutValue(ms) {
    const min = 16;
    const max = 2147483647;
    return Math.max(min, Math.min(ms, max));
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
      this._wbecDevice = new import_WbecClient.default(this.config.host, {
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
    const intervalMs = Math.max(this.config.maxRequestInterval * 1.1, this.config.requestInterval * 1e3);
    this.requestInterval = this.setInterval(this.onInterval.bind(this), this.boundTimeoutValue(intervalMs));
    this.update();
    if (this.config.energyMeterId) {
      const throttleMs = Math.max(this.config.maxRequestInterval * 1.1, this.wbecConfig.cfgPvCycleTime * 1e3);
      this.onEnergyMeterChange = import_lodash.default.throttle(this.onEnergyMeterChange.bind(this), this.boundTimeoutValue(throttleMs));
      this.subscribeForeignStates(this.config.energyMeterId);
    }
    if (this._enableChargeLog) {
      for (let boxId = 0; boxId < this.wbecConfig.cfgCntWb; boxId++) {
        const timeoutMs = (3 + boxId) * this.config.maxRequestInterval;
        this.setTimeout(() => this.updateChargeLog(boxId), this.boundTimeoutValue(timeoutMs));
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
              case "resCode":
                if (val !== "0") {
                  this.log.warn(`Received invalid response code for Box ${boxKey} (${state}=${val})`);
                }
            }
            await this.setState(`box${boxKey}.${state}`, val, true);
          }
          switch (boxState.chgStat || null) {
            case 2:
              await this.setState(`box${boxKey}.vehiclePlugged`, false, true);
              await this.setState(`box${boxKey}.vehicleChargingRequest`, false, true);
              await this.setState(`box${boxKey}.chargingAllowed`, false, true);
              break;
            case 3:
              await this.setState(`box${boxKey}.vehiclePlugged`, false, true);
              await this.setState(`box${boxKey}.vehicleChargingRequest`, false, true);
              await this.setState(`box${boxKey}.chargingAllowed`, true, true);
              break;
            case 4:
              await this.setState(`box${boxKey}.vehiclePlugged`, true, true);
              await this.setState(`box${boxKey}.vehicleChargingRequest`, false, true);
              await this.setState(`box${boxKey}.chargingAllowed`, false, true);
              break;
            case 5:
              await this.setState(`box${boxKey}.vehiclePlugged`, true, true);
              await this.setState(`box${boxKey}.vehicleChargingRequest`, false, true);
              await this.setState(`box${boxKey}.chargingAllowed`, true, true);
              break;
            case 6:
              await this.setState(`box${boxKey}.vehiclePlugged`, true, true);
              await this.setState(`box${boxKey}.vehicleChargingRequest`, true, true);
              await this.setState(`box${boxKey}.chargingAllowed`, false, true);
              break;
            case 7:
              await this.setState(`box${boxKey}.vehiclePlugged`, true, true);
              await this.setState(`box${boxKey}.vehicleChargingRequest`, true, true);
              await this.setState(`box${boxKey}.chargingAllowed`, true, true);
              break;
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
      if (!chargeLog || !chargeLog.line || !Array.isArray(chargeLog.line)) {
        this.log.warn(`Received invalid charge log format for Box: ${boxId}`);
        return;
      }
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
          name: i18n.chargeLog["timestamp"],
          type: "number",
          role: "timestamp",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".timestamp", line.timestamp, true));
      await this.extendObject(idPrefix + ".duration", {
        type: "state",
        common: {
          name: i18n.chargeLog["duration"],
          type: "number",
          role: "interval",
          unit: "s",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".duration", line.duration, true));
      await this.extendObject(idPrefix + ".energy", {
        type: "state",
        common: {
          name: i18n.chargeLog["energy"],
          type: "number",
          role: "value.energy",
          unit: "Wh",
          write: false
        }
      }).then(() => this.setState(idPrefix + ".energy", line.energy, true));
      await this.extendObject(idPrefix + ".user", {
        type: "state",
        common: {
          name: i18n.chargeLog["user"],
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
      case "currFs":
        if (!ack) {
          try {
            const current = this.roundCurrent(newState.val);
            this.log.debug(`set failsafeCurrentLimit to ${current}A for Box: ${boxId}`);
            const response = await this.wbecDevice.setFailsafeCurrentLimit(boxId, current * 10);
            this.log.debug(`Received failsafeCurrentLimit response`);
            this.log.silly(`setFailsafeCurrentLimit response:
${JSON.stringify(response, null, 2)}`);
            return true;
          } catch (error) {
            this.log.error(`Error while setting failsafe current limit for Box: ${boxId} to ${newState.val}
${error}`);
          }
        }
        break;
      case "standby":
        if (!ack) {
          try {
            const standbyValue = Number(newState.val);
            this.log.debug(`set standby to ${standbyValue} for Box: ${boxId}`);
            const response = await this.wbecDevice.setStandby(boxId, standbyValue);
            this.log.debug(`Received standby response`);
            this.log.silly(`setStandby response:
${JSON.stringify(response, null, 2)}`);
            return true;
          } catch (error) {
            this.log.error(`Error while setting standby for Box: ${boxId} to ${newState.val}
${error}`);
          }
        }
        break;
      case "remLock":
        if (!ack) {
          try {
            const remLockValue = Number(newState.val);
            this.log.debug(`set remLock to ${remLockValue} for Box: ${boxId}`);
            const response = await this.wbecDevice.setRemLock(boxId, remLockValue);
            this.log.debug(`Received remLock response`);
            this.log.silly(`setRemLock response:
${JSON.stringify(response, null, 2)}`);
            return true;
          } catch (error) {
            this.log.error(`Error while setting remLock for Box: ${boxId} to ${newState.val}
${error}`);
          }
        }
        break;
      case "wdTmOut":
        if (!ack) {
          try {
            const timeout = Number(newState.val);
            this.log.debug(`set watchdogTimeout to ${timeout} for Box: ${boxId}`);
            const response = await this.wbecDevice.setWatchdogTimeout(boxId, timeout);
            this.log.debug(`Received watchdogTimeout response`);
            this.log.silly(`setWatchdogTimeout response:
${JSON.stringify(response, null, 2)}`);
            return true;
          } catch (error) {
            this.log.error(`Error while setting watchdog timeout for Box: ${boxId} to ${newState.val}
${error}`);
          }
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
      this.wbecDevice.clientReset();
      callback();
    } catch {
      callback();
    }
  }
  sanitizeObjectId(name) {
    return (name || "").replace(this.FORBIDDEN_CHARS, "_").replace(/[.\s]/g, "_");
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
      const id = `cfg.${this.sanitizeObjectId(wbecConfigKey)}`;
      const value = this.wbecConfig[wbecConfigKey];
      const name = wbecConfigKey in i18n.cfg ? i18n.cfg[wbecConfigKey] : wbecConfigKey;
      promises.push(this.extendObject(id, {
        type: "state",
        common: {
          name,
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
        name: i18n.json[`${idPrefix}.version`],
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.bldDate`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.bldDate`],
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.timeNow`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.timeNow`],
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.enwg14a`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.enwg14a`],
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.enwgErr`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.enwgErr`],
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
        name: i18n.json[`${idPrefix}.state.lastTm`],
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.state.millis`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.state.millis`],
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
        name: i18n.json[`${idPrefix}.enabled`],
        role: "indicator",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.release`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.release`],
        role: "indicator",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.lastId`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.lastId`],
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
        name: i18n.json[`${idPrefix}.mode`],
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
        name: i18n.json[`${idPrefix}.watt`],
        role: "value.energy",
        type: "number",
        unit: "W",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.wbId`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.wbId`],
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
        name: i18n.json[`${idPrefix}.mac`],
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.rssi`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.rssi`],
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.signal`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.signal`],
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.channel`, {
      type: "state",
      common: {
        name: i18n.json[`${idPrefix}.channel`],
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
        name: i18n.box[`busId`],
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.version`, {
      type: "state",
      common: {
        name: i18n.box[`version`],
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.chgStat`, {
      type: "state",
      common: {
        name: i18n.box[`chgStat`],
        role: "indicator",
        type: "number",
        write: false,
        states: {
          2: "State A1, No vehicle connected, wallbox does not allow charging",
          3: "State A2, No vehicle connected, wallbox allows charging",
          4: "State B1, Vehicle connected without charging request, wallbox does not allow charging",
          5: "State B2, Vehicle connected without charging request, wallbox allows charging",
          6: "State C1, Vehicle connected with charging request, wallbox does not allow charging",
          7: "State C2, Vehicle connected with charging request, wallbox allows charging",
          8: "Derating",
          9: "State E, Error",
          10: "State F, Wallbox locked or not ready",
          11: "Error"
        }
      }
    });
    await this.extendObject(`${idPrefix}.vehiclePlugged`, {
      type: "state",
      common: {
        name: i18n.box[`vehiclePlugged`],
        role: "sensor",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.vehicleChargingRequest`, {
      type: "state",
      common: {
        name: i18n.box[`vehicleChargingRequest`],
        role: "sensor",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.chargingAllowed`, {
      type: "state",
      common: {
        name: i18n.box[`chargingAllowed`],
        role: "sensor",
        type: "boolean",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currL1`, {
      type: "state",
      common: {
        name: i18n.box[`currL1`],
        role: "value.current",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currL2`, {
      type: "state",
      common: {
        name: i18n.box[`currL2`],
        role: "value.current",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currL3`, {
      type: "state",
      common: {
        name: i18n.box[`currL3`],
        role: "value.current",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.pcbTemp`, {
      type: "state",
      common: {
        name: i18n.box[`pcbTemp`],
        role: "value.temp",
        type: "number",
        unit: "\xB0C",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.voltL1`, {
      type: "state",
      common: {
        name: i18n.box[`voltL1`],
        role: "value.voltage",
        type: "number",
        unit: "V",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.voltL2`, {
      type: "state",
      common: {
        name: i18n.box[`voltL2`],
        role: "value.voltage",
        type: "number",
        unit: "V",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.voltL3`, {
      type: "state",
      common: {
        name: i18n.box[`voltL3`],
        role: "value.voltage",
        type: "number",
        unit: "V",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.extLock`, {
      type: "state",
      common: {
        name: i18n.box[`extLock`],
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.power`, {
      type: "state",
      common: {
        name: i18n.box[`power`],
        type: "number",
        write: false,
        role: "value.power.consumed",
        unit: "W"
      }
    });
    await this.extendObject(`${idPrefix}.powerTarget`, {
      type: "state",
      common: {
        name: i18n.box[`powerTarget`],
        type: "number",
        write: true,
        role: "value.power",
        unit: "W"
      }
    });
    await this.extendObject(`${idPrefix}.energyP`, {
      type: "state",
      common: {
        name: i18n.box[`energyP`],
        role: "value.energy",
        type: "number",
        unit: "kWh",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.energyI`, {
      type: "state",
      common: {
        name: i18n.box[`energyI`],
        role: "value.energy",
        type: "number",
        unit: "kWh",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.energyC`, {
      type: "state",
      common: {
        name: i18n.box[`energyC`],
        role: "value.energy",
        type: "number",
        unit: "kWh",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currMax`, {
      type: "state",
      common: {
        name: i18n.box[`currMax`],
        role: "value.current",
        type: "number",
        unit: "A",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.currMin`, {
      type: "state",
      common: {
        name: i18n.box[`currMin`],
        role: "value.current",
        type: "number",
        unit: "A",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.logStr`, {
      type: "state",
      common: {
        name: i18n.box[`logStr`],
        role: "text",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.wdTmOut`, {
      type: "state",
      common: {
        name: i18n.box[`wdTmOut`],
        role: "value.interval",
        type: "number",
        unit: "ms",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.standby`, {
      type: "state",
      common: {
        name: i18n.box[`standby`],
        role: "state",
        type: "number",
        desc: "Reg. 258: Standby Function Control",
        states: {
          0: "enable standby",
          4: "disable standby"
        },
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.remLock`, {
      type: "state",
      common: {
        name: i18n.box[`remLock`],
        role: "state",
        type: "number",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.currLim`, {
      type: "state",
      common: {
        name: i18n.box[`currLim`],
        role: "value.current",
        type: "number",
        unit: "A",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.currFs`, {
      type: "state",
      common: {
        name: i18n.box[`currFs`],
        role: "value.current",
        type: "number",
        unit: "A",
        write: true
      }
    });
    await this.extendObject(`${idPrefix}.lmReq`, {
      type: "state",
      common: {
        name: i18n.box[`lmReq`],
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.lmLim`, {
      type: "state",
      common: {
        name: i18n.box[`lmLim`],
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.resCode`, {
      type: "state",
      common: {
        name: i18n.box[`resCode`],
        role: "state",
        type: "string",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.failCnt`, {
      type: "state",
      common: {
        name: i18n.box[`failCnt`],
        role: "state",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.phases`, {
      type: "state",
      common: {
        name: i18n.box[`phases`],
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.extendObject(`${idPrefix}.phasesAvailable`, {
      type: "state",
      common: {
        name: i18n.box[`phasesAvailable`],
        role: "value",
        type: "number",
        write: false
      }
    });
    await this.setState(`${idPrefix}.powerTarget`, null, true);
    await this.setState(`${idPrefix}.phasesAvailable`, 1, true);
    this.subscribeStates(`${idPrefix}.currLim`);
    this.subscribeStates(`${idPrefix}.currFs`);
    this.subscribeStates(`${idPrefix}.standby`);
    this.subscribeStates(`${idPrefix}.remLock`);
    this.subscribeStates(`${idPrefix}.wdTmOut`);
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
