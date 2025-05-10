import { toast } from 'sonner';
import { Hash, X } from 'lucide-react';
import React, { useState } from 'react';

import { 
    FormField, 
    FormMessage 
} from '@/components/ui/form';

import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const FormTag = ({ form }) => {
    const [tagInput, setTagInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (!trimmedTag) return;
        
        const currentTags = form.getValues("tags") || [];
        
        if (currentTags.includes(trimmedTag)) {
            toast.error("Tag already exists");
            return;
        }
        
        if (currentTags.length >= 3) {
            toast.error("Maximum 3 tags allowed");
            return;
        }
        
        form.setValue("tags", [...currentTags, trimmedTag]);
        setTagInput("");
        setIsOpen(false);
    };

    const removeTag = (tagToRemove) => {
        const currentTags = form.getValues("tags") || [];
        form.setValue(
            "tags",
            currentTags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
                {(form.watch("tags") || []).map((tag) => (
                    <Badge key={tag} className="py-1 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800">
                        #{tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={14} />
                        </button>
                    </Badge>
                ))}
                
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 border-dashed border-gray-300 text-gray-500 hover:text-gray-700"
                        >
                            <Hash size={16} className="mr-1" /> Add Tag
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter tag name"
                                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                maxLength={20}
                            />
                            <Button type="button" size="sm" onClick={addTag}>
                                Add
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => <FormMessage />}
            />
        </div>
    )
}

export default FormTag;