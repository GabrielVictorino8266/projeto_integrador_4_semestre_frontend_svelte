import { deserialize } from "$app/forms";
import { toastState } from "./toast.svelte";

export function createUsersTableState(initialData) {
    // --- State ---
    let state = $state({
        users: initialData?.users ?? [],
        totalItems: initialData?.totalItems ?? 0,
        isLoading: false,
        currentPage: initialData?.page ?? 1,
        pageSize: initialData?.size ?? 10,
        search: initialData?.search ?? "",
        sorting: initialData?.sorting ?? { field: "nome", direction: "asc" },
        initialized: Boolean(initialData)
    });

    let debounceTimer;
    let abortController;

    // --- Fetch helper ---
    async function fetchUsers() {
        state.isLoading = true;
        try {
            abortController?.abort();
            abortController = new AbortController();

            const formData = new FormData();
            formData.append("page", state.currentPage);
            formData.append("size", state.pageSize);
            formData.append("search", state.search);
            formData.append("sort", `${state.sorting.field},${state.sorting.direction}`);

            const response = await fetch("?/search", {
                method: "POST",
                body: formData,
                signal: abortController.signal
            });

            const result = deserialize(await response.json());
            if (result.type === "success") {
                state.users = result.users;
                state.totalItems = result.pagination.totalItems;
            } else {
                toastState.error(result.error);
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                toastState.error(error.message || "Erro ao carregar usuários");
            }
        } finally {
            state.isLoading = false;
            state.initialized = true;
        }
    }

    // --- Reactive fetching ---
    // Runs whenever page, size, or sorting change *after* initialization
    $effect(() => {
        const { currentPage, pageSize, sorting, initialized } = state;
        if (!initialized) return; // don’t run until after mount or initial data used
        fetchUsers();

        return () => abortController?.abort();
    });

    // --- Debounced search ---
    $effect(() => {
        const { search, initialized } = state;
        if (!initialized) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fetchUsers, 300);

        return () => clearTimeout(debounceTimer);
    });

    // --- Public API ---
    return {
        get state() { return state; },
        setPage: (page) => (state.currentPage = page),
        setPageSize: (size) => (state.pageSize = size),
        setSort: (field, direction) => (state.sorting = { field, direction }),
        setSearch: (value) => (state.search = value),
        reload: fetchUsers,
    };
}
