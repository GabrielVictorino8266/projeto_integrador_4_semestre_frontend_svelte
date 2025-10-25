<script>
    const { 
        totalItems = 100,
        currentPage = 1,
        itemsPerPage = 10,
        maxVisiblePages = 5,  // Maximum page buttons to show
        onPageChange = (_page) => {}
    } = $props();

    const totalPages = $derived(totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1);
    const showingStart = $derived(totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0);
    const showingEnd = $derived(totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0);

    // Calculate which page numbers to show
    const visiblePages = $derived.by(() => {
        // If we have few pages, show them all
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Center the current page when possible
        const sidePadding = Math.floor(maxVisiblePages / 2);
        let startPage = currentPage - sidePadding;
        let endPage = currentPage + sidePadding;

        // Don't go below page 1
        if (startPage < 1) {
            startPage = 1;
            endPage = maxVisiblePages;
        }

        // Don't go above total pages
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - maxVisiblePages + 1;
        }

        // Create array of page numbers
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    });


    const showFirstPage = $derived(visiblePages[0] > 1);
    const showLastPage = $derived(visiblePages[visiblePages.length - 1] < totalPages);

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        onPageChange?.(page);
    }

    function changePage(direction) {
        const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1;
        goToPage(newPage);
    }
</script>

<div class="pagination">
    <div class="pagination-info">
        Mostrando <span>{showingStart}</span> a <span>{showingEnd}</span> de <span>{totalItems}</span> registros
    </div>
    <div class="pagination-controls">
        <button
            aria-label="Anterior"
            class="page-btn"
            disabled={currentPage === 1}
            onclick={() => changePage("prev")}
        >
            <i class="fas fa-chevron-left"></i>
        </button>

        {#if showFirstPage}
            <button
                aria-label="Página 1"
                class="page-btn"
                onclick={() => goToPage(1)}
            >
                1
            </button>
            {#if visiblePages[0] > 2}
                <span class="ellipsis">...</span>
            {/if}
        {/if}
        
        {#each visiblePages as page (page)}
            <button
                aria-label="Página {page}"
                class="page-btn"
                class:active={page === currentPage}
                onclick={() => goToPage(page)}
            >
                {page}
            </button>
        {/each}

        {#if showLastPage}
            {#if visiblePages[visiblePages.length - 1] < totalPages - 1}
                <span class="ellipsis">...</span>
            {/if}
            <button
                aria-label="Página {totalPages}"
                class="page-btn"
                onclick={() => goToPage(totalPages)}
            >
                {totalPages}
            </button>
        {/if}
        
        <button
            aria-label="Próximo"
            class="page-btn"
            disabled={currentPage === totalPages}
            onclick={() => changePage("next")}
        >
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
</div>

<style>
    .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: rgba(15, 23, 42, 0.6);
        border-radius: 0 0 15px 15px;
        margin-top: -1px;
    }

    .pagination-info {
        color: #94a3b8;
        font-size: 14px;
    }

    .pagination-controls {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .page-btn {
        padding: 8px 12px;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        color: #3b82f6;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 36px;
        text-align: center;
    }

    .page-btn:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.2);
    }

    .page-btn.active {
        background: #3b82f6;
        color: white;
    }

    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .ellipsis {
        color: #94a3b8;
        padding: 0 8px;
        user-select: none;
    }
</style>