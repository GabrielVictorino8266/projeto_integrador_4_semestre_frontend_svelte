<script>
    import { onMount } from "svelte";
    import { toastState } from "$lib/state/toast.svelte";
    import { Toaster } from "$lib/components/ui";
    import UserModal from "$lib/components/UserModal.svelte";
    import UsersTable from "$lib/components/UsersTable.svelte";
    import { createUserModalState } from "$lib/stores/userModal.svelte";
    import { createUsersTableState } from "$lib/stores/usersTable.svelte";
   
    const { data } = $props();

    const usersTable = createUsersTableState();
    const userModal = createUserModalState();

    onMount(() => {
        if (data.error) {
            toastState.error(data.error);
        }
    });
</script>

<Toaster />

<UserModal 
    user={userModal.state.user}
    isOpen={userModal.state.open} 
    isEditMode={userModal.state.editing} 
    isSaving={userModal.state.saving}
    onClose={userModal.close}
    onSaveSuccess={userModal.handleSuccess}
    onSaveError={userModal.handleError}
/>

<UsersTable 
    users={usersTable.state.users}
    isLoading={usersTable.state.isLoading}
    currentPage={usersTable.state.currentPage}
    pageSize={usersTable.state.pageSize}
    searchTerm={usersTable.state.search}
    sorting={usersTable.state.sorting}
    onSort={usersTable.setSort}
    onPageChange={usersTable.setPage}
    onSearch={usersTable.setSearch}
    onEdit={userModal.openForEdit}
    onDelete={userModal.openForDelete}
/>