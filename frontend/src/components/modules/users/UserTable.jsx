import React from 'react';

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

import EachUtils from '@/utils/EachUtils';
import UserTableRow from './UserTableRow';
import UserTablePagination from './UserTablePagination';

const UserTable = ({ 
    users, 
    currentPage, 
    totalPages, 
    itemsPerPage, 
    totalItems,
    onPageChange, 
    onRoleChange, 
    onDelete 
}) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        <EachUtils 
                            of={users}
                            render={(user, index) => (
                                <UserTableRow 
                                    key={index}
                                    user={user}
                                    onRoleChange={onRoleChange}
                                    onDelete={onDelete}
                                />
                            )}
                        />
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                Tidak ada pengguna ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {totalItems > 0 && (
                <UserTablePagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

export default UserTable;