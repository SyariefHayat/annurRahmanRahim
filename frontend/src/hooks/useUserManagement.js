import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';

import { allUsersAtom } from '@/jotai/atoms';
import { useAuth } from '@/context/AuthContext';
import { apiInstanceExpress } from '@/services/apiInstance';

export const useUserManagement = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useAtom(allUsersAtom);
    
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const itemsPerPage = 10;

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        if (filterRole !== 'all' && user.role !== filterRole) return false;
        if (searchQuery && !user.username.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    }) : [];

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [users, filterRole, searchQuery]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handleRoleChange = async () => {
        if (!selectedUser || !selectedRole) return;
        setIsLoading(true);
        const toastId = toast.loading("Merubah role...");

        try {
            const token = await currentUser.getIdToken();
            const updatedUserData = {
                id: selectedUser._id,
                role: selectedRole
            };
            
            const response = await apiInstanceExpress.put("admin/update/role", updatedUserData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                toast.success("Berhasil mengubah role", { id: toastId });
                if (Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                } else {
                    const updatedUsers = users.map(user => 
                        user._id === selectedUser._id ? { ...user, role: selectedRole } : user
                    );
                    setUsers(updatedUsers);
                }
            }
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Gagal mengubah role pengguna", { id: toastId });
        } finally {
            setIsLoading(false);
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        const toastId = toast.loading("Menghapus akun...");
        
        try {
            const token = await currentUser.getIdToken();
            const response = await apiInstanceExpress.delete(`admin/user/delete/${selectedUser._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.status === 200) {
                toast.success("Berhasil menghapus akun", { id: toastId });
                if (Array.isArray(users)) {
                    const updatedUsers = users.filter(user => user._id !== selectedUser._id);
                    setUsers(updatedUsers);
                }
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Gagal menghapus pengguna", { id: toastId });
        } finally {
            setIsLoading(false);
            setSelectedUser(null);
        }
    };

    return {
        users,
        filteredUsers,
        currentUsers,
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
    };
};