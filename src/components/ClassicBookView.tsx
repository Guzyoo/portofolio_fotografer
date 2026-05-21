import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Album, Photo } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Info } from 'lucide-react';

interface ClassicBookViewProps {
  album: Album;
  themeColor: string;
}

export default function ClassicBookView({ album, themeColor }: ClassicBookViewProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0 corresponds to spread 0 (pages 1 & 2), 1 to spread 1 (pages 3 & 4), etc.
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const photos = album.photos;
  const totalPhotos = photos.length;
  
  // Total spreads = Cover Spread (1) + (totalPhotos / 2, rounded up)
  const totalSpreads = 1 + Math.ceil(totalPhotos / 2);

  const nextPage = () => {
    if (currentPage < totalSpreads - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-[#0A0A0A] rounded-xl border border-[#222]">
      {/* Visual Header */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-4 px-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: themeColor }} />
          <span className="text-xs uppercase tracking-widest text-[#888] font-mono">Mode Buku Album Digital</span>
        </div>
        <div className="text-xs font-mono text-[#666]">
          Halaman {currentPage * 2 + 1} - {Math.min((currentPage * 2) + 2, totalPhotos + 2)} dari {totalPhotos + 2}
        </div>
      </div>

      {/* Book Frame */}
      <div className="relative w-full max-w-4xl min-h-[580px] md:min-h-0 md:h-[480px] bg-[#141414] rounded-2xl p-3 sm:p-6 shadow-2xl border border-[#2B2B2B] flex flex-col justify-center">
        {/* Book Spine (Perfect 3D spine divider in the center) */}
        <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 w-4 sm:w-6 -ml-2 sm:-ml-3 bg-gradient-to-r from-[#0C0C0C] via-[#1F1F1F] to-[#0C0C0C] opacity-90 z-20 shadow-inner flex flex-col justify-between py-8">
          <div className="w-full h-1 bg-black/40"></div>
          <div className="w-full h-1 bg-black/40"></div>
          <div className="w-full h-1 bg-black/40"></div>
        </div>

        {/* Spread Containers */}
        <div className="relative flex-1 w-full flex overflow-y-auto md:overflow-hidden rounded-lg bg-[#111] border border-[#222]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row w-full min-h-full"
            >
              {/* LEFT PAGE */}
              <div className="w-full md:w-1/2 min-h-[280px] md:h-full bg-[#161616] border-b md:border-b-0 md:border-r border-black/30 p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                {currentPage === 0 ? (
                  /* SPREAD 0 LEFT - Book Cover */
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                    <motion.div 
                      className="w-24 h-24 mb-6 rounded-lg overflow-hidden border border-[#333] shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img 
                        src={album.coverUrl} 
                        alt="cover" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 font-mono mb-2" style={{ color: themeColor, borderColor: `${themeColor}22`, backgroundColor: `${themeColor}11` }}>
                      {album.category}
                    </span>
                    <h3 className="text-base sm:text-2xl font-serif text-white font-medium tracking-tight mt-1">{album.name}</h3>
                    <div className="w-12 h-[1px] bg-[#C5A059] my-4" style={{ backgroundColor: themeColor }} />
                    <p className="text-[11px] sm:text-xs text-[#888] font-light italic max-w-xs transition-colors line-clamp-3">
                      {album.description}
                    </p>
                  </div>
                ) : (
                  /* OTHER SPREADS - LEFT PAGE (An even-index photo) */
                  (() => {
                    const photoIdx = (currentPage - 1) * 2;
                    const photo = photos[photoIdx];
                    if (!photo) {
                      return (
                        <div className="flex-1 flex items-center justify-center text-[#444] text-[11px] font-mono italic">
                          Akhir dari Album
                        </div>
                      );
                    }
                    return (
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div 
                          className="flex-1 rounded-md border border-[#2B2B2B] bg-[#1F1F1F] overflow-hidden relative group cursor-pointer shadow-md"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-[10px] text-white font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {photo.date}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-[11px] sm:text-xs text-white/90 line-clamp-2 font-light leading-relaxed">
                            {photo.caption}
                          </p>
                          <span className="text-[10px] font-mono text-[#555] mt-1 block">Foto {photoIdx + 1} dari {totalPhotos}</span>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Left Page Edge Overlay for 3D effect */}
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/30 to-transparent pointer-events-none"></div>
              </div>

              {/* RIGHT PAGE */}
              <div className="w-full md:w-1/2 min-h-[280px] md:h-full bg-[#161616] p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                {currentPage === 0 ? (
                  /* SPREAD 0 RIGHT - Dedication / Photographer Intro */
                  <div className="flex-1 flex flex-col justify-between h-full p-2">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-2" style={{ color: themeColor }}>
                        Tentang Album
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#aaa] leading-relaxed font-light">
                        Diproduksi dengan keahlian artistik yang mendalam, menangkap momen autentik yang kaya akan cerita dan emosi. Kami mengundang Anda membalik halaman buku ini untuk menjelajahi keindahan visual yang telah kami abadikan.
                      </p>
                    </div>

                    <div className="bg-[#1D1D1D] rounded-lg p-3 border border-[#2A2A2A] mt-4">
                      <h5 className="text-[10px] font-mono text-white/60 flex items-center gap-1.5 mb-1">
                        <Info className="w-3 h-3" /> Petunjuk Navigasi
                      </h5>
                      <p className="text-[9px] text-[#777] leading-tight">
                        Gunakan tombol panah di kanan-kiri album untuk membalik halaman atau klik foto mana saja untuk memperbesarnya.
                      </p>
                    </div>

                    <div className="text-[10px] text-[#444] font-mono text-right mt-auto">
                      Photofolio Pro © 2026
                    </div>
                  </div>
                ) : (
                  /* OTHER SPREADS - RIGHT PAGE (An odd-index photo) */
                  (() => {
                    const photoIdx = (currentPage - 1) * 2 + 1;
                    const photo = photos[photoIdx];
                    if (!photo) {
                      return (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-14 h-14 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-[#555] mb-2 font-mono">
                            ✓
                          </div>
                          <h4 className="text-xs text-[#888] font-mono">Akhir dari Buku Foto</h4>
                          <p className="text-[9px] text-[#555] max-w-[140px] mt-1 leading-tight">
                            Terima kasih telah melihat. Pesan sesi Anda sekarang di panel kontak!
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div 
                          className="flex-1 rounded-md border border-[#2B2B2B] bg-[#1F1F1F] overflow-hidden relative group cursor-pointer shadow-md"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-[10px] text-white font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {photo.date}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-[11px] sm:text-xs text-white/90 line-clamp-2 font-light leading-relaxed">
                            {photo.caption}
                          </p>
                          <span className="text-[10px] font-mono text-[#555] mt-1 block">Foto {photoIdx + 1} dari {totalPhotos}</span>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Right Page Edge Overlay for 3D effect */}
                <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/30 to-transparent pointer-events-none"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pages Navigation Buttons */}
      <div className="flex items-center gap-6 mt-5 z-10">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-white/80 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs text-[#888] font-mono">
          Spand {currentPage + 1} / {totalSpreads}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalSpreads - 1}
          className="p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-white/80 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Halaman Selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* LIGHTBOX PHOTO MODAL */}
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
              <div className="flex justify-center items-center gap-4 mt-2">
                <span className="text-xs text-[#666] font-mono">Tanggal Sesi: {selectedPhoto.date}</span>
                <span className="text-neutral-700 font-mono">|</span>
                <span className="text-xs text-white/40 font-mono">Resolusi Tinggi</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
