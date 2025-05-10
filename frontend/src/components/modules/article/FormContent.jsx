import React from 'react'
import { toast } from 'sonner';

import { 
    FileImage,
    Heading1, 
    Heading2, 
    Heading3, 
    ImageIcon,  
    Type,
    X, 
} from "lucide-react";

import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover";

import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const FormContent = ({ contents, setContents, form }) => {
    const handleContentChange = (index, value) => {
        const updatedContents = [...contents];
        updatedContents[index].value = value;
        setContents(updatedContents);
    };
    
    const handleContentTypeChange = (index, type) => {
        const updatedContents = [...contents];
        updatedContents[index].type = type;
        
        if (type === "image") {
            updatedContents[index].value = "";
        }
        
        setContents(updatedContents);
    };
    
    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedContents = [...contents];
            updatedContents[index].value = file;
            setContents(updatedContents);
        }
    };
    
    const handleRemoveContent = (index) => {
        if (contents.length > 1) {
            const updatedContents = [...contents];
            updatedContents.splice(index, 1);
            setContents(updatedContents);
        } else {
            toast.error("Artikel harus memiliki setidaknya satu blok konten");
        }
    };
    
    const getPlaceholder = (type) => {
        switch (type) {
            case "heading-1": return "Main Heading";
            case "heading-2": return "Subheading";
            case "heading-3": return "Section Title";
            case "text": return "Apa yang anda pikirkan ?";
            default: return "";
        }
    };
    
    const getRowCount = (type, content) => {
        if (type === "heading-1" || type === "heading-2" || type === "heading-3") {
            return 1;
        }
        
        if (type === "text") {
            const lineCount = (content?.match(/\n/g) || []).length + 1;
            return Math.max(3, Math.min(lineCount + 1, 15));
        }
        
        return 3;
    };

    return (
        <div className="space-y-8 mb-8">
            {contents.map((content, index) => (
                <div key={index} className="relative group">
                    <Card className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 flex items-center gap-2 text-gray-600">
                                            {content.type === "text" && <Type size={14} />}
                                            {content.type === "heading-1" && <Heading1 size={14} />}
                                            {content.type === "heading-2" && <Heading2 size={14} />}
                                            {content.type === "heading-3" && <Heading3 size={14} />}
                                            {content.type === "image" && <ImageIcon size={14} />}
                                            
                                            {content.type === "text" && "Text"}
                                            {content.type === "heading-1" && "Heading 1"}
                                            {content.type === "heading-2" && "Heading 2"}
                                            {content.type === "heading-3" && "Heading 3"}
                                            {content.type === "image" && "Image"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-1">
                                        <div className="space-y-1">
                                            <button
                                                type="button"
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => handleContentTypeChange(index, "heading-1")}
                                            >
                                                <Heading1 size={14} /> Heading 1
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => handleContentTypeChange(index, "heading-2")}
                                            >
                                                <Heading2 size={14} /> Heading 2
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => handleContentTypeChange(index, "heading-3")}
                                            >
                                                <Heading3 size={14} /> Heading 3
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => handleContentTypeChange(index, "text")}
                                            >
                                                <Type size={14} /> Text
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 flex items-center gap-2"
                                                onClick={() => handleContentTypeChange(index, "image")}
                                            >
                                                <ImageIcon size={14} /> Image
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveContent(index)}
                            >
                                <X size={16} />
                            </Button>
                        </div>

                        {content.type === "image" ? (
                            <div className="mt-2">
                                {content.value instanceof File || content.value ? (
                                    <div className="relative w-full max-h-96 overflow-hidden rounded-lg">
                                        <img
                                            src={ 
                                                content.value instanceof File
                                                ? URL.createObjectURL(content.value)
                                                : `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${content.value}`
                                            }
                                            alt="Content image"
                                            className="w-full object-contain max-h-96"
                                        />
                                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <label htmlFor={`content-image-${index}`} className="cursor-pointer p-3 bg-white bg-opacity-90 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:bg-opacity-100 transition-all">
                                                <FileImage size={16} />
                                                Change Image
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor={`content-image-${index}`}
                                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <FileImage size={32} className="text-gray-400 mb-2" />
                                            <p className="text-gray-500 font-medium">Click to upload image</p>
                                            <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG or WEBP</p>
                                        </div>
                                    </label>
                                )}
                                <input
                                    id={`content-image-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(index, e)}
                                />
                                <div className="mt-1 text-red-500 text-sm">
                                    {form.formState.errors.content?.[index]?.value?.message}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2">
                                <Textarea
                                    value={content.value || ""}
                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                    placeholder={getPlaceholder(content.type)}
                                    rows={getRowCount(content.type, content.value)}
                                    className={`w-full resize-none transition-all duration-200 focus-visible:ring-blue-400/25 ${
                                        content.type === "heading-1" ? "text-3xl font-bold" :
                                        content.type === "heading-2" ? "text-2xl font-bold" :
                                        content.type === "heading-3" ? "text-xl font-bold" : "text-base"
                                    }`}
                                />
                                <div className="mt-1 text-red-500 text-sm">
                                    {form.formState.errors.content?.[index]?.value?.message}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            ))}
        </div>
    )
}

export default FormContent