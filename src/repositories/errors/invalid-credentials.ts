export class InvalidCredentials extends Error {
  constructor() {
    super("E-mail e/ou senha inválidos");
  }
}
