<script lang="ts">
    const { data } = $props();

    const dashboard = data.dashboard;
    
    // Calculate percentages for limits
    const veiculosPercent = $derived(Math.round((dashboard.limitesPlano.veiculosUsados / dashboard.limitesPlano.veiculosLimite) * 100));
    const motoristasPercent = $derived(Math.round((dashboard.limitesPlano.motoristasUsados / dashboard.limitesPlano.motoristasLimite) * 100));
    const usuariosPercent = $derived(Math.round((dashboard.limitesPlano.usuariosUsados / dashboard.limitesPlano.usuariosLimite) * 100));

    // Calculate max value for bar chart scaling
    const maxCusto = $derived(Math.max(...dashboard.custosManutencaoUltimos6Meses.map(item => item.value), 1));
    const hasManutencaoData = $derived(dashboard.custosManutencaoUltimos6Meses.some(item => item.value > 0));

    // Calculate total for pie chart
    const totalVeiculos = $derived(dashboard.frotaPorStatus.reduce((acc, item) => acc + item.value, 0));

    const currentUser = $state(data?.session?.user);
    const isPaidPlan = $derived(currentUser?.plano === "PAGO");

</script>

<!-- KPI Cards -->
<div class="kpi-grid">
    <div class="kpi-card primary">
        <div class="icon">
            <i class="fas fa-car"></i>
        </div>
        <div class="label">Total de Veículos</div>
        <div class="value">{dashboard.kpis.totalVeiculos}</div>
    </div>

    <div class="kpi-card success">
        <div class="icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="label">Veículos Ativos</div>
        <div class="value">{dashboard.kpis.veiculosAtivos}</div>
    </div>

    <div class="kpi-card warning">
        <div class="icon">
            <i class="fas fa-wrench"></i>
        </div>
        <div class="label">Em Manutenção</div>
        <div class="value">{dashboard.kpis.veiculosEmManutencao}</div>
    </div>

    <div class="kpi-card info">
        <div class="icon">
            <i class="fas fa-user"></i>
        </div>
        <div class="label">Total de Motoristas</div>
        <div class="value">{dashboard.kpis.totalMotoristas}</div>
    </div>
</div>

