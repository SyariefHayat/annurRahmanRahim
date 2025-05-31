import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  User, 
  MapPin, 
  FileText, 
  Target, 
  Clock, 
  DollarSign,
  Download,
  ArrowLeft,
  CheckCircle,
  Building,
  Lightbulb
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { useParams } from 'react-router-dom';
import { useProgramDetail } from '@/hooks/useProgramDetail';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/utils/formatDate';
import Footer from '../landing/Footer';

const Slug = () => {
  const { id } = useParams();
  const { loading, programData } = useProgramDetail(id);
  const [activeTab, setActiveTab] = useState('overview');

  // Loading state
  if (loading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data program...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Error state - if no program data
  if (!programData) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Program tidak ditemukan</h2>
            <p className="text-gray-600 mb-4">Program yang Anda cari tidak dapat ditemukan.</p>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/program/pemda.pdf";
    link.download = "proposal-pemda.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image */}
              <div className="lg:col-span-1">
                <img
                  src={programData.image}
                  alt={programData.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* Main Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {programData.title}
                  </h1>
                  <Badge 
                    variant={programData.status === 'Disetujui' ? 'default' : 'secondary'}
                    className="ml-4 shrink-0"
                  >
                    {programData.status}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {programData.desc}
                </p>
                
                {/* Key Info Grid */}
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
                      <p className="font-medium">{formatCurrency(programData.budget)}</p>
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
                
                <Button onClick={handleDownload} className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Download Proposal PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Ringkasan', icon: FileText },
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'budget', label: 'Anggaran', icon: DollarSign },
                { id: 'support', label: 'Dukungan', icon: CheckCircle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Latar Belakang */}
                {programData?.summary?.[0]?.background && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Latar Belakang
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {programData.summary[0].background}
                    </p>
                  </div>
                )}

                {/* Tujuan Program */}
                {programData?.summary?.[0]?.objectives?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Tujuan Program
                    </h3>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                      {programData.summary[0].objectives.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-6">Timeline Kegiatan</h3>
                {programData.timeline && programData.timeline.length > 0 ? (
                  programData.timeline.map((timelineItem, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {timelineItem.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {formatDate(timelineItem.date)}
                            </Badge>
                          </div>
                          {timelineItem.activities && timelineItem.activities.length > 0 && (
                            <ul className="space-y-1">
                              {timelineItem.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="text-gray-600 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {index < programData.timeline.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Timeline belum tersedia</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Rincian Anggaran</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Anggaran</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(programData.budget)}
                    </p>
                  </div>
                </div>
                
                {programData.budgetBreakdown && programData.budgetBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {programData.budgetBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item.item}</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Rincian anggaran belum tersedia</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Dukungan yang Diharapkan</h3>
                {programData.supportExpected && programData.supportExpected.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {programData.supportExpected.map((support, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{support}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Informasi dukungan belum tersedia</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </DefaultLayout>
  );
};

export default Slug;