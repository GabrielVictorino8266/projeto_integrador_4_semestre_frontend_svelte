import { createApiClient, ApiError } from "$lib/api/client";
import { logger } from "$lib/utils/logger";

export const authService = (cookies) => {
  const getToken = () => cookies.get("session_token") || null;

  return {
    login: async (cpf, senha) => {
      try {
        const credentials = btoa(`${cpf.replace(/\D/g, "")}:${senha}`);
        const token = await createApiClient().post(
          "/authenticate",
          {},
          {
            headers: { Authorization: `Basic ${credentials}` },
          },
        );

        cookies.set("session_token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        return { success: true };
      } catch (err) {
        if (err instanceof ApiError) {
          return { status: err.status, error: err.message };
        }
        logger.error("Unable to authenticate:", err);
        return { status: 500, error: "Erro interno do servidor" };
      }
    },

    logout: () => cookies.delete("session_token", { path: "/" }),

    getSessionUser: async () => {
      const token = getToken();
      if (!token) return null;

      try {
        const result = await createApiClient(token).get("/usuarios/me");
        if (!result?.user?.id) {
          throw Error("User data missing or invalid.");
        }
        return { user: result.user, token };
      } catch (err) {
        logger.error("Unable to retrieve session user:", err);
        return null;
      }
    },
  };
};
