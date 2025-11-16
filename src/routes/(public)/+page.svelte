<script>
  import { resolve } from '$app/paths';
  import PricingSection from '$lib/components/PricingSection.svelte';
  import CompanyLogo from '$lib/components/CompanyLogo.svelte';
 
  
    const features = [
      {
        icon: '📊',
        title: 'Análise em Tempo Real',
        description: 'Monitore sua frota com dados atualizados instantaneamente e tome decisões baseadas em informações precisas.'
      },
      {
        icon: '🔒',
        title: 'Segurança Garantida',
        description: 'Seus dados protegidos com criptografia de ponta a ponta e infraestrutura em nuvem de alta disponibilidade.'
      },
      {
        icon: '📈',
        title: 'Crescimento Escalável',
        description: 'Comece pequeno e cresça conforme sua necessidade. Planos flexíveis que acompanham seu negócio.'
      },
      {
        icon: '💡',
        title: 'Insights Inteligentes',
        description: 'BI avançado que transforma dados em ações concretas para otimizar custos e performance.'
      }
    ];
  
     function handleSelectPlan(plan) {
      const params = new URLSearchParams({ plan: plan.id });
      window.location.href = '/planos?' + params.toString();
    }
    
    function scrollToPricing() {
      document.getElementById('scroll-plans')?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  </script>
  
  <div class="page-container">
    <!-- Header -->
    <header>
      <div class="header-content">
        <CompanyLogo url="/" />
        <a href={resolve("/login")} class="header-btn">Entrar</a>
      </div>
    </header>
  
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Gestão Inteligente de Frotas</h1>
        <p>Controle total sobre sua frota com tecnologia de ponta. Relatórios completos, análise em tempo real e suporte dedicado.</p>
        <button on:click={scrollToPricing} class="cta-button">Começar Agora</button>
      </div>
    </section>
  
    <!-- Pricing Section -->
    <PricingSection viewPlans={true} onSelectPlan={handleSelectPlan} />
    <div id="scroll-plans"></div>
  
    <!-- Features Section -->
    <section class="features-section">
      <div class="features-content">
        <h2>Por Que Escolher o DriveFlow?</h2>
        <div class="features-grid">
          {#each features as feature, index (index)}
            <div class="feature-item">
              <div class="feature-item-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  
    <!-- Footer -->
    <footer>
      <div class="footer-content">
        <div class="footer-logo">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M 20 30 Q 70 30 70 50 Q 70 70 20 70" stroke="url(#footerGrad)" stroke-width="18" fill="none" stroke-linecap="round"/>
            <path d="M 25 35 Q 65 35 65 50 Q 65 65 25 65" stroke="white" stroke-width="2" fill="none" stroke-dasharray="4 4" opacity="0.8"/>
          </svg>
        </div>
        <p><strong>DRIVEFLOW</strong></p>
        <p>© 2025 DriveFlow - Gestão Inteligente de Frotas</p>
        <p>Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
  
  <style>
    :global(body) {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      color: #1e293b;
    }
  
    .page-container {
      overflow-x: hidden;
    }
  
    /* Header */
    header {
      background: linear-gradient(135deg, #0a1628 0%, #1a2744 100%);
      padding: 20px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
  
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .header-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }
  
    .header-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }
  
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0f1f3a 100%);
      padding: 100px 20px;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    }
  
    .hero::before {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent);
      border-radius: 50%;
      top: -200px;
      right: -200px;
      animation: pulse 4s ease-in-out infinite;
    }
  
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.5; }
    }
  
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
  
    .hero h1 {
      font-size: 56px;
      font-weight: 800;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  
    .hero p {
      font-size: 22px;
      color: #94a3b8;
      margin-bottom: 40px;
      line-height: 1.6;
    }
  
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 18px 48px;
      border-radius: 12px;
      border: none;
      font-size: 20px;
      font-weight: 700;
      transition: all 0.3s;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
      cursor: pointer;
    }
  
    .cta-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
    }
  
  
    /* Features Section */
    .features-section {
      padding: 100px 20px;
      background: white;
    }
  
    .features-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .features-section h2 {
      text-align: center;
      font-size: 42px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 60px;
    }
  
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
  
    .feature-item {
      text-align: center;
      padding: 30px;
    }
  
    .feature-item-icon {
      font-size: 56px;
      margin-bottom: 20px;
    }
  
    .feature-item h3 {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
  
    .feature-item p {
      font-size: 16px;
      color: #64748b;
      line-height: 1.6;
    }
  
    /* Footer */
    footer {
      background: linear-gradient(135deg, #0a1628 0%, #1a2744 100%);
      color: white;
      padding: 60px 20px 30px;
      text-align: center;
    }
  
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .footer-logo {
      margin-bottom: 24px;
    }
  
    .footer-logo svg {
      width: 60px;
      height: 60px;
      margin: 0 auto;
    }
  
    footer p {
      color: #94a3b8;
      margin-bottom: 8px;
    }
  
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 36px;
      }
  
      .hero p {
        font-size: 18px;
      }
  
    }
  </style>