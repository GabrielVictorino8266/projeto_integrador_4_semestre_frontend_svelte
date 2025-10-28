import { deserialize } from "$app/forms";
import { debounceAsync } from "$lib/utils/debounce.js";

const initialState = {
    users: [],
    isLoading: false,
    totalItems: 0,
    currentPage: 0,
    pageSize: 10,
    search: '',
    sorting: {
        field: 'id',
        order: 'asc',
    }
};

let state = $state(initialState);
let fetchAbortController = null;

const fetchUsers = async () => {
    state.isLoading = true;
    try {
        fetchAbortController?.abort();
        fetchAbortController = new AbortController();

        const formData = new FormData();
        formData.append('page', state.currentPage);
        formData.append('size', state.pageSize);
        formData.append('search', state.search);
        formData.append('sort', `${state.sorting.field},${state.sorting.order}`);

        const response = await fetch('?/search', {
            method: 'POST',
            body: formData,
            signal: fetchAbortController.signal,
        });

        const result = deserialize(await response.text());

        if (result.type === 'success') {
            state.users = result.data.users;
            state.totalItems = result.data.pagination.totalItems;
            state.currentPage = result.data.pagination.currentPage;
            state.pageSize = result.data.pagination.itemsPerPage;

            return { success: true, message: "Usuários carregados com sucesso." };
        }
        return { success: false, message: result.error || "Não foi possível carregar os usuários." };
    } catch (error) {
        if (error.name !== 'AbortError') {
            return { success: false, message: "Erro inesperado ao carregar os usuários." };
        }
        return { success: false, aborted: true, message: "Operação cancelada pelo usuário." };
    } finally {
        state.isLoading = false;
    }

};

const changePage = async (page) => {
    state.currentPage = page;
    return await fetchUsers();
};

const debouncedSearch = debounceAsync(fetchUsers, 250);
const updateSearch = async (search) => {
    state.search = search?.trim() || '';
    state.currentPage = 0;
    state.isLoading = true;
    return await debouncedSearch();
};

const updateSort = async (field, order) => {
    state.sorting = { field, order };
    return await fetchUsers();
};

const initialize = (initialData = {}) => {
    const { users, pagination = {}, search, sorting = {} } = initialData;

    state.users = users || initialState.users;
    state.totalItems = pagination.totalItems || initialState.totalItems;
    state.currentPage = pagination.currentPage || initialState.currentPage;
    state.pageSize = pagination.itemsPerPage || initialState.pageSize;
    state.search = search || initialState.search;
    state.sorting = {
        field: sorting.field || initialState.sorting.field,
        order: sorting.order || initialState.sorting.order,
    };
};

const userTableStore = {
    get state() {
        return state;
    },

    fetchUsers,
    changePage,
    updateSearch,
    updateSort,
    initialize,

    columns: [
        { key: "id", label: "ID", width: '70px' },
        { key: "nome", label: "Nome" },
        { key: "cpf", label: "CPF", width: '150px' },
        { key: "email", label: "Email" },
        { key: "telefone", label: "Telefone", width: '200px' },
        { key: "acoes", label: "Ações", width: '100px', sortable: false },
    ],
};

export default userTableStore;