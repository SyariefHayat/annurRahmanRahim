import React from 'react';

import { 
    MoreHorizontal, 
    ShieldCheck, 
    UserX 
} from 'lucide-react';

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitial } from '@/utils/getInitial';
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate, getProfilePicture } from '@/lib/utils';

const UserTableRow = ({ user, onRoleChange, onDelete }) => {
    const getRoleBadge = (role) => {
        switch(role) {
            case 'product manager':
                return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Product Manager</Badge>;
            case 'coordinator':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Coordinator</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">User</Badge>;
        }
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                        <AvatarImage 
                            src={getProfilePicture(user)}
                            referrerPolicy="no-referrer"
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-200">{getInitial(user.username)}</AvatarFallback>
                    </Avatar>
                    {user.username}
                </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">
                    {user.provider}
                </Badge>
            </TableCell>
            <TableCell>
                {getRoleBadge(user.role)}
            </TableCell>
            <TableCell>
                {user.createdAt && formatDate(user.createdAt)}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            className="flex items-center gap-2"
                            onClick={() => onRoleChange(user)}
                        >
                            <ShieldCheck size={14} />
                            <span>Ubah Role</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => onDelete(user)}
                        >
                            <UserX size={14} />
                            <span>Hapus User</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
};

export default UserTableRow;