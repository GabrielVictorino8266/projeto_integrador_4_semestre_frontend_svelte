// lib/api/maintenance.js
import { ApiService } from "./service";

const mapper = (maintenance) => ({
  id: maintenance.id,
  dataManutencao: maintenance.dataManutencao,
  descricao: maintenance.descricao,
  custo: maintenance.custo,
  tipoManutencao: maintenance.tipoManutencao,
  veiculoId: maintenance.veiculoId,
  placaVeiculo: maintenance.placaVeiculo,
});

export const maintenanceService = (token) => {
  return new ApiService(token, "manutencoes", mapper);
};
