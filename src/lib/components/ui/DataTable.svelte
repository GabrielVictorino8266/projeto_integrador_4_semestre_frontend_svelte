<script>
    import { fade } from "svelte/transition";

    const {
        columns,
        items = [],
        isLoading = false,
        totalItems = 0,
        currentPage = 1,
        pagination = true,
        pageSize = 10,
        toolbar = null,
        onSort = () => {},
        onSearch = () => {},
        onPageChange = () => {},
        ...cellRenderers
    } = $props();

    import Grid from "./Grid.svelte";
    import Paginator from "./Paginator.svelte";
    import Toolbar from "./Toolbar.svelte";
</script>

<Toolbar onSearch={onSearch} {toolbar} />

<div class="content-wrapper">
    <!-- Table -->
    <div class="table-container" class:loading={isLoading}>
        <Grid {columns} {items} {cellRenderers} {onSort} />

        {#if pagination}
            <Paginator
                {totalItems}
                {currentPage}
                itemsPerPage={pageSize}
                {onPageChange}
            />
        {/if}

        {#if isLoading}
            <div
                class="loading-overlay"
                in:fade={{ duration: 100 }}
                out:fade={{ duration: 300 }}
            >
                <div class="spinner"></div>
            </div>
        {/if}
    </div>
</div>


<style>
    /* Table */
    .table-container {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(59, 130, 246, 0.2);
        overflow-x: auto;
        position: relative;
    }

    .content-wrapper:has(.loading-overlay) {
        pointer-events: none;
    }
    /* Loading overlay - simplified */
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.2);
        backdrop-filter: blur(2px);
        border-radius: 15px;
        z-index: 1000;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(59, 130, 246, 0.15);
        border-top-color: rgba(59, 130, 246, 0.6);
        border-radius: 50%;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
   
    /* Responsivo */
    @media (max-width: 768px) {
        .spinner {
            width: 50px;
            height: 50px;
        }
    }
</style>
