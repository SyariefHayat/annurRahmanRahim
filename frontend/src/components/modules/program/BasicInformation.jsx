import React, { useState, useRef, useEffect } from 'react'
import { FileText, Upload, X } from 'lucide-react'

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form'

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const BasicInformation = ({ form, programData, onImageChange }) => {
    const [selectedFileName, setSelectedFileName] = useState('');
    const [hasNewImage, setHasNewImage] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (programData?.image && !hasNewImage) {
            setSelectedFileName(programData.image);
        }
    }, [programData, hasNewImage]);

    const formatAmount = (value) => {
        if (!value || value === '') return '';
        
        const numericValue = String(value).replace(/[^\d]/g, '');
        if (!numericValue) return '';
        
        const number = parseInt(numericValue, 10);
        return `Rp ${number.toLocaleString('id-ID')}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        
        if (file) {
            // Validate file size
            if (file.size > MAX_SIZE) {
                alert('Ukuran file maksimal 5MB');
                e.target.value = ''; // Clear the input
                return;
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Format file tidak didukung. Gunakan JPEG, PNG, atau WebP');
                e.target.value = ''; // Clear the input
                return;
            }
            
            setSelectedFileName(file.name);
            setHasNewImage(true); // Mark that a new image has been selected
            form.setValue("programImage", file); // Use programImage to match parent component
            
            // Notify parent component about image change
            if (onImageChange) {
                onImageChange(file);
            }
        } else {
            setSelectedFileName('');
            setHasNewImage(false);
            form.setValue("programImage", null);
            
            if (onImageChange) {
                onImageChange(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFileName('');
        setHasNewImage(false);
        form.setValue("programImage", null);
        
        // Reset the file input using ref
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Notify parent component about image removal
        if (onImageChange) {
            onImageChange(null);
        }
    };

    const handleBudgetChange = (e, onChange) => {
        const inputValue = e.target.value;
        
        const numericOnly = inputValue.replace(/[^\d]/g, '');
        onChange(numericOnly);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar</h2>
                </div>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Judul Program
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Masukkan judul program" 
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="desc"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Deskripsi Program
                                </FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Masukkan deskripsi program secara detail" 
                                        className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none transition-colors"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="proposer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Pengusul Program
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Masukkan nama pengusul" 
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Lokasi Program
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Masukkan lokasi program" 
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Kategori Program
                                </FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-pointer">
                                            <SelectValue placeholder="Pilih kategori program" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pendidikan" className="cursor-pointer">Pendidikan</SelectItem>
                                        <SelectItem value="kesehatan" className="cursor-pointer">Kesehatan</SelectItem>
                                        <SelectItem value="lingkungan" className="cursor-pointer">Lingkungan</SelectItem>
                                        <SelectItem value="sosial" className="cursor-pointer">Sosial</SelectItem>
                                        <SelectItem value="ekonomi" className="cursor-pointer">Ekonomi</SelectItem>
                                        <SelectItem value="infrastruktur" className="cursor-pointer">Infrastruktur</SelectItem>
                                        <SelectItem value="teknologi" className="cursor-pointer">Teknologi</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Durasi Program
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Contoh: 6 bulan, 1 tahun" 
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Anggaran Program
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatAmount(field.value)}
                                        onChange={(e) => handleBudgetChange(e, field.onChange)}
                                        placeholder="Rp 0"
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="programImage"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Gambar Program
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-3">
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors file:mr-4 py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                                            onChange={handleFileChange}
                                            {...field}
                                        />
                                        
                                        {selectedFileName && (
                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Upload className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-700 font-medium">
                                                        {hasNewImage ? `Gambar baru: ${selectedFileName}` : `Gambar saat ini: ${selectedFileName}`}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                    className="p-1 hover:bg-green-100 rounded-full transition-colors"
                                                >
                                                    <X className="h-4 w-4 text-green-600 hover:text-green-800" />
                                                </button>
                                            </div>
                                        )}

                                        {!hasNewImage && programData?.image && !selectedFileName && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm text-blue-700">
                                                        Gambar saat ini: {programData.image}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Pilih file baru untuk mengganti gambar yang ada
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <p className="text-xs text-gray-500 mt-1">
                                    Format yang didukung: JPEG, PNG, WebP. Maksimal 5MB.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default BasicInformation