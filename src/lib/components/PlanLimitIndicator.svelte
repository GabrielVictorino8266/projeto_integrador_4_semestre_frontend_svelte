<script>
    let { limit, used, message = "usuários registrados" } = $props();

    // Calculate percentage
    const percent = $derived(Math.round((used / limit) * 100));

    // Determine CSS class based on usage level
    const progressClass = $derived(
        percent >= 90 ? "critical" : percent >= 75 ? "warning" : "normal",
    );
</script>

<div class="limit-indicator {progressClass}" id="indicator">
    <div class="limit-left">
        <svg
            class="warning-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div class="limit-info">
            <div class="limit-header">
                <span class="plan-label">Plano Gratuito:</span>
                <span class="limit-count" id="countText"
                    >{used} de {limit} {message}</span
                >
                {#if used >= limit}
                    <span class="warning-badge" id="badge">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                            ></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Limite atingido
                    </span>
                {/if}
            </div>
            <div class="limit-message" id="message">
                Faça upgrade para cadastrar mais veículos
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        id="progressFill"
                        style="width: {percent}%"
                    ></div>
                </div>
            </div>
        </div>
    </div>
    <button class="upgrade-btn">Fazer Upgrade</button>
</div>


<style>

    .limit-indicator {
        background: linear-gradient(135deg, rgba(255, 140, 66, 0.12) 0%, rgba(255, 140, 66, 0.06) 100%);
        border: 2px solid rgba(255, 140, 66, 0.5);
        border-left: 5px solid #ff8c42;
        border-radius: 12px;
        padding: 20px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 60px;
        box-shadow: 0 4px 20px rgba(255, 140, 66, 0.15);
    }

    .limit-indicator.normal {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%);
        border-color: rgba(59, 130, 246, 0.5);
        border-left-color: #3b82f6;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
    }

    .limit-indicator.critical {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
        border-color: rgba(239, 68, 68, 0.5);
        border-left-color: #ef4444;
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
    }

    .limit-left {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        flex: 1;
    }

    .warning-icon {
        color: #ff8c42;
        margin-top: 2px;
        flex-shrink: 0;
    }

    .limit-indicator.normal .warning-icon {
        color: #3b82f6;
    }

    .limit-indicator.critical .warning-icon {
        color: #ef4444;
    }

    .limit-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .limit-header {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .plan-label {
        font-size: 14px;
        font-weight: 600;
        color: #ff8c42;
    }

    .limit-indicator.normal .plan-label {
        color: #60a5fa;
    }

    .limit-indicator.critical .plan-label {
        color: #f87171;
    }

    .limit-count {
        font-size: 14px;
        font-weight: 400;
        color: #e2e8f0;
    }

    .warning-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 140, 66, 0.15);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        color: #ff8c42;
        text-transform: uppercase;
    }

    .limit-indicator.critical .warning-badge {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
    }

    .warning-badge svg {
        width: 12px;
        height: 12px;
    }

    .limit-message {
        font-size: 13px;
        color: #94a3b8;
        margin-top: 2px;
    }

    .progress-container {
        width: 100%;
        max-width: 800px;
        margin-top: 8px;
    }

    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(30, 41, 59, 0.8);
        border-radius: 2px;
        overflow: hidden;
        position: relative;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff8c42 0%, #ff6b35 100%);
        border-radius: 2px;
        transition: width 0.3s ease;
    }

    .limit-indicator.normal .progress-fill {
        background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    }

    .limit-indicator.critical .progress-fill {
        background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    }

    .upgrade-btn {
        padding: 10px 20px;
        background: #ff8c42; /* warning color */
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .limit-indicator.normal .upgrade-btn {
        background: #3b82f6; /* normal color */
    }

    .limit-indicator.warning .upgrade-btn {
        background: #ff8c42; /* warning color */
    }

    .limit-indicator.critical .upgrade-btn {
        background: #ef4444; /* critical color */
    }

    .upgrade-btn:hover {
        transform: translateY(-1px);
    }

    .limit-indicator.normal .upgrade-btn:hover {
        background: #2563eb;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .limit-indicator.warning .upgrade-btn:hover {
        background: #ff7a2e;
        box-shadow: 0 4px 12px rgba(255, 140, 66, 0.4);
    }

    .limit-indicator.critical .upgrade-btn:hover {
        background: #dc2626;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    /* Demo controls */
    .demo-controls {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(71, 85, 105, 0.5);
        border-radius: 8px;
        padding: 20px;
        margin-top: 30px;
    }

    .demo-controls h3 {
        font-size: 16px;
        margin-bottom: 16px;
        color: #e2e8f0;
    }

    .control-group {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .demo-btn {
        padding: 8px 16px;
        background: rgba(71, 85, 105, 0.5);
        border: 1px solid rgba(100, 116, 139, 0.5);
        border-radius: 6px;
        color: #e2e8f0;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .demo-btn:hover {
        background: rgba(100, 116, 139, 0.5);
        border-color: rgba(148, 163, 184, 0.5);
    }
</style>