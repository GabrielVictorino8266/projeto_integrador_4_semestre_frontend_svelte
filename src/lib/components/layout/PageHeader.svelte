
<script>
  let {
    title,
    subtitle,
    showLogo = true
  } = $props();
</script>

<div class="header-section">
  {#if showLogo}
    <div class="logo">
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28" stroke="#3b82f6" stroke-width="2" fill="none" opacity="0.3"/>
        <circle cx="30" cy="30" r="20" fill="#3b82f6" opacity="0.5"/>
        <circle cx="30" cy="30" r="12" fill="#60a5fa"/>
      </svg>
    </div>
  {/if}
  
  <h1>{title}</h1>
  
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
</div>

<style>
  .header-section {
    text-align: center;
    margin-bottom: 20px;
  }

  .logo {
    width: 40px;
    height: 40px;
    margin: 0 auto 10px;
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

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    color: white;
  }

  .subtitle {
    font-size: 13px;
    color: #8b9cb6;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 20px;
    }

    .subtitle {
      font-size: 12px;
    }
  }
</style>

