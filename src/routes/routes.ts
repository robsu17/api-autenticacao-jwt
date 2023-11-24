import { FastifyInstance } from "fastify";
import { register } from "./register";
import login from "./login";
import user from "./protegida";
import authenticate from "../middleware/middleware";

export async function routes(app: FastifyInstance) {
  // Rota de cadastro
  app.post("/register", register);

  // Rota de login
  app.post("/login", login);

  // Rota protegida
  app.get("/user", { onRequest: [authenticate] }, user);
}
