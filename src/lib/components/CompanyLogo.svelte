<script>
    import { resolve } from '$app/paths';
    const { url } = $props();
</script>

<a href={resolve(url || '/')} data-sveltekit-reload class="no-link">
    <div class="logo-header">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient
                    id="logoGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stop-color="#3b82f6" />
                    <stop offset="100%" stop-color="#2563eb" />
                </linearGradient>
            </defs>
            <path
                d="M 20 30 Q 70 30 70 50 Q 70 70 20 70"
                stroke="url(#logoGrad)"
                stroke-width="18"
                fill="none"
                stroke-linecap="round"
            />
            <path
                d="M 25 35 Q 65 35 65 50 Q 65 65 25 65"
                stroke="white"
                stroke-width="2"
                fill="none"
                stroke-dasharray="4 4"
                opacity="0.8"
            />
            <rect x="5" y="35" width="10" height="3" rx="1.5" fill="#06b6d4" />
            <rect x="3" y="42" width="12" height="3" rx="1.5" fill="#8b5cf6" />
            <rect x="5" y="49" width="10" height="3" rx="1.5" fill="#3b82f6" />
        </svg>
        <span class="logo-text">DRIVEFLOW</span>
    </div>
</a>

<style>
    .no-link {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    .no-link:focus,
    .no-link:active {
        outline: none;
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
        color: #fff;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
    }
</style>
