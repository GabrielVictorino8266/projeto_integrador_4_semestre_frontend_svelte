<!-- MaintenanceForm.svelte -->
<script>
    import { enhance } from "$app/forms";
    import { Input, Button } from "$lib/components/layout";
    import { onDestroy } from "svelte";

    const { maintenance, tiposManutencao = [
        { value: 'PREVENTIVA', label: 'Preventiva' },
        { value: 'CORRETIVA', label: 'Corretiva' },
        { value: 'REVISAO', label: 'Revisão' },
        { value: 'EMERGENCIAL', label: 'Emergencial' }
    ], vehicles = [], isEditMode, onCancel, onSaveSuccess, onSaveError } = $props();

    let isSubmitting = $state(false); 
    let errors = $state(null);
    let formActions = $state(null);

    const today = new Date().toISOString().split('T')[0];
    
    let formData = $state({
        veiculoId: maintenance?.veiculoId ?? '',
        dataManutencao: maintenance?.dataManutencao ?? today,
        tipoManutencao: maintenance?.tipoManutencao ?? 'PREVENTIVA',
        descricao: maintenance?.descricao ?? '',
        custo: maintenance?.custo ?? 0
    });

    // Scroll to first error
    $effect(() => {
        if (!errors) return;
        const firstErrorField = ['veiculoId', 'dataManutencao', 'tipoManutencao', 'descricao', 'custo']
            .find(field => errors[field]);
        if (firstErrorField) {
            document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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

    const capitalizeWords = (str) => {
        return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    

    onDestroy(() => {
        errors = null;
        formData = {
            veiculoId: '',
            dataManutencao: '',
            tipoManutencao: 'PREVENTIVA',
            descricao: '',
            custo: 0
        };
    })
</script>

{#key errors}
    <form
        class="maintenance-form"
        method="post"
        action="?/save"
        use:enhance={handleSubmit}
        novalidate
        autocomplete="off"
    >
        {#if maintenance?.id}
            <input type="hidden" name="id" value={maintenance.id} />
        {/if}

        <div class="form-fields">
            {#if vehicles?.length == 0}
                <p class="warning-text">
                    <i class="fas fa-info-circle"></i>
                    Registre um veículo para registrar uma manutenção.
                </p>
            {/if}

            <div class="form-group">
                <label for="veiculoId" class="form-label">
                    Veículo <span class="required">*</span>
                </label>
                <select
                    id="veiculoId"
                    name="veiculoId"
                    class="form-select"
                    class:error={errors?.veiculoId}
                    bind:value={formData.veiculoId}
                    size="5"
                    required
                >
                    <option value="">Selecione o veículo</option>
                    {#each vehicles as vehicle, index (index)}
                        <option value={vehicle.id}>
                            {vehicle.placa} - {vehicle.numeroVeiculo} ({vehicle.marca})
                        </option>
                    {/each}
                </select>
                {#if errors?.veiculoId}
                    <span class="error-message">{errors.veiculoId}</span>
                {/if}
            </div>

            <Input
                label="Data da Manutenção"
                required
                type="date"
                id="dataManutencao"
                name="dataManutencao"
                max={today}
                bind:value={formData.dataManutencao}
                error={errors?.dataManutencao}
            />

            <div class="form-row">
                <div class="form-group">
                    <label for="tipoManutencao" class="form-label">
                        Tipo de Manutenção <span class="required">*</span>
                    </label>
                    <select
                        id="tipoManutencao"
                        name="tipoManutencao"
                        class="form-select"
                        class:error={errors?.tipoManutencao}
                        bind:value={formData.tipoManutencao}
                        required
                    >
                        {#each tiposManutencao as tipo, index (index)}
                            <option value={tipo.value}>{capitalizeWords(tipo.label)}</option>
                        {/each}
                    </select>
                    {#if errors?.tipoManutencao}
                        <span class="error-message">{errors.tipoManutencao}</span>
                    {/if}
                </div>

                <Input
                    label="Custo (R$)"
                    required
                    type="number"
                    id="custo"
                    name="custo"
                    placeholder="Ex: 1200.00"
                    min="0"
                    step="0.01"
                    bind:value={formData.custo}
                    error={errors?.custo}
                />
            </div>

            <div class="form-group full-width">
                <label for="descricao" class="form-label">
                    Descrição <span class="required">*</span>
                </label>
                <textarea
                    id="descricao"
                    name="descricao"
                    class="form-textarea"
                    class:error={errors?.descricao}
                    placeholder="Descreva os serviços realizados..."
                    rows="4"
                    maxlength="500"
                    bind:value={formData.descricao}
                    required
                ></textarea>
                {#if errors?.descricao}
                    <span class="error-message">{errors.descricao}</span>
                {/if}
                <span class="char-count">{formData.descricao.length}/500</span>
            </div>
        </div>

        <div class="form-actions button-group" bind:this={formActions}>
            <Button type="button" variant="secondary" onclick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
                {isEditMode ? "Salvar Alterações" : "Registrar Manutenção"}
            </Button>
        </div>
    </form>
{/key}

<style>
    
    .maintenance-form {
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

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        color: #8b9cb6;
        transition: color 0.3s;
    }

    .form-select,
    .form-textarea {
        width: 100%;
        padding: 10px 12px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        color: #e2e8f0;
        font-size: 14px;
        transition: all 0.3s;
    }

    .form-select:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-select.error,
    .form-textarea.error {
        border-color: #ef4444;
    }

    .form-textarea {
        resize: vertical;
        min-height: 100px;
        font-family: inherit;
        line-height: 1.5;
    }

    .required {
        color: #ef4444;
    }

    .error-message {
        display: block;
        font-size: 11px;
        color: #ef4444;
        margin-top: 3px;
    }

    .char-count {
        display: block;
        font-size: 11px;
        color: #64748b;
        text-align: right;
        margin-top: 4px;
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

    .warning-text {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        padding: 12px;
        background: rgba(255, 165, 0, 0.15);
        border-left: 3px solid #ff8c00;
        border-radius: 4px;
        font-size: 13px;
        color: #ff8c00;
    }

    .warning-text i {
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