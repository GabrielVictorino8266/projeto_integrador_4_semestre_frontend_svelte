<script>
    import { applyAction, enhance } from "$app/forms";
    import { page } from "$app/stores";
    
    // UI Component Imports
    import { Modal, Button, Input, PasswordInput } from "$lib/components/ui";

    // --- PROPS ---
    // Props are non-reactive (read-only) inputs for the component.
    const { 
        user, 
        isOpen, 
        isEditMode, 
        onClose, 
        onSaveSuccess, 
        onSaveError 
    } = $props();

    // --- STATE (Runes) ---
    // Reactive state for managing UI feedback and conditional fields.
    let isSubmitting = $state(false); 
    let showPasswordFields = $state(false);

    // Derived state: Gets the server-side validation errors from SvelteKit.
    const formErrors = $derived($page.form?.errors);

    // --- HANDLERS ---
    
    // Toggles visibility of the optional password change fields.
    const togglePasswordFields = () => {
        showPasswordFields = !showPasswordFields;
    };

    // --- EFFECTS ---

    // Resets password field visibility and clears form errors when the modal is closed.
    $effect(() => {
        if (!isOpen) {
            showPasswordFields = false;
            $page.form = null;
        }
    });


    // --- FORM ENHANCEMENT ---

    // Handles form submission lifecycle with SvelteKit's `enhance`.
    const handleSubmit = () => {
        // 1. Set submitting state immediately.
        isSubmitting = true;
        
        return async ({ result, update }) => {
            // Small delay for ux
            await new Promise((resolve) => setTimeout(resolve, 250));
            
            // 2. Update the page to display new data or validation errors.
            await update();

            // 3. Process the result based on type and status
            if (result.type === "success") {
                onSaveSuccess?.(result.data);
            } else if (result.type === "failure" || result.type === "error") {
                // Handle server errors (500, etc.) or validation failures
                onSaveError?.(result.data);
            }
            // Note: 400 validation errors are handled by update() and displayed via formErrors
            
            // 4. Reset submitting state.
            isSubmitting = false;
        };
    };
</script>

<Modal
    title={isEditMode ? "Editar Usuário" : "Adicionar Usuário"}
    {isOpen}
    {onClose}
>
    <form
        class="user-form"
        method="post"
        action="?/save"
        use:enhance={handleSubmit}
        novalidate
    >
        {#if user?.id}
            <input type="hidden" name="id" value={user.id} />
        {/if}

        <div class="form-fields">
            <Input
                label="Nome"
                required
                type="text"
                id="nome"
                name="nome"
                placeholder="Ex: João Silva"
                value={user?.nome}
                error={formErrors?.nome}
            />
            <Input
                label="CPF"
                required
                type="text"
                id="cpf"
                name="cpf"
                placeholder="Ex: 123.456.789-00"
                value={user?.cpf}
                error={formErrors?.cpf}
            />
            <Input
                label="Email"
                required
                type="email"
                id="email"
                name="email"
                placeholder="Ex: joao@email.com"
                value={user?.email}
                error={formErrors?.email}
            />
            <Input
                label="Telefone"
                required
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="Ex: (11) 90000-0000"
                value={user?.telefone}
                error={formErrors?.telefone}
            />
        </div>

        <div class="form-section">
            <div class="password-header">
                <h3 class="section-title">Segurança</h3>
                {#if isEditMode && !showPasswordFields}
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onclick={togglePasswordFields}
                    >
                        Alterar Senha
                    </Button>
                {/if}
            </div>

            {#if !isEditMode || showPasswordFields}
                <div class="password-fields">
                    {#if isEditMode && showPasswordFields}
                        <p class="password-info">
                            Deixe os campos em branco para manter a senha atual
                        </p>
                    {/if}
                    <PasswordInput
                        label="Senha"
                        required={!isEditMode}
                        id="senha"
                        name="senha"
                        placeholder="Mínimo 8 caracteres"
                        showStrength={true}
                        error={formErrors?.senha}
                    />
                    <PasswordInput
                        label="Confirmar Senha"
                        required={!isEditMode}
                        id="senhaConfirmacao"
                        name="senhaConfirmacao"
                        placeholder="Repita a senha"
                        error={formErrors?.senhaConfirmacao}
                    />
                    {#if isEditMode}
                        <Button
                            type="button"
                            variant="outline-red"
                            size="small"
                            onclick={togglePasswordFields}
                        >
                            Cancelar alteração
                        </Button>
                    {/if}
                </div>
            {/if}
        </div>

        <div class="modal-actions">
            <Button type="button" variant="secondary" onclick={onClose}>
                Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
                {isEditMode ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
        </div>
    </form>
</Modal>

<style>
    .user-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .form-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
        background: rgba(30, 41, 59, 0.4);
        border-radius: 16px;
        border: 1px solid rgba(59, 130, 246, 0.25);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .section-title {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .password-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        gap: 24px;
    }

    .password-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 8px;
    }

    .password-info {
        margin: 0;
        padding: 12px;
        background: rgba(59, 130, 246, 0.15);
        border-left: 3px solid #3b82f6;
        border-radius: 4px;
        font-size: 13px;
        color: #93c5fd;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
        padding-top: 24px;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
    }

    @media (max-width: 640px) {
        .modal-actions {
            flex-direction: column-reverse;
        }

        .modal-actions :global(button) {
            width: 100%;
        }

        .password-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
    }
</style>