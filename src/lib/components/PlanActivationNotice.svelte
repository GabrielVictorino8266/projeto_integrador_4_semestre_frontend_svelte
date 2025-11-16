<script>
    import { fade, scale } from 'svelte/transition';
    import dismissable from '$lib/utils/dismissable';

  import { plans } from '$lib/data/plans';

  const { justActivatedPlan } = $props();

  let showModal = $state(justActivatedPlan?.length && plans?.[justActivatedPlan]);
</script>

{#if showModal}
  <div class="modal-overlay" transition:fade={{ duration: 300 }}>
    <div class="modal-container" use:dismissable={{ active: showModal }}
		ondismiss={() => (showModal = false)}
		transition:scale={{ duration: 300, start: 0.8 }}>
      <!-- Header with gradient -->
      <div class="modal-header">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#10b981"/>
            <path d="M14 24l8 8 12-16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>Plano Ativo</h2>
        <button class="close-btn" onclick={() => (showModal = false)} aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <p class="success-message">
          🎉 Seu pagamento foi aprovado com sucesso!
        </p>

        <p class="subtitle">
          Agora você tem acesso a todos os recursos do seu plano:
        </p>

        <ul class="features-list">
          {#each plans[justActivatedPlan].features as feature, index (index)}
            <li class="feature-item">
              <span class="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#10b981"/>
                  <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="feature-text">{feature.text}</span>
            </li>
          {/each}
        </ul>

        <button class="cta-button" onclick={() => (showModal = false)}>
          Começar a usar
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-container {
    background: linear-gradient(to bottom, #1e293b 0%, #0f172a 100%);
    border-radius: 16px;
    max-width: 500px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.4s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    position: relative;
    padding: 32px 24px 24px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    text-align: center;
  }

  .success-icon {
    margin: 0 auto 16px;
    animation: scaleIn 0.5s ease-out 0.2s backwards;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal-header h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .modal-content {
    padding: 32px 24px;
  }

  .success-message {
    font-size: 18px;
    font-weight: 600;
    color: #f0fdf4;
    text-align: center;
    margin: 0 0 24px;
    line-height: 1.5;
  }

  .subtitle {
    font-size: 15px;
    color: #94a3b8;
    margin: 0 0 20px;
    text-align: center;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 32px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(16, 185, 129, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(16, 185, 129, 0.1);
    transition: all 0.2s;
    animation: slideInLeft 0.4s ease-out backwards;
  }

  .feature-item:nth-child(1) { animation-delay: 0.1s; }
  .feature-item:nth-child(2) { animation-delay: 0.15s; }
  .feature-item:nth-child(3) { animation-delay: 0.2s; }
  .feature-item:nth-child(4) { animation-delay: 0.25s; }
  .feature-item:nth-child(5) { animation-delay: 0.3s; }
  .feature-item:nth-child(6) { animation-delay: 0.35s; }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .feature-item:hover {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
    transform: translateX(4px);
  }

  .check-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .feature-text {
    font-size: 15px;
    color: #e2e8f0;
    font-weight: 500;
  }

  .cta-button {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  .cta-button:active {
    transform: translateY(0);
  }
</style>