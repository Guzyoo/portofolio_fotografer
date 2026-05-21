import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Photographer, Booking, Album } from '../types';
import ClassicBookView from './ClassicBookView';
import InteractiveCardsView from './InteractiveCardsView';
import MasonryGridView from './MasonryGridView';
import AestheticDatePicker from './AestheticDatePicker';
import { 
  Instagram, Mail, Calendar, MessageCircle, Send, CheckCircle2, 
  MapPin, Clock, Award, Star, BookOpen, Layers, LayoutGrid, Sparkles,
  ChevronDown, Folder, Sun, Moon
} from 'lucide-react';

interface ClientViewProps {
  photographer: Photographer;
  onSubmitBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  themeMode?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export default function ClientView({ photographer, onSubmitBooking, themeMode = 'dark', toggleTheme }: ClientViewProps) {
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(
    photographer.albums.length > 0 ? photographer.albums[0].id : null
  );

  // Forms states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding / Engagement');
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fallbacks
  const themeColor = photographer.themeColor || '#C5A059';
  const selectedAlbum = photographer.albums.find(a => a.id === activeAlbumId) || photographer.albums[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) return;

    onSubmitBooking({
      clientName,
      email: clientEmail,
      phone: clientPhone,
      eventType,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      message: message || 'Tertarik untuk menyewa jasa foto Anda.'
    });

    setIsSubmitted(true);
    
    // Clear forms
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setMessage('');
  };

