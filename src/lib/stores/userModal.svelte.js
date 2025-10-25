export function createUserModalState(onSuccess, onError) {
  let abortController = null;

  let modalState = $state({
    user: null,
    open: false,
    editing: false,
    saving: false,
  });

  const resetModalState = () => {
    modalState = {
      user: null,
      open: false,
      editing: false,
      saving: false,
    };
  };

  const handleClose = () => {
    abortController?.abort();
    resetModalState();
  };

  const handleEdit = (user) => {
    modalState = {
      user,
      open: true,
      editing: true,
      saving: false,
    };
  };

  const handleDelete = (user) => {
    modalState = {
      user,
      open: true,
      editing: false,
      saving: false,
    };
  };

  const handleSaveSuccess = (data) => {
    onSuccess?.("Usuário salvo com sucesso!");
    resetModalState();
  };

  const handleSaveError = ({ error }) => {
    onError?.(error);
    resetModalState();
  };

  return {
    get open() {
      return modalState.open;
    },
    get editing() {
      return modalState.editing;
    },
    get user() {
      return modalState.user;
    },
    get saving() {
      return modalState.saving;
    },
    handleClose,
    handleEdit,
    handleDelete,
    handleSaveSuccess,
    handleSaveError,
  };
}
