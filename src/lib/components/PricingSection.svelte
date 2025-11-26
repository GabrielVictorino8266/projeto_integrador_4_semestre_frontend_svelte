<script>
    const { data, onSelectPlan, viewPlans = false, variant = "default" } = $props();

    import { plans } from "$lib/data/plans";

    const currentUser = $state(data?.session?.user);
    const activePlan = $state(currentUser?.plan || '');
</script>

<section class="pricing" class:compact={variant === "compact"}>
    <div class="pricing-header">
        <h2>Escolha o Plano Ideal para Sua Frota</h2>
        <p>Planos flexíveis que crescem com seu negócio</p>
    </div>

    <div class="pricing-cards">
        {#each Object.values(plans) as plan, index (index)}
            <div class="pricing-card" class:recommended={plan.recommended}>
                <div class="pricing-card--content">
                    {#if plan.recommended}
                        <span class="recommended-badge">Recomendado</span>
                    {/if}

                    <div class="card-icon">{plan.icon}</div>
                    <h3 class="card-title">{plan.name}</h3>
                    <p class="card-subtitle">{plan.subtitle}</p>

                    {#if variant !== "compact"}
                        <p class="card-description">{plan.description}</p>
                    {/if}

                    <div class="card-price">
                        {#if plan.id === 'GRATUITO'}
                            Grátis
                        {:else}
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}
                            {#if plan.priceUnit}
                                <span>{plan.priceUnit}</span>
                            {/if}
                        {/if}
                    </div>

                    <ul class="features-list">
                        {#each plan.features as feature, index (index)}
                            <li>
                                <span
                                    class="feature-icon"
                                    class:check={feature.included}
                                    class:cross={!feature.included}
                                >
                                    {feature.included ? "✓" : "✗"}
                                </span>
                                {feature.text}
                            </li>
                        {/each}
                    </ul>
                </div>
                {#if viewPlans}
                    <button
                        class="card-button"
                        onclick={() => onSelectPlan?.(plan)}
                    >
                        Ver Planos
                    </button>
                {:else if activePlan === plan.id}
                    <button
                        disabled
                        class="card-button current-plan"
                        onclick={() => onSelectPlan?.(plan)}
                    >
                        Seu plano atual
                    </button>
                {:else}
                    <button
                        class="card-button {plan.buttonClass}"
                        onclick={() => onSelectPlan?.(plan)}
                    >
                        {plan.buttonText}
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</section>

<style>
    /* Default Pricing Section */
    .pricing {
        background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
        padding: 100px 20px;
    }

    /* Compact Variant */
    .pricing.compact {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        padding: 0 20px;
    }

    .pricing-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .pricing.compact .pricing-header {
        margin-bottom: 10px;
    }

    .pricing-header h2 {
        font-size: 42px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 16px;
    }

    .pricing.compact .pricing-header h2 {
        font-size: 32px;
        margin-bottom: 12px;
        margin-top: 0;
    }

    .pricing-header p {
        font-size: 18px;
        color: #64748b;
    }

    .pricing.compact .pricing-header p {
        font-size: 16px;
    }

    .pricing-cards {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 30px;
        padding: 0 20px;
    }

    .pricing.compact .pricing-cards {
        gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }

    .pricing-card {
        background: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .pricing.compact .pricing-card {
        padding: 32px;
        border-radius: 16px;
    }

    .pricing-card::before {
        content: "";
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

    .pricing.compact .pricing-card:hover {
        transform: translateY(-4px);
    }

    .pricing-card.recommended {
        border: 3px solid #3b82f6;
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

    .pricing.compact .recommended-badge {
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        font-size: 10px;
    }

    .card-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }

    .pricing.compact .card-icon {
        font-size: 40px;
        margin-bottom: 16px;
    }

    .card-title {
        font-size: 28px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
    }

    .pricing.compact .card-title {
        font-size: 24px;
        margin-bottom: 6px;
    }

    .card-subtitle {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 24px;
        font-style: italic;
    }

    .pricing.compact .card-subtitle {
        font-size: 13px;
        margin-bottom: 20px;
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

    .pricing.compact .card-price {
        font-size: 36px;
        margin-bottom: 20px;
    }

    .card-price span {
        font-size: 18px;
        color: #64748b;
        font-weight: 400;
    }

    .pricing.compact .card-price span {
        font-size: 16px;
    }

    .features-list {
        list-style: none;
        margin-bottom: 32px;
    }

    .pricing.compact .features-list {
        margin-bottom: 24px;
    }

    .features-list li {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        font-size: 15px;
        color: #475569;
    }

    .pricing.compact .features-list li {
        gap: 10px;
        margin-bottom: 10px;
        font-size: 14px;
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

    .pricing.compact .feature-icon {
        width: 22px;
        height: 22px;
        font-size: 13px;
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

    .pricing.compact .card-button {
        padding: 14px;
        font-size: 15px;
        border-radius: 10px;
    }

    .card-button.current-plan {
        background: #f1f5f9;
        color: #94a3b8;
        cursor: not-allowed;
        border: 2px solid #e2e8f0;
    }

    .card-button.current-plan::before {
        content: "✓ ";
        margin-right: 4px;
        color: #10b981;
        font-weight: 700;
    }

    .card-button.current-plan:hover {
        transform: none;
        box-shadow: none;
        background: #f1f5f9;
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

    .pricing.compact .card-button:hover {
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        .pricing-cards {
            grid-template-columns: 1fr;
        }

        .pricing-card.recommended {
            transform: scale(1);
        }

        .pricing.compact {
            padding: 20px 15px;
        }

        .pricing.compact .pricing-cards {
            max-height: calc(100vh - 150px);
        }
    }
</style>
