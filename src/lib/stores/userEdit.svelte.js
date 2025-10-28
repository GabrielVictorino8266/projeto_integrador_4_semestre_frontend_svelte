const initialState = {
    selectedUser: null,
    showModal: false,
    isEditMode: false,
};

let state = $state(initialState);

const openCreate = () => {
    state.selectedUser = null;
    state.isEditMode = false;
    state.showModal = true;
};

const openEdit = (user) => {
    state.selectedUser = user;
    state.isEditMode = true;
    state.showModal = true;
};

const closeModal = () => {
    state.showModal = false;
};

const userEditStore = {
    get state() {
        return state;
    },
    
    openCreate,
    openEdit,
    closeModal,
};

export default userEditStore;