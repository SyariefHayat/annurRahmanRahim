import React from 'react'
import { DollarSign, Plus, Trash2 } from 'lucide-react'

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CreateBudget = ({ form, budgetFields, appendBudget, removeBudget }) => {
    const formatAmount = (value) => {
        if (!value || value === '') return '';
        
        const numericValue = String(value).replace(/[^\d]/g, '');
        if (!numericValue) return '';
        
        const number = parseInt(numericValue, 10);
        return `Rp ${number.toLocaleString('id-ID')}`;
    };

    const handleBudgetChange = (e, onChange) => {
        const inputValue = e.target.value;
        
        const numericOnly = inputValue.replace(/[^\d]/g, '');
        onChange(numericOnly);
    };
    
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Rincian Anggaran</h2>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendBudget({ item: "", amount: "" })}
                        className="bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Item
                    </Button>
                </div>
            </div>
            
            <div className="p-8 space-y-6">
                {budgetFields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-900">Item {index + 1}</h3>
                            {budgetFields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeBudget(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name={`budgetBreakdown.${index}.item`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Nama Item</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nama item anggaran" 
                                                className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`budgetBreakdown.${index}.amount`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Jumlah (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                value={formatAmount(field.value)}
                                                onChange={(e) => handleBudgetChange(e, field.onChange)}
                                                placeholder="Rp 0"
                                                className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CreateBudget