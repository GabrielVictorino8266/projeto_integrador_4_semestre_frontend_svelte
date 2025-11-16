import { z } from "zod";

export const UserSchema = z.object({
  id: z.coerce.number().int().positive().optional(),

  nome: z
    .string()
    .min(3, "O nome é obrigatório.")
    .max(100, "O nome deve ter no máximo 100 caracteres.")
    .trim(),

  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),

  cpf: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length === 11, "O CPF deve conter 11 dígitos."),

  email: z.string().email("Formato de e-mail inválido.").max(100),

  dataNascimento: z
    .string()
    .date("Data inválida") // valida formato YYYY-MM-DD
    .transform((str) => new Date(str + "T00:00:00")) // evita timezone issues
    .refine((date) => {
      const year = date.getFullYear();
      const currentYear = new Date().getFullYear();
      return year >= currentYear - 150 && year <= currentYear - 1;
    }, "Data de nascimento inválida"),

  telefone: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length >= 1, "O telefone é obrigatório.")
    .refine(
      (s) => s.length <= 20,
      "O telefone deve ter no máximo 20 caracteres.",
    ),
});

export const UpsertUserSchema = UserSchema.partial()
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
