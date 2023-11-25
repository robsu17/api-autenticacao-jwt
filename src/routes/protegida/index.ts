import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export default async function user(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization;
  let decoded;
  if (token) {
    const authToken = token?.split(" ");
    decoded = jwt.decode(authToken[1]);
  }
  reply.status(200).send(decoded);
}
