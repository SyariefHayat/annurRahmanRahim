import React from 'react'
import { Plus, Target, Trash2 } from 'lucide-react'

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel,
    FormMessage 
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CreateSupport = ({ form, supportFields, appendSupport, removeSupport }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Target className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Dukungan yang Diharapkan</h2>
                            <p className="text-sm text-gray-600 mt-1">Opsional - Tambahkan dukungan yang dibutuhkan</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSupport("")}
                        className="bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Dukungan
                    </Button>
                </div>
            </div>
            
            <div className="p-8">
                {supportFields.length > 0 ? (
                    <div className="space-y-4">
                        {supportFields.map((field, index) => (
                            <div key={field.id} className="flex gap-3">
                                <FormField
                                    control={form.control}
                                    name={`supportExpected.${index}`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    placeholder={`Dukungan ${index + 1} (contoh: Bantuan teknis, Pelatihan, dll)`} 
                                                    className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500 bg-white"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSupport(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Belum ada dukungan yang ditambahkan</p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendSupport("")}
                            className="bg-white hover:bg-gray-50 cursor-pointer"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Dukungan Pertama
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateSupport