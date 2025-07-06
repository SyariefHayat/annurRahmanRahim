import { toast } from 'sonner';
import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';

import { 
    FormControl, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";

const ImageUpload = ({ image, setImage, form }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const MAX_SIZE = 5 * 1024 * 1024;

        if (file && file.size > MAX_SIZE) {
            toast.error('Ukuran file maksimal 5MB');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        form.setValue("campaignImage", file);
    };

    return (
        <FormItem>
            <FormLabel className="block text-sm font-medium mb-2">Foto Kampanye</FormLabel>
            <div 
                onClick={() => fileInputRef.current?.click()} 
                className={`
                    w-full h-64 rounded-lg border-2 border-dashed cursor-pointer
                    transition-all duration-200 group hover:border-blue-400
                    flex items-center justify-center
                    ${image ? 'border-transparent' : 'border-gray-300'}
                `}
            >
                {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover object-center rounded-lg" />
                ) : (
                    <div className="text-center p-6">
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500" />
                        <p className="mt-2 text-sm text-gray-500 group-hover:text-blue-500">
                            Klik untuk unggah gambar
                        </p>
                        <p className="text-xs text-gray-400">
                            Format: JPG, PNG, GIF (Maks. 5MB)
                        </p>
                    </div>
                )}
            </div>
            <FormControl>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </FormControl>
            <FormMessage className="mt-1" />
        </FormItem>
    );
};

export default ImageUpload;