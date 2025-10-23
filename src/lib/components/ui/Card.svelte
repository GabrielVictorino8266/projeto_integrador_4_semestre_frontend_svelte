
<script>
  let {
    maxWidth = '550px',
    children
  } = $props();
</script>

<div class="card" style="max-width: {maxWidth}">
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .card {
    width: 100%;
    max-height: 100vh;
    background-color: #0a1628;
    padding: 20px 30px;
    color: white;
    /* overflow-y: auto; */
  }

  @media (max-width: 768px) {
    .card {
      padding: 15px 20px;
    }
  }
</style>

