<script>
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  let selectedPlan = null;
  
  const plans = [
      {
        id: 'essencial',
        name: 'Essencial',
        subtitle: '(Gratuito)',
        icon: '🚗',
        price: 'Grátis',
        description: 'Ideal para quem está começando e quer testar a plataforma sem compromisso.',
        features: [
          { text: 'Até 5 motoristas', included: true },
          { text: 'Até 5 veículos', included: true },
          { text: 'Sem relatórios', included: false },
          { text: 'Sem BI', included: false },
          { text: 'Suporte simples', included: true }
        ],
        buttonText: 'Começar Grátis',
        buttonClass: 'btn-free',
        recommended: false
      },
      {
        id: 'profissional',
        name: 'Profissional',
        subtitle: '(Light)',
        icon: '🚙',
        price: 'R$ 79,99',
        priceUnit: '/mês',
        description: 'Para empresas que precisam de relatórios e controle operacional completo.',
        features: [
          { text: 'Até 15 motoristas', included: true },
          { text: 'Até 10 veículos', included: true },
          { text: 'Relatórios completos', included: true },
          { text: 'Controle de incidentes', included: true },
          { text: 'Suporte simples', included: true }
        ],
        buttonText: 'Assinar Agora',
        buttonClass: 'btn-professional',
        recommended: true
      },
      {
        id: 'corporativo',
        name: 'Corporativo',
        subtitle: '(Avançado)',
        icon: '🚚',
        price: 'R$ 159,99',
        priceUnit: '/mês',
        description: 'Para grandes frotas com foco em análise e performance avançada.',
        features: [
          { text: 'Motoristas ilimitados', included: true },
          { text: 'Veículos ilimitados', included: true },
          { text: 'Relatórios avançados', included: true },
          { text: 'Insights de acidentes', included: true },
          { text: 'BI integrado', included: true },
          { text: 'Suporte completo', included: true }
        ],
        buttonText: 'Assinar Completo',
        buttonClass: 'btn-corporate',
        recommended: false
      }
    ];
  
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
  
  function selectPlan(plan) {
    selectedPlan = plan;
    goto(resolve('/login'));
  }
  
    function scrollToPricing() {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  </script>
  
  <div class="page-container">
    <!-- Header -->
    <header>
      <div class="header-content">
        <div class="logo-header">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#2563eb" />
              </linearGradient>
            </defs>
            <path d="M 20 30 Q 70 30 70 50 Q 70 70 20 70" stroke="url(#logoGrad)" stroke-width="18" fill="none" stroke-linecap="round"/>
            <path d="M 25 35 Q 65 35 65 50 Q 65 65 25 65" stroke="white" stroke-width="2" fill="none" stroke-dasharray="4 4" opacity="0.8"/>
            <rect x="5" y="35" width="10" height="3" rx="1.5" fill="#06b6d4"/>
            <rect x="3" y="42" width="12" height="3" rx="1.5" fill="#8b5cf6"/>
            <rect x="5" y="49" width="10" height="3" rx="1.5" fill="#3b82f6"/>
          </svg>
          <span class="logo-text">DRIVEFLOW</span>
        </div>
        <a href="/login" class="header-btn">Entrar</a>
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
    <section class="pricing" id="pricing">
      <div class="pricing-header">
        <h2>Escolha o Plano Ideal para Sua Frota</h2>
        <p>Planos flexíveis que crescem com seu negócio</p>
      </div>
  
      <div class="pricing-cards">
        {#each plans as plan, index (index)}
          <div class="pricing-card" class:recommended={plan.recommended}>
            {#if plan.recommended}
              <span class="recommended-badge">Recomendado</span>
            {/if}
            
            <div class="card-icon">{plan.icon}</div>
            <h3 class="card-title">{plan.name}</h3>
            <p class="card-subtitle">{plan.subtitle}</p>
            <p class="card-description">{plan.description}</p>
            
            <div class="card-price">
              {plan.price}
              {#if plan.priceUnit}
                <span>{plan.priceUnit}</span>
              {/if}
            </div>
  
            <ul class="features-list">
              {#each plan.features as feature, index (index)}
                <li>
                  <span class="feature-icon" class:check={feature.included} class:cross={!feature.included}>
                    {feature.included ? '✓' : '✗'}
                  </span>
                  {feature.text}
                </li>
              {/each}
            </ul>
  
            <button 
              class="card-button {plan.buttonClass}" 
              on:click={() => selectPlan(plan)}
            >
              {plan.buttonText}
            </button>
          </div>
        {/each}
      </div>
    </section>
  
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
  
    .logo-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  
    .logo-header svg {
      width: 50px;
      height: 50px;
    }
  
    .logo-text {
      color: #06b6d4;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
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
  
    /* Pricing Section */
    .pricing {
      padding: 100px 20px;
      background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    }
  
    .pricing-header {
      text-align: center;
      margin-bottom: 60px;
    }
  
    .pricing-header h2 {
      font-size: 42px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 16px;
    }
  
    .pricing-header p {
      font-size: 18px;
      color: #64748b;
    }
  
    .pricing-cards {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 30px;
      padding: 0 20px;
    }
  
    .pricing-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
  
    .pricing-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #3b82f6, #06b6d4);
    }
  
    .pricing-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }
  
    .pricing-card.recommended {
      border: 3px solid #3b82f6;
      transform: scale(1.05);
    }
  
    .pricing-card.recommended::before {
      height: 8px;
    }
  
    .recommended-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
  
    .card-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
  
    .card-title {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }
  
    .card-subtitle {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 24px;
      font-style: italic;
    }
  
    .card-description {
      font-size: 15px;
      color: #475569;
      margin-bottom: 24px;
      line-height: 1.6;
    }
  
    .card-price {
      font-size: 42px;
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 24px;
    }
  
    .card-price span {
      font-size: 18px;
      color: #64748b;
      font-weight: 400;
    }
  
    .features-list {
      list-style: none;
      margin-bottom: 32px;
    }
  
    .features-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 15px;
      color: #475569;
    }
  
    .feature-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 14px;
    }
  
    .feature-icon.check {
      background: #22c55e;
      color: white;
    }
  
    .feature-icon.cross {
      background: #ef4444;
      color: white;
    }
  
    .card-button {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  
    .btn-free {
      background: linear-gradient(135deg, #64748b 0%, #475569 100%);
      color: white;
    }
  
    .btn-professional {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }
  
    .btn-corporate {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
    }
  
    .card-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  
      .pricing-cards {
        grid-template-columns: 1fr;
      }
  
      .pricing-card.recommended {
        transform: scale(1);
      }
    }
  </style>