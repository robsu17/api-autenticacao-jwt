import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { environment } from "../../env";

export default async function login(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.string(),
    senha: z.string(),
  });

  const { email, senha } = bodySchema.parse(request.body);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      reply.status(401).send({ mensagem: "Usuário e/ou senha inválidos" });
    }

    let token;
    if (user) {
      const senhaHashCompare = await bcrypt.compare(senha, user?.senha);
      if (senhaHashCompare) {
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            ultimo_login: new Date(),
          },
        });

        const telefones = await prisma.telefone.findMany({
          where: {
            user_id: user.id,
          },
        });

        token = jwt.sign(
          { nome: user.nome, email: user.email, telefones },
          environment.SECRET_KEY,
          { expiresIn: 60 * 30 },
        );
      } else {
        reply.status(401).send({ mensagem: "Usuário e/ou senha inválidos" });
      }
    }

    reply.status(200).send({
      id: user?.id,
      data_criacao: user?.data_criacao,
      data_atualizacao: user?.data_atualizacao,
      ultimo_login: user?.ultimo_login,
      token,
    });
  } catch (err) {
    reply.status(400).send({ mensagem: "Algum erro ocorreu", err });
  }
}
