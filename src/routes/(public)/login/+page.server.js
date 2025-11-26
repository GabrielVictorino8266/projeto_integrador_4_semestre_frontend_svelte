import { fail, redirect } from "@sveltejs/kit";
import { logger } from "$lib/utils/logger";
import { authService } from "$lib/api/auth";

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  const reason = url.searchParams.get("reason");
  const timestamp = url.searchParams.get("timestamp");
  const redirect_url = url.searchParams.get("redirect");

  // Map "reason" query param to user-friendly messages
  let error = "";

  switch (reason) {
    case "session_expired":
      error = "Sua sessão expirou. Faça login novamente.";
      break;

    case "must_login_to_purchase":
      error = "Realize o login ou cadastre-se para continuar.";
      break;

    default:
      error = "";
  }

  return {
    username: url.searchParams.get("username"),
    error,
    timestamp,
    redirect_url,
  };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const cpf = data.get("cpf");
    const password = data.get("senha");

    const result = await authService(cookies).login(cpf, password);

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
    return redirect(303, "/dashboard");
  },
};
