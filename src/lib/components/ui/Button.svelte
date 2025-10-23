<script>
  let { 
    variant = 'primary', 
    type = 'button',
    disabled = false,
    loading = false,
    onclick,
    children 
  } = $props();
</script>

<button 
  {type}
  {onclick}
  disabled={disabled || loading}
  class="btn btn-{variant}"
  class:loading
>
  {#if loading}
    <i class="fas fa-spinner fa-spin"></i>
  {/if}

  {@render children()}
</button>

<style>
  .btn {
    flex: 1;
    padding: 11px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: #162844;
    color: #8b9cb6;
    border: 1px solid #1e3a5f;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #1a2f4d;
    color: white;
    border-color: #3b82f6;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  .btn-primary:hover:not(:disabled)::before {
    left: 100%;
  }

  .btn-primary.loading::before {
    animation: shimmer 1s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  i {
    font-size: 17px;
  }
</style>