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
import { Textarea } from '@/components/ui/textarea'

const Summary = ({ 
    form, 
    summaryFields, 
    addObjective, 
    removeObjective, 
    appendSummary, 
    removeSummary }) => {
    
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Target className="h-5 w-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Ringkasan Program</h2>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSummary({ background: "", objectives: [""] })}
                        className="bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Ringkasan
                    </Button>
                </div>
            </div>
            
            <div className="p-8 space-y-6">
                {summaryFields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 rounded-xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900">Ringkasan {index + 1}</h3>
                            {summaryFields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSummary(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        
                        <FormField
                            control={form.control}
                            name={`summary.${index}.background`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Latar Belakang Masalah</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Masukkan latar belakang masalah" 
                                            className="min-h-[100px] border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white resize-none"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-medium text-gray-700">Tujuan Program</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addObjective(index)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Tambah Tujuan
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {form.watch(`summary.${index}.objectives`).map((_, objIndex) => (
                                    <div key={objIndex} className="flex gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`summary.${index}.objectives.${objIndex}`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            placeholder={`Tujuan ${objIndex + 1}`} 
                                                            className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {form.watch(`summary.${index}.objectives`).length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeObjective(index, objIndex)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Summary