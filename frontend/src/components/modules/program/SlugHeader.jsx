import React from 'react';
import { useAtom } from 'jotai';

import { 
    Calendar, 
    User, 
    MapPin, 
    Clock, 
    DollarSign,
    Download,
    Building
} from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import DonasiBtn from '../campaign/DonasiBtn';
import { Button } from '@/components/ui/button';
import { programDataAtom } from '@/jotai/atoms';
import { formatDate } from '@/utils/formatDate';

const SlugHeader = () => {
    const [programData] = useAtom(programDataAtom);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/program/pemda.pdf";
        link.download = "proposal-pemda.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {programData.title}
                </h1>
                <Badge 
                    variant={programData.status === 'Disetujui' ? 'default' : 'secondary'}
                    className="ml-0 md:ml-4 shrink-0"
                >
                    {programData.status}
                </Badge>
            </div>
            
            <p className="text-gray-600 mb-6 text-lg">
                {programData.desc}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                        <span className="text-sm text-gray-500">Pengusul</span>
                        <p className="font-medium">{programData.proposer}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                        <span className="text-sm text-gray-500">Tanggal Pengajuan</span>
                        <p className="font-medium">{formatDate(programData.createdAt)}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                        <span className="text-sm text-gray-500">Lokasi</span>
                        <p className="font-medium">{programData.location}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                        <span className="text-sm text-gray-500">Durasi</span>
                        <p className="font-medium">{programData.duration}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <div>
                        <span className="text-sm text-gray-500">Total Anggaran</span>
                        <p className="font-medium">{formatCurrency(programData.targetAmount)}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <div>
                        <span className="text-sm text-gray-500">Kategori</span>
                        <p className="font-medium">{programData.category}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-5 flex-wrap">
                <DonasiBtn />
                
                <Button onClick={handleDownload} className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Download Proposal PDF
                </Button>
            </div>
        </div>
    );
};

export default SlugHeader;