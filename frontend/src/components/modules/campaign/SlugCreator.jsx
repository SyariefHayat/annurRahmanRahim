import React from 'react';
import { ChevronRight } from 'lucide-react';

import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from '@/components/ui/avatar';

import { Button } from "@/components/ui/button";
import { getInitial } from '@/utils/getInitial';
import { getProfilePicture } from '@/lib/utils';

export const SlugCreator = ({ creator }) => {
    return (
        <div className="flex items-center gap-3 pt-2">
            <Avatar className="h-10 w-10 bg-gray-50 border border-gray-100">
                <AvatarImage src={getProfilePicture(creator)} />
                <AvatarFallback>{getInitial(creator.username)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium text-gray-900">{creator.username}</p>
                <p className="text-xs text-gray-500">{creator.role}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer">
                <a href={`/user/${creator._id}`} className="flex gap-1 items-center justify-center">
                    Profil <ChevronRight className="h-3 w-3 ml-1" />
                </a>
            </Button>
        </div>
    );
};