import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { 
    isOpenAtom, 
    previewAlbumAtom, 
    previewPictureAtom, 
} from "@/jotai/atoms";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import ProfilePictureDialog from "./ProfilePictureDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfilePicture } from "@/lib/utils";
import { getInitial } from "@/utils/getInitial";

const UserInfo = () => {
    const { userData } = useAuth();
    const [isOpen, setIsOpen] = useAtom(isOpenAtom);
    const [, setPreviewAlbum] = useAtom(previewAlbumAtom);
    const [previewPicture, setPreviewPicture] = useAtom(previewPictureAtom);

    return (
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 sm:-mt-16 px-4 relative z-10">
            <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        setPreviewAlbum("");
                        setPreviewPicture("");
                    }
                }}
            >
                <Avatar 
                    onClick={() => setIsOpen(true)} 
                    className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-md cursor-pointer"
                >
                    <AvatarImage 
                        src={previewPicture || getProfilePicture(userData)}
                        referrerPolicy="no-referrer"
                        className="object-cover"
                    />
                    <AvatarFallback>{getInitial(userData.username)}</AvatarFallback>
                </Avatar>
                <ProfilePictureDialog />
            </Dialog>

            <div className="space-y-1 sm:pb-2">
                <h1 className="text-2xl font-medium">{userData?.username}</h1>
                <p className="text-sm text-gray-500">{userData?.email}</p>
            </div>
            
            <div className="flex-grow"></div>
            
            <Button variant="outline" className="hidden sm:flex items-center gap-2 shadow-sm" asChild>
                <Link to={`/article/create/${userData?._id}`}>
                    <Plus size={16} /> Tambah Konten
                </Link>
            </Button>
        </div>
    );
};

export default UserInfo;