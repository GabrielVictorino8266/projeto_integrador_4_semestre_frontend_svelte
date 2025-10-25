import { fail } from "@sveltejs/kit";
import { logger } from "$lib/utils/logger";
import { ApiError, createApiClient } from "$lib/api/client";
import { login } from "$lib/api/auth";

const apiClient = createApiClient();

/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const cpf = data.get("cpf").replace(/\D/g, "");
    const password = data.get("senha");

    // Cadastrar empresa e usuário
    try {
      await apiClient.post("/public/register", {
        razaoSocial: data.get("razaoSocial"),
        nomeFantasia: data.get("nomeFantasia"),
        cnpj: data.get("cnpj").replace(/\D/g, ""),
        adminNome: data.get("nome"),
        adminSenha: password,
        adminCpf: cpf,
        adminEmail: data.get("email"),
        adminDataNascimento: data.get("dataNascimento"),
        adminTelefone: data.get("telefone"),
      });
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.status, { error: e.message });
      }
      logger.error(e);
      return fail(500, { error: "Erro interno do servidor" });
    }

    // Tentar login automático após cadastro bem-sucedido
    const result = await login(cookies, cpf, password);
    if (!result?.error) {
      return { redirect: `/dashboard` };
    }
    // Login falhou mas cadastro foi bem-sucedido - redireciona para tela de login
    return { redirect: `/login?username=${encodeURIComponent(cpf)}` };
  },
};
