import { createApiClient, ApiError } from "$lib/api/client";
import { logger } from "$lib/utils/logger";

export const login = async (cookies, cpf, senha) => {
  try {
    // Tentar login automático após cadastro bem-sucedido
    const apiClient = createApiClient();
    const credentials = btoa(`${cpf.replace(/\D/g, "")}:${senha}`);

    const token = await apiClient.post(
      "/authenticate",
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    cookies.set("session_token", token, {
      path: "/", // Make the cookie available across the entire site
      httpOnly: true, // Essential for HttpOnly
      secure: true, // Recommended for production
      sameSite: "lax", // Recommended for security
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { status: err.status, error: err.message };
    }
    logger.error("Unable to authenticate:", err);
    return { status: 500, error: "Erro interno do servidor" };
  }
};

export const logout = async (cookies) => {
  cookies.delete("session_token", { path: "/" });
};

export const getSessionUser = async (cookies) => {
  const token = cookies.get("session_token");
  if (!token) return null;

  try {
    // const authedClient = createApiClient(token);
    // const user = await authedClient.get('/user');
    // if (!user?.id) {
    //     logger.error('User data missing or invalid.');
    //     return null;
    // }
    // return user;

    return {
      user: {
        id: 1,
        name: "John Doe",
        role: "admin",
        cpf: "12345678901",
        email: "john.doe@example.com",
        telefone: "12345678901",
      },
      token,
    };
  } catch (err) {
    logger.error("Unable to retrieve session user from /user endpoint:", err);
    return null;
  }
};