  const handleCreateWhatsAppLink = () => {
    const text = `Halo Kak ${photographer.name}, saya bercakap-cakap melalui website portfolio Anda dan tertarik untuk booking sesi foto Anda!`;
    return `https://wa.me/${photographer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${
      themeMode === 'light' 
        ? 'bg-[#F4F4F7] text-neutral-800' 
        : 'bg-[#0A0A0A] text-[#E0E0E0]'
    }`}>
      {/* CUSTOM PHOTOGRAPHER SPONSORED CLIENT HEADER */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md h-16 flex items-center justify-between px-4 sm:px-8 shadow-md transition-colors ${
        themeMode === 'light'
          ? 'bg-white/95 border-b border-neutral-200'
          : 'bg-[#0A0A0A]/90 border-b border-[#1A1A1A]'
      }`}>
        <div id="photographer-logo-identity" className="flex items-center gap-3">
          {photographer.logoUrl ? (
            <img 
              src={photographer.logoUrl} 
              alt={photographer.name} 
              className="max-h-9 max-w-[180px] object-contain transition-transform hover:scale-[1.02]" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-extrabold text-xs tracking-tighter"
                style={{ backgroundColor: themeColor }}
              >
                {photographer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <span className={`text-xs sm:text-sm font-bold tracking-wide font-serif uppercase truncate max-w-[120px] sm:max-w-[200px] transition-colors ${
                themeMode === 'light' ? 'text-neutral-800' : 'text-white'
              }`}>
                {photographer.name}
              </span>
            </div>
          )}
        </div>

        {/* Quick Menu Actions */}
        <div className="flex items-center gap-2.5">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
                themeMode === 'light'
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-350 text-neutral-800 shadow-sm'
                  : 'bg-[#121212] hover:bg-[#1E1E1E] border-neutral-800 text-neutral-300'
              }`}
              title={themeMode === 'light' ? 'Aktifkan Dark Mode' : 'Aktifkan Light Mode'}
              aria-label="Toggle Theme"
            >
              {themeMode === 'light' ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              )}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest mr-1">
            <span>Portfolio</span>
            <span className="text-neutral-700">•</span>
            <span style={{ color: themeColor }}>Verified</span>
          </div>

          <button
            onClick={() => {
              window.document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 cursor-pointer select-none ${
              themeMode === 'light' ? 'shadow-sm' : ''
            }`}
            style={{
              borderColor: themeColor,
              backgroundColor: `${themeColor}12`,
              color: themeMode === 'light' ? '#262626' : '#FFFFFF'
            }}
          >
            Undang Booking
          </button>
        </div>
      </nav>

      {/* 1. HERO BRANDING & BIO SUMMARY */}
      <section className={`relative py-12 md:py-20 border-b overflow-hidden transition-colors duration-300 ${
        themeMode === 'light' ? 'border-neutral-200 bg-white' : 'border-[#1F1F1F] bg-[#0E0E0E]'
      }`}>
        {/* Abstract background blobs using theme color opacity */}
        <div 
          className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-10" 
          style={{ backgroundColor: themeColor }}
        />
        <div 
          className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-5" 
          style={{ backgroundColor: themeColor }}
        />

        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
          {/* Avatar and branding shield */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 shadow-2xl"
              style={{ borderColor: themeColor }}
            >
              <img 
                src={photographer.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'} 
                alt="Photographer" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span 
              className={`absolute bottom-0 right-1 px-3 py-1 border text-[8px] sm:text-[10px] font-bold rounded-full font-mono uppercase shadow-md flex items-center gap-1 transition-colors duration-300 ${
                themeMode === 'light' ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-[#121212] border-[#2B2B2B]'
              }`}
              style={{ color: themeColor }}
            >
              <Sparkles className="w-3 h-3" /> PRO
            </span>
          </motion.div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className={`text-3xl md:text-4xl font-serif tracking-tight font-medium transition-colors duration-300 ${
                themeMode === 'light' ? 'text-neutral-900 font-semibold' : 'text-white'
              }`}>
                {photographer.name}
              </h1>
              <p className={`text-sm font-mono tracking-wider flex items-center justify-center md:justify-start gap-2 transition-colors duration-300 ${
                themeMode === 'light' ? 'text-neutral-500' : 'text-[#888]'
              }`}>
                <span>@{photographer.username}</span>
                <span className={themeMode === 'light' ? 'text-neutral-350' : 'text-[#333]'}>•</span>
                <span style={{ color: themeColor }}>PHOTOGRAPHER PORTOFOLIO</span>
              </p>
            </div>

            <p className={`text-xs sm:text-sm max-w-2xl font-light leading-relaxed transition-colors duration-300 ${
              themeMode === 'light' ? 'text-neutral-700' : 'text-[#aaa]'
            }`}>
              {photographer.bio}
            </p>

            {/* Direct WhatsApp Call to Ask Question First */}
            <div className="flex justify-center md:justify-start pt-1.5">
              <a 
                href={handleCreateWhatsAppLink()} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" /> Tanya via WhatsApp dahulu
              </a>
            </div>

            {/* Specialty tag pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              {photographer.specialtyTags.map((tag) => (
                <span 
                  key={tag} 
                  className={`text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded tracking-tight transition-colors duration-300 ${
                    themeMode === 'light' 
                      ? 'bg-neutral-100 border border-neutral-300 text-neutral-600 font-medium' 
                      : 'bg-neutral-900 border border-[#262626] text-[#bbb]'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick social shortcuts */}
            <div className={`flex items-center justify-center md:justify-start gap-4 pt-1.5 transition-colors duration-300 ${
              themeMode === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400'
            }`}>
              <a 
                href={`https://instagram.com/${photographer.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className={`transition-colors flex items-center gap-1.5 text-xs font-mono ${
                  themeMode === 'light' ? 'hover:text-neutral-900' : 'hover:text-white'
                }`}
              >
                <Instagram className="w-4 h-4" /> Instagram 
              </a>
              <span className={themeMode === 'light' ? 'text-neutral-300' : 'text-[#333]'}>|</span>
              <a 
                href={`mailto:${photographer.email}`}
                className={`transition-colors flex items-center gap-1.5 text-xs font-mono ${
                  themeMode === 'light' ? 'hover:text-neutral-900' : 'hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" /> {photographer.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY COLLECTION EXPLORER */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className={`flex flex-col sm:flex-row justify-between sm:items-end gap-3 border-b pb-5 transition-colors duration-300 ${
          themeMode === 'light' ? 'border-neutral-200' : 'border-[#1D1D1D]'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: themeColor }}>
              Poin Karya Kurasi
            </span>
            <h2 className={`text-2xl sm:text-3xl font-serif font-medium transition-colors duration-300 ${
              themeMode === 'light' ? 'text-neutral-900 font-semibold' : 'text-white'
            }`}>Buku Album & Karya Portofolio</h2>
          </div>

          {/* Selector view label indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono transition-colors duration-300 ${
            themeMode === 'light' ? 'bg-neutral-100 border-neutral-300 text-neutral-650' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <span className={themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-500'}>Format Visual:</span>
            <span className={`flex items-center gap-1 font-semibold ${themeMode === 'light' ? 'text-neutral-900' : 'text-white'}`}>
              {photographer.layoutStyle === 'Classic Album' && <><BookOpen className="w-3.5 h-3.5" style={{ color: themeColor }} /> Buku Album Digital</>}
              {photographer.layoutStyle === 'Interactive Cards' && <><Layers className="w-3.5 h-3.5" style={{ color: themeColor }} /> Slider Kartu Cetak</>}
              {photographer.layoutStyle === 'Masonry Grid' && <><LayoutGrid className="w-3.5 h-3.5" style={{ color: themeColor }} /> Grid Modern</>}
            </span>
          </div>
        </div>

        {photographer.albums.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border transition-colors ${
            themeMode === 'light' ? 'bg-neutral-100/50 border-neutral-200 text-neutral-500' : 'bg-neutral-900/30 border-neutral-800'
          }`}>
            <p className="text-sm font-mono italic">Fotografer sedang merapikan lemari portofolionya. Segera kembali!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Album Selector Dropdown for Mobile Only */}
            <div className="block sm:hidden space-y-2">
              <label className={`text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 justify-between transition-colors ${
                themeMode === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400'
              }`}>
                <span className="flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5" style={{ color: themeColor }} /> Pilih Galeri Katalog
                </span>
                <span className={themeMode === 'light' ? 'text-neutral-400' : 'text-neutral-500'}>({photographer.albums.length} Kategori)</span>
              </label>
              <div className="relative">
                <select
                  value={activeAlbumId || ''}
                  onChange={(e) => setActiveAlbumId(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-serif outline-none focus:border-[#C5A059] transition-all appearance-none cursor-pointer pr-10 ${
                    themeMode === 'light' ? 'bg-white border border-neutral-300 text-neutral-800' : 'bg-[#161616] border border-[#2B2B2B] text-white'
                  }`}
                >
                  {photographer.albums.map((album) => (
                    <option key={album.id} value={album.id} className={themeMode === 'light' ? 'bg-white text-neutral-800' : 'bg-[#121212] text-white'}>
                      [{album.category}] {album.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-neutral-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Horizontal album category tabs - Desktop & Tablet Only */}
            <div className={`hidden sm:flex gap-2 overflow-x-auto pb-2 border-b transition-colors duration-300 ${
              themeMode === 'light' ? 'border-neutral-200' : 'border-[#1A1A1A]'
            }`}>
              {photographer.albums.map((album) => {
                const isActive = album.id === activeAlbumId;
                return (
                  <button
                    key={album.id}
                    onClick={() => setActiveAlbumId(album.id)}
                    className={`py-2 px-4 text-xs font-mono rounded-t-lg transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? (themeMode === 'light' ? 'text-neutral-900 border-b-2 font-semibold' : 'text-white border-b-2 font-semibold') 
                        : (themeMode === 'light' ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300')
                    }`}
                    style={{ 
                      borderColor: isActive ? themeColor : 'transparent',
                    }}
                  >
                    <span 
                      className="text-[9px] px-1.5 py-0.5 rounded mr-1.5 text-[8px] font-bold uppercase transition-colors"
                      style={{ 
                        backgroundColor: isActive ? `${themeColor}22` : (themeMode === 'light' ? '#EBECEF' : '#1A1A1A'), 
                        color: isActive ? themeColor : (themeMode === 'light' ? '#666' : '#777')
                      }}
                    >
                      {album.category}
                    </span>
                    {album.name}
                  </button>
                );
              })}
            </div>

            {/* ACTIVE ALBUM DETAIL SUMMARY */}
            {selectedAlbum && (
              <div className={`border rounded-xl p-5 flex flex-col md:flex-row justify-between gap-6 transition-colors duration-300 ${
                themeMode === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#111] border-[#1D1D1D]'
              }`}>
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500">Mengenai Koleksi Aktif</span>
                  <h3 className={`text-lg font-serif italic font-medium transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-950 font-semibold' : 'text-white'
                  }`}>{selectedAlbum.name}</h3>
                  <p className={`text-xs sm:text-sm font-light leading-relaxed transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                  }`}>
                    {selectedAlbum.description}
                  </p>
                </div>
                
                <div className={`shrink-0 flex md:flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6 gap-3 min-w-[140px] transition-colors duration-300 ${
                  themeMode === 'light' ? 'border-neutral-250' : 'border-neutral-800'
                }`}>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono block">Daftar Foto Kurasi:</span>
                    <span className={`text-lg font-serif font-semibold transition-colors duration-300 ${
                      themeMode === 'light' ? 'text-neutral-900' : 'text-white'
                    }`}>{selectedAlbum.photos.length} Frame</span>
                  </div>
                  <div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 block" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                      Katalog {selectedAlbum.category}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* THE DYNAMIC INTERACTIVE VISUALIZER */}
            {selectedAlbum && (
              <div className="pt-4 animate-fadeIn">
                {photographer.layoutStyle === 'Classic Album' && (
                  <ClassicBookView album={selectedAlbum} themeColor={themeColor} themeMode={themeMode} />
                )}
                {photographer.layoutStyle === 'Interactive Cards' && (
                  <div key={selectedAlbum.id}>
                    <InteractiveCardsView album={selectedAlbum} themeColor={themeColor} themeMode={themeMode} />
                  </div>
                )}
                {photographer.layoutStyle === 'Masonry Grid' && (
                  <MasonryGridView album={selectedAlbum} themeColor={themeColor} themeMode={themeMode} />
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. TRUST & BOOKING INQUIRY FORMS */}
      <section id="booking-section" className={`border-t py-16 md:py-24 transition-colors duration-300 ${
        themeMode === 'light'
          ? 'bg-gradient-to-b from-neutral-50 to-neutral-100 border-neutral-250 text-neutral-800'
          : 'bg-gradient-to-b from-[#0C0C0C] to-[#050505] border-[#1D1D1D] text-white'
      }`}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          
          {/* Photographer's guarantee & FAQ */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                Tanya Jawab & Layanan
              </span>
              <h3 className={`text-2xl font-serif font-medium transition-colors duration-300 ${
                themeMode === 'light' ? 'text-neutral-900 font-semibold' : 'text-white'
              }`}>Bermitra mengabadikan kisah indah</h3>
            </div>

            <p className={`text-xs sm:text-sm font-light leading-relaxed transition-colors duration-300 ${
              themeMode === 'light' ? 'text-neutral-655' : 'text-neutral-400'
            }`}>
              Setiap momen berharga terjadi sekali seumur hidup. Kami bekerja dengan dedikasi penuh di setiap event, mempersiapkan peralatan mutakhir, dan memoles setiap frame dengan tone warna eksklusif yang memancarkan emosi mendalam.
            </p>

            {/* Quick mini testimonials / features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded shrink-0 transition-colors duration-300 ${
                  themeMode === 'light' ? 'bg-white border border-neutral-200 text-[#C5A059]' : 'bg-neutral-900 border border-neutral-800 text-[#C5A059]'
                }`} style={{ color: themeColor }}>
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-semibold transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-900 font-bold' : 'text-white'
                  }`}>Tone Warna Eksklusif</h4>
                  <p className={`text-[10px] mt-0.5 leading-normal transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-550' : 'text-neutral-500'
                  }`}>Penyelarasan mood warna sinematik khusus di setiap file mentah.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded shrink-0 transition-colors duration-300 ${
                  themeMode === 'light' ? 'bg-white border border-neutral-200 text-[#C5A059]' : 'bg-neutral-900 border border-neutral-800 text-[#C5A059]'
                }`} style={{ color: themeColor }}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-semibold transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-900 font-bold' : 'text-white'
                  }`}>Waktu Pengiriman Cepat</h4>
                  <p className={`text-[10px] mt-0.5 leading-normal transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-550' : 'text-neutral-500'
                  }`}>File kurasi dikirimkan digital maksimal 14 hari kerja setelah sesi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded shrink-0 transition-colors duration-300 ${
                  themeMode === 'light' ? 'bg-white border border-neutral-200 text-[#C5A059]' : 'bg-neutral-900 border border-neutral-800 text-[#C5A059]'
                }`} style={{ color: themeColor }}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-semibold transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-900 font-bold' : 'text-white'
                  }`}>Sedia Luar Daerah</h4>
                  <p className={`text-[10px] mt-0.5 leading-normal transition-colors duration-300 ${
                    themeMode === 'light' ? 'text-neutral-550' : 'text-neutral-500'
                  }`}>Perjalanan ke luar kota/daerah dipersiapkan matang secara profesional.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6 relative overflow-visible transition-colors duration-300 ${
            themeMode === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#111] border-[#222]'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: `${themeColor}09` }} />
            
            <div className="space-y-1">
              <h4 className={`text-base font-serif font-medium transition-colors duration-300 ${
                themeMode === 'light' ? 'text-neutral-900 font-semibold' : 'text-white'
              }`}>Kirim Undangan Booking</h4>
              <p className={`text-[11px] transition-colors duration-300 ${
                themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-500'
              }`}>Tanyakan penawaran khusus & diskon paket sesuai ketersediaan jadwal saya.</p>
              
              <div className="pt-2">
                <a 
                  href={handleCreateWhatsAppLink()} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 border font-mono text-[10px] font-bold rounded-xl transition-all ${
                    themeMode === 'light'
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                      : 'bg-emerald-950/20 hover:bg-emerald-900/35 border-emerald-900/40 text-emerald-400'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> Tanya Tanya Dahulu via WhatsApp 💬
                </a>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-5 text-center py-6"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-550">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className={`text-sm font-semibold transition-colors ${themeMode === 'light' ? 'text-neutral-900 font-bold' : 'text-white'}`}>Inkuiri Berhasil Dikirimkan!</h5>
                    <p className={`text-xs max-w-xs mx-auto leading-relaxed transition-colors ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Terima kasih atas kiriman informasi Anda. Kak {photographer.name} akan segera menghubungi Anda langsung ke WhatsApp / Email dalam waktu dekat!
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={handleCreateWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-green-650 hover:bg-green-600 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer font-mono shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp Langsung
                    </a>
                  </div>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[10px] text-neutral-500 hover:text-neutral-750 underline cursor-pointer font-mono"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-500'}`}>Nama Lengkap Pembeli Jasa</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Contoh: Farhan Sanjaya"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:border-[#C5A059] outline-none transition-colors ${
                        themeMode === 'light' 
                          ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                          : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600'
                      }`}
                      style={{ focusBorderColor: themeColor }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-500'}`}>Email</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="farhan@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs focus:border-[#C5A059] outline-none transition-colors ${
                          themeMode === 'light' 
                            ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                            : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-500'}`}>Nomor WhatsApp</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="081234..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs focus:border-[#C5A059] outline-none transition-colors ${
                          themeMode === 'light' 
                            ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                            : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-500'}`}>Pilih Layanan</label>
                      <select 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2.5 text-xs focus:border-[#C5A059] outline-none transition-colors ${
                          themeMode === 'light' 
                            ? 'bg-neutral-50 border border-neutral-300 text-neutral-800 focus:bg-white' 
                            : 'bg-[#181818] border border-[#2B2B2B] text-white'
                        }`}
                      >
                        <option value="Wedding Day Capture">Wedding (Pernikahan)</option>
                        <option value="Prewedding intim / Engagement">Engagement (Prewedding)</option>
                        <option value="Event Wisuda Lengkap">Graduation (Wisuda)</option>
                        <option value="Ulang Tahun & Pesta Privat">Birthday / Sweet 17</option>
                        <option value="Komersial Katalog Produk">Food & Product Photography</option>
                        <option value="Sesi Potret Eksklusif Lainnya">Sesi Custom Lainnya</option>
                      </select>
                    </div>

                    <AestheticDatePicker 
                      selectedDate={eventDate}
                      onChange={setEventDate}
                      themeColor={themeColor}
                      themeMode={themeMode}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-500'}`}>Beri Detail Kebutuhan & Ide Lokasi</label>
                    <textarea 
                      rows={3} 
                      placeholder="Jelaskan kebutuhan jumlah foto, lokasi out/in door, atau durasi sesi pas kegiatan..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:border-[#C5A059] outline-none resize-none transition-colors ${
                        themeMode === 'light' 
                          ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                          : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full pt-3 pb-3 text-xs font-bold font-mono rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-md uppercase cursor-pointer"
                    style={{ backgroundColor: themeColor, color: '#000' }}
                  >
                    Kirim Inkuiri ke Fotografer <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
