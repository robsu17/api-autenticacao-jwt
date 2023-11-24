import { beforeEach, describe, expect, it } from "vitest";
import { UsersRepository } from "../repositories/InMemoryUsersInterface";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";
import { InvalidCredentials } from "../repositories/errors/invalid-credentials";

let repository: UsersRepository;
describe("Teste de autenticação de usuário", () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
  });

  it("Usuário deve logar com credênciais corretas", async () => {
    const email = "johndoe@gmail.com";
    const senha = "123456";

    await repository.create({
      nome: "John Doe",
      email,
      senha,
      telefones: {
        create: {
          numero: "123456789",
          ddd: "11",
          id: 1,
        },
      },
    });

    const userResponse = await repository.login(email, senha);

    expect(userResponse.user.email).toEqual(email);
  });

  it("Usuário não deve logar com credênciais inválidas", async () => {
    await repository.create({
      nome: "John Doe",
      email: "johndoe@gmail.com",
      senha: "123456",
      telefones: {
        create: {
          numero: "123456789",
          ddd: "11",
          id: 1,
        },
      },
    });

    const emailErrado = "johndoe123@gmail.com";
    const senhaErrada = "12345678";

    expect(async () => {
      await repository.login(emailErrado, "123456");
    }).rejects.toBeInstanceOf(InvalidCredentials);

    expect(async () => {
      await repository.login("johndoe@gmail.com", senhaErrada);
    }).rejects.toBeInstanceOf(InvalidCredentials);
  });

  it("Usuário ao logar deve ser gerado o token JWT", async () => {
    const email = "johndoe@gmail.com";
    const senha = "123456";

    await repository.create({
      nome: "John Doe",
      email,
      senha,
      telefones: {
        create: {
          numero: "123456789",
          ddd: "11",
          id: 1,
        },
      },
    });

    const user = await repository.login(email, senha);

    expect(user.token).toEqual(expect.any(String));
  });

  it("Ao logar deve se cadastrar deve ser gerado um token JWT", async () => {
    const email = "johndoe@gmail.com";
    const senha = "123456";

    const userCreated = await repository.create({
      nome: "John Doe",
      email,
      senha,
      telefones: {
        create: {
          numero: "123456789",
          ddd: "11",
          id: 1,
        },
      },
    });

    expect(userCreated.token).toEqual(expect.any(String));
  });
});
