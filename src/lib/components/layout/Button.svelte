<script>
  let { 
    variant = 'primary', 
    type = 'button',
    disabled = false,
    loading = false,
    icon,
    onclick,
    children,
    ...props
  } = $props();
</script>

<button 
  {type}
  {onclick}
  disabled={disabled || loading}
  class="btn btn-{variant}"
  class:loading
  {...props}
>
  {#if loading}
    <i class="fas fa-spinner fa-spin"></i>
  {:else if icon}
    <i class="fas fa-{icon}"></i>
  {/if}

  {@render children()}
</button>