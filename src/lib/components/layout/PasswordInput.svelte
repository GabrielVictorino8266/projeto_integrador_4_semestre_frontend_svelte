
<script>
	import Input from "./Input.svelte";
  import { validarSenha } from '$lib/utils/validation';
  import { slide } from "svelte/transition";
  
  let {
    value = $bindable(''),
    showStrength = false,
    ...props
  } = $props();

  let strength = $derived.by(() => {
    if (!showStrength || !value) return null;
  
    let score = validarSenha(value);
    if (score <= 2) return { level: 'weak', text: 'Senha fraca' };
    if (score <= 4) return { level: 'medium', text: 'Senha média' };
    return { level: 'strong', text: 'Senha forte' };
  });
</script>

<Input
  type="password"
  autocomplete="new-password"
  bind:value
  {...props}
>
  {#if showStrength && value}
    <div class="password-strength" transition:slide={{ duration: 100 }}>
      <div class="strength-bar-container">
        <div class="strength-bar {strength?.level}"></div>
      </div>
      <div class="strength-text {strength?.level}">
        {strength?.text}
      </div>
    </div>
  {/if}

</Input>

<style>
  .password-strength {
    margin-top: 8px;
  }

  .strength-bar-container {
    width: 100%;
    height: 4px;
    background-color: #162844;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 6px;
  }

  .strength-bar {
    height: 100%;
    width: 0%;
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  .strength-bar.weak {
    width: 33.33%;
    background-color: #ef4444;
  }

  .strength-bar.medium {
    width: 66.66%;
    background-color: #f59e0b;
  }

  .strength-bar.strong {
    width: 100%;
    background-color: #10b981;
  }

  .strength-text {
    font-size: 11px;
    font-weight: 600;
  }

  .strength-text.weak {
    color: #ef4444;
  }

  .strength-text.medium {
    color: #f59e0b;
  }

  .strength-text.strong {
    color: #10b981;
  }

</style>

