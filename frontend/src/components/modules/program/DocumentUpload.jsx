import React, { useEffect, useState } from 'react';

import { 
    Upload, 
    X, 
    FileText 
} from 'lucide-react';

import { 
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl, 
    FormMessage 
} from '@/components/ui/form';

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

const DocumentUpload = ({ form, programData }) => {
    const [existingDocument, setExistingDocument] = useState(null);
    const [isDocumentChanged, setIsDocumentChanged] = useState(false);

    useEffect(() => {
        if (programData?.document && !isDocumentChanged) {
            setExistingDocument({
                name: programData.document,
                isExisting: true
            });
        }
    }, [programData, isDocumentChanged]);

    const handleFileUpload = (file) => {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB

        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('File harus berformat PDF');
            return;
        }

        if (file.size > MAX_SIZE) {
            alert('Ukuran file tidak boleh lebih dari 10MB');
            return;
        }

        // Set new file to form
        form.setValue('programDocument', file);
        setIsDocumentChanged(true);
        setExistingDocument(null);
    };

    const handleRemoveFile = () => {
        form.setValue('programDocument', null);
        setIsDocumentChanged(true);
        setExistingDocument(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getCurrentDocument = (fieldValue) => {
        if (fieldValue && fieldValue instanceof File) {
            return {
                name: fieldValue.name,
                size: fieldValue.size,
                isNew: true
            };
        } else if (existingDocument && !isDocumentChanged) {
            return {
                name: existingDocument.name,
                size: null,
                isExisting: true
            };
        }
        return null;
    };

    return (
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Upload Dokumen
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                    Upload dokumen PDF seperti proposal, detail anggaran, atau dokumen lainnya
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="programDocument"
                    render={({ field }) => {
                        const currentDoc = getCurrentDocument(field.value);
                        
                        return (
                            <FormItem>
                                <FormLabel>File PDF</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        {currentDoc ? (
                                            <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="w-8 h-8 text-red-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {currentDoc.name}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            {currentDoc.size && (
                                                                <p className="text-xs text-gray-500">
                                                                    {formatFileSize(currentDoc.size)}
                                                                </p>
                                                            )}
                                                            {currentDoc.isExisting && (
                                                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                                    File tersimpan
                                                                </span>
                                                            )}
                                                            {currentDoc.isNew && (
                                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                                    File baru
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemoveFile}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-full">
                                                <label
                                                    htmlFor="document-upload"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PDF (Maks. 10MB)</p>
                                                    </div>
                                                    <input
                                                        id="document-upload"
                                                        type="file"
                                                        accept=".pdf"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleFileUpload(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default DocumentUpload;