<script>
  import { deserialize } from "$app/forms";
  import { onMount } from "svelte";
  import { Mask } from "maska";
  import { toastState } from "$lib/stores/toast.svelte";
  import Toaster from "$lib/components/layout/Toaster.svelte";
  import VehicleForm from "$lib/components/VehicleForm.svelte";
  import ConfirmDialog from "$lib/components/layout/ConfirmDialog.svelte";
  import Modal from "$lib/components/layout/Modal.svelte";
  import DataTable from "$lib/components/layout/DataTable.svelte";
  import Button from "$lib/components/layout/Button.svelte";
  import PlanLimitIndicator from "$lib/components/PlanLimitIndicator.svelte";

  // Keep this store — it's doing heavy lifting
  import { createDataTableStore } from "$lib/stores/dataTable.svelte.js";

  const { data } = $props();

  const vehiclesTable = createDataTableStore({
      endpoint: "?/search",
      columns: [
        { key: "id", label: "ID", width: '70px' },
        { key: "numeroVeiculo", label: "Número", width: '100px' },
        { key: "placa", label: "Placa", width: '120px' },
        { key: "tipoVeiculo", label: "Tipo", width: '120px' },
        { key: "marca", label: "Marca", width: '130px' },
        { key: "anoFabricacao", label: "Ano", width: '90px' },
        { key: "kmAtual", label: "KM Atual", width: '120px' },
        { key: "status", label: "Status", width: '100px' },
        { key: "acoes", label: "Ações", width: '100px', sortable: false },
      ],
    });

  // Simplify dialogs to local state
  let isEditing = $state(false);
  let isDeleting = $state(false);
  let selectedVehicle = $state(null);
  let isEditMode = $state(false);

  const placaMask = new Mask({ mask: "AAA-#*##" }); // Brazilian plate format
  const currentUser = $state(data?.session?.user);
  const isAdmin = $derived(currentUser?.role === "ADMIN");

  // === Helpers ===
  const formatKm = (km) => {
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
  };

  const getStatusBadge = (status) => {
    console.log('status', status)
    const badges = {
      'ATIVO': 'badge-ativo',
      'INATIVO': 'badge-inativo',
      'MANUTENCAO': 'badge-manutencao',
      'EXCLUIDO': 'badge-excluido'
    };
    return badges[status] || 'badge-secondary';
  };

  // === Deletion logic (inline, no store) ===
  async function deleteVehicle(vehicle) {
    if (!vehicle?.id) {
      return { success: false, message: "Veículo não selecionado." };
    }

    try {
      const formData = new FormData();
      formData.append("id", vehicle.id);
      const response = await fetch("?/delete", { method: "POST", body: formData });
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      const result = deserialize(await response.text());

      if (result.type === "success") {
        return { success: true, message: "Veículo excluído com sucesso." };
      } else {
        return { success: false, message: result.data.error || "Não foi possível excluir o veículo." };
      }
    } catch {
      return { success: false, message: "Não foi possível excluir o veículo." };
    }
  }

  // === Lifecycle ===
  onMount(() => {
    vehiclesTable.initialize(data);
    if (data?.error) toastState.error(data.error);
  });

  // === Handlers ===
  const handleCreate = () => {
    selectedVehicle = null;
    isEditMode = false;
    isEditing = true;
  };

  const handleEdit = (vehicle) => {
    selectedVehicle = vehicle;
    isEditMode = true;
    isEditing = true;
  };

  const handleDelete = (vehicle) => {
    selectedVehicle = vehicle;
    isDeleting = true;
  };

  const confirmDelete = async () => {
    const result = await deleteVehicle(selectedVehicle);
    if (result.success) {
      toastState.success(result.message);
      vehiclesTable.fetchData();
    } else {
      toastState.error(result.message);
    }
    isDeleting = false;
  };

  const handleSaveSuccess = () => {
    isEditing = false;
    toastState.success("Veículo salvo com sucesso.");
    vehiclesTable.fetchData();
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
      Tem certeza que deseja excluir o veículo <b>{selectedVehicle?.numeroVeiculo}</b> - <b>{selectedVehicle?.placa}</b>?
    {/snippet}
  </ConfirmDialog>
{/if}

{#if isEditing}
  <Modal
    title={isEditMode ? 'Editar Veículo' : 'Criar Veículo'}
    onClose={() => isEditing = false}
  >
    <VehicleForm
      vehicle={selectedVehicle}
      isEditMode={isEditMode}
      onCancel={() => isEditing = false}
      onSaveSuccess={handleSaveSuccess}
      onSaveError={(err) => toastState.error(err)}
    />
  </Modal>
{/if}

{#if isAdmin}
  <PlanLimitIndicator 
    limit={5} 
    used={vehiclesTable.state.totalItems} 
    message="veículos registrados" 
  />
{/if}


<DataTable
  columns={vehiclesTable.columns}
  items={vehiclesTable.state.items}
  isLoading={vehiclesTable.state.isLoading}
  totalItems={vehiclesTable.state.totalItems}
  currentPage={vehiclesTable.state.currentPage}
  pageSize={vehiclesTable.state.pageSize}
  currentSort={vehiclesTable.state.sorting}

  onSort={async (field, order) => {
    const result = await vehiclesTable.updateSort(field, order);
    if (!result.success) toastState.error(result.message);
  }}

  onPageChange={async (page) => {
    const result = await vehiclesTable.changePage(page);
    if (!result.success) toastState.error(result.message);
  }}

  onSearch={async (search) => {
    const result = await vehiclesTable.updateSearch(search);
    if (!result.success) toastState.error(result.message);
  }}
>
  {#snippet toolbar()}
    {#if isAdmin}
      <Button variant="primary" icon="plus" onclick={handleCreate}>
        Novo Veículo
      </Button>
    {/if}
  {/snippet}

  {#snippet cell_placa(vehicle)} 
    {placaMask.masked(vehicle.placa)} 
  {/snippet}

  {#snippet cell_kmAtual(vehicle)}
    {formatKm(vehicle.kmAtual)}
  {/snippet}

  {#snippet cell_status(vehicle)}
    <span class="badge {getStatusBadge(vehicle.status)}">
      {vehicle.status}
    </span>
  {/snippet}

  {#snippet cell_acoes(vehicle)}
  {#if isAdmin}
    <div class="btn-group">
      <button aria-label="Editar" class="btn-icon" onclick={() => handleEdit(vehicle)}>
        <i class="fas fa-edit"></i>
      </button>
      <button aria-label="Excluir" class="btn-icon delete" onclick={() => handleDelete(vehicle)}>
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
    font-weight: 600;
    width: 100px;
    text-transform: uppercase;
  }

  .badge-ativo {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .badge-excluido {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .badge-manutencao {
    background: rgba(234, 179, 8, 0.1);
    color: #eab308;
    border: 1px solid rgba(234, 179, 8, 0.3);
  }

  .badge-indisponivel {
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
    border: 1px solid rgba(148, 163, 184, 0.3);
  }

  .badge-secondary {
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
    border: 1px solid rgba(148, 163, 184, 0.3);
  }
</style>