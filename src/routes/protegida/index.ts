import { FastifyReply, FastifyRequest } from "fastify";

export default async function user(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const decoded = request.user;
  reply.status(200).send({ user: decoded });
}
