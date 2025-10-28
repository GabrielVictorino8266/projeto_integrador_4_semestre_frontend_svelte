import { deserialize } from "$app/forms";

const initialState = {
    isOpen: false,
    isDeleting: false,
    selectedUser: null,
};

let state = $state(initialState);
let abortController = null;

const openDialog = (user) => {
    state.selectedUser = user;
    state.isOpen = true;
};

const closeDialog = () => {
    abortController?.abort();
    state.isOpen = false;
    state.selectedUser = null;
};

const confirmDelete = async () => {
    if (!state.selectedUser) {
        return { success: false, aborted: true, message: 'Usuário não selecionado.' };
    }

    state.isDeleting = true;
    try {
        abortController?.abort();
        abortController = new AbortController();

        const formData = new FormData();
        formData.append('id', state.selectedUser.id);

        const response = await fetch(`?/delete`, {
            method: 'POST',
            body: formData,
            signal: abortController.signal,
        });

        const result = deserialize(await response.text());

        if (result.type === 'success') {
            return { success: true, message: "Usuário excluído com sucesso." };
        } else {
            return { success: false, message: result.data?.error || "Não foi possível excluir o usuário." };
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            return { success: false, message: "Erro inesperado ao excluir o usuário." };
        }
        return { success: false, aborted: true, message: "Operação cancelada pelo usuário." };
    } finally {
        state.isDeleting = false;
    }
};

const userDeleteStore = {
    get state() {
        return state;
    },

    openDialog,
    closeDialog,
    confirmDelete,
};

export default userDeleteStore;