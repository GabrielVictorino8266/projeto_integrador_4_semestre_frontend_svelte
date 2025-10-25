<script>
    import DataTable from "./ui/DataTable.svelte";

    const {
        users,
        onSort = () => {},
        onPageChange = () => {},
        onSearch = () => {},
        onEdit = () => {},
        onDelete = () => {},
    } = $props();

    const columns = [
        { key: "id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "cpf", label: "CPF" },
        { key: "email", label: "Email" },
        { key: "telefone", label: "Telefone" },
        { key: "acoes", label: "Ações" },
    ];
</script>

<DataTable {columns} items={users} {onSort} {onPageChange} {onSearch}>
    {#snippet acoes(user)}
        <button onclick={() => onEdit?.(user)}>Editar</button>
        <button onclick={() => onDelete?.(user)}>Excluir</button>
    {/snippet}
</DataTable>
