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
  ChevronDown, Folder
} from 'lucide-react';

interface ClientViewProps {
  photographer: Photographer;
  onSubmitBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

export default function ClientView({ photographer, onSubmitBooking }: ClientViewProps) {
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
    <div className="flex-1 bg-[#0A0A0A] text-[#E0E0E0] min-h-screen overflow-y-auto">
      {/* 1. HERO BRANDING & BIO SUMMARY */}
      <section className="relative py-12 md:py-20 border-b border-[#1F1F1F] bg-[#0E0E0E] overflow-hidden">
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
              className="absolute bottom-0 right-1 px-3 py-1 bg-[#121212] border border-[#2B2B2B] text-[8px] sm:text-[10px] font-bold rounded-full font-mono uppercase shadow-md flex items-center gap-1"
              style={{ color: themeColor }}
            >
              <Sparkles className="w-3 h-3" /> PRO
            </span>
          </motion.div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-white font-medium">
                {photographer.name}
              </h1>
              <p className="text-sm font-mono tracking-wider text-[#888] flex items-center justify-center md:justify-start gap-2">
                <span>@{photographer.username}</span>
                <span className="text-[#333]">•</span>
                <span style={{ color: themeColor }}>PHOTOGRAPHER PORTOFOLIO</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#aaa] max-w-2xl font-light leading-relaxed">
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
                  className="text-[9px] sm:text-[10px] bg-neutral-900 border border-[#262626] font-mono px-2.5 py-0.5 rounded text-[#bbb] tracking-tight"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick social shortcuts */}
            <div className="flex items-center justify-center md:justify-start gap-4 pt-1.5 text-neutral-400">
              <a 
                href={`https://instagram.com/${photographer.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                <Instagram className="w-4 h-4" /> Instagram 
              </a>
              <span className="text-[#333]">|</span>
              <a 
                href={`mailto:${photographer.email}`}
                className="hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                <Mail className="w-4 h-4" /> {photographer.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY COLLECTION EXPLORER */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 border-b border-[#1D1D1D] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: themeColor }}>
              Poin Karya Kurasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-medium">Buku Album & Karya Portofolio</h2>
          </div>

          {/* Selector view label indicator */}
          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800 text-[10px] font-mono">
            <span className="text-neutral-500">Format Visual:</span>
            <span className="text-white flex items-center gap-1">
              {photographer.layoutStyle === 'Classic Album' && <><BookOpen className="w-3.5 h-3.5" style={{ color: themeColor }} /> Buku Album Digital</>}
              {photographer.layoutStyle === 'Interactive Cards' && <><Layers className="w-3.5 h-3.5" style={{ color: themeColor }} /> Slider Kartu Cetak</>}
              {photographer.layoutStyle === 'Masonry Grid' && <><LayoutGrid className="w-3.5 h-3.5" style={{ color: themeColor }} /> Grid Modern</>}
            </span>
          </div>
        </div>

        {photographer.albums.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-800">
            <p className="text-sm font-mono text-[#555] italic">Fotografer sedang merapikan lemari portofolionya. Segera kembali!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Album Selector Dropdown for Mobile Only */}
            <div className="block sm:hidden space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5" style={{ color: themeColor }} /> Pilih Galeri Katalog
                </span>
                <span className="text-neutral-500">({photographer.albums.length} Kategori)</span>
              </label>
              <div className="relative">
                <select
                  value={activeAlbumId || ''}
                  onChange={(e) => setActiveAlbumId(e.target.value)}
                  className="w-full bg-[#161616] border border-[#2B2B2B] rounded-xl px-4 py-3 text-sm text-white font-serif outline-none focus:border-[#C5A059] transition-all appearance-none cursor-pointer pr-10"
                >
                  {photographer.albums.map((album) => (
                    <option key={album.id} value={album.id} className="bg-[#121212] py-2 text-white">
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
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 border-b border-[#1A1A1A]">
              {photographer.albums.map((album) => {
                const isActive = album.id === activeAlbumId;
                return (
                  <button
                    key={album.id}
                    onClick={() => setActiveAlbumId(album.id)}
                    className={`py-2 px-4 text-xs font-mono rounded-t-lg transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? 'text-white border-b-2 font-semibold' 
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                    style={{ 
                      borderColor: isActive ? themeColor : 'transparent',
                    }}
                  >
                    <span 
                      className="text-[9px] px-1.5 py-0.5 rounded mr-1.5 text-[8px] font-bold uppercase"
                      style={{ 
                        backgroundColor: isActive ? `${themeColor}22` : '#1A1A1A', 
                        color: isActive ? themeColor : '#777' 
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
              <div className="bg-[#111] border border-[#1D1D1D] rounded-xl p-5 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500">Mengenai Koleksi Aktif</span>
                  <h3 className="text-lg font-serif italic text-white font-medium">{selectedAlbum.name}</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {selectedAlbum.description}
                  </p>
                </div>
                
                <div className="shrink-0 flex md:flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-neutral-800 pt-3 md:pt-0 md:pl-6 gap-3 min-w-[140px]">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono block">Daftar Foto Kurasi:</span>
                    <span className="text-lg font-serif font-semibold text-white">{selectedAlbum.photos.length} Frame</span>
                  </div>
                  <div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                      Katalog {selectedAlbum.category}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* THE DYNAMIC INTERACTIVE VISUALIZER */}
            {selectedAlbum && (
              <div className="pt-4">
                {photographer.layoutStyle === 'Classic Album' && (
                  <ClassicBookView album={selectedAlbum} themeColor={themeColor} />
                )}
                {photographer.layoutStyle === 'Interactive Cards' && (
                  <div key={selectedAlbum.id}>
                    <InteractiveCardsView album={selectedAlbum} themeColor={themeColor} />
                  </div>
                )}
                {photographer.layoutStyle === 'Masonry Grid' && (
                  <MasonryGridView album={selectedAlbum} themeColor={themeColor} />
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. TRUST & BOOKING INQUIRY FORMS */}
      <section className="bg-gradient-to-b from-[#0C0C0C] to-[#050505] border-t border-[#1D1D1D] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          
          {/* Photographer's guarantee & FAQ */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                Tanya Jawab & Layanan
              </span>
              <h3 className="text-2xl font-serif text-white font-medium">Bermitra mengabadikan kisah indah</h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Setiap momen berharga terjadi sekali seumur hidup. Kami bekerja dengan dedikasi penuh di setiap event, mempersiapkan peralatan mutakhir, dan memoles setiap frame dengan tone warna eksklusif yang memancarkan emosi mendalam.
            </p>

            {/* Quick mini testimonials / features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#C5A059] shrink-0" style={{ color: themeColor }}>
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Tone Warna Eksklusif</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal">Penyelarasan mood warna sinematik khusus di setiap file mentah.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#C5A059] shrink-0" style={{ color: themeColor }}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Waktu Pengiriman Cepat</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal">File kurasi dikirimkan digital maksimal 14 hari kerja setelah sesi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#C5A059] shrink-0" style={{ color: themeColor }}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Sedia Luar Daerah</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5 leading-normal">Perjalanan ke luar kota/daerah dipersiapkan matang secara profesional.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="bg-[#111] p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xl space-y-6 relative overflow-visible">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: `${themeColor}09` }} />
            
            <div className="space-y-1">
              <h4 className="text-base text-white font-serif font-medium">Kirim Undangan Booking</h4>
              <p className="text-[11px] text-neutral-500">Tanyakan penawaran khusus & diskon paket sesuai ketersediaan jadwal saya.</p>
              
              <div className="pt-2">
                <a 
                  href={handleCreateWhatsAppLink()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-950/20 hover:bg-emerald-900/35 border border-emerald-900/40 text-emerald-400 font-mono text-[10px] font-bold rounded-xl transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-450" /> Tanya Tanya Dahulu via WhatsApp 💬
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
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-white">Inkuiri Berhasil Dikirimkan!</h5>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      Terima kasih atas kiriman informasi Anda. Kak {photographer.name} akan segera menghubungi Anda langsung ke WhatsApp / Email dalam waktu dekat!
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={handleCreateWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-green-600 hover:bg-green-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer font-mono"
                    >
                      <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp Langsung
                    </a>
                  </div>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[10px] text-neutral-600 hover:text-neutral-400 underline cursor-pointer"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 font-mono">Nama Lengkap Pembeli Jasa</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Contoh: Farhan Sanjaya"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none placeholder-neutral-600"
                      style={{ focusBorderColor: themeColor }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono">Email</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="farhan@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none placeholder-neutral-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono">Nomor WhatsApp</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="081234..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none placeholder-neutral-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-500 font-mono">Pilih Layanan</label>
                      <select 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C5A059] outline-none"
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
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 font-mono">Beri Detail Kebutuhan & Ide Lokasi</label>
                    <textarea 
                      rows={3} 
                      placeholder="Jelaskan kebutuhan jumlah foto, lokasi out/in door, atau durasi sesi pas kegiatan..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-xs text-white focus:border-[#C5A059] outline-none placeholder-neutral-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full pt-3 pb-3 bg-white text-black text-xs font-bold font-mono rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-md uppercase cursor-pointer"
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
