import React from 'react';
import { CalendarIcon } from 'lucide-react';

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";

import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover";

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

const CampaignTargetInfo = ({ form }) => {
    const formatAmount = (value) => {
        if (!value) return "";
        return `Rp ${Number(value).toLocaleString("id-ID")}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="targetAmount" render={({ field }) => (
                <FormItem>
                    <FormLabel className="block text-sm font-medium">Target Donasi</FormLabel>
                    <FormControl>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={formatAmount(field.value)}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/[^\d]/g, "");
                                field.onChange(raw);
                            }}
                            placeholder="Rp"
                            className="rounded-md"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="deadline" render={({ field }) => (
                <FormItem>
                    <FormLabel className="block text-sm font-medium">Tanggal Berakhir</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                type="button" 
                                variant="outline" 
                                className={cn(
                                    "w-full justify-start text-left font-normal rounded-md",
                                    !field.value && "text-gray-400"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? formatDate(field.value) : <span>Pilih tanggal</span>}
                            </Button>
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
            )} />
        </div>
    );
};

export default CampaignTargetInfo;