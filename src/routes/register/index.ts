import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    nome: z.string(),
    email: z.string(),
    senha: z.string(),
    telefones: z.object({
      numero: z.string(),
      ddd: z.string(),
    }),
  });

  const { nome, email, senha, telefones } = bodySchema.parse(request.body);

  const hashDaSenha = await bcrypt.hash(senha, 6);

  try {
    const emailAlreadyUse = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyUse) {
      reply.status(401).send({ mensagem: "E-mail já existente" });
    }

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashDaSenha,
        telefones: {
          create: {
            numero: telefones.numero,
            ddd: telefones.ddd,
          },
        },
      },
      include: {
        telefones: true,
      },
    });

    const token = jwt.sign(
      { nome: user.nome, email: user.email, telefones: user.telefones },
      "supersecret",
      { expiresIn: 60 * 30 },
    );

    reply.status(201).send({
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_atualizacao: user.ultimo_login,
      token,
    });
  } catch (err) {
    reply.status(400).send(err);
  }
}
