import DashboardLayout from '@/components/layouts/DashboardLayout'
import { apiInstanceExpress } from '@/services/apiInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import BasicInformation from '@/components/modules/program/BasicInformation';
import Summary from '@/components/modules/program/Summary';
import CreateTimeline from '@/components/modules/program/CreateTimeline';
import CreateBudget from '@/components/modules/program/CreateBudget';
import CreateSupport from '@/components/modules/program/CreateSupport';
import { useAuth } from '@/context/AuthContext';

const EditProgramSchema = z.object({
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
    programImage: z.any().optional(), // Ubah menjadi optional untuk edit
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

const EditProgram = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [programData, setProgramData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [hasNewImage, setHasNewImage] = useState(false); // Track jika ada gambar baru

    const form = useForm({
        resolver: zodResolver(EditProgramSchema),
        defaultValues: {
            title: "",
            desc: "",
            proposer: "",
            location: "",
            category: "",
            status: "Menunggu Persetujuan",
            budget: "",
            duration: "",
            programImage: null,
            summary: [{ background: "", objectives: [""] }],
            timeline: [{ date: "", title: "", activities: [""] }],
            budgetBreakdown: [{ item: "", amount: "" }],
            supportExpected: [],
        },
    });

    // Field arrays untuk dynamic fields
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

    // Handler untuk mendeteksi perubahan gambar
    const handleImageChange = (newImage) => {
        if (newImage && newImage instanceof File) {
            setHasNewImage(true);
            form.setValue('programImage', newImage);
        }
    };

    useEffect(() => {
        const getProgramDataById = async () => {
            if (!programId) {
                toast.error("ID program tidak ditemukan");
                navigate('/dashboard');
                return;
            }

            try {
                setIsLoadingData(true);
                const response = await apiInstanceExpress.get(`program/get/${programId}`);
                
                if (response.status === 200) {
                    const data = response.data.data;
                    setProgramData(data);

                    // Reset form dengan data yang diterima
                    form.reset({
                        title: data.title || "",
                        desc: data.desc || "",
                        proposer: data.proposer || "",
                        location: data.location || "",
                        category: data.category || "",
                        status: data.status || "Menunggu Persetujuan",
                        budget: data.budget?.toString() || "",
                        duration: data.duration || "",
                        programImage: null, // Set null untuk edit, bukan data.image
                        summary: data.summary && data.summary.length > 0 
                            ? data.summary 
                            : [{ background: "", objectives: [""] }],
                        timeline: data.timeline && data.timeline.length > 0 
                            ? data.timeline 
                            : [{ date: "", title: "", activities: [""] }],
                        budgetBreakdown: data.budgetBreakdown && data.budgetBreakdown.length > 0 
                            ? data.budgetBreakdown.map(item => ({
                                item: item.item || "",
                                amount: item.amount?.toString() || ""
                            }))
                            : [{ item: "", amount: "" }],
                        supportExpected: data.supportExpected || [],
                    });
                    
                    // Reset flag gambar baru
                    setHasNewImage(false);
                }
            } catch (error) {
                console.error("Error fetching program data:", error);
                toast.error("Gagal memuat data program");
                navigate('/dashboard');
            } finally {
                setIsLoadingData(false);
            }
        };

        getProgramDataById();
    }, [programId, navigate, form]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            
            const formData = new FormData();
            const token = await currentUser.getIdToken();
            
            // Append basic fields
            formData.append('title', data.title);
            formData.append('desc', data.desc);
            formData.append('proposer', data.proposer);
            formData.append('location', data.location);
            formData.append('category', data.category);
            formData.append('budget', data.budget.toString());
            formData.append('duration', data.duration);
            
            if (data.status) {
                formData.append('status', data.status);
            }
            
            // Hanya append gambar jika ada gambar baru yang dipilih
            if (hasNewImage && data.programImage instanceof File) {
                formData.append('programImage', data.programImage);
            }
            
            formData.append('summary', JSON.stringify(data.summary));
            formData.append('timeline', JSON.stringify(data.timeline));
            formData.append('budgetBreakdown', JSON.stringify(data.budgetBreakdown));
            formData.append('supportExpected', JSON.stringify(data.supportExpected));

            const response = await apiInstanceExpress.put(`program/update/${programId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success("Program berhasil diperbarui!");
                navigate('/dashboard/program');
            }
        } catch (error) {
            console.error("Error updating program:", error);
            toast.error(error.response?.data?.message || "Gagal memperbarui program");
        } finally {
            setLoading(false);
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

    if (isLoadingData) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="flex items-center space-x-2">
                                <Loader2 className="animate-spin" size={24} />
                                <span className="text-gray-600">Memuat data program...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Program</h1>
                        <p className="text-gray-600">Perbarui informasi program yang ada</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <BasicInformation 
                                form={form} 
                                programData={programData}
                                onImageChange={handleImageChange}
                            />
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
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/dashboard/program')}
                                        className="flex-1 h-12"
                                    >
                                        Batal
                                    </Button>
                                    {loading ? (
                                        <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700" disabled>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Sedang memperbarui program
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="submit" 
                                            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                        >
                                            Perbarui Program
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default EditProgram