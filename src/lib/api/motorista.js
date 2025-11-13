// lib/services/user.js
import { ApiService } from "./service";

const mapper = (user) => ({
  id: user.id,
  nomeMotorista: user.nomeMotorista,
  tipoCnh: user.tipoCnh,
  numeroCnh: user.numeroCnh,
  desempenho: user.desempenho,
  usuarioId: user.usuarioId,
});

export const motoristaService = (token) => {
  return new ApiService(token, "perfis-motorista", mapper);
}