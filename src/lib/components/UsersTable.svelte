<script>
    const { users, onEdit, onDelete } = $props();
</script>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        {#each users as user (user.id)}
            <tr>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.cpf}</td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>
                    <button onclick={() => onEdit?.(user.id)}>Editar</button>
                    <button onclick={() => onDelete?.(user.id)}>Excluir</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

