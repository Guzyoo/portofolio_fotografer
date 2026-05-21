import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Album, Photo } from '../types';
import { LayoutGrid, Calendar, Eye, ZoomIn } from 'lucide-react';

interface MasonryGridViewProps {
  album: Album;
  themeColor: string;
}

export default function MasonryGridView({ album, themeColor }: MasonryGridViewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const photos = album.photos;

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#121212] rounded-xl border border-[#222] min-h-[300px]">
        <LayoutGrid className="w-8 h-8 text-neutral-600 mb-2" />
        <p className="text-sm font-mono text-[#555] italic">Tidak ada foto di album ini.</p>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-2 bg-[#0A0A0A] rounded-xl border border-[#222]">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6 px-2">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" style={{ color: themeColor }} />
          <span className="text-xs uppercase tracking-widest text-[#888] font-mono">Mode Grid Masonry Modern</span>
        </div>
        <div className="text-xs font-mono text-[#666]">
          {photos.length} Total Frame Foto
        </div>
      </div>

      {/* Masonry Core Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="break-inside-avoid relative bg-[#141414] border border-[#222] rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:border-[#444] transition-all"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Image Box */}
            <div className="relative overflow-hidden w-full">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              
              {/* Blur/Black overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                {/* Details */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <p className="text-xs sm:text-sm text-white font-medium leading-normal">
                    {photo.caption}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[10px] text-[#C5A059] flex items-center gap-1 font-mono" style={{ color: themeColor }}>
                      <Calendar className="w-3 h-3" />
                      {photo.date}
                    </span>
                    <span className="text-[10px] text-white/50 flex items-center gap-1 font-mono">
                      <ZoomIn className="w-3 h-3" /> PERBESAR
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 text-white text-3xl font-light hover:text-white/60 cursor-pointer"
              onClick={() => setSelectedPhoto(null)}
            >
              &times;
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl max-h-[75vh] min-h-[300px] overflow-hidden rounded-lg bg-[#111] border border-[#333] relative ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="mt-4 text-center max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-medium text-white">{selectedPhoto.caption}</p>
              <p className="text-xs text-[#666] font-mono mt-1">Gaya Sesi Foto • Dibuat pada {selectedPhoto.date}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
