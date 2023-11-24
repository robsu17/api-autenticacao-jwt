import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";
import bcrypt from "bcrypt";
import { UserEmailExistente } from "../repositories/errors/user-email-existente";
import { UsersRepository } from "../repositories/InMemoryUsersInterface";

let repository: UsersRepository;

describe("Teste de registro de usuário", () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
  });

  it("Usuário deve se cadastrar", async () => {
    const user = await repository.create({
      nome: "John Doe",
      email: "johnDoe@gmail.com",
      senha: "123456",
      telefones: {
        create: {
          numero: "123456789",
          ddd: "12",
          id: 1,
        },
      },
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Senha do usuário deve ser encriptada", async () => {
    const userResponse = await repository.create({
      nome: "John Doe",
      email: "johnDoe@gmail.com",
      senha: "123456",
      telefones: {
        create: {
          numero: "123456789",
          ddd: "12",
          id: 1,
        },
      },
    });

    const senhaCriptada = await bcrypt.compare(
      "123456",
      userResponse.user.senha,
    );

    expect(senhaCriptada).toBe(true);
  });

  it("Usuário não deve se cadastrar com e-mail já cadastrado", async () => {
    await repository.create({
      nome: "John Doe",
      email: "johndoe@gmail.com",
      senha: "123456",
      telefones: {
        create: {
          numero: "123456789",
          ddd: "12",
          id: 1,
        },
      },
    });

    expect(async () => {
      await repository.create({
        nome: "John Doe",
        email: "johndoe@gmail.com",
        senha: "123456",
        telefones: {
          create: {
            numero: "123456789",
            ddd: "12",
            id: 1,
          },
        },
      });
    }).rejects.toBeInstanceOf(UserEmailExistente);
  });
});
