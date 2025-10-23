
<script>
  let { children } = $props();
</script>

<div class="form-row">
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
  }

  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>

