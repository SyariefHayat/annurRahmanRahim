import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Trash2, FileText, Calendar, DollarSign, Target } from 'lucide-react';

const PostProgramSchema = z.object({
    title: z.string().trim().min(1, { message: "Judul program diperlukan" }),
    desc: z.string().trim().min(1, { message: "Deskripsi program diperlukan" }),
    proposer: z.string().trim().min(1, { message: "Pengusul program diperlukan" }),
    location: z.string().trim().min(1, { message: "Lokasi program diperlukan" }),
    category: z.string().trim().min(1, { message: "Kategori program diperlukan" }),
    status: z.enum(["Menunggu Persetujuan", "Disetujui", "Ditolak"]).optional(),
    budget: z.string()
        .min(1, { message: "Anggaran program diperlukan" })
        .regex(/^\d+$/, { message: "Hanya masukkan angka" })
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 100_000, { message: "Minimal Rp 100.000" }),
    duration: z.string().trim().min(1, { message: "Durasi program diperlukan" }),
    image: z.any()
        .refine(
            (file) => file instanceof File || (file && file.length > 0),
            { message: "Gambar program diperlukan"}
        ),
    summary: z.array(z.object({
        background: z.string().trim().min(1, { message: "Latar belakang masalah diperlukan" }),
        objectives: z.array(z.string().trim().min(1)).min(1, { message: "Minimal satu tujuan diperlukan" }),
    })),
    timeline: z.array(z.object({
        date: z.string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal tidak valid" })
        .transform((val) => new Date(val)),
        title: z.string().trim().min(1, { message: "Judul kegiatan diperlukan" }),
        activities: z.array(z.string().trim().min(1)).min(1, { message: "Minimal satu aktivitas diperlukan" }),
    })),
    budgetBreakdown: z.array(z.object({
        item: z.string().trim().min(1, { message: "Nama item diperlukan" }),
        amount: z.string()
        .regex(/^\d+$/, { message: "Jumlah harus berupa angka" })
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 0, { message: "Jumlah tidak boleh negatif" }),
    })),
    supportExpected: z.array(z.string().trim().min(1)).optional(),
});

const CreateProgram = () => {
    const form = useForm({
        resolver: zodResolver(PostProgramSchema),
        defaultValues: {
            title: "",
            desc: "",
            proposer: "",
            location: "",
            category: "",
            status: "Menunggu Persetujuan",
            budget: "",
            duration: "",
            image: null,
            summary: [{ background: "", objectives: [""] }],
            timeline: [{ date: "", title: "", activities: [""] }],
            budgetBreakdown: [{ item: "", amount: "" }],
            supportExpected: [""],
        }
    });

    const { fields: summaryFields, append: appendSummary, remove: removeSummary } = useFieldArray({
        control: form.control,
        name: "summary"
    });

    const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
        control: form.control,
        name: "timeline"
    });

    const { fields: budgetFields, append: appendBudget, remove: removeBudget } = useFieldArray({
        control: form.control,
        name: "budgetBreakdown"
    });

    const { fields: supportFields, append: appendSupport, remove: removeSupport } = useFieldArray({
        control: form.control,
        name: "supportExpected"
    });

    const onSubmit = async (data) => {
        console.log(data);
    };

    const addObjective = (summaryIndex) => {
        const currentSummary = form.getValues(`summary.${summaryIndex}`);
        form.setValue(`summary.${summaryIndex}.objectives`, [...currentSummary.objectives, ""]);
    };

    const removeObjective = (summaryIndex, objectiveIndex) => {
        const currentSummary = form.getValues(`summary.${summaryIndex}`);
        const newObjectives = currentSummary.objectives.filter((_, index) => index !== objectiveIndex);
        form.setValue(`summary.${summaryIndex}.objectives`, newObjectives);
    };

    const addActivity = (timelineIndex) => {
        const currentTimeline = form.getValues(`timeline.${timelineIndex}`);
        form.setValue(`timeline.${timelineIndex}.activities`, [...currentTimeline.activities, ""]);
    };

    const removeActivity = (timelineIndex, activityIndex) => {
        const currentTimeline = form.getValues(`timeline.${timelineIndex}`);
        const newActivities = currentTimeline.activities.filter((_, index) => index !== activityIndex);
        form.setValue(`timeline.${timelineIndex}.activities`, newActivities);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Program Baru</h1>
                        <p className="text-gray-600">Lengkapi informasi program yang akan dibuat</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Basic Information Card */}
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Judul Program</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Masukkan judul program" 
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Deskripsi Program</FormLabel>
                                                    <FormControl>
                                                        <Textarea 
                                                            placeholder="Masukkan deskripsi program" 
                                                            className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Pengusul Program</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Masukkan nama pengusul" 
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Lokasi Program</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Masukkan lokasi program" 
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Kategori Program</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                                                <SelectValue placeholder="Pilih kategori program" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="pendidikan">Pendidikan</SelectItem>
                                                            <SelectItem value="kesehatan">Kesehatan</SelectItem>
                                                            <SelectItem value="lingkungan">Lingkungan</SelectItem>
                                                            <SelectItem value="sosial">Sosial</SelectItem>
                                                            <SelectItem value="ekonomi">Ekonomi</SelectItem>
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Durasi Program</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Contoh: 6 bulan" 
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Anggaran Program (Rp)</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Masukkan anggaran dalam rupiah" 
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                            {...field} 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="image"
                                            render={({ field: { onChange, ...field } }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Gambar Program</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                            onChange={(e) => onChange(e.target.files?.[0])}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Summary Section */}
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
                                            className="bg-white hover:bg-gray-50"
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
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                                                                className="min-h-[100px] border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white"
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
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
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
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
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

                            {/* Timeline Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-8 py-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Calendar className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-900">Timeline Program</h2>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => appendTimeline({ date: "", title: "", activities: [""] })}
                                            className="bg-white hover:bg-gray-50"
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
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium text-gray-700">Tanggal</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    type="date" 
                                                                    className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white"
                                                                    {...field} 
                                                                />
                                                            </FormControl>
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
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Tambah Aktivitas
                                                    </Button>
                                                </div>
                                                <div className="space-y-3">
                                                    {form.watch(`timeline.${index}.activities`).map((_, actIndex) => (
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
                                                            {form.watch(`timeline.${index}.activities`).length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeActivity(index, actIndex)}
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
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

                            {/* Budget Breakdown */}
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
                                            className="bg-white hover:bg-gray-50"
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
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                                                                    placeholder="Jumlah dalam rupiah" 
                                                                    className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500 bg-white"
                                                                    {...field} 
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

                            {/* Support Expected */}
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
                                            className="bg-white hover:bg-gray-50"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Tambah Dukungan
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="p-8 space-y-4">
                                    {supportFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-3">
                                            <FormField
                                                control={form.control}
                                                name={`supportExpected.${index}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input 
                                                                placeholder={`Dukungan ${index + 1}`} 
                                                                className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                                                {...field} 
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {supportFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSupport(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="flex-1 h-12 text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
                                    >
                                        Simpan sebagai Draft
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Buat Program
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateProgram;