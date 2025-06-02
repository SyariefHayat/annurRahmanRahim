import React from 'react'
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react'
import { format } from "date-fns"
import { id } from "date-fns/locale" // Import locale Indonesia

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import { cn, formatDate } from '@/lib/utils'

const CreateTimeline = ({ 
    form, 
    timelineFields, 
    addActivity, 
    removeActivity, 
    appendTimeline, 
    removeTimeline 
}) => {
    
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <CalendarIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Timeline Program</h2>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTimeline({ date: null, title: "", activities: [""] })}
                        className="bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Timeline
                    </Button>
                </div>
            </div>
            <div className="p-8 space-y-6">
                {timelineFields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 rounded-xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900">Timeline {index + 1}</h3>
                            {timelineFields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTimeline(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name={`timeline.${index}.date`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium text-gray-700">Tanggal</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "h-11 w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50 focus:border-purple-500 focus:ring-purple-500 bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? (
                                                            formatDate(field.value)
                                                        ) : (
                                                            "Pilih tanggal"
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`timeline.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Judul Kegiatan</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan judul kegiatan" 
                                                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-medium text-gray-700">Aktivitas</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addActivity(index)}
                                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Tambah Aktivitas
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {form.watch(`timeline.${index}.activities`)?.map((_, actIndex) => (
                                    <div key={actIndex} className="flex gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`timeline.${index}.activities.${actIndex}`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input 
                                                            placeholder={`Aktivitas ${actIndex + 1}`} 
                                                            className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {form.watch(`timeline.${index}.activities`)?.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeActivity(index, actIndex)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CreateTimeline