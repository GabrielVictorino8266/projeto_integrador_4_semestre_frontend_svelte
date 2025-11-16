<script>
  import { deserialize } from "$app/forms";
  import { onMount } from "svelte";
  import { Mask } from "maska";
  import { toastState } from "$lib/stores/toast.svelte";
  import Toaster from "$lib/components/layout/Toaster.svelte";
  import MaintenanceForm from "$lib/components/MaintenanceForm.svelte";
  import ConfirmDialog from "$lib/components/layout/ConfirmDialog.svelte";
  import Modal from "$lib/components/layout/Modal.svelte";
  import DataTable from "$lib/components/layout/DataTable.svelte";
  import Button from "$lib/components/layout/Button.svelte";
  import PlanLimitIndicator from "$lib/components/PlanLimitIndicator.svelte";

  // Keep this store — it's doing heavy lifting
  import { createDataTableStore } from "$lib/stores/dataTable.svelte.js";

  const { data } = $props();

  const manutencoesTable = createDataTableStore({
      endpoint: "?/search",
      columns: [
        { key: "id", label: "ID", width: '70px' },
        { key: "dataManutencao", label: "Data", width: '120px' },
        { key: "descricao", label: "Descrição", width: '200px' },
        { key: "custo", label: "Custo (R$)", width: '100px' },
        { key: "tipoManutencao", label: "Tipo", width: '100px' },
        { key: "placaVeiculo", label: "Veículo", width: '100px' },
        { key: "acoes", label: "Ações", width: '100px', sortable: false },
      ]
    });

  // Estados do diálogo
  let isEditing = $state(false);
  let isDeleting = $state(false);
  let selectedManutencao = $state(null);
  let isEditMode = $state(false);

  const placaMask = new Mask({ mask: "@@@-#*##" }); // Brazilian plate format
  const currentUser = $state(data?.session?.user);
  const isAdmin = $derived(currentUser?.role === "ADMIN");
  const isPaidPlan = $derived(currentUser?.plano === "PAGO");
  const limitReached = $derived(!isPaidPlan && manutencoesTable.state.totalItems >= 50);


  // === Helpers ===
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('-').reverse().join('/');
  };

  // === Lógica de exclusão ===
  async function deleteManutencao(manutencao) {
    if (!manutencao?.id) {
      return { success: false, message: "Manutenção não selecionada." };
    }

    try {
      const formData = new FormData();
      formData.append("id", manutencao.id);
      const response = await fetch("?/delete", { method: "POST", body: formData });
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      const result = deserialize(await response.text());

      if (result.type === "success") {
        return { success: true, message: "Manutenção excluída com sucesso." };
      } else {
        return { success: false, message: result.data.error || "Não foi possível excluir a manutenção." };
      }
    } catch {
      return { success: false, message: "Erro ao tentar excluir a manutenção." };
    }
  }

  // === Ciclo de Vida ===
  onMount(() => {
    manutencoesTable.initialize(data);
    if (data?.error) toastState.error(data.error);
  });

  // === Manipuladores ===
  const handleCreate = () => {
    selectedManutencao = null;
    isEditMode = false;
    isEditing = true;
  };

  const handleEdit = (manutencao) => {
    selectedManutencao = manutencao;
    isEditMode = true;
    isEditing = true;
  };

  const handleDelete = (manutencao) => {
    selectedManutencao = manutencao;
    isDeleting = true;
  };

  const confirmDelete = async () => {
    const result = await deleteManutencao(selectedManutencao);
    if (result.success) {
      toastState.success(result.message);
      manutencoesTable.fetchData();
    } else {
      toastState.error(result.message);
    }
    isDeleting = false;
  };

  const handleSaveSuccess = () => {
    isEditing = false;
    toastState.success("Manutenção salva com sucesso!");
    manutencoesTable.fetchData();
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
      Tem certeza que deseja excluir a manutenção do veículo <b>{selectedManutencao?.placaVeiculo}</b> de <b>{selectedManutencao?.dataManutencao ? formatDate(selectedManutencao.dataManutencao) : ''}</b>?
    {/snippet}
  </ConfirmDialog>
{/if}

{#if isEditing}
  <Modal
    title={isEditMode ? 'Editar Manutenção' : 'Nova Manutenção'}
    onClose={() => isEditing = false}
  >
    <MaintenanceForm
      maintenance={selectedManutencao}
      tiposManutencao={data.tipoManutencao}
      vehicles={data.vehicles}
      isEditMode={isEditMode}
      onCancel={() => isEditing = false}
      onSaveSuccess={handleSaveSuccess}
      onSaveError={(err) => toastState.error(err)}
    />
  </Modal>
{/if}

{#if isAdmin && !isPaidPlan}
  <PlanLimitIndicator 
    limit={50} 
    used={manutencoesTable.state.totalItems} 
    message="manutenções registradas" 
  />
{/if}

<DataTable
  columns={manutencoesTable.columns}
  items={manutencoesTable.state.items}
  isLoading={manutencoesTable.state.isLoading}
  totalItems={manutencoesTable.state.totalItems}
  currentPage={manutencoesTable.state.currentPage}
  pageSize={manutencoesTable.state.pageSize}
  currentSort={manutencoesTable.state.sorting}

  onSort={async (field, order) => {
    const result = await manutencoesTable.updateSort(field, order);
    if (!result.success) toastState.error(result.message);
  }}

  onPageChange={async (page) => {
    const result = await manutencoesTable.changePage(page);
    if (!result.success) toastState.error(result.message);
  }}

  onSearch={async (search) => {
    const result = await manutencoesTable.updateSearch(search);
    if (!result.success) toastState.error(result.message);
  }}
>
  {#snippet toolbar()}
    {#if isAdmin && !limitReached}
      <Button variant="primary" icon="plus" onclick={handleCreate}>
        Nova Manutenção
      </Button>
    {/if}
  {/snippet}

  {#snippet cell_dataManutencao(manutencao)}
    {formatDate(manutencao.dataManutencao)}
  {/snippet}

  {#snippet cell_custo(manutencao)}
    {formatCurrency(manutencao.custo || 0)}
  {/snippet}

  {#snippet cell_tipoManutencao(manutencao)}
    <span class="badge">
      {manutencao.tipoManutencao || 'Não especificado'}
    </span>
  {/snippet}

  {#snippet cell_placaVeiculo(manutencao)}
    {placaMask.masked(manutencao.placaVeiculo || '')}
  {/snippet}

  {#snippet cell_acoes(manutencao)}
  {#if isAdmin}
    <div class="btn-group">
      <button aria-label="Editar" class="btn-icon" onclick={() => handleEdit(manutencao)}>
        <i class="fas fa-edit"></i>
      </button>
      <button aria-label="Excluir" class="btn-icon delete" onclick={() => handleDelete(manutencao)}
        disabled={!manutencao.id}>
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
    justify-content: center;
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

  .badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-block;
    min-width: 80px;
    text-align: center;
    text-transform: capitalize;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
</style>