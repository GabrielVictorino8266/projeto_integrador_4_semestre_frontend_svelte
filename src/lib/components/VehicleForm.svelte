<!-- VehicleForm.svelte -->
<script>
    import { enhance } from "$app/forms";
    import { Input, Button } from "$lib/components/layout";
    import { onDestroy } from "svelte";

    const {
        vehicle,
        isEditMode,
        onCancel,
        onSaveSuccess,
        onSaveError,
        tiposVeiculo = [
            { value: 'carro', label: 'Carro' },
            { value: 'moto', label: 'Moto' },
            { value: 'caminhao', label: 'Caminhão' },
            { value: 'van', label: 'Van' },
            { value: 'onibus', label: 'Ônibus' }
        ],
        statusVeiculo = [
            { value: 'ativo', label: 'Ativo' },
            { value: 'inativo', label: 'Inativo' },
            { value: 'manutencao', label: 'Manutenção' }
        ]
    } = $props();

    let isSubmitting = $state(false); 
    let errors = $state(null);
    let formActions = $state(null);

    const currentYear = new Date().getFullYear();
    
    let formData = $state({
        numeroVeiculo: vehicle?.numeroVeiculo ?? '',
        placa: vehicle?.placa ?? '',
        tipoVeiculo: vehicle?.tipoVeiculo ?? '',
        anoFabricacao: vehicle?.anoFabricacao ?? '',
        marca: vehicle?.marca ?? '',
        kmAtual: vehicle?.kmAtual ?? 0,
        limiteAvisoKm: vehicle?.limiteAvisoKm ?? 1000,
        status: vehicle?.status ?? 'ativo'
    });

    // Scroll to first error
    $effect(() => {
        if (!errors) return;
        const firstErrorField = ['numeroVeiculo', 'placa', 'tipoVeiculo', 'anoFabricacao', 'marca', 'kmAtual', 'limiteAvisoKm']
            .find(field => errors[field]);
        if (firstErrorField) {
            document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Transforma a placa para maiúsculo
    $effect(() => {
        formData.placa = formData?.placa?.toUpperCase();
    });

    const handleSubmit = async () => {
        isSubmitting = true;

        await new Promise((resolve) => setTimeout(resolve, 250));

        return async ({ result, update }) => {
            await update();

            isSubmitting = false;
            errors = result.data.errors;

            if (result.type === 'success') {
                onSaveSuccess(result.data);
            } else if (result?.data?.error) {
                onSaveError(result.data.error);
            }
        };
    };

    onDestroy(() => {
        errors = null;
        formData = {
            numeroVeiculo: '',
            placa: '',
            tipoVeiculo: '',
            anoFabricacao: '',
            marca: '',
            kmAtual: '',
            limiteAvisoKm: '',
            status: 'ATIVO'
        };
    })
</script>

{#key errors}
    <form
        class="vehicle-form"
        method="post"
        action="?/save"
        use:enhance={handleSubmit}
        novalidate
        autocomplete="off"
    >
        {#if vehicle?.id}
            <input type="hidden" name="id" value={vehicle.id} />
        {/if}

        <div class="form-fields">
            <div class="form-row">
                <Input
                    label="Número do Veículo"
                    required
                    type="text"
                    id="numeroVeiculo"
                    name="numeroVeiculo"
                    placeholder="Ex: 001"
                    maxlength="10"
                    bind:value={formData.numeroVeiculo}
                    error={errors?.numeroVeiculo}
                />
                <Input
                    label="Placa"
                    required
                    type="text"
                    id="placa"
                    name="placa"
                    placeholder="Ex: ABC1D23"
                    maxlength="7"
                    bind:value={formData.placa}
                    error={errors?.placa}
                />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="tipoVeiculo" class="form-label">
                        Tipo de Veículo <span class="required">*</span>
                    </label>
                    <select
                        id="tipoVeiculo"
                        name="tipoVeiculo"
                        class="form-select"
                        class:error={errors?.tipoVeiculo}
                        bind:value={formData.tipoVeiculo}
                        required
                    >
                        <option value="">Selecione o tipo</option>
                        {#each tiposVeiculo as tipo, index (index)}
                            <option value={tipo.value}>{tipo.label}</option>
                        {/each}
                    </select>
                    {#if errors?.tipoVeiculo}
                        <span class="error-message">{errors.tipoVeiculo}</span>
                    {/if}
                </div>

                <Input
                    label="Marca"
                    required
                    type="text"
                    id="marca"
                    name="marca"
                    placeholder="Ex: Toyota"
                    maxlength="20"
                    bind:value={formData.marca}
                    error={errors?.marca}
                />
            </div>

            <div class="form-row">
                <Input
                    label="Ano de Fabricação"
                    required
                    type="number"
                    id="anoFabricacao"
                    name="anoFabricacao"
                    placeholder="Ex: 2020"
                    min="1900"
                    max={currentYear}
                    bind:value={formData.anoFabricacao}
                    error={errors?.anoFabricacao}
                />

                <div class="form-group">
                    <label for="status" class="form-label">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        class="form-select"
                        bind:value={formData.status}
                    >
                        {#each statusVeiculo as status, index (index)}
                            <option  value={status.value}>{status.label}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="form-row">
                <Input
                    label="KM Atual"
                    required
                    type="number"
                    id="kmAtual"
                    name="kmAtual"
                    placeholder="Ex: 50000"
                    min="0"
                    bind:value={formData.kmAtual}
                    error={errors?.kmAtual}
                />
                <Input
                    label="Limite de Aviso (KM)"
                    required
                    type="number"
                    id="limiteAvisoKm"
                    name="limiteAvisoKm"
                    placeholder="Ex: 5000"
                    min="0"
                    bind:value={formData.limiteAvisoKm}
                    error={errors?.limiteAvisoKm}
                />
            </div>
            <p class="info-text">
                <i class="fas fa-info-circle"></i>
                O limite de aviso indica a cada quantos quilômetros você deseja receber notificações de manutenção.
            </p>
        </div>

        <div class="form-actions button-group" bind:this={formActions}>
            <Button type="button" variant="secondary" onclick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
                {isEditMode ? "Salvar Alterações" : "Criar Veículo"}
            </Button>
        </div>
    </form>
{/key}

<style>
    .vehicle-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .form-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }

    .form-group {
        margin-bottom: 14px;
        flex: 1;
    }

    .form-label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        color: #8b9cb6;
        transition: color 0.3s;
    }

    .required {
        color: #ef4444;
    }

    .error-message {
        font-size: 11px;
        color: #ef4444;
        margin-top: 3px;
    }

    .info-text {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        padding: 12px;
        background: rgba(59, 130, 246, 0.15);
        border-left: 3px solid #3b82f6;
        border-radius: 4px;
        font-size: 13px;
        color: #93c5fd;
    }

    .info-text i {
        font-size: 14px;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
        padding-top: 24px;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }

        .form-actions {
            flex-direction: column;
        }

        .form-actions :global(button) {
            width: 100%;
        }
    }
</style>