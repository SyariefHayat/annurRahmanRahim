import React, { useState } from 'react';
import { FileImage } from 'lucide-react';

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormMessage 
} from '@/components/ui/form';

const FormCover = ({ form, existingUrl }) => {
    const [previewUrl, setPreviewUrl] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setValue("cover", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            form.setValue("cover", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <FormField
            name="cover"
            control={form.control}
            render={({ field }) => (
                <FormItem className="mb-8">
                    <FormControl>
                        <div
                        className={`relative w-full h-64 rounded-xl overflow-hidden transition-all duration-300 ${
                            isDragging ? "border-2 border-dashed border-blue-500 bg-blue-50" : "border-2 border-dashed border-gray-200 bg-gray-50"
                        }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {previewUrl || existingUrl ? (
                                <>
                                    <img
                                        src={previewUrl ? previewUrl : `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${existingUrl}`}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <label htmlFor="coverImage" className="cursor-pointer p-3 bg-white bg-opacity-90 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:bg-opacity-100 transition-all">
                                            <FileImage size={16} />
                                            Change Cover
                                        </label>
                                    </div>
                                    <input
                                        id="coverImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </>
                            ) : (
                                <label
                                    htmlFor="coverImage"
                                    className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer"
                                >
                                    <FileImage size={32} className="text-gray-400 mb-2" />
                                    <p className="text-gray-500 font-medium">Letakkan gambar sampul di sini atau klik untuk mengunggah</p>
                                    <p className="text-gray-400 text-sm mt-1">Rekomendasi: 1600×900px</p>
                                    <input
                                        id="coverImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage className="mt-2 text-center" />
                </FormItem>
            )}
        />
    )
}

export default FormCover