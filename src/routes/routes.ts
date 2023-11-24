import { FastifyInstance } from "fastify";
import { register } from "./register";
import login from "./login";
import user from "./protegida";
import authenticate from "../middleware/middleware";

export async function routes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
  app.get("/user", { onRequest: [authenticate] }, user);
}
