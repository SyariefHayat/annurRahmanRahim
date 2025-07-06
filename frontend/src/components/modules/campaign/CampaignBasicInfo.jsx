import React from 'react';

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CampaignBasicInfo = ({ form }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="block text-sm font-medium">Judul Kampanye</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Masukkan judul kampanye" 
                                className="w-full rounded-md" 
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="block text-sm font-medium">Kategori</FormLabel>
                        <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full rounded-md">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kesehatan">Kesehatan</SelectItem>
                                    <SelectItem value="pendidikan">Pendidikan</SelectItem>
                                    <SelectItem value="bencana alam">Bencana Alam</SelectItem>
                                    <SelectItem value="kemanusiaan & sosial">Kemanusiaan & Sosial</SelectItem>
                                    <SelectItem value="Pembangunan Fasilitas">Pembangunan Fasilitas</SelectItem>
                                    <SelectItem value="acara khusus">Acara Khusus</SelectItem>
                                    <SelectItem value="darurat">Darurat</SelectItem>
                                    <SelectItem value="lain">Lain Lain</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel className="block text-sm font-medium">Deskripsi</FormLabel>
                    <FormControl>
                        <Textarea 
                            placeholder="Jelaskan tujuan kampanye Anda..." 
                            className="resize-none h-32 rounded-md"
                            maxLength={280}
                            {...field} 
                        />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                        {field.value?.length || 0}/280 karakter
                    </p>
                    <FormMessage />
                </FormItem>
            )} />
        </>
    );
};

export default CampaignBasicInfo;