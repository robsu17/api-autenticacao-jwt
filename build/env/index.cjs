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

// src/env/index.ts
var env_exports = {};
__export(env_exports, {
  environment: () => environment
});
module.exports = __toCommonJS(env_exports);
var import_node_process = require("process");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333),
  SECRET_KEY: import_zod.z.string()
});
var _env = envSchema.safeParse(import_node_process.env);
if (_env.success === false) {
  console.error("\u26A0\uFE0F A invalide environment variables!", _env.error.format());
  throw new Error("invalid environment variables.");
}
var environment = _env.data;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  environment
});
