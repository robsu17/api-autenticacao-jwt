import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export default async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization;

  if (!token) {
    reply.status(401).send({ mensagem: "Token ausente" });
  }

  try {
    if (token) {
      const authToken = token?.split(" ");
      jwt.verify(authToken[1], "supersecret");
    }
  } catch (err: any) {
    if (err.message === "jwt expired") {
      reply.status(401).send({ mensagem: "Sessão inválida" });
    }
    reply.status(401).send({ mensagem: "Não autorizado" });
  }
}
