<script>
import { deserialize } from "$app/forms";
  import { onMount } from "svelte";
  import { Mask } from "maska";
  import { toastState } from "$lib/stores/toast.svelte";
  import Toaster from "$lib/components/layout/Toaster.svelte";
  import UserForm from "$lib/components/UserForm.svelte";
  import ConfirmDialog from "$lib/components/layout/ConfirmDialog.svelte";
  import Modal from "$lib/components/layout/Modal.svelte";
  import DataTable from "$lib/components/layout/DataTable.svelte";
  import Button from "$lib/components/layout/Button.svelte";
  import PlanLimitIndicator from "$lib/components/PlanLimitIndicator.svelte";

  // Keep this store — it’s doing heavy lifting
  import { createDataTableStore } from "$lib/stores/dataTable.svelte.js";

  const { data } = $props();

  const usersTable = createDataTableStore({
      endpoint: "?/search",
      columns: [
        { key: "id", label: "ID", width: '70px' },
        { key: "funcao", label: "Função", width: '100px', sortable: false },
        { key: "nome", label: "Nome" },
        { key: "cpf", label: "CPF", width: '150px' },
        { key: "cnh", label: "CNH", width: '230px' },
        { key: "email", label: "Email" },
        { key: "telefone", label: "Telefone", width: '200px' },
        { key: "acoes", label: "Ações", width: '100px', sortable: false },
      ],
    });

  // Simplify dialogs to local state
  let isEditing = $state(false);
  let isDeleting = $state(false);
  let selectedUser = $state(null);
  let isEditMode = $state(false);

  const currentUser = $state(data?.session?.user);
  const cpfMask = new Mask({ mask: "###.###.###-##" });
  const isPaidPlan = $derived(!currentUser?.plano === "PAGO");
  const limitReached = $derived(!isPaidPlan && usersTable.state.totalItems >= 5);
  const isAdmin = $derived(currentUser?.role === "ADMIN");

  // === Helpers ===
  const canEditOrDelete = (user) => user?.id !== currentUser?.id;

  // === Deletion logic (inline, no store) ===
  async function deleteUser(user) {
    if (!user?.id) {
      return { success: false, message: "Usuário não selecionado." };
    }

    try {
      const formData = new FormData();
      formData.append("id", user.id);
      const response = await fetch("?/delete", { method: "POST", body: formData });
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      const result = deserialize(await response.text());

      if (result.type === "success") {
        return { success: true, message: "Usuário excluído com sucesso." };
      } else {
        return { success: false, message: result.data.error || "Não foi possível excluir o usuário." };
      }
    } catch {
      return { success: false, message: "Não foi possível excluir o usuário." };
    }
  }

  // === Lifecycle ===
  onMount(() => {
    usersTable.initialize(data);
    if (data?.error) toastState.error(data.error);
  });

  // === Handlers ===
  const handleCreate = () => {
    selectedUser = null;
    isEditMode = false;
    isEditing = true;
  };

  const handleEdit = (user) => {
    if (!canEditOrDelete(user)) return;
    selectedUser = user;
    isEditMode = true;
    isEditing = true;
  };

  const handleDelete = (user) => {
    if (!canEditOrDelete(user)) return;
    selectedUser = user;
    isDeleting = true;
  };

  const confirmDelete = async () => {
    const result = await deleteUser(selectedUser);
    if (result.success) {
      toastState.success(result.message);
      usersTable.fetchData();
    } else {
      toastState.error(result.message);
    }
    isDeleting = false;
  };

  const handleSaveSuccess = () => {
    isEditing = false;
    toastState.success("Usuário salvo com sucesso.");
    usersTable.fetchData();
  };
</script>

<Toaster />

{#if isDeleting}
  <ConfirmDialog
    title="Confirmar exclusão"
    isOpen={true}
    isLoading={false}
    confirmText="Confirmar"
    cancelText="Cancelar"
    onConfirm={confirmDelete}
    onCancel={() => isDeleting = false}
  >
    {#snippet message()}
      Tem certeza que deseja excluir o usuário <b>{selectedUser?.nome}</b>?
    {/snippet}
  </ConfirmDialog>
{/if}

{#if isEditing}
  <Modal
    title={isEditMode ? 'Editar Usuário' : 'Criar Usuário'}
    onClose={() => isEditing = false}
  >
    <UserForm
      user={selectedUser}
      isEditMode={isEditMode}
      onCancel={() => isEditing = false}
      onSaveSuccess={handleSaveSuccess}
      onSaveError={(err) => toastState.error(err)}
    />
  </Modal>
{/if}

{#if isAdmin && !isPaidPlan}
  <PlanLimitIndicator 
    limit={5} 
    used={usersTable.state.totalItems} 
    message="usuários registrados" 
  />
{/if}

<DataTable
  columns={usersTable.columns}
  items={usersTable.state.items}
  isLoading={usersTable.state.isLoading}
  totalItems={usersTable.state.totalItems}
  currentPage={usersTable.state.currentPage}
  pageSize={usersTable.state.pageSize}
  currentSort={usersTable.state.sorting}

  onSort={async (field, order) => {
    const result = await usersTable.updateSort(field, order);
    if (!result.success) toastState.error(result.message);
  }}

  onPageChange={async (page) => {
    const result = await usersTable.changePage(page);
    if (!result.success) toastState.error(result.message);
  }}

  onSearch={async (search) => {
    const result = await usersTable.updateSearch(search);
    if (!result.success) toastState.error(result.message);
  }}
>
  {#snippet toolbar()}
  {#if currentUser?.role === "ADMIN" && !limitReached}
    <Button variant="primary" icon="plus" onclick={handleCreate}>
      Novo Usuário
    </Button>
  {/if}
  {/snippet}

  {#snippet cell_cpf(user)} {cpfMask.masked(user.cpf)} {/snippet}

  {#snippet cell_funcao(user)}
    {#if user.motorista}
      Motorista
    {:else}
      Admin
    {/if}
  {/snippet}

  {#snippet cell_nome(user)}
    {user.nome}
    {#if user.id === currentUser?.id}
      <span class="badge badge-warning">(Você)</span>
    {:else if user.motorista}
    {/if}
  {/snippet}

  {#snippet cell_cnh(user)}
    {#if user.motorista}
      {user.motorista?.numeroCnh} 
      <span class="badge badge-primary">(Tipo: {user.motorista?.tipoCnh})</span>
    {:else}
      &mdash;
    {/if}
  {/snippet}

  {#snippet cell_acoes(user)}
    {#if canEditOrDelete(user) && isAdmin}
      <div class="btn-group">
        <button aria-label="Editar" class="btn-icon" onclick={() => handleEdit(user)}>
          <i class="fas fa-edit"></i>
        </button>
        <button aria-label="Excluir" class="btn-icon delete" onclick={() => handleDelete(user)}>
          <i class="fas fa-trash"></i>
        </button>
      </div>
    {:else}
      &mdash;
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

  .text-muted {
    color: #86898b;
  }
</style>