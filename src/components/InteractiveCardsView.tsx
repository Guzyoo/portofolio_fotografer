import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Album, Photo } from '../types';
import { ChevronLeft, ChevronRight, Layers, Calendar, ZoomIn } from 'lucide-react';

interface InteractiveCardsViewProps {
  album: Album;
  themeColor: string;
}

export default function InteractiveCardsView({ album, themeColor }: InteractiveCardsViewProps) {
  const [cards, setCards] = useState<Photo[]>(album.photos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Track swipe animation states for manual buttons
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = album.photos.length;

  const nextCard = () => {
    if (cards.length <= 1 || animatingId) return;

    // Slide current front card left
    setAnimatingId(cards[0].id);
    setSlideDirection('left');

    setTimeout(() => {
      setCards((prev) => {
        const updated = [...prev.slice(1), prev[0]];
        return updated;
      });
      setCurrentIndex((prev) => (prev + 1) % total);
      setAnimatingId(null);
      setSlideDirection(null);
    }, 250); // Keep in sync with spring/tween speed
  };

  const prevCard = () => {
    if (cards.length <= 1 || animatingId) return;

    // Target the last card (at the very bottom of the stack)
    const lastCard = cards[cards.length - 1];
    
    // We want the incoming card to start offset from the left (-320) and layer on top
    setAnimatingId(lastCard.id);
    setSlideDirection('right');

    setCards((prev) => {
      const last = prev[prev.length - 1];
      return [last, ...prev.slice(0, prev.length - 1)];
    });
    setCurrentIndex((prev) => (prev - 1 + total) % total);

    // Let the spring animate it smoothly to index 0 (x: 0, scale: 1)
    setTimeout(() => {
      setAnimatingId(null);
      setSlideDirection(null);
    }, 50);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (cards.length <= 1 || animatingId) return;
    const swipeThreshold = 80;

    if (info.offset.x < -swipeThreshold) {
      // Swiped Left -> Move card to the very back of the pile
      setCards((prev) => {
        const updated = [...prev.slice(1), prev[0]];
        return updated;
      });
      setCurrentIndex((prev) => (prev + 1) % total);
    } else if (info.offset.x > swipeThreshold) {
      // Swiped Right -> Pull card from back of pile to top
      setCards((prev) => {
        const last = prev[prev.length - 1];
        return [last, ...prev.slice(0, prev.length - 1)];
      });
      setCurrentIndex((prev) => (prev - 1 + total) % total);
    }
  };

  if (total === 0) {
    return (
      <div id="cards-empty-state" className="flex flex-col items-center justify-center p-8 bg-[#121212] rounded-xl border border-[#222] min-h-[300px]">
        <Layers className="w-8 h-8 text-neutral-600 mb-2" />
        <p className="text-sm font-mono text-[#555] italic">Tidak ada foto di album ini.</p>
      </div>
    );
  }

  return (
    <div id="cards-view-root" className="flex flex-col items-center justify-center p-2 sm:p-4 bg-[#0A0A0A] rounded-xl border border-[#222]">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-4 px-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5" style={{ color: themeColor }} />
          <span className="text-xs uppercase tracking-widest text-[#888] font-mono">Mode Kartu Cetak Interaktif</span>
        </div>
        <div className="text-xs font-mono text-[#666]">
          {currentIndex + 1} of {total} Cetakan Foto
        </div>
      </div>

      {/* Card Arena Stack */}
      <div className="relative w-full max-w-sm h-[400px] sm:h-[480px] flex items-center justify-center pt-8 pb-12 overflow-visible">
        <AnimatePresence mode="popLayout">
          {cards.map((photo, index) => {
            const isVisible = index < 3;
            const isFront = index === 0;
            const isAnimating = photo.id === animatingId;

            // Base Stack Styling Specs
            let x = 0;
            let scale = 1 - index * 0.06;
            let y = index * -18;
            let rotate = isFront ? 0 : index % 2 === 0 ? index * 2 : index * -2;
            let opacity = isVisible ? (1 - index * 0.25) : 0;
            let zIndex = 30 - index;

            // Custom animations when button clicks trigger transitions
            if (isAnimating) {
              if (slideDirection === 'left') {
                x = -380;
                rotate = -12;
                opacity = 0;
              } else if (slideDirection === 'right') {
                // Incoming card slides beautifully from the left to top
                x = -320;
                rotate = -8;
                opacity = 0.4;
              }
            }

            return (
              <motion.div
                key={photo.id}
                style={{ 
                  zIndex: zIndex,
                  originX: 0.5,
                  originY: 1.0,
                }}
                animate={{
                  x: x,
                  scale: scale,
                  y: y,
                  rotate: rotate,
                  opacity: opacity,
                }}
                drag={isFront && !isAnimating ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.03, rotate: 1.5 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 24
                }}
                className={`absolute w-full max-w-[280px] sm:max-w-[310px] aspect-[3/4] bg-[#161616] rounded-2xl shadow-2xl overflow-hidden p-3.5 border border-[#333] flex flex-col justify-between touch-none ${
                  isFront && !isAnimating ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                }`}
              >
                {/* Photo frame mimicking physical prints */}
                <div className="relative flex-1 bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#222]">
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {isFront && (
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/90 border border-white/10 rounded-full text-white cursor-pointer transition-colors"
                      title="Perbesar Foto"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Bottom detail area resembling high-end polaroid info label */}
                <div className="pt-3.5 px-1 pb-1">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[11px] sm:text-xs text-white/90 line-clamp-1 font-mono font-medium tracking-tight">
                      {photo.caption || 'Momen Estetik'}
                    </p>
                    <span 
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-mono shrink-0" 
                      style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                    >
                      {isFront ? 'FOKUS' : 'ANTRIAN'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-[#555] font-mono justify-between">
                    <div className="flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded">
                      <Calendar className="w-2.5 h-2.5" />
                      {photo.date}
                    </div>
                    <span>ID: {photo.id.toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-6 mt-2 pb-2">
        <button
          onClick={prevCard}
          disabled={animatingId !== null}
          className="p-2 sm:p-2.5 bg-[#161616] hover:bg-[#252525] disabled:opacity-40 border border-[#2C2C2C] rounded-full text-white/80 transition-all active:scale-95 cursor-pointer"
          title="Koleksi Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs text-[#888] font-mono bg-[#111] px-3 py-1 rounded-full border border-[#222]">
          Koleksi Ke {currentIndex + 1} dari {total}
        </span>

        <button
          onClick={nextCard}
          disabled={animatingId !== null}
          className="p-2 sm:p-2.5 bg-[#161616] hover:bg-[#252525] disabled:opacity-40 border border-[#2C2C2C] rounded-full text-white/80 transition-all active:scale-95 cursor-pointer"
          title="Koleksi Selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* QUICK INSTRUCTION */}
      <p className="text-[10px] text-[#555] mt-4 font-mono text-center mb-1">
        💡 Seret (drag) kartu ke kiri/kanan atau klik tombol untuk mengocok album foto!
      </p>

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
              className="absolute top-6 right-6 text-white text-3xl font-light hover:text-white/60 cursor-pointer animate-pulse"
              onClick={() => setSelectedPhoto(null)}
            >
              &times;
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-4xl max-h-[75vh] min-h-[300px] overflow-hidden rounded-lg bg-[#111] border border-[#333] relative"
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
