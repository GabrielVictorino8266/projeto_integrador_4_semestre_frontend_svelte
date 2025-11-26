import { z } from "zod";

const CNH_TYPES = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"];

export const UpsertMotoristaSchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  usuarioId: z.coerce
    .number()
    .int()
    .positive({
      message: "O ID do usuário é obrigatório.",
    })
    .optional(),

  tipoCnh: z
    .string({
      // Message when the field is missing (required_error) or not a string (invalid_type_error)
      required_error: "O tipo da CNH é obrigatório.",
      invalid_type_error: "O tipo da CNH é obrigatório.",
    })
    .trim() // Removes leading/trailing whitespace
    .toUpperCase() // Converts to uppercase to handle 'a' or 'ab'
    .transform((s) => {
      // Use a transformation to ensure that if a non-string value (like null/undefined)
      // somehow gets past the type check, we handle it gracefully before refinement.
      return s;
    })
    .refine((s) => CNH_TYPES.includes(s), {
      // Custom message when the value is a string but not in the allowed list
      message:
        "Tipo de CNH inválido. Escolha entre: A, B, C, D, E, AB, AC, AD ou AE.",
    }),

  numeroCnh: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length === 11, "Número da CNH deve conter 11 dígitos."),

  desempenho: z.coerce
    .number()
    .int()
    .min(1, "Desempenho deve ser no mínimo 1.")
    .max(10, "Desempenho deve ser no máximo 10."),
});
