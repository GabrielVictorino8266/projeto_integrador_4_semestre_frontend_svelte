import { createApiClient, ApiError } from "./client";
import { logger } from "$lib/utils/logger";

export const userService = (token) => ({
  getUsers: async (params = {}) => {
    const apiClient = createApiClient(token);
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key] || "";
        if (String(value).trim()) {
          query.set(key, value);
        }
      });
      if (!query.has("sort")) {
        query.set("sort", "id,asc");
      }
      if (!query.has("page")) {
        query.set("page", "0");
      }
      if (!query.has("size")) {
        query.set("size", "10");
      }

      const url = `/usuarios?${query.toString()}`;
      const data = await apiClient.get(url);

      return {
        users: (data?.content || []).map((user) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          cpf: user.cpf,
          dataNascimento: user.dataNascimento,
        })),
        pagination: {
          currentPage: data?.pageable?.pageNumber || 0,
          itemsPerPage: data?.pageable?.pageSize || 10,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || 0,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message };
      }
      logger.error("Unable to fetch users:", error);
      return { error: "Erro interno do servidor" };
    }
  },

  createUser: async (user) => {
    try {
      const apiClient = createApiClient(token);
      const data = await apiClient.post("/usuarios", user);
      return { user: data };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message };
      }
      logger.error("Unable to create user:", error);
      return { error: "Erro interno do servidor" };
    }
  },

  updateUser: async (user) => {
    try {
      const apiClient = createApiClient(token);
      const data = await apiClient.patch(`/usuarios/${user.id}`, user);
      return { user: data };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message };
      }
      logger.error("Unable to update user:", error);
      return { error: "Erro interno do servidor" };
    }
  },

  deleteUser: async (id) => {
    try {
      const apiClient = createApiClient(token);
      await apiClient.delete(`/usuarios/${id}`);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { error: error.message };
      }
      logger.error("Unable to delete user:", error);
      return { error: "Erro interno do servidor" };
    }
  },
});