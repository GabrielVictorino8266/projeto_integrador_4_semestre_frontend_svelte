<script>
    import { onMount } from "svelte";
    import { Mask } from "maska";
    import { toastState } from "$lib/stores/toast.svelte";
    import { Toaster } from "$lib/components/layout/index.js";
    import UserForm from "$lib/components/UserForm.svelte";
    import ConfirmDialog from "$lib/components/layout/ConfirmDialog.svelte";
    import Modal from "$lib/components/layout/Modal.svelte";
    import DataTable from "$lib/components/layout/DataTable.svelte";
    import Button from "$lib/components/layout/Button.svelte";

    import users from "$lib/stores/userTable.svelte";
    import editUser from "$lib/stores/userEdit.svelte";
    import deleteUser from "$lib/stores/userDelete.svelte";

    const { data } = $props();

    const currentUser = $state(data?.session?.user);
    const cpfMask = new Mask({ mask: "###.###.###-##" });

    onMount(() => {
        users.initialize(data);
        if (data.error) {
            toastState.error(data.error);
        }
    });
    
    const handleSearch = async (search) => {
        const result = await users.updateSearch(search);
        if (!result.success && !result.aborted) {
            toastState.error(result.message);
        }
    };

    const handleSort = async (field, order) => {
        const result = await users.updateSort(field, order);
        if (!result.success && !result.aborted) {
            toastState.error(result.message);
        }
    };

    const handlePageChange = async (page) => {
        const result = await users.changePage(page);
        if (!result.success && !result.aborted) {
            toastState.error(result.message);
        }
    };

     const handleConfirmDelete = async () => {
        const result = await deleteUser.confirmDelete();
        if (!result.success) {
            toastState.error(result.message);
        } else {
            toastState.success('Usuário excluído com sucesso');
            users.fetchUsers();
            deleteUser.closeDialog();
        }
    };

    const handleSaveSuccess = () => {
        editUser.closeModal();
        toastState.success('Usuário salvo com sucesso');
        users.fetchUsers();
    };

    const handleSaveError = (error) => {
        toastState.error(error);
    };
</script>

<Toaster />

{#if deleteUser.state.isOpen}
    {#snippet message()}
        Tem certeza que deseja excluir o usuário <b>{deleteUser.state.selectedUser.nome}</b>?
    {/snippet}

    <ConfirmDialog
        title="Confirmar exclusão"
        {message}
        isOpen={deleteUser.state.isOpen}
        isLoading={deleteUser.state.isDeleting}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={deleteUser.closeDialog}
    />
{/if}

{#if editUser.state.showModal}
    <Modal
        title={editUser.state.isEditMode ? 'Editar Usuário' : 'Criar Usuário'}
        onClose={editUser.closeModal}
    >
        <UserForm
            user={editUser.state.selectedUser}
            isEditMode={editUser.state.isEditMode}
            onCancel={editUser.closeModal}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
        />
    </Modal>
{/if}

<DataTable
    columns={users.columns}
    items={users.state.users}
    isLoading={users.state.isLoading}
    totalItems={users.state.totalItems}
    currentPage={users.state.currentPage}
    pageSize={users.state.pageSize}
    currentSort={users.state.sorting}
    onSort={handleSort}
    onPageChange={handlePageChange}
    onSearch={handleSearch}
>
    {#snippet toolbar()}
        <Button variant="primary" icon="plus" onclick={editUser.openCreate}>
            Novo Usuário
        </Button>
    {/snippet}

    {#snippet cell_cpf(user)}
        {cpfMask.masked(user.cpf)}
    {/snippet}
    
    {#snippet cell_nome(user)}
        {user.nome}
        {#if user.id === currentUser?.id}
            <span class="badge badge-warning">(Você)</span>
        {/if}
    {/snippet}

    {#snippet cell_acoes(user)}
        {#if user.id !== currentUser?.id}
            <div class="btn-group">
                <button aria-label="Editar" class="btn-icon" onclick={() => editUser.openEdit(user)}>
                    <i class="fas fa-edit"></i>
                </button>
                <button aria-label="Excluir" class="btn-icon delete" onclick={() => deleteUser.openDialog(user)}>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        {/if}
    {/snippet}
</DataTable>

<style>
    .btn-group {
        display: flex;
        gap: 5px;
    }

    .btn-icon {
        padding: 8px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        cursor: pointer;
        color: #3b82f6;
        transition: all 0.3s;
    }

    .btn-icon:hover {
        background: rgba(59, 130, 246, 0.2);
        transform: scale(1.1);
    }

    .btn-icon.delete {
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
    }

    .btn-icon.delete:hover {
        background: rgba(239, 68, 68, 0.1);
    }
</style>