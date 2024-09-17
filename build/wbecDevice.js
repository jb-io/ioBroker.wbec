"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var wbecDevice_exports = {};
__export(wbecDevice_exports, {
  default: () => WbecDevice
});
module.exports = __toCommonJS(wbecDevice_exports);
var import_axios = __toESM(require("axios"));
class WbecDevice {
  _host;
  _errorHandler = null;
  _errorBubbling = true;
  constructor(host) {
    this._host = host;
  }
  setErrorHandler(onError, errorBubbling = false) {
    this._errorHandler = onError;
    this._errorBubbling = errorBubbling;
  }
  get host() {
    return "http://" + this._host;
  }
  async requestGet(uri, config) {
    return import_axios.default.get(`${this.host}${uri}`, {
      timeout: 2e3,
      ...config
    }).then((response) => response.data).catch((reason) => {
      if (this._errorHandler) {
        this._errorHandler(reason);
      }
      if (this._errorBubbling) {
        throw reason;
      }
    });
  }
  async requestGetJsonResponse(uri) {
    return this.requestGet(uri, { responseType: "json" });
  }
  async requestConfig() {
    return this.requestGetJsonResponse(`/cfg`);
  }
  async requestJson(id = null) {
    const idQuery = id !== null ? `?id=${id}` : "";
    return this.requestGetJsonResponse(`/json` + idQuery);
  }
  async requestPv() {
    return this.requestGetJsonResponse(`/pv`);
  }
  async requestStatus(id) {
    return this.requestGetJsonResponse(`/status?box=${id}`);
  }
  async requestChargeLog(id, length = 10) {
    return this.requestGetJsonResponse(`/chargelog?id=${id}&len=${length}`);
  }
  async setPvValue(parameters) {
    const queryParameters = [];
    for (const valueKey in parameters) {
      const value = parameters[valueKey];
      queryParameters.push(`${valueKey}=${value}`);
    }
    const queryString = queryParameters.join("&");
    console.log(queryString);
    return this.requestGetJsonResponse(`/pv?${queryString}`);
  }
  async setCurrentLimit(id, currentLimit) {
    const queryString = `?currLim=${currentLimit}&id=${id}`;
    return this.requestGetJsonResponse(`/json` + queryString);
  }
  async reset() {
    await this.requestGet("/reset");
  }
}
//# sourceMappingURL=wbecDevice.js.map