<!-- Limits Section -->
{#if !isPaidPlan}
<div class="limit-section">
    <h2>
        <i class="fas fa-chart-line"></i>
        Limites do Plano Gratuito
    </h2>
    <div class="limit-grid">
        <div class="limit-item">
            <div class="limit-header">
                <span class="limit-label">Veículos</span>
                <span class="limit-count">{dashboard.limitesPlano.veiculosUsados} de {dashboard.limitesPlano.veiculosLimite}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: {veiculosPercent}%"></div>
            </div>
        </div>

        <div class="limit-item">
            <div class="limit-header">
                <span class="limit-label">Motoristas</span>
                <span class="limit-count">{dashboard.limitesPlano.motoristasUsados} de {dashboard.limitesPlano.motoristasLimite}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: {motoristasPercent}%"></div>
            </div>
        </div>

        <div class="limit-item">
            <div class="limit-header">
                <span class="limit-label">Usuários</span>
                <span class="limit-count">{dashboard.limitesPlano.usuariosUsados} de {dashboard.limitesPlano.usuariosLimite}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: {usuariosPercent}%"></div>
            </div>
        </div>
    </div>
</div>
{:else}
  
<div class="limit-section unlimited-plan">
    <h2>
        <i class="fas fa-infinity"></i>
        Plano Ilimitado
    </h2>
    <div class="limit-grid">
        <div class="limit-item unlimited-item">
            <div class="limit-header">
                <span class="limit-label">Veículos</span>
                <span class="limit-count unlimited-badge">{dashboard.limitesPlano.veiculosUsados} <span class="infinity-symbol">∞</span></span>
            </div>
            <div class="progress-bar unlimited-bar">
                <div class="progress-fill unlimited-fill"></div>
            </div>
        </div>

        <div class="limit-item unlimited-item">
            <div class="limit-header">
                <span class="limit-label">Motoristas</span>
                <span class="limit-count unlimited-badge">{dashboard.limitesPlano.motoristasUsados} <span class="infinity-symbol">∞</span></span>
            </div>
            <div class="progress-bar unlimited-bar">
                <div class="progress-fill unlimited-fill"></div>
            </div>
        </div>

        <div class="limit-item unlimited-item">
            <div class="limit-header">
                <span class="limit-label">Usuários</span>
                <span class="limit-count unlimited-badge">{dashboard.limitesPlano.usuariosUsados} <span class="infinity-symbol">∞</span></span>
            </div>
            <div class="progress-bar unlimited-bar">
                <div class="progress-fill unlimited-fill"></div>
            </div>
        </div>
    </div>
</div>
{/if}

<!-- Charts Section -->
<div class="charts-grid">
    <!-- Pie Chart: Fleet Status -->
    <div class="chart-card">
        <h3>
            <i class="fas fa-chart-pie"></i>
            Frota por Status
        </h3>
        {#if dashboard.frotaPorStatus.length > 0}
           <div class="pie-chart">
    <div class="pie-circle">
        <svg width="160" height="160" viewBox="0 0 160 160">
            <circle class="bg-circle" cx="80" cy="80" r="70"></circle>
            {#each dashboard.frotaPorStatus as status, index (index)}
                {@const percent = (status.value / totalVeiculos) * 100}
                {@const circumference = 440}
                {@const previousPercent = dashboard.frotaPorStatus
                    .slice(0, index)
                    .reduce((sum, s) => sum + (s.value / totalVeiculos) * 100, 0)}
                <circle 
                    class="fill-circle" 
                    cx="80" 
                    cy="80" 
                    r="70"
                    style="
                        stroke: {status.fill}; 
                        stroke-dasharray: {(circumference * percent / 100)} {circumference}; 
                        stroke-dashoffset: {-circumference * previousPercent / 100}
                    "
                ></circle>
            {/each}
        </svg>
        <div class="pie-center-text">
            <div class="value">{totalVeiculos}</div>
            <div class="label">Veículos</div>
        </div>
    </div>
    <div class="pie-legend">
        {#each dashboard.frotaPorStatus as status, index (index)}
            <div class="legend-item">
                <div class="legend-color" style="background: {status.fill}"></div>
                <span class="legend-label">{status.name}</span>
                <span class="legend-value">{status.value}</span>
            </div>
        {/each}
    </div>
</div>
        {:else}
            <div class="empty-state">
                <i class="fas fa-car"></i>
                <p>Nenhum veículo cadastrado</p>
            </div>
        {/if}
    </div>

    <!-- Bar Chart: Maintenance Costs -->
    <div class="chart-card">
        <h3>
            <i class="fas fa-chart-bar"></i>
            Custos de Manutenção (Últimos 6 Meses)
        </h3>
        {#if hasManutencaoData}
            <div class="bar-chart">
                {#each dashboard.custosManutencaoUltimos6Meses as mes, index (index)}
                    {@const barHeight = mes.value > 0 ? (mes.value / maxCusto) * 180 : 4}
                    <div class="bar-item">
                        <div class="bar" style="height: {barHeight}px" title="R$ {mes.value.toFixed(2)}"></div>
                        <div class="bar-label">{mes.name}</div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="bar-chart">
                {#each dashboard.custosManutencaoUltimos6Meses as mes, index (index)}
                    <div class="bar-item">
                        <div class="bar" style="height: 4px"></div>
                        <div class="bar-label">{mes.name}</div>
                    </div>
                {/each}
            </div>
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>Nenhum custo registrado nos últimos 6 meses</p>
            </div>
        {/if}
    </div>
</div>

<!-- Alerts Section -->
<div class="alerts-section">
    <h3>
        <i class="fas fa-bell"></i>
        Alertas
    </h3>
    {#if dashboard.alertasManutencaoKm.length > 0}
        <div class="alerts-list">
            {#each dashboard.alertasManutencaoKm as alerta, index (index)}
                <div class="alert-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="alert-content">
                        <div class="alert-title">{alerta.placa} - {alerta.numeroVeiculo}</div>
                        <div class="alert-description">{alerta.mensagem}</div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="empty-state">
            <i class="fas fa-check-circle"></i>
            <p>Nenhum alerta no momento</p>
        </div>
    {/if}
</div>

<style>
    /* KPI Cards */
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
    }

    .kpi-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 24px;
        transition: all 0.3s ease;
    }

    .kpi-card:hover {
        transform: translateY(-4px);
        border-color: rgba(59, 130, 246, 0.6);
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
    }

    .kpi-card .icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-bottom: 16px;
    }

    .kpi-card.primary .icon {
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.2),
            rgba(59, 130, 246, 0.1)
        );
        color: #60a5fa;
    }

    .kpi-card.success .icon {
        background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.2),
            rgba(34, 197, 94, 0.1)
        );
        color: #4ade80;
    }

    .kpi-card.warning .icon {
        background: linear-gradient(
            135deg,
            rgba(251, 146, 60, 0.2),
            rgba(251, 146, 60, 0.1)
        );
        color: #fb923c;
    }

    .kpi-card.info .icon {
        background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.2),
            rgba(139, 92, 246, 0.1)
        );
        color: #a78bfa;
    }

    .kpi-card .label {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .kpi-card .value {
        font-size: 36px;
        font-weight: 700;
        color: #fff;
    }

    /* Limit Indicators */
    .limit-section {
        background: rgba(15, 23, 42, 0.6);
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-left: 5px solid #3b82f6;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 40px;
    }

    .limit-section h2 {
        font-size: 18px;
        color: #60a5fa;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .limit-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .limit-item {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(71, 85, 105, 0.5);
        border-radius: 8px;
        padding: 16px;
    }

    .limit-item .limit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .limit-item .limit-label {
        font-size: 14px;
        color: #e2e8f0;
        font-weight: 500;
    }

    .limit-item .limit-count {
        font-size: 14px;
        color: #94a3b8;
    }

    .limit-item .progress-bar {
        width: 100%;
        height: 6px;
        background: rgba(30, 41, 59, 0.8);
        border-radius: 3px;
        overflow: hidden;
    }

    .limit-item .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #2563eb);
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    /* Charts Section */
    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
    }

    .chart-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 24px;
    }

    .chart-card h3 {
        font-size: 16px;
        color: #e2e8f0;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .chart-card h3 i {
        color: #60a5fa;
    }

    /* Pie Chart */
    .pie-chart {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
        padding: 20px 0;
    }

    .pie-circle {
        position: relative;
        width: 160px;
        height: 160px;
    }

    .pie-circle svg {
        transform: rotate(-90deg);
    }

    .pie-circle circle {
        fill: none;
        stroke-width: 20;
    }

    .pie-circle .bg-circle {
        stroke: rgba(30, 41, 59, 0.8);
    }

    .pie-circle .fill-circle {
        transition: stroke-dashoffset 0.5s ease;
    }

    .pie-center-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    .pie-center-text .value {
        font-size: 32px;
        font-weight: 700;
        color: #fff;
    }

    .pie-center-text .label {
        font-size: 12px;
        color: #94a3b8;
    }

    .pie-legend {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
    }

    .legend-label {
        font-size: 14px;
        color: #e2e8f0;
        flex: 1;
    }

    .legend-value {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
    }

    /* Unlimited Plan Styling */
    .limit-section.unlimited-plan {
        border-left: 5px solid #8b5cf6;
        background: rgba(139, 92, 246, 0.05);
        border-color: rgba(139, 92, 246, 0.3);
    }

    .limit-section.unlimited-plan h2 {
        color: #a78bfa;
    }

    .limit-item.unlimited-item {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .unlimited-badge {
        color: #a78bfa !important;
        font-weight: 600;
    }

    .infinity-symbol {
        font-size: 18px;
        color: #8b5cf6;
        margin-left: 4px;
    }

    .progress-bar.unlimited-bar {
        background: rgba(139, 92, 246, 0.2);
    }

    .progress-fill.unlimited-fill {
        width: 100% !important;
        background: linear-gradient(90deg, #8b5cf6, #7c3aed);
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0%, 100% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
    }

    /* Bar Chart */
    .bar-chart {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 200px;
        gap: 12px;
        padding: 20px 0;
    }

    .bar-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .bar {
        width: 100%;
        background: linear-gradient(180deg, #3b82f6, #2563eb);
        border-radius: 4px 4px 0 0;
        min-height: 4px;
        transition: all 0.3s ease;
        position: relative;
    }

    .bar:hover {
        opacity: 0.8;
        transform: scaleY(1.05);
    }

    .bar-label {
        font-size: 12px;
        color: #94a3b8;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #64748b;
    }

    .empty-state i {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .empty-state p {
        font-size: 14px;
    }

    /* Alerts Section */
    .alerts-section {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 24px;
    }

    .alerts-section h3 {
        font-size: 16px;
        color: #e2e8f0;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .alerts-section h3 i {
        color: #fb923c;
    }

    .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .alert-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background: rgba(251, 146, 60, 0.1);
        border: 1px solid rgba(251, 146, 60, 0.3);
        border-left: 3px solid #fb923c;
        border-radius: 8px;
    }

    .alert-item i {
        color: #fb923c;
        font-size: 18px;
        margin-top: 2px;
    }

    .alert-content {
        flex: 1;
    }

    .alert-title {
        font-size: 14px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
    }

    .alert-description {
        font-size: 13px;
        color: #94a3b8;
    }

    @media (max-width: 768px) {
        .charts-grid {
            grid-template-columns: 1fr;
        }

        .pie-chart {
            flex-direction: column;
            gap: 20px;
        }

        .kpi-grid {
            grid-template-columns: 1fr;
        }

        .limit-grid {
            grid-template-columns: 1fr;
        }
    }
</style>