import React, { useState } from 'react';

import { 
  ArrowUpRight, 
  Calendar, 
  CheckCircle, 
  FileDown, 
  Tag, 
  User 
} from 'lucide-react';

import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ProgramCard = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/program/pemda.pdf";
    link.download = "proposal-pemda.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <article className="relative flex max-w-xl flex-col items-start justify-between overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <figure className="w-full h-64 rounded-t-xl overflow-hidden relative">
        {!imageLoaded && (
          <div className="absolute inset-0">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <img
          src={item.image}
          alt={item.title}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </figure>

      <div className="w-full flex flex-col pt-6 px-4 pb-4">
        <header className="min-h-[100px]">
          <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.desc}</p>
        </header>

        <ul className="text-sm text-gray-600 mt-3 space-y-2">
          <li className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span>Diajukan :</span>
            <p>{formatDate(item.createdAt)}</p>
          </li>
          <li className="flex items-center gap-2">
            <Tag size={16} className="text-gray-500" />
            <span>Kategori :</span>
            <p>{item.category}</p>
          </li>
          <li className="flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            <span>Pengusul :</span>
            <p>{item.proposer}</p>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-gray-500" />
            <span>Status :</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              item.status === 'Disetujui'
                ? 'bg-green-100 text-green-700'
                : item.status === 'Menunggu Persetujuan'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
              }`}
            >
              {item.status}
            </span>
          </li>
        </ul>

        <footer className="mt-6 flex items-center justify-between text-sm text-gray-700">
          <Button variant="outline" asChild>
            <a href={"/program/1"}>
            Lihat Detail
            <ArrowUpRight />
            </a>
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            Download PDF
            <FileDown />
          </Button>
        </footer>
      </div>
    </article>
  );
};

export default ProgramCard;