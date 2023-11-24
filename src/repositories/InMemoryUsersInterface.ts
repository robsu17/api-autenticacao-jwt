import { Prisma } from "@prisma/client";
import { UserLogged } from "./in-memory-users-repository";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<UserLogged>;
  login(email: string, senha: string): Promise<UserLogged>;
}
