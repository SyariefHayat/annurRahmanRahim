import React, { useState } from 'react';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import ChangeRoleDialog from '@/components/modules/users/ChangeRoleDialog';
import DeleteUserDialog from '@/components/modules/users/DeleteUserDialog';
import TableToolbar from '@/components/modules/users/TableToolbar';
import UserTable from '@/components/modules/users/UserTable';
import { useUserManagement } from '@/hooks/useUserManagement';

const Users = () => {
    const {
        currentUsers,
        filteredUsers,
        filterRole,
        searchQuery,
        currentPage,
        totalPages,
        selectedUser,
        selectedRole,
        isLoading,
        itemsPerPage,
        setFilterRole,
        setSearchQuery,
        setCurrentPage,
        setSelectedUser,
        setSelectedRole,
        handleRoleChange,
        handleDeleteUser
    } = useUserManagement();

    const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const openRoleDialog = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setChangeRoleDialogOpen(true);
    };

    const openDeleteDialog = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleRoleChangeAndClose = async () => {
        await handleRoleChange();
        setChangeRoleDialogOpen(false);
    };

    const handleDeleteAndClose = async () => {
        await handleDeleteUser();
        setDeleteDialogOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <TableToolbar 
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    filterRole={filterRole}
                    onFilterRoleChange={setFilterRole}
                />

                <UserTable 
                    users={currentUsers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredUsers.length}
                    onPageChange={setCurrentPage}
                    onRoleChange={openRoleDialog}
                    onDelete={openDeleteDialog}
                />

                <ChangeRoleDialog 
                    open={changeRoleDialogOpen}
                    onOpenChange={setChangeRoleDialogOpen}
                    selectedUser={selectedUser}
                    selectedRole={selectedRole}
                    onRoleChange={setSelectedRole}
                    onSave={handleRoleChangeAndClose}
                    isLoading={isLoading}
                />

                <DeleteUserDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    selectedUser={selectedUser}
                    onConfirm={handleDeleteAndClose}
                />
            </div>
        </DashboardLayout>
    );
};

export default Users;