<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        overflow: hidden;
    }

    .login-container {
        display: flex;
        height: 100vh;
        background-color: #0a1628;
    }

    .login-card {
        width: 400px;
        background-color: #0a1628;
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: white;
        position: relative;
        z-index: 10;
    }

    .logo-section {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 40px;
    }

    .logo {
        width: 60px;
        height: 60px;
        animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .logo svg {
        width: 100%;
        height: 100%;
    }

    h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 300;
        line-height: 1.2;
    }

    h1 span {
        font-weight: 700;
        font-size: 28px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #8b9cb6;
        transition: color 0.3s;
    }

    input[type="text"],
    input[type="password"] {
        width: 100%;
        padding: 12px 16px;
        background-color: #162844;
        border: 1px solid #1e3a5f;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    input[type="text"]::placeholder,
    input[type="password"]::placeholder {
        color: #4a5f7f;
    }

    input[type="text"]:focus,
    input[type="password"]:focus {
        outline: none;
        border-color: #3b82f6;
        background-color: #1a2f4d;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        font-size: 14px;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #8b9cb6;
        transition: color 0.3s;
    }

    .checkbox-label:hover {
        color: #a8b9d1;
    }

    input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
    }

    .forgot-password {
        color: #3b82f6;
        text-decoration: none;
        transition: color 0.3s;
    }

    .forgot-password:hover {
        color: #60a5fa;
        text-decoration: underline;
    }

    .btn-login {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .btn-login::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
    }

    .btn-login:hover::before {
        left: 100%;
    }

    .btn-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-login:active {
        transform: translateY(0);
    }

    footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #4a5f7f;
    }

    .animated-background {
        flex: 1;
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0f1f3a 100%);
    }

    /* Partículas flutuantes */
    .particle {
        position: absolute;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: float 20s infinite;
    }

    .particle:nth-child(1) {
        width: 80px;
        height: 80px;
        top: 20%;
        left: 20%;
        animation-delay: 0s;
        animation-duration: 15s;
    }

    .particle:nth-child(2) {
        width: 60px;
        height: 60px;
        top: 60%;
        left: 70%;
        animation-delay: 2s;
        animation-duration: 18s;
    }

    .particle:nth-child(3) {
        width: 100px;
        height: 100px;
        top: 40%;
        left: 50%;
        animation-delay: 4s;
        animation-duration: 22s;
    }

    .particle:nth-child(4) {
        width: 70px;
        height: 70px;
        top: 70%;
        left: 30%;
        animation-delay: 6s;
        animation-duration: 20s;
    }

    .particle:nth-child(5) {
        width: 90px;
        height: 90px;
        top: 10%;
        left: 80%;
        animation-delay: 8s;
        animation-duration: 17s;
    }

    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.5;
        }
        50% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.4;
        }
        75% {
            transform: translate(20px, 30px) scale(1.05);
            opacity: 0.6;
        }
    }

    /* Ondas animadas */
    .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.1));
    }

    .wave::before,
    .wave::after {
        content: '';
        position: absolute;
        width: 200%;
        height: 100%;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        background: rgba(59, 130, 246, 0.1);
    }

    .wave::before {
        border-radius: 45%;
        animation: wave 10s linear infinite;
    }

    .wave::after {
        border-radius: 40%;
        animation: wave 15s linear infinite reverse;
        opacity: 0.5;
    }

    @keyframes wave {
        0% {
            transform: translate(-50%, 0) rotate(0deg);
        }
        100% {
            transform: translate(-50%, 0) rotate(360deg);
        }
    }

    /* Grid animado */
    .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(50px, 50px);
        }
    }

    /* Círculos pulsantes */
    .pulse-circle {
        position: absolute;
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: pulse-expand 4s ease-out infinite;
    }

    .pulse-circle:nth-child(6) {
        width: 200px;
        height: 200px;
        top: 30%;
        right: 20%;
        animation-delay: 0s;
    }

    .pulse-circle:nth-child(7) {
        width: 150px;
        height: 150px;
        bottom: 20%;
        left: 60%;
        animation-delay: 2s;
    }

    @keyframes pulse-expand {
        0% {
            transform: scale(0.8);
            opacity: 0;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    /* Gradiente animado de fundo */
    .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        animation: float-orb 15s ease-in-out infinite;
    }

    .gradient-orb:nth-child(8) {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
        top: -100px;
        right: -100px;
        animation-delay: 0s;
    }

    .gradient-orb:nth-child(9) {
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, rgba(147, 51, 234, 0.2), transparent);
        bottom: -80px;
        left: 20%;
        animation-delay: 5s;
    }

    @keyframes float-orb {
        0%, 100% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(50px, 50px);
        }
    }

    @media (max-width: 768px) {
        .login-container {
            flex-direction: column;
        }

        .login-card {
            width: 100%;
        }

        .animated-background {
            display: none;
        }
    }
</style>

<script>
    let cpf = '';
    let senha = '';
    let lembrarme = false;

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

    function handleSubmit() {
        console.log('Login submitted:', { cpf, senha, lembrarme });
        alert('Login realizado!\nCPF: ' + cpf);
        // Aqui você adicionaria a lógica de autenticação
    }
</script>

<div class="login-container">
    <div class="login-card">
        <div class="logo-section">
        </div>

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <label for="cpf">CPF</label>
                <input
                    type="text"
                    id="cpf"
                    bind:value={cpf}
                    on:input={handleCPFInput}
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
