import { createApiClient } from "$lib/api/client";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
  const dashboardApi = createApiClient(locals.token);

  const result = await dashboardApi.get("/dashboard");
  result.alertasManutencaoKm = [
    {
      placa: "ABC1234",
      numeroVeiculo: "123",
      mensagem: "Excedeu o limite de km",
    },
    {
      placa: "DEF5678",
      numeroVeiculo: "456",
      mensagem: "Próximo da manutenção preventiva",
    },
    {
      placa: "GHI9012",
      numeroVeiculo: "789",
      mensagem: "Manutenção atrasada em 500 km",
    },
    {
      placa: "JKL3456",
      numeroVeiculo: "321",
      mensagem: "Revisão de 10.000 km necessária",
    },
    {
      placa: "MNO7890",
      numeroVeiculo: "654",
      mensagem: "Troca de óleo pendente",
    },
  ];

  return {
    dashboard: {
      kpis: {
        totalVeiculos: 0,
        veiculosAtivos: 0,
        veiculosEmManutencao: 0,
        totalMotoristas: 0,
      },
      limitesPlano: {
        veiculosUsados: 0,
        veiculosLimite: 5,
        motoristasUsados: 0,
        motoristasLimite: 5,
        usuariosUsados: 0,
        usuariosLimite: 5,
      },
      frotaPorStatus: [],
      custosManutencaoUltimos6Meses: [],
      alertasManutencaoKm: [],
      motoristasBaixoDesempenho: [],
      ...result,
    },
    session: { user: locals.user },
  };
}
