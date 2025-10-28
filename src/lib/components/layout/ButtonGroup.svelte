
<script>
  let { children } = $props();
</script>

<div class="button-group">
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }
</style>

