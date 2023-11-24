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

// src/repositories/in-memory-users-repository.ts
var in_memory_users_repository_exports = {};
__export(in_memory_users_repository_exports, {
  InMemoryUsersRepository: () => InMemoryUsersRepository
});
module.exports = __toCommonJS(in_memory_users_repository_exports);
var import_crypto = require("crypto");
var import_bcrypt = __toESM(require("bcrypt"), 1);

// src/repositories/errors/user-email-existente.ts
var UserEmailExistente = class extends Error {
  constructor() {
    super("E-mail j\xE1 existente");
  }
};

// src/repositories/errors/invalid-credentials.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("E-mail e/ou senha inv\xE1lidos");
  }
};

// src/repositories/in-memory-users-repository.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var InMemoryUsersRepository = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const passowrdHash = await import_bcrypt.default.hash(data.senha, 6);
    const user = {
      id: (0, import_crypto.randomUUID)(),
      nome: data.nome,
      email: data.email,
      senha: passowrdHash,
      data_criacao: /* @__PURE__ */ new Date(),
      data_atualizacao: /* @__PURE__ */ new Date(),
      ultimo_login: /* @__PURE__ */ new Date(),
      telefones: data.telefones?.create
    };
    const sameEmail = this.items.find((users) => {
      return users.email === user.email;
    });
    if (sameEmail) {
      throw new UserEmailExistente();
    }
    const token = import_jsonwebtoken.default.sign(user, "teste");
    this.items.push(user);
    return {
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token,
      user
    };
  }
  async login(email, senha) {
    const user = this.items.find((user2) => {
      return user2.email === email;
    });
    if (!user) {
      throw new InvalidCredentials();
    }
    const senhaCompare = await import_bcrypt.default.compare(senha, user.senha);
    if (!senhaCompare) {
      throw new InvalidCredentials();
    }
    const token = import_jsonwebtoken.default.sign(user, "teste");
    return {
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token,
      user
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryUsersRepository
});
