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

// src/routes/routes.ts
var routes_exports = {};
__export(routes_exports, {
  routes: () => routes
});
module.exports = __toCommonJS(routes_exports);

// src/routes/register/index.ts
var import_zod2 = __toESM(require("zod"), 1);

// src/prisma/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/register/index.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/env/index.ts
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

// src/utils/dateformatter.ts
var dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false
});

// src/routes/register/index.ts
async function register(request, reply) {
  const bodySchema = import_zod2.default.object({
    nome: import_zod2.default.string(),
    email: import_zod2.default.string(),
    senha: import_zod2.default.string(),
    telefones: import_zod2.default.object({
      numero: import_zod2.default.string(),
      ddd: import_zod2.default.string()
    })
  });
  const { nome, email, senha, telefones } = bodySchema.parse(request.body);
  const hashDaSenha = await import_bcrypt.default.hash(senha, 6);
  try {
    const emailAlreadyUse = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (emailAlreadyUse) {
      reply.status(401).send({ mensagem: "E-mail j\xE1 existente" });
    }
    const user2 = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashDaSenha,
        telefones: {
          create: {
            numero: telefones.numero,
            ddd: telefones.ddd
          }
        }
      },
      include: {
        telefones: true
      }
    });
    const token = import_jsonwebtoken.default.sign(
      { nome: user2.nome, email: user2.email, telefones: user2.telefones },
      environment.SECRET_KEY,
      { expiresIn: 60 * 30 }
    );
    reply.status(201).send({
      id: user2.id,
      data_criacao: dateTimeFormatter.format(user2.data_criacao),
      data_atualizacao: dateTimeFormatter.format(user2.data_atualizacao),
      ultimo_atualizacao: dateTimeFormatter.format(user2.ultimo_login),
      token
    });
  } catch (err) {
    reply.status(400).send(err);
  }
}

// src/routes/login/index.ts
var import_zod3 = __toESM(require("zod"), 1);
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
async function login(request, reply) {
  const bodySchema = import_zod3.default.object({
    email: import_zod3.default.string(),
    senha: import_zod3.default.string()
  });
  const { email, senha } = bodySchema.parse(request.body);
  try {
    const user2 = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user2) {
      reply.status(401).send({ mensagem: "Usu\xE1rio e/ou senha inv\xE1lidos" });
    }
    let token;
    if (user2) {
      const senhaHashCompare = await import_bcrypt2.default.compare(senha, user2?.senha);
      if (senhaHashCompare) {
        await prisma.user.update({
          where: {
            email: user2.email
          },
          data: {
            ultimo_login: /* @__PURE__ */ new Date()
          }
        });
        const telefones = await prisma.telefone.findMany({
          where: {
            user_id: user2.id
          }
        });
        token = import_jsonwebtoken2.default.sign(
          { nome: user2.nome, email: user2.email, telefones },
          environment.SECRET_KEY,
          { expiresIn: 30 }
        );
      } else {
        reply.status(401).send({ mensagem: "Usu\xE1rio e/ou senha inv\xE1lidos" });
      }
    }
    reply.status(200).send({
      id: user2?.id,
      data_criacao: dateTimeFormatter.format(user2?.data_criacao),
      data_atualizacao: dateTimeFormatter.format(user2?.data_atualizacao),
      ultimo_login: dateTimeFormatter.format(user2?.ultimo_login),
      token
    });
  } catch (err) {
    reply.status(400).send({ mensagem: "Algum erro ocorreu", err });
  }
}

// src/routes/protegida/index.ts
async function user(request, reply) {
  const decoded = request.user;
  reply.status(200).send({ user: decoded });
}

// src/middleware/middleware.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"), 1);
async function authenticate(request, reply) {
  const token = request.headers.authorization;
  if (!token) {
    reply.status(401).send({ mensagem: "Token ausente" });
  }
  try {
    if (token) {
      const authToken = token?.split(" ");
      const decoded = import_jsonwebtoken3.default.verify(authToken[1], "supersecret");
      request.user = decoded;
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      reply.status(401).send({ mensagem: "Sess\xE3o inv\xE1lida" });
    }
    reply.status(401).send({ mensagem: "N\xE3o autorizado" });
  }
}

// src/routes/routes.ts
async function routes(app) {
  app.post("/register", register);
  app.post("/login", login);
  app.get("/user", { onRequest: [authenticate] }, user);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
