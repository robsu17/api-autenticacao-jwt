export class UserEmailExistente extends Error {
  constructor() {
    super("E-mail já existente");
  }
}
