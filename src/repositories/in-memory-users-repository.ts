import { Prisma, User } from "@prisma/client";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { UserEmailExistente } from "./errors/user-email-existente";
import { UsersRepository } from "./InMemoryUsersInterface";
import { InvalidCredentials } from "./errors/invalid-credentials";
import jwt from "jsonwebtoken";

export type UserLogged = {
  id: string;
  data_criacao: Date;
  data_atualizacao: Date;
  ultimo_login: Date;
  token: string;
  user: User;
};

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<UserLogged> {
    const passowrdHash = await bcrypt.hash(data.senha, 6);

    const user = {
      id: randomUUID(),
      nome: data.nome,
      email: data.email,
      senha: passowrdHash,
      data_criacao: new Date(),
      data_atualizacao: new Date(),
      ultimo_login: new Date(),
      telefones: data.telefones?.create,
    };

    const sameEmail = this.items.find((users) => {
      return users.email === user.email;
    });

    if (sameEmail) {
      throw new UserEmailExistente();
    }

    const token = jwt.sign(user, "teste");

    this.items.push(user);

    return {
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token,
      user,
    };
  }

  async login(email: string, senha: string): Promise<UserLogged> {
    const user = this.items.find((user) => {
      return user.email === email;
    });

    if (!user) {
      throw new InvalidCredentials();
    }

    const senhaCompare = await bcrypt.compare(senha, user.senha);

    if (!senhaCompare) {
      throw new InvalidCredentials();
    }

    const token = jwt.sign(user, "teste");

    return {
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token,
      user,
    };
  }
}
