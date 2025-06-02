import React, { useState } from 'react'
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

const BasicInformation = ({ form }) => {
    const [selectedFileName, setSelectedFileName] = useState('');

    const formatAmount = (value) => {
        if (!value || value === '') return '';
        
        const numericValue = String(value).replace(/[^\d]/g, '');
        if (!numericValue) return '';
        
        const number = parseInt(numericValue, 10);
        return `Rp ${number.toLocaleString('id-ID')}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const MAX_SIZE = 5 * 1024 * 1024;
        
        if (file && file.size > MAX_SIZE) {
            toast.error('Ukuran file maksimal 5MB');
            return;
        }
        
        if (file) {
            setSelectedFileName(file.name);
            form.setValue("image", file);
        } else {
            setSelectedFileName('');
            form.setValue("image", null);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFileName('');
        form.setValue("image", null);
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
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
                        name="image"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Gambar Program
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-3">
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors file:mr-4 py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                                            onChange={(e) => handleFileChange(e)}
                                            {...field}
                                        />
                                        
                                        {/* Display selected file name */}
                                        {selectedFileName && (
                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Upload className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-700 font-medium">
                                                        {selectedFileName}
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