<script>
    import '$lib/assets/login.css';

    import { slide } from 'svelte/transition';
    import { enhance } from '$app/forms';

    const { data, form } = $props();

    let cpf = $state(data.username || form?.cpf);
    let senha = $state('');
    let lembrarme = $state(false);

    function formatCPF(value) {
        // Remove tudo que não é número
        value = value.replace(/\D/g, '');
        
        // Adiciona a formatação
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        
        return value;
    }

    function handleCPFInput(e) {
        cpf = formatCPF(e.target.value);
    }
</script>

<div class="login-container">
    <div class="login-card">
        <div class="logo-section">
        </div>

        <form method="post" use:enhance>
            {#if form?.error}
                <div class="error-message" transition:slide>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{form.error}</span>
                </div>
            {/if}

            <div class="form-group">
                <label for="cpf">CPF</label>
                <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    bind:value={cpf}
                    oninput={handleCPFInput}
                    placeholder="Informe seu cpf"
                    maxlength="14"
                    required
                />
            </div>

            <div class="form-group">
                <label for="senha">Senha</label>
                <input
                    type="password"
                    id="senha"
                    name="senha"
                    bind:value={senha}
                    placeholder="Informe sua senha"
                    required
                />
            </div>

            <div class="options">
                <label class="checkbox-label">
                    <input type="checkbox" bind:checked={lembrarme} />
                    <span>Lembrar-me</span>
                </label>
                <a href="/cadastro" class="forgot-password">Cadastre-se</a>
            </div>

            <button type="submit" class="btn-login">ENTRAR</button>
        </form>

        <footer>
            © Fev 2025 - Todos os direitos reservados.
        </footer>
    </div>

    <div class="animated-background">
        <div class="grid-overlay"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="pulse-circle"></div>
        <div class="pulse-circle"></div>
        <div class="gradient-orb"></div>
        <div class="gradient-orb"></div>
        <div class="wave"></div>
    </div>
</div>
