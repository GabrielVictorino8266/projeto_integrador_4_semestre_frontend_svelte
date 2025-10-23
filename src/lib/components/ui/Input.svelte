<script>
  import { maska } from "maska/svelte"
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  let {
    type = 'text',
    id,
    name,
    label,
    placeholder = '',
    required = false,
    maxlength,
    value = $bindable(''),
    hint,
    error,
    children,
    disabled = false,
    copyable = false,
    mask,
    oninput,
    onblur,
  } = $props();

  let copied = $state(false);
  let errorKey = $state(0);
  
  $effect(() => {
    if (error) {
      errorKey = Date.now(); // Change key to force re-mount
    }
  })

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
    navigator.clipboard.writeText(value).then(() => {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    });
  }
</script>

{#key errorKey}
  <div class="form-group" in:shake={error ? {} : undefined}>
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
        {type}
        {id}
        {name}
        {placeholder}
        {required}
        {maxlength}
        {disabled}
        bind:value
        class:error
        class:with-copy={copyable}
        use:maska={{ mask }}
        oninput={oninput}
        onblur={onblur}
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

<style>
  .form-group {
    margin-bottom: 14px;
    flex: 1;
  }

  label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: #8b9cb6;
    transition: color 0.3s;
  }

  .required {
    color: #ef4444;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    background-color: #162844;
    border: 1px solid #1e3a5f;
    border-radius: 4px;
    color: white;
    font-size: 13px;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  input.with-copy {
    padding-right: 42px;
  }

  .copy-btn {
    position: absolute;
    right: 8px;
    background: transparent;
    border: none;
    color: #8b9cb6;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-btn:hover:not(:disabled) {
    background-color: #1a2f4d;
    color: #3b82f6;
  }

  .copy-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .copy-btn i {
    font-size: 13px;
  }

  input::placeholder {
    color: #4a5f7f;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #1a2f4d;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input.error {
    border-color: #ef4444;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #1a3250 inset !important;
    -webkit-text-fill-color: white !important;
    border-color: #2d5a8a !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  input:disabled:-webkit-autofill,
  input:disabled:-webkit-autofill:hover,
  input:disabled:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #0e1a2f inset !important;
    -webkit-text-fill-color: #6b7f9f !important;
  }

  input:disabled {
    cursor: not-allowed;
    background-color: #0e1a2f;
    color: #6b7f9f;
    border-color: #1e3a5f;
    opacity: 0.7;
  }

  input:disabled:focus {
    border-color: #1e3a5f;
    background-color: #0e1a2f;
    box-shadow: none;
  }

  .hint {
    font-size: 11px;
    color: #6b7f9f;
    margin-top: 3px;
  }

  .error-text {
    font-size: 11px;
    color: #ef4444;
    margin-top: 3px;
  }
</style>