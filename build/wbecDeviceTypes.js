"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var wbecDeviceTypes_exports = {};
__export(wbecDeviceTypes_exports, {
  PvMode: () => PvMode
});
module.exports = __toCommonJS(wbecDeviceTypes_exports);
var PvMode = /* @__PURE__ */ ((PvMode2) => {
  PvMode2[PvMode2["Disabled"] = 0] = "Disabled";
  PvMode2[PvMode2["Off"] = 1] = "Off";
  PvMode2[PvMode2["Pv"] = 2] = "Pv";
  PvMode2[PvMode2["PvWithMin"] = 3] = "PvWithMin";
  return PvMode2;
})(PvMode || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PvMode
});
//# sourceMappingURL=wbecDeviceTypes.js.map
