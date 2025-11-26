<script>
    const { 
        items, 
        columns, 
        cellRenderers, 
        currentSort = null,
        onSort = (_key, _order) => {},
    } = $props();

    let sortOrder = $state(currentSort?.order || "desc");
    let sortKey = $state(currentSort?.field || null);
    
    function sort(key) {
        sortKey = key;
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        onSort?.(sortKey, sortOrder);
    }
</script>

<table>
    <thead>
        <tr>
            {#each columns as column, index (index)}
                <th 
                    class:sortable={column.sortable !== false} 
                    onclick={column.sortable !== false ? () => sort(column.key) : undefined}
                    style:width={column.width || 'auto'}
                >
                    <span class="column-label">{column.label}</span>

                    {#if sortKey === column.key}
                        <span class="sort-indicator">
                            <i class="fas fa-lg fa-sort-{sortOrder === "asc" ? "up" : "down"}"></i>
                        </span>
                    {/if}
                </th>
            {/each}
        </tr>
    </thead>
    
    <tbody>
        {#each items as item, index (index)}
            <tr>
                {#each columns as column (column.key)}
                    {@const renderer = cellRenderers[`cell_${column.key}`]}
                    <td>
                        {#if renderer}
                            {@render renderer(item)}
                        {:else}
                            {item[column.key]}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}

        {#if items?.length == 0}
            <tr>
                <td colspan="{columns.length}" class="no-data">
                    Nenhum registro encontrado
                </td>
            </tr>
        {/if}
    </tbody>
</table>


<style>
    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    thead {
        background: rgba(59, 130, 246, 0.1);
    }

    .sort-indicator {
        position: absolute;
        right: 10px;
        opacity: 0.5;
        transition: opacity 0.2s;
    }

    th:hover .sort-indicator {
        opacity: 1;
    }

    th {
        position: relative;
        padding: 12px 14px;
        text-align: left;
        font-weight: 600;
        color: #3b82f6;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: center;
        user-select: none;
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        -o-user-select: none; /* Opera */
    }

    th.sortable:hover {
        cursor: pointer;
        background: rgba(59, 130, 246, 0.1);
    }

    td {
        padding: 12px 14px;
        border-top: 1px solid rgba(59, 130, 246, 0.1);
        color: #cbd5e1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }

    td.no-data {
        color: #94a3b8;
        padding: 20px;
        font-style: italic;
        font-size: 14px;
        text-align: center;
        opacity: 0.8;
    }

    tbody tr {
        transition: all 0.3s;
    }

    tbody tr:hover {
        background: rgba(59, 130, 246, 0.05);
    }

    /* Responsivo */
    @media (max-width: 768px) {
        table {
            font-size: 12px;
        }

        th,
        td {
            padding: 12px 10px;
        }
    }
</style>

