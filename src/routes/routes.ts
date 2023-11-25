import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { register } from "./register";
import login from "./login";
import user from "./protegida";
import authenticate from "../middleware/middleware";

export async function routes(app: FastifyInstance) {
  app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({ mensagem: "API para o desafio" });
  });
  app.post("/register", register);
  app.post("/login", login);
  app.get("/user", { onRequest: [authenticate] }, user);
}
