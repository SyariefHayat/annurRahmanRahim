import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import Navbar from '../landing/Navbar';

const Slug = () => {
  // Sample data berdasarkan dokumen proposal pemda
  const proposalData = {
    id: 1,
    title: "Pengembangan Kawasan Jagung Modern dengan Industri Hilir Etanol dan DDGS",
    desc: "Program pengembangan kawasan pertanian jagung modern seluas 100 hektare yang terintegrasi dengan industri pengolahan etanol dan DDGS di Kabupaten Bogor, Jawa Barat",
    proposer: "Hj. Afiah Rospiatun, SP, SPd.I, MPdI",
    date: "2024-12-15",
    location: "Kabupaten Bogor, Jawa Barat",
    category: "Pertanian & Energi",
    status: "Menunggu Persetujuan",
    budget: "138.000.000",
    duration: "5 Tahun",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  };

  const [activeTab, setActiveTab] = useState('overview');

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/program/pemda.pdf";
    link.download = "proposal-pemda.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const yearlyPlan = [
    {
      year: 1,
      title: "Fokus Legalitas & Relasi",
      activities: [
        "Konsultasi Perizinan AMDAL/UKL-UPL",
        "Penyusunan Dokumen Teknis & Izin Lingkungan",
        "Koordinasi Lintas Instansi dan Sosialisasi"
      ]
    },
    {
      year: 2,
      title: "Pemetaan Wilayah & Kelembagaan",
      activities: [
        "Pengurusan Izin Usaha & Lahan",
        "Fasilitasi Penetapan Lokasi (penyusunan RT/RW)",
        "Dukungan legal kelembagaan"
      ]
    },
    {
      year: 3,
      title: "Fase Pembangunan & Penguatan Tim",
      activities: [
        "Operasional Tim Implementasi",
        "Pengadaan & Pembangunan Infrastruktur Dasar",
        "Pelatihan SDM lokal"
      ]
    },
    {
      year: 4,
      title: "Transisi Pembangunan ke Produksi",
      activities: [
        "Mulai Operasi Produksi Etanol & DDGS skala uji coba",
        "Monitoring & Evaluasi Produksi Awal",
        "Penyesuaian Izin Operasional"
      ]
    },
    {
      year: 5,
      title: "Optimalisasi Produksi & Pelaporan",
      activities: [
        "Produksi Komersial Penuh",
        "Distribusi Produk Etanol & DDGS",
        "Pelaporan Dampak Sosial-Ekonomi kepada Pemda"
      ]
    }
  ];

  const supportExpected = [
    "Fasilitasi penerbitan izin lokasi dan usaha",
    "Pendampingan AMDAL/UKL-UPL",
    "Rekomendasi peraturan daerah yang mendukung investasi hijau",
    "Penyediaan akses informasi lahan dan tata ruang",
    "Pembinaan kepada petani dan pelaku UMKM di sekitar kawasan"
  ];

  const budgetBreakdown = [
    { item: "Perizinan Hulu (NIB, SPPL, UKL-UPL & Amdal)", amount: 40000000 },
    { item: "Perizinan Hilir (OSS, IUI, PIRT, BPJPH, BPOM & SNI)", amount: 20000000 },
    { item: "Biaya Tambahan (Sertifikasi, izin lokasi)", amount: 25000000 },
    { item: "Mobilisasi Tim Satgas (4 Bulan)", amount: 32000000 },
    { item: "Driver Satgas (4 Bulan)", amount: 12000000 },
    { item: "Bensin Tim Satgas (4 Bulan)", amount: 6000000 },
    { item: "Sosialisasi & Survei", amount: 1500000 },
    { item: "Operasional Lainnya", amount: 1500000 }
  ];

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
                  src={proposalData.image}
                  alt={proposalData.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* Main Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {proposalData.title}
                  </h1>
                  <Badge 
                    variant={proposalData.status === 'Disetujui' ? 'default' : 'secondary'}
                    className="ml-4 shrink-0"
                  >
                    {proposalData.status}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {proposalData.desc}
                </p>
                
                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Pengusul</span>
                      <p className="font-medium">{proposalData.proposer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <span className="text-sm text-gray-500">Tanggal Pengajuan</span>
                      <p className="font-medium">{formatDate(proposalData.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <span className="text-sm text-gray-500">Lokasi</span>
                      <p className="font-medium">{proposalData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-sm text-gray-500">Durasi</span>
                      <p className="font-medium">{proposalData.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <div>
                      <span className="text-sm text-gray-500">Total Anggaran</span>
                      <p className="font-medium">{formatCurrency(proposalData.budget)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="text-sm text-gray-500">Kategori</span>
                      <p className="font-medium">{proposalData.category}</p>
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
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Latar Belakang
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Pemerintah Indonesia terus mendorong transformasi sektor pertanian untuk menjadi lebih produktif, 
                    mandiri, dan berkelanjutan. Program ini dirancang untuk mengembangkan kawasan pertanian jagung 
                    modern di Kabupaten Bogor seluas 100 hektare dengan pendekatan teknologi pertanian presisi, 
                    dilengkapi fasilitas pengolahan pascapanen dan industri hilirisasi yang menghasilkan etanol dan DDGS.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Tujuan Program
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Memohon fasilitasi dan kemudahan proses perizinan usaha, AMDAL/UKL-UPL</li>
                    <li>• Menjalin kerjasama dengan Pemda dalam pengawasan dan pembinaan kawasan</li>
                    <li>• Mendorong integrasi kebijakan daerah yang mendukung hilirisasi pertanian</li>
                    <li>• Memohon dukungan teknis dari instansi terkait</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-6">Rencana Kegiatan 5 Tahun</h3>
                {yearlyPlan.map((plan, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{plan.year}</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Tahun {plan.year}: {plan.title}
                        </h4>
                        <ul className="space-y-1">
                          {plan.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="text-gray-600 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {index < yearlyPlan.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Rincian Anggaran</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Anggaran</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(138000000)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {budgetBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{item.item}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Dukungan yang Diharapkan dari PEMDA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportExpected.map((support, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{support}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Slug;