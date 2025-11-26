// lib/services/ApiService.js
import { createApiClient, ApiError } from "./client";
import { logger } from "$lib/utils/logger";

export class ApiService {
  /**
   * @param {string} token - Auth token
   * @param {string} endpoint - e.g., 'usuarios', 'veiculos'
   * @param {(item: any) => any} [mapper] - Optional function to normalize API response items
   */
  constructor(token, endpoint, mapper = (item) => item) {
    this.token = token;
    this.endpoint = endpoint;
    this.mapper = mapper;
    this.apiClient = createApiClient(token);
  }

  async getAll(params = {}) {
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key] || "";
        if (String(value).trim()) query.set(key, value);
      });
      if (!query.has("sort")) query.set("sort", "id,asc");
      if (!query.has("page")) query.set("page", "0");
      if (!query.has("size")) query.set("size", "10");

      const url = `/${this.endpoint}?${query.toString()}`;
      const data = await this.apiClient.get(url);

      let items = data;
      if (items?.content?.length > 0) {
        items = items.content.map(this.mapper);
      } else if (items?.data?.length > 0) {
        items = items.data.map(this.mapper);
      } else if (items?.length > 0) {
        items = items.map(this.mapper);
      }

      return {
        items,
        pagination: {
          currentPage: data?.pageable?.pageNumber || 0,
          itemsPerPage: data?.pageable?.pageSize || 10,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalElements || 0,
          ...(data?.pagination || {}),
        },
      };
    } catch (error) {
      if (error instanceof ApiError) return { error: error.message };
      logger.error(`Unable to fetch ${this.endpoint}:`, error);
      return { error: "Erro interno do servidor" };
    }
  }

  async getLookups() {
    try {
      const data = await this.apiClient.get(`/${this.endpoint}/lookups`);
      return { items: data };
    } catch (error) {
      if (error instanceof ApiError) return { error: error.message };
      logger.error(`Unable to fetch lookups for ${this.endpoint}:`, error);
      return { error: "Erro interno do servidor" };
    }
  }

  async create(payload) {
    if (this.endpoint === "perfis-motorista") {
      payload.usuarioId = payload.usuarioId || 0;
    }
    try {
      const data = await this.apiClient.post(`/${this.endpoint}`, payload);
      return { item: data };
    } catch (error) {
      if (error instanceof ApiError) return { error: error.message };
      logger.error(`Unable to create ${this.endpoint}:`, error);
      return { error: "Erro interno do servidor" };
    }
  }

  async update(payload) {
    try {
      const data = await this.apiClient.patch(
        `/${this.endpoint}/${payload.id}`,
        payload,
      );
      return { item: data };
    } catch (error) {
      if (error instanceof ApiError) return { error: error.message };
      logger.error(`Unable to update ${this.endpoint}:`, error);
      return { error: "Erro interno do servidor" };
    }
  }

  async delete(id) {
    try {
      await this.apiClient.delete(`/${this.endpoint}/${id}`);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) return { error: error.message };
      logger.error(`Unable to delete ${this.endpoint}:`, error);
      return { error: "Erro interno do servidor" };
    }
  }
}
