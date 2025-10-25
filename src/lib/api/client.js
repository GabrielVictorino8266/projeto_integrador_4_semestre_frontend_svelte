import { logger } from "$lib/utils/logger";

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class ApiClient {
  constructor(baseURL = "", token = null) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || "GET";

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    logger.info(`${method} ${url}`);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          throw new ApiError("Usuário não autenticado", response.status);
        }

        const errorData = await response.json().catch(() => null);
        logger.error(`${method} ${url} - ${response.status}`, errorData);

        throw new ApiError(
          errorData?.errors?.[0]?.defaultMessage ||
            errorData?.message ||
            `Erro HTTP ${response.status}`,
          response.status,
          errorData,
        );
      }

      logger.info(`${method} ${url} - ${response.status}`);

      if (response.status === 204) return null;

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      logger.info(
        `${method} ${url} - Response:`,
        typeof result === "object" ? JSON.stringify(result) : result,
      );
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      logger.error(error);
      throw new ApiError(error.message || "Erro inesperado", 0);
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  setAuthToken(token) {
    this.token = token;
  }

  removeAuthToken() {
    this.token = null;
  }
}

export const createApiClient = (token = null) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  if (!baseURL) {
    throw new Error("VITE_API_BASE_URL não está configurada.");
  }
  return new ApiClient(baseURL, token);
};
