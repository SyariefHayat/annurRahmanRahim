import React from 'react';
import { Loader2 } from 'lucide-react';

import ImageUpload from './ImageUpload';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import CampaignBasicInfo from './CampaignBasicInfo';
import CampaignTargetInfo from './CampaignTargetInfo';
import { Form, FormField } from "@/components/ui/form";
import { useCampaignForm } from '@/hooks/useCampaignForm';

const CampaignForm = () => {
    const { form, image, setImage, isLoading, onSubmit } = useCampaignForm();

    return (
        <div className="max-w-xl mx-auto border rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Buat Campaign Donasi</h2>

            <Form {...form}>
                <Toaster />
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField 
                        control={form.control} 
                        name="campaignImage" 
                        render={() => (
                            <ImageUpload 
                                image={image} 
                                setImage={setImage} 
                                form={form} 
                            />
                        )} 
                    />

                    <CampaignBasicInfo form={form} />
                    <CampaignTargetInfo form={form} />

                    <div className="pt-4">
                        {isLoading ? (
                            <Button className="w-full rounded-md bg-blue-600 hover:bg-blue-700" disabled>
                                <Loader2 className="animate-spin mr-2" size={18} />
                                Sedang membuat kampanye
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Buat Kampanye
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CampaignForm;