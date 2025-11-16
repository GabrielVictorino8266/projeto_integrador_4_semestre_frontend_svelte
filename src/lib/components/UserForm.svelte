<!-- UserForm.svelte -->
<script>
    import { enhance } from "$app/forms";
    import { Input, PasswordInput, Button } from "$lib/components/layout";
    import { onDestroy } from "svelte";

    const { user, isEditMode, onCancel, onSaveSuccess, onSaveError } = $props();

    let isSubmitting = $state(false);
    let showPasswordFields = $state(false);
    let errors = $state(null);
    let formActions = $state(null);

    const currentYear = new Date().getFullYear();
    const maxDate = `${currentYear - 1}-12-31`;
    const minDate = `${currentYear - 150}-01-01`;

    const tipoCnhOptions = [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "E", label: "E" },
        { value: "AB", label: "AB" },
        { value: "AC", label: "AC" },
        { value: "AD", label: "AD" },
        { value: "AE", label: "AE" },
    ];

    let formData = $state({
        funcao: user?.motorista ? "MOTORISTA" : "ADMIN",
        nome: user?.nome ?? "",
        cpf: user?.cpf ?? "",
        numeroCnh: user?.motorista?.numeroCnh ?? "",
        tipoCnh: user?.motorista?.tipoCnh ?? "A",
        email: user?.email ?? "",
        telefone: user?.telefone ?? "",
        dataNascimento: user?.dataNascimento ?? "",
        senha: "",
        senhaConfirmacao: "",
    });

    const togglePasswordFields = () => {
        showPasswordFields = !showPasswordFields;
    };

    // Scroll to first error
    $effect(() => {
        if (!errors) return;
        const firstErrorField = [
            "funcao",
            "nome",
            "cpf",
            "email",
            "cnh",
            "tipoCnh",
            "telefone",
            "senha",
            "senhaConfirmacao",
        ].find((field) => errors[field]);
        if (firstErrorField) {
            document
                .getElementById(firstErrorField)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });

    const handleSubmit = async () => {
        isSubmitting = true;

        await new Promise((resolve) => setTimeout(resolve, 250));

        return async ({ result, update }) => {
            await update();

            isSubmitting = false;
            errors = result?.data?.errors;

            if (result?.type === "success") {
                onSaveSuccess(result.data);
            } else if (result?.data?.error) {
                onSaveError(result.data.error);
            }
        };
    };

    onDestroy(() => {
        errors = null;
        formData = {
            funcao: "",
            nome: "",
            cpf: "",
            numeroCnh: "",
            tipoCnh: "",
            email: "",
            telefone: "",
            senha: "",
            dataNascimento: "",
            senhaConfirmacao: "",
        };
    });
</script>

{#key errors}
    <form
        class="user-form"
        method="post"
        action="?/save"
        use:enhance={handleSubmit}
        novalidate
        autocomplete="off"
    >
        {#if user?.id}
            <input type="hidden" name="id" value={user.id} />
            <input type="hidden" name="motoristaId" value={user.motorista?.id} />
        {/if}

        <div class="form-fields">
            <div class="form-group">
                <label for="role" class="form-label"> Função do Usuário </label>
                <select
                    id="role"
                    name="role"
                    class="form-select"
                    bind:value={formData.funcao}
                >
                    <option value="ADMIN" selected={formData.funcao === "ADMIN"}>Administrador</option>
                    <option value="MOTORISTA" selected={formData.funcao === "MOTORISTA"}>Motorista</option>
                </select>
            </div>

            <Input
                label="Nome"
                required
                type="text"
                id="nome"
                name="nome"
                placeholder="Ex: João Silva"
                bind:value={formData.nome}
                error={errors?.nome}
            />
            <Input
                label="CPF"
                required
                type="text"
                id="cpf"
                name="cpf"
                placeholder="Ex: 123.456.789-00"
                mask="###.###.###-##"
                bind:value={formData.cpf}
                error={errors?.cpf}
            />

            {#if formData.funcao === "MOTORISTA"}
                <div class="flex-row">
                    <div class="col-cnh">
                        <Input
                            label="CNH"
                            required
                            type="text"
                            id="cnh"
                            name="cnh"
                            placeholder="Ex: 1234567890123"
                            mask="###########"
                            bind:value={formData.numeroCnh}
                            error={errors?.numeroCnh}
                        />
                    </div>
                    <div class="col-tipo-cnh">
                        <div class="form-group">
                            <label for="tipoCnh" class="form-label"> Tipo da CNH </label>
                            <select
                                id="tipoCnh"
                                name="tipoCnh"
                                class="form-select"
                                bind:value={formData.tipoCnh}
                            >
                                {#each tipoCnhOptions as option, index(index)}
                                    <option value={option.value} selected={formData.tipoCnh === option.value}>{option.label}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
            {/if}

            <Input
                label="Email"
                required
                type="email"
                id="email"
                name="email"
                placeholder="Ex: joao@email.com"
                bind:value={formData.email}
                error={errors?.email}
            />
            <Input
                label="Telefone"
                required
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="Ex: (11) 90000-0000"
                mask="(##) #####-####"
                bind:value={formData.telefone}
                error={errors?.telefone}
            />

            <Input
                label="Data de Nascimento"
                required
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                placeholder="Ex: 01/01/2000"
                min={minDate}
                max={maxDate}
                bind:value={formData.dataNascimento}
                error={errors?.dataNascimento}
            />

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
                                Deixe os campos em branco para manter a senha
                                atual
                            </p>
                        {/if}
                        <PasswordInput
                            label="Senha"
                            required={!isEditMode}
                            autocomplete="new-password"
                            id="senha"
                            name="senha"
                            placeholder="Mínimo 8 caracteres"
                            showStrength={true}
                            error={errors?.senha}
                        />
                        <PasswordInput
                            label="Confirmar Senha"
                            required={!isEditMode}
                            autocomplete="new-password"
                            id="senhaConfirmacao"
                            name="senhaConfirmacao"
                            placeholder="Repita a senha"
                            error={errors?.senhaConfirmacao}
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

        </div>

        <div class="form-actions button-group" bind:this={formActions}>
            <Button type="button" variant="secondary" onclick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
                {isEditMode ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
        </div>
    </form>
{/key}

<style>
    .form-actions {
        display: flex;
        gap: 8px;
    }

    .flex-row {
        display: flex;
        gap: 16px;
    }
    .col-cnh {
        flex: 1 1 auto;
    }
    .col-tipo-cnh {
        flex: 0 0 100px;
    }
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

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
        padding-top: 24px;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
    }

    @media (max-width: 640px) {
        .form-actions {
            flex-direction: column;
        }

        .form-actions :global(button) {
            width: 100%;
        }

        .password-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }
    }
</style>
