import { fail, redirect } from "@sveltejs/kit";
import { logger } from "$lib/utils/logger";
import { login } from "$lib/api/auth";

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  return { username: url.searchParams.get("username") };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const cpf = data.get("cpf");
    const password = data.get("senha");

    const result = await login(cookies, cpf, password);

    // Se o login falhar, retorna mensagem apropriada
    if (result?.error) {
      return fail(result.status ?? 400, {
        error:
          result.status === 401
            ? "CPF ou senha incorretos. Verifique e tente novamente."
            : "Não foi possível realizar o login. Tente novamente mais tarde.",
        cpf,
      });
    }

    logger.info(`Usuário autenticado com sucesso: ${cpf}`);
    throw redirect(303, "/dashboard");
  },
};
