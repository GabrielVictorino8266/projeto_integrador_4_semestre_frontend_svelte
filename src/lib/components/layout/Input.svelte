<script>
  import { maska } from "maska/svelte"
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  let {
    variant = 'default',
    id,
    label,
    required = false,
    value = $bindable(''),
    hint,
    error,
    children,
    copyable = false,
    mask,
    ...props
  } = $props();

  let copied = $state(false);
  let errorKey = $state(0);
  let unmaskedValue = undefined;
  
  $effect(() => {
    if (error) {
      errorKey = Date.now(); // Change key to force re-mount
    }
  })

  const handleMaska = (event) => {
    unmaskedValue = event.unmasked;
  };

  const handleCopy = (event) => {
    if (unmaskedValue !== undefined) {
      event.preventDefault();
      navigator.clipboard.writeText(unmaskedValue);
    }
  };

  function shake() {
    return {
      delay: 0,
      duration: 400,
      easing: cubicOut,
      css: (t, u) => {
        const intensity = u * 3; // 3px shake
        const phase = Math.sin(u * Math.PI * 2); // 4 oscillations
        return `transform: translateX(${intensity * phase}px);`;
      }
    };
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(unmaskedValue !== undefined ? unmaskedValue : value).then(() => {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    });
  }
</script>

{#key errorKey}
  <div class="form-group {variant}" in:shake={error ? {} : undefined}>
    {#if label}
      <label for={id}>
        {label}
        {#if required}
          <span class="required">*</span>
        {/if}
      </label>
    {/if}
    
    <div class="input-wrapper">
      <input
        {id}
        bind:value
        class:error
        class:with-copy={copyable}
        use:maska={{ mask, onMaska: handleMaska }}
        oncopy={handleCopy}
        {...props}
      />
      
      {#if copyable}
        <button
          type="button"
          class="copy-btn"
          onclick={copyToClipboard}
          disabled={!value}
          title={copied ? 'Copiado!' : 'Copiar'}
        >
          <i class="fa-solid {copied ? 'fa-check' : 'fa-copy'}"></i>
        </button>
      {/if}
    </div>

    {@render children?.()}
    
    {#if hint}
      <div class="hint">{hint}</div>
    {/if}
    
    {#if error}
      <div class="error-text" transition:slide={{ delay: 100 }}>{error}</div>
    {/if}
  </div>
{/key}