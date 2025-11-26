import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  numeroVeiculo: z
    .string()
    .min(1, "O número do veículo é obrigatório.")
    .max(10, "O número do veículo deve ter no máximo 10 caracteres.")
    .trim(),

  placa: z
    .string()
    .min(1, "A placa é obrigatória.")
    .max(8, "A placa deve ter no máximo 8 caracteres.")
    .regex(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/, "Formato de placa inválido.")
    .trim(),

  tipoVeiculo: z.string().min(1, "O tipo do veículo é obrigatório.").trim(),
  // Nota: Você precisará adicionar validação enum se usar equivalente ValidEnum

  anoFabricacao: z
    .string()
    .min(1, "O ano de fabricação é obrigatório.")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number({
          invalid_type_error: "O ano de fabricação deve ser um número.",
        })
        .int("O ano de fabricação deve ser um número inteiro.")
        .min(1900, "O ano de fabricação deve ser no mínimo 1900.")
        .refine(
          (year) => year <= new Date().getFullYear(),
          "O ano de fabricação não pode ser maior que o ano atual.",
        ),
    ),

  marca: z
    .string()
    .min(1, "A marca é obrigatória.")
    .max(20, "A marca deve ter no máximo 20 caracteres.")
    .trim(),

  kmAtual: z
    .string()
    .min(1, "A quilometragem atual é obrigatória.")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number({
          invalid_type_error: "A quilometragem atual deve ser um número.",
        })
        .int("A quilometragem atual deve ser um número inteiro.")
        .min(0, "A quilometragem atual deve ser no mínimo 0."),
    ),
  limiteAvisoKm: z
    .string()
    .min(1, "O limite de KM para aviso é obrigatório.")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number({
          invalid_type_error: "O limite de KM para aviso deve ser um número.",
        })
        .int("O limite de KM para aviso deve ser um número inteiro.")
        .min(0, "O limite de KM para aviso deve ser no mínimo 0."),
    ),

  status: z.string().default("ATIVO").optional(),
  // Nota: Você precisará adicionar validação enum se usar equivalente ValidEnum
});
