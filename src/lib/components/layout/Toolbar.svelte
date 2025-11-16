<script>
  const { onSearch, toolbar } = $props();

  let searchInput = $state(null);

  function onSearchInput(event) {
    onSearch?.(event.target.value);
  }

  function clearSearch() {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
</script>

<div class="toolbar">
   <div class="search-box">
      <i class="search-icon fas fa-search"></i>
      <input
          bind:this={searchInput}
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          id="searchInput"
          oninput={onSearchInput}
      />
      <button
        type="button"
        class="clear-btn"
        onclick={clearSearch}
        title="Limpar"
      >
        <i class="fa-solid fa-times"></i>
      </button>
  </div>

  {#if toolbar}
    <div class="toolbar-buttons">
      {@render toolbar()}
    </div>
  {/if}
</div>

<style>
  /* Toolbar */
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    gap: 15px;
    flex-wrap: wrap;
    padding: 0 15px;
  }

  .toolbar-buttons {
      display: flex;
      gap: 10px;
      position: relative;
      flex-basis: auto;
  }

  .search-box {
    flex: 1;
    min-width: 250px;
    max-width: 400px;
    position: relative;
  }

  .search-box input {
    width: 100%;
    padding: 12px 20px 12px 45px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 10px;
    color: #e0e6ed;
    font-size: 14px;
    transition: all 0.3s;
  }

  .search-box input:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(15, 23, 42, 0.8);
  }

  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }

  .clear-btn {
    position: absolute;
    right: 8px;
    top: 8px;
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

  .clear-btn:hover {
    background-color: #1a2f4d;
    color: #3b82f6;
  }

  .clear-btn:active {
    transform: scale(0.95);
  }

  .clear-btn i {
    font-size: 13px;
  }

  /* Responsivo */
  @media (max-width: 768px) {
      .toolbar {
          flex-direction: column;
          align-items: stretch;
      }

      .search-box {
          max-width: 100%;
      }
  }
</style>
