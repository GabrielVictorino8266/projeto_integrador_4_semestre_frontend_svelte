import { toastState } from "./toast.svelte";

export function createUserModalState() {
  let modalState = $state({
    user: null,
    open: false,
    editing: false,
    saving: false,
  });

  const close = () => {
    modalState.user = null;
    modalState.open = false;
    modalState.editing = false;
    modalState.saving = false;
  };

  const openForEdit = (user) => {
    modalState.user = user;
    modalState.open = true;
    modalState.editing = true;
    modalState.saving = false;
  };

  const openForDelete = (user) => {
    modalState.user = user;
    modalState.open = true;
    modalState.editing = false;
    modalState.saving = false;
  };

  const startSaving = () => {
    modalState.saving = true;
  };

  const handleSuccess = (message = "Operação realizada com sucesso!") => {
    toastState.success(message);
    close();
  };

  const handleError = (error) => {
    toastState.error(error);
    modalState.saving = false; // Keep modal open for retry
  };

  return {
    get state() { return modalState; },
    close,
    openForEdit,
    openForDelete,
    startSaving,
    handleSuccess,
    handleError,
  };
}