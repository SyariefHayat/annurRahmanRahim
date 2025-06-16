import React from 'react'

import { 
    Calendar, 
    Target, 
    Clock, 
    FileText 
} from 'lucide-react'

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog'

import { 
    formatCurrency, 
    formatDate 
} from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from 'react-router-dom'

const DetailCampaignDialog = ({ selectedCampaign, showDetailDialog, setShowDetailDialog }) => {
    const navigate = useNavigate();

    return (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-lg">
                {selectedCampaign && (
                    <ScrollArea className="h-[500px]">
                        <div className="relative">
                            <img 
                                src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${selectedCampaign.image}`} 
                                className="w-full h-64 object-cover" 
                                alt={selectedCampaign.title}
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1">
                                    {selectedCampaign.category}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-bold text-gray-800">
                                    {selectedCampaign.title}
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 mt-2">
                                    Informasi lengkap tentang campaign ini.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Deskripsi</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {selectedCampaign.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                        <Target className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Target Donasi</p>
                                            <p className="font-semibold text-gray-800">
                                                {formatCurrency(selectedCampaign.targetAmount)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                        <Calendar className="h-5 w-5 text-red-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Tanggal Berakhir</p>
                                            <p className="font-semibold text-gray-800">
                                                {/* {formatDate(selectedCampaign.deadline)} */}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <p className="text-sm text-blue-600 font-medium">
                                            {getDaysRemaining(selectedCampaign.deadline)} tersisa untuk campaign ini
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter className="p-6 pt-0 flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowDetailDialog(false)}
                                className="border-gray-300 text-gray-700"
                            >
                                Tutup
                            </Button>
                            <Button 
                                onClick={() => navigate(`/program/sosial/${selectedCampaign._id}`)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Donasi Sekarang
                            </Button>
                        </DialogFooter>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}

// Helper function to calculate days remaining
const getDaysRemaining = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Campaign telah berakhir";
    if (diffDays === 0) return "Berakhir hari ini";
    return `${diffDays} hari`;
}

export default DetailCampaignDialog