import { z } from "zod";

export const UsuarioSchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  nome: z
    .string()
    .min(3, "O Nome é Obrigatório.")
    .max(100, "Nome deve ter no máximo 100 caracteres.")
    .trim(),

  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),

  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos.")
    .length(11),

  email: z.string().email("Formato de e-mail inválido.").max(100),

  dataNascimento: z.coerce.date().refine((date) => date < new Date(), {
    message: "A data de nascimento deve ser no passado.",
  }),

  telefone: z.string().max(20).optional().nullable(),
});

export const UpsertUsuarioSchema = UsuarioSchema.partial()
  .extend({
    id: z.string().optional(),
    senhaConfirmacao: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // On create: senha and senhaConfirmacao are required
    if (!data.id) {
      if (!data.senha) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Senha é obrigatória.",
          path: ["senha"],
        });
      }
      if (!data.senhaConfirmacao) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Confirmação de senha é obrigatória.",
          path: ["senhaConfirmacao"],
        });
      }
    }

    // Password match validation (when senha is provided)
    if (data.senha && data.senha !== data.senhaConfirmacao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem.",
        path: ["senhaConfirmacao"],
      });
    }
  });
