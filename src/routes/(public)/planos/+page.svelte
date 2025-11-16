<script>
  import { deserialize } from "$app/forms";
  import { slide } from 'svelte/transition';

  import PricingSection from "$lib/components/PricingSection.svelte";

  import { plans } from '$lib/data/plans';

  const { data } = $props();

  let currentStep = $state('plans'); // 'plans', 'confirm', 'payment', or 'success'
  let selectedPlan = $state(null);
  let paymentData = $state(null);
  let isLoading = $state(false);
  let copiedPixCode = $state(false);

  // Load selected plan from URL parameter
   $effect(() => {
    const id = data?.selectedPlan;
    if (!id) return;

    const plan = plans?.[id];
    if (!plan) {
      currentStep = 'error';
      return;
    }

    handlePlanSelect(plan);
  });


  function handlePlanSelect(plan) {
       
    if (plan.id === "GRATUITO") {
        window.location.href = '/dashboard';
    } else {
        selectedPlan = plan;
        currentStep = 'confirm';
    }
  }

  async function handleConfirmPlan() {

    try {
        isLoading = true;

        const formData = new FormData();
        formData.append("planId", selectedPlan.id);
       const response = await fetch('?/create-payment', {
            method: 'POST',
            body: formData
        });
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
        const result = deserialize(await response.text());
        if (result.type === 'success') {
            currentStep = 'payment';
            paymentData = result.data.payment;
        } else if (result.type === 'redirect') {
            window.location.href = result.location;
        } else {
            throw new Error(result?.message || "Erro ao confirmar plano");
        }
    } catch (_error) {
        currentStep = 'error';
    } finally {
        isLoading = false;
    }
  }

  function handleBack() {
    if (currentStep === 'confirm') {
      currentStep = 'plans';
      selectedPlan = null;
    } else if (currentStep === 'payment') {
      currentStep = 'confirm';
      paymentData = null;
    }
  }

  function handleConfirmPayment() {
    currentStep = 'success';
  }

  function handleClose() {
    // Navigate back to home - adjust this to your routing method
    window.location.href = '/';
    // Or if using SvelteKit: goto('/')
  }

  function handleCheckStatus() {
    // Navigate to status page - adjust this to your routing method
    window.location.href = '/dashboard';
    // Or if using SvelteKit: goto('/status')
  }

  function copyPixCode() {
    navigator.clipboard.writeText(paymentData.qrCode);
    copiedPixCode = true;
    setTimeout(() => {
      copiedPixCode = false;
    }, 2000);
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
</script>


<div class="page-container">
    <div >
        <button onclick={handleClose} class="back-to-home">
            ← Voltar à página inicial
        </button>
    </div>
  
  {#if currentStep === 'plans'}
    <div in:slide={{ duration: 300 }}>
      <PricingSection onSelectPlan={handlePlanSelect} variant="compact"/>
    </div>
  
  {:else if currentStep === 'confirm'}
    <div class="step-container" in:slide={{ duration: 300 }}>
      <div class="step-content">
        <div class="step-header">
          <span class="step-number">1/2</span>
          <h2>Confirme seu plano</h2>
          <p class="step-subtitle">Revise os detalhes antes de prosseguir para o pagamento</p>
        </div>

        <div class="plan-summary">
          <div class="plan-summary-header">
            <h3>{selectedPlan.name}</h3>
            {#if selectedPlan.popular}
              <span class="popular-badge">Mais Popular</span>
            {/if}
          </div>
          
          <div class="plan-price-large">
            {selectedPlan.price}
            <span class="period">/mês</span>
          </div>

          <div class="features-list">
            <h4>O que está incluído:</h4>
            <ul>
              {#each selectedPlan.features as feature,index (index)}
                <li>
                   <span>
                    {#if feature.included}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill="#10b981"/>
                            <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {:else}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill="#10b981"/>
                            <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                    </span>
                    {feature.text}
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <div class="action-buttons">
          <button class="secondary-button" onclick={handleBack} disabled={isLoading}>
            ← Escolher outro plano
          </button>
          <button class="primary-button" style="width: 300px" onclick={handleConfirmPlan} disabled={isLoading}>
            {#if isLoading}
              <spin class="spinner"></spin>
              Aguarde...
            {:else}
              Continuar para pagamento →
            {/if}
          </button>
        </div>
      </div>
    </div>

  {:else if currentStep === 'payment'}
    <div class="step-container" in:slide|fade={{ duration: 300 }}>
      <div class="step-content">
        <div class="step-header">
          <span class="step-number">2/2</span>
          <h2>Pagamento via PIX</h2>
          <p class="step-subtitle">Plano: <strong>{selectedPlan.name}</strong> - {selectedPlan.price}/mês</p>
        </div>

        {#if isLoading}
          <div class="loading-state" in:slide|fade={{ duration: 200 }}>
            <div class="spinner"></div>
            <p>Gerando pagamento PIX...</p>
          </div>
        {:else}
         
<div class="payment-section" in:slide|fade={{ duration: 300 }}>
  <div class="payment-header">
    <div class="price-display">
      <span class="price-amount">{formatCurrency(paymentData.amount)}</span>
      <span class="price-label">Valor do PIX</span>
    </div>
    <div class="expiry-badge">
      <span class="expiry-icon">⏱️</span>
      <span class="expiry-text">Expira em 24h</span>
    </div>
  </div>

  <div class="payment-content">
    <div class="qr-section">
      <div class="qr-code-wrapper">
        <img src={"data:image/png;base64," + paymentData.qrCodeBase64} alt="QR Code PIX" class="qr-code" />
      </div>
      <p class="qr-instruction">Escaneie com o app do seu banco</p>
    </div>

    <div class="divider">
      <span class="divider-text">ou</span>
    </div>

    <div class="code-section">
      <label for="pix-code-input" class="code-label">Pix Copia e Cola</label>
      <div class="code-input-group">
        <input 
          type="text" 
          readonly 
          value={paymentData.qrCode} 
          class="code-input"
          id="pix-code-input"
        />
        <button class="copy-btn" class:copied={copiedPixCode} onclick={copyPixCode}>
            {#if copiedPixCode}
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
               </svg>
                Copiado!
            {:else}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copiar
            {/if}
        </button>
      </div>
      
      <div class="steps-compact">
        <div class="step-item">
          <span class="step-num">1</span>
          <span class="step-text">Abra o app do banco</span>
        </div>
        <div class="step-item">
          <span class="step-num">2</span>
          <span class="step-text">Cole o código ou escaneie</span>
        </div>
        <div class="step-item">
          <span class="step-num">3</span>
          <span class="step-text">Confirme o pagamento</span>
        </div>
      </div>

     <div class="pending-activation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Seu plano será ativado assim que o pagamento for confirmado.</span>
     </div>
    </div>
  </div>
</div>

<div class="action-buttons">
  <button type="button" class="secondary-button" onclick={handleBack}>
    ← Voltar
  </button>
  <button type="button" class="primary-button" onclick={handleConfirmPayment}>
    Já realizei o pagamento
  </button>
</div>
{/if} 

      </div>
    </div>

{:else if currentStep === 'success'}
    <div class="success-container">
  <div class="success-content">
    <div class="pending-icon">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#3b82f6"></circle>
        <polyline points="12 6 12 12 16 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg>
    </div>
    
    <div class="pending-header">
      <h2>Pagamento Recebido!</h2>
      <p>Estamos processando sua confirmação.</p>
    </div>
    
    <div class="pending-message">
      <p>Seu plano será ativado em breve!</p>
      <p>Acesse o dashboard para verificar quando seu plano for ativado. Você receberá uma notificação assim que estiver tudo pronto.</p>
    </div>
    
    <div class="success-buttons">
      <button class="secondary-button" onclick={handleClose}>
        ← Voltar para a Home
      </button>
      <button class="primary-button" onclick={handleCheckStatus}>
        Acessar Dashboard
      </button>
    </div>
  </div>
</div>

{:else if currentStep === 'error'}
    <div class="error-container">
  <div class="error-content">
    <div class="error-icon">
     <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Circle background -->
            <circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#dc2626" stroke-width="2"/>
            
            <!-- X mark -->
            <line x1="15" y1="9" x2="9" y2="15" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    </div>
    
    <div class="error-header">
      <h2>Erro inesperado</h2>
    </div>
    
    <div class="error-message">
      <p>Algo deu errado. Tente novamente mais tarde.</p>
    </div>
    
    <div class="error-buttons">
      <button class="secondary-button" onclick={handleClose}>
        ← Voltar para a Home
      </button>
    </div>
  </div>
</div>
{/if}
</div>


<svelte:head>
    <style>
        *, *::before, *::after {
            box-sizing: border-box;
        }
        html {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        body {
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 0;
        }
    </style>
</svelte:head>
<style>
  /* === Page Layout === */
  .page-container {
    min-height: 100vh;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  /* === Step Container & Navigation === */
  .step-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .back-to-home {
    position: absolute;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    color: #64748b;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 16px;
    transition: all 0.3s;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .back-to-home:hover {
    color: #3b82f6;
    transform: translateX(-4px);
  }

  .step-content {
    background: white;
    border-radius: 20px;
    padding: 32px 40px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    max-width: 100%;
    margin: 0 auto;
  }

  .step-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .step-number {
    display: inline-block;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .step-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .step-subtitle {
    color: #64748b;
    font-size: 14px;
  }

  .step-subtitle strong {
    color: #3b82f6;
  }

  /* === Confirmation Screen === */
  .plan-summary {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    margin-bottom: 20px;
  }

  .plan-summary-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .plan-summary-header h3 {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .popular-badge {
    background: #3b82f6;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .plan-price-large {
    font-size: 36px;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 24px;
    text-align: center;
  }

  .period {
    font-size: 16px;
    color: #64748b;
    font-weight: 500;
  }

  .features-list h4 {
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 16px;
    text-align: center;
  }

  .features-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .features-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #475569;
    padding-left: 0;
  }

  .features-list li span {
    flex-shrink: 0;
  }

  .features-list li svg {
    width: 18px;
    height: 18px;
  }

  /* === Payment Section === */
  .payment-section {
    margin-bottom: 24px;
  }

  /* --- Payment Header --- */
  .payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    padding: 20px 24px;
    border-radius: 12px 12px 0 0;
    color: white;
  }

  .price-display {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .price-amount {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .price-label {
    font-size: 13px;
    opacity: 0.9;
    font-weight: 500;
  }

  .expiry-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }

  .expiry-icon {
    font-size: 16px;
  }

  /* --- Payment Content (QR + Code) --- */
  .payment-content {
    display: grid;
    grid-template-columns: auto 1px 1fr;
    gap: 32px;
    background: white;
    border: 2px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 12px 12px;
    padding: 24px;
  }

  /* --- QR Section --- */
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .qr-code-wrapper {
    background: white;
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
  }

  .qr-code {
    width: 180px;
    height: 180px;
    display: block;
  }

  .qr-instruction {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    text-align: center;
    font-weight: 500;
  }

  /* --- Divider --- */
  .divider {
    position: relative;
    background: #e2e8f0;
    width: 1px;
  }

  .divider-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
  }

  /* --- Code Section --- */
  .code-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .code-label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin: 0;
  }

  .code-input-group {
    display: flex;
    gap: 8px;
  }

  .code-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    background: #f8fafc;
    color: #475569;
    transition: border-color 0.2s;
  }

  .code-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  /* --- Copy Button --- */
  .copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    gap: 6px;
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s;
  }

  .copy-btn.copied {
    background-color: #10b981;
  }

  .copy-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .copy-btn:active {
    transform: translateY(0);
  }

  /* === Compact Steps Guide === */
  .steps-compact {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .step-num {
    background: #3b82f6;
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 11px;
    flex-shrink: 0;
  }

  .step-text {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
  }

  /* === Pending Activation Notice === */
  .pending-activation {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #fef3c7;
    border-radius: 6px;
    font-size: 13px;
    color: #92400e;
    font-weight: 600;
  }

  .pending-activation svg {
    color: #f59e0b;
    flex-shrink: 0;
  }

  /* === Action Buttons (Unified) === */
  .action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
  }
.primary-button {
    background: #10b981;
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: none;
  }

  .primary-button:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .primary-button:disabled {
    background: #86efac;
    color: #dcfce7;
    cursor: not-allowed;
    opacity: 1;
  }

  .secondary-button {
    background: white;
    color: #64748b;
    border: 2px solid #e2e8f0;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .secondary-button:hover:not(:disabled) {
    border-color: #cbd5e1;
    color: #475569;
    background: #f8fafc;
  }

  .secondary-button:disabled {
    background: #fafafa;
    color: #cbd5e1;
    border-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 1;
  }

  /* === Loading State === */
  .loading-state {
    text-align: center;
    padding: 40px 20px;
  }

.spinner {
    width: 16px;
    height: 16px;
    display: inline-block;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-state p {
    color: #64748b;
    font-size: 16px;
  }

  /* === Success / Pending Overlay === */
  .success-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .success-content {
    background: white;
    border-radius: 16px;
    padding: 48px 40px;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .pending-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    animation: scaleIn 0.5s ease-out;
  }

  @keyframes scaleIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .pending-header {
    margin-bottom: 24px;
  }

  .pending-header h2 {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
  }

  .pending-header p {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
  }

  .pending-message {
    margin-bottom: 32px;
    padding: 20px;
    background: #dbeafe;
    border-radius: 8px;
    border: 1px solid #93c5fd;
  }

  .pending-message p {
    margin: 0;
    font-size: 14px;
    color: #1e40af;
    line-height: 1.6;
  }

  .pending-message p:first-child {
    font-weight: 600;
    margin-bottom: 8px;
  }

  .success-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
/* === Error Overlay === */
  .error-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .error-content {
    background: white;
    border-radius: 16px;
    padding: 48px 40px;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .error-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    animation: shake 0.5s ease-out;
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-8px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(8px);
    }
  }

  .error-header {
    margin-bottom: 24px;
  }

  .error-header h2 {
    font-size: 28px;
    font-weight: 700;
    color: #dc2626;
    margin: 0;
  }

  .error-message {
    margin-bottom: 32px;
    padding: 16px 20px;
    background: #fef2f2;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
  }

  .error-message p {
    margin: 0;
    font-size: 15px;
    color: #7f1d1d;
    line-height: 1.5;
  }

  .error-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .error-buttons button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .error-buttons .secondary-button {
    background: #f3f4f6;
    color: #374151;
  }

  .error-buttons .secondary-button:hover {
    background: #e5e7eb;
  }

  .error-buttons .primary-button {
    background: #dc2626;
    color: white;
  }

  .error-buttons .primary-button:hover {
    background: #b91c1c;
  }

  /* Reuse button styles within overlay */
  .success-buttons .primary-button,
  .success-buttons .secondary-button {
    flex: 1;
    min-width: 140px;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .success-buttons .primary-button {
    background-color: #3b82f6;
    color: white;
  }

  .success-buttons .primary-button:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }

  .success-buttons .secondary-button {
    background-color: #f3f4f6;
    color: #374151;
  }

  .success-buttons .secondary-button:hover {
    background-color: #e5e7eb;
  }

  /* === Responsive Adjustments === */
  @media (max-width: 768px) {
    .payment-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .payment-content {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .divider {
      height: 1px;
      width: 100%;
      background: #e2e8f0;
    }

    .divider-text {
      left: 50%;
      top: 50%;
    }

    .qr-section {
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .step-container {
      padding: 20px 15px;
    }

    .step-content {
      padding: 24px 20px;
      margin-top: 40px;
    }

    .step-header h2 {
      font-size: 24px;
    }

    .back-to-home {
      top: 10px;
      left: 10px;
      font-size: 14px;
    }

    .payment-section {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column-reverse;
    }

    .primary-button,
    .secondary-button {
      width: 100%;
    }

    .plan-summary {
      padding: 20px;
    }

    .plan-price-large {
      font-size: 32px;
    }

    .features-list ul {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .success-content {
      padding: 32px 24px;
    }

    .success-buttons {
      flex-direction: column;
    }

    .success-buttons .primary-button,
    .success-buttons .secondary-button {
      width: 100%;
    }
  }
</style>