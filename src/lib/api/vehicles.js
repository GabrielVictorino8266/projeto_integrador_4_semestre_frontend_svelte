// lib/services/vehicles.js
import { ApiService } from "./service";

const mapper = (vehicle) => ({
  id: vehicle.id,
  numeroVeiculo: vehicle.numeroVeiculo,
  placa: vehicle.placa,
  tipoVeiculo: vehicle.tipoVeiculo.toLowerCase(),
  anoFabricacao: vehicle.anoFabricacao,
  marca: vehicle.marca,
  kmAtual: vehicle.kmAtual,
  limiteAvisoKm: vehicle.limiteAvisoKm,
  status: vehicle.status.toLowerCase(),
});

export const vehicleService = (token) => {
  return new ApiService(token, "veiculos", mapper);
}