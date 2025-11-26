import { z } from "zod";

export const MaintenanceSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  dataManutencao: z.string().min(1, "Data da manutenção é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  veiculoId: z.number().min(1, "Veículo é obrigatório"),
  custo: z.number().min(0, "Custo não pode ser negativo"),
  tipoManutencao: z.enum(["PREVENTIVA", "CORRETIVA", "PREDITIVA"], {
    errorMap: () => ({ message: "Tipo de manutenção inválido" }),
  }),
});

export const MaintenanceFilterSchema = z.object({
  numeroVeiculo: z.string().optional(),
  placa: z.string().optional(),
  tipoVeiculo: z.string().optional(),
  anoFabricacao: z.string().optional(),
  marca: z.string().optional(),
  kmAtual: z.string().optional(),
  limiteAvisoKm: z.string().optional(),
  status: z.string().optional(),
  page: z.number().min(0).optional().default(0),
  size: z.number().min(1).max(100).optional().default(10),
  sort: z.string().optional().default("dataManutencao,desc"),
});

export const mapMaintenanceToFormData = (maintenance) => ({
  ...maintenance,
  custo: maintenance?.custo?.toString() || "0",
  dataManutencao: maintenance?.dataManutencao?.split("T")[0] || "",
});

export const mapFormDataToMaintenance = (formData) => ({
  ...formData,
  custo: parseFloat(formData.custo) || 0,
  veiculoId: parseInt(formData.veiculoId) || 0,
});
