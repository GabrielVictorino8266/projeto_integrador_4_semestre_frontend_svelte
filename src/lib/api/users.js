// lib/services/user.js
import { ApiService } from "./service";

const mapper = (user) => ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  cpf: user.cpf,
  dataNascimento: user.dataNascimento,
  telefone: user.telefone,
});

export const userService = (token) => {
  return new ApiService(token, "usuarios", mapper);
};
