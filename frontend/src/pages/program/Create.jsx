import { z } from 'zod';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Summary from '@/components/modules/program/Summary';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import CreateBudget from '@/components/modules/program/CreateBudget';
import CreateSupport from '@/components/modules/program/CreateSupport';
import CreateTimeline from '@/components/modules/program/CreateTimeline';
import BasicInformation from '@/components/modules/program/BasicInformation';

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
        objectives: z.array(z.string().trim().min(1, { message: "Tujuan tidak boleh kosong" }))
            .min(1, { message: "Minimal satu tujuan diperlukan" }),
    })).min(1, { message: "Minimal satu ringkasan diperlukan" }),
    timeline: z.array(z.object({
        date: z.union([
            z.string().min(1, "Tanggal diperlukan"),
            z.date()
        ])
        .transform((val) => {
            if (typeof val === 'string') return val;
            if (val instanceof Date) return val.toISOString().split('T')[0];
            return "";
        })
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, "Tanggal tidak valid"),
        title: z.string().trim().min(1, { message: "Judul kegiatan diperlukan" }),
        activities: z.array(z.string().trim().min(1, { message: "Aktivitas tidak boleh kosong" }))
            .min(1, { message: "Minimal satu aktivitas diperlukan" }),
    })).min(1, { message: "Minimal satu timeline diperlukan" }),
    budgetBreakdown: z.array(z.object({
        item: z.string().trim().min(1, { message: "Nama item diperlukan" }),
        amount: z.string()
            .min(1, { message: "Jumlah diperlukan" })
            .regex(/^\d+$/, { message: "Jumlah harus berupa angka" })
            .transform((val) => parseInt(val, 10))
            .refine((val) => val >= 0, { message: "Jumlah tidak boleh negatif" }),
    })).min(1, { message: "Minimal satu item anggaran diperlukan" }),
    supportExpected: z.array(z.string().trim()).optional().default([]),
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
            supportExpected: [],
        },
        mode: "onChange"
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
        try {
            console.log("Form data:", data);
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    const addObjective = (summaryIndex) => {
        const currentSummary = form.getValues(`summary.${summaryIndex}`);
        if (currentSummary && currentSummary.objectives) {
            form.setValue(`summary.${summaryIndex}.objectives`, [...currentSummary.objectives, ""]);
        }
    };

    const removeObjective = (summaryIndex, objectiveIndex) => {
        const currentSummary = form.getValues(`summary.${summaryIndex}`);
        if (currentSummary && currentSummary.objectives && currentSummary.objectives.length > 1) {
            const newObjectives = currentSummary.objectives.filter((_, index) => index !== objectiveIndex);
            form.setValue(`summary.${summaryIndex}.objectives`, newObjectives);
        }
    };

    const addActivity = (timelineIndex) => {
        const currentTimeline = form.getValues(`timeline.${timelineIndex}`);
        if (currentTimeline && currentTimeline.activities) {
            form.setValue(`timeline.${timelineIndex}.activities`, [...currentTimeline.activities, ""]);
        }
    };

    const removeActivity = (timelineIndex, activityIndex) => {
        const currentTimeline = form.getValues(`timeline.${timelineIndex}`);
        if (currentTimeline && currentTimeline.activities && currentTimeline.activities.length > 1) {
            const newActivities = currentTimeline.activities.filter((_, index) => index !== activityIndex);
            form.setValue(`timeline.${timelineIndex}.activities`, newActivities);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Program Baru</h1>
                        <p className="text-gray-600">Lengkapi informasi program yang akan dibuat</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <BasicInformation form={form} />

                            <Summary 
                                form={form}
                                summaryFields={summaryFields}
                                addObjective={addObjective} 
                                removeObjective={removeObjective}
                                appendSummary={appendSummary}
                                removeSummary={removeSummary}
                            />

                            <CreateTimeline 
                                form={form}
                                timelineFields={timelineFields}
                                addActivity={addActivity}
                                removeActivity={removeActivity}
                                appendTimeline={appendTimeline}
                                removeTimeline={removeTimeline}
                            />

                            <CreateBudget 
                                form={form}
                                budgetFields={budgetFields}
                                appendBudget={appendBudget}
                                removeBudget={removeBudget}
                            />

                            <CreateSupport 
                                form={form}
                                supportFields={supportFields}
                                appendSupport={appendSupport}
                                removeSupport={removeSupport}
                            />

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <div className="flex flex-col sm:flex-row gap-4">
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