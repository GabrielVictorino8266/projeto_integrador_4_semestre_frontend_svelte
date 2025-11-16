<p class="warning-text">
    <i class="fas fa-info-circle icon-pulse"></i>
    <span class="text-slide">Seu pagamento está em processamento. Em breve, seu plano será ativado.</span>
</p>

<style>
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.8;
        }
    }

    @keyframes shimmer {
        0% {
            background-position: -200% center;
        }
        100% {
            background-position: 200% center;
        }
    }

    .warning-text {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: rgba(255, 165, 0, 0.15);
        border-left: 3px solid #ff8c00;
        border-radius: 4px;
        font-size: 13px;
        color: #ff8c00;
        position: relative;
        overflow: hidden;
    }

    .warning-text::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
        pointer-events: none;
    }

    .icon-pulse {
        animation: pulse 1.5s ease-in-out infinite;
        font-size: 14px;
    }

    .text-slide {
        animation: slideIn 0.8s ease-out 0.2s backwards;
    }
</style>