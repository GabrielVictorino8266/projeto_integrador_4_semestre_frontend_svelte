// lib/stores/dataTable.svelte.js
import { deserialize } from "$app/forms";
import { debounceAsync } from "$lib/utils/debounce.js";

/**
 * @param {Object} config
 * @param {string} config.endpoint - e.g., '?/search'
 * @param {Array} config.columns - table column definitions
 * @param {string} [config.defaultSortField='id']
 * @param {string} [config.defaultSortOrder='asc']
 * @param {number} [config.defaultPageSize=10]
 */
export function createDataTableStore(config) {
  const columns = config.columns;
  const endpoint = config.endpoint ?? "?/search";
  const defaultSortField = config.defaultSortField ?? "id";
  const defaultSortOrder = config.defaultSortOrder ?? "asc";
  const defaultPageSize = config.defaultPageSize ?? 10;

  let fetchAbortController = null;

  const state = $state({
    items: [],
    isLoading: false,
    totalItems: 0,
    currentPage: 0,
    pageSize: defaultPageSize,
    search: "",
    filters: {},
    sorting: {
      field: defaultSortField,
      order: defaultSortOrder,
    },
  });

  async function fetchData() {
    state.isLoading = true;
    try {
      fetchAbortController?.abort();
      fetchAbortController = new AbortController();

      const formData = new FormData();
      formData.append("page", state.currentPage);
      formData.append("size", state.pageSize);
      formData.append("search", state.search);
      formData.append("sort", `${state.sorting.field},${state.sorting.order}`);

      for (const [key, value] of Object.entries(state.filters)) {
        if (String(value)?.trim()) {
          formData.append(`filters[${key}]`, value);
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        signal: fetchAbortController.signal,
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const result = deserialize(await response.text());

      if (result.type === "success") {
        state.items = result.data.items ?? [];
        state.totalItems = result.data.pagination?.totalItems ?? 0;
        state.currentPage =
          result.data.pagination?.currentPage ?? state.currentPage;
        state.pageSize = result.data.pagination?.itemsPerPage ?? state.pageSize;

        return { success: true, message: "Dados carregados com sucesso." };
      }

      return {
        success: false,
        message: result.error || "Não foi possível carregar os dados.",
      };
    } catch (error) {
      if (error.name !== "AbortError") {
        return {
          success: false,
          message: "Erro inesperado ao carregar os dados.",
        };
      }
      return {
        success: false,
        aborted: true,
        message: "Operação cancelada pelo usuário.",
      };
    } finally {
      state.isLoading = false;
    }
  }

  const debouncedFetch = debounceAsync(() => fetchData(), 250);

  async function changePage(page) {
    state.currentPage = page;
    return await fetchData();
  }

  async function updateSearch(search) {
    state.search = search?.trim() || "";
    state.currentPage = 0;
    state.isLoading = true;
    return await debouncedFetch();
  }

  async function updateSort(field, order) {
    state.sorting = { field, order };
    return await fetchData();
  }

  async function updateFilters(filters) {
    state.filters = { ...filters };
    state.currentPage = 0;
    return await fetchData();
  }

  function initialize(initialData = {}) {
    const {
      items,
      pagination = {},
      search,
      filters = {},
      sorting = {},
    } = initialData;

    state.items = items || [];
    state.totalItems = pagination.totalItems || 0;
    state.currentPage = pagination.currentPage || 0;
    state.pageSize = pagination.itemsPerPage || defaultPageSize;
    state.search = search || "";
    state.filters = filters || {};
    state.sorting = {
      field: sorting.field || defaultSortField,
      order: sorting.order || defaultSortOrder,
    };
  }

  return {
    get state() {
      return state;
    },
    get columns() {
      return columns;
    },
    fetchData,
    changePage,
    updateSearch,
    updateSort,
    updateFilters,
    initialize,
  };
}
