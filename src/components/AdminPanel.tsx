import React, { useState } from 'react';
import { Photographer, Album, Photo, Booking } from '../types';
import { 
  Camera, Settings, Palette, Eye, Copy, Check, Plus, Trash, Globe, 
  BookOpen, Layers, LayoutGrid, CheckCircle, Mail, Phone, Flame, 
  MessageSquare, User, Calendar, ExternalLink, RefreshCw,
  Upload, HardDrive, Link, FileImage, Key
} from 'lucide-react';

interface AdminPanelProps {
  photographers: Photographer[];
  activeId: string;
  onSelectPhotographer: (id: string) => void;
  onCreatePhotographer: (name: string, username: string, password?: string) => void;
  onUpdatePhotographer: (updated: Photographer) => void;
  onViewPublicPortofolio: () => void;
  currentUser: { role: 'admin' | 'photographer'; username: string; name: string };
  onLogout: () => void;
  onDeletePhotographer: (id: string) => void;
  themeMode?: 'dark' | 'light';
}

export default function AdminPanel({
  photographers,
  activeId,
  onSelectPhotographer,
  onCreatePhotographer,
  onUpdatePhotographer,
  onViewPublicPortofolio,
  currentUser,
  onLogout,
  onDeletePhotographer,
  themeMode = 'dark'
}: AdminPanelProps) {
  const currentPhotographer = photographers.find(p => p.id === activeId) || photographers[0];

  // Forms states
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileUsername, setNewProfileUsername] = useState('');
  const [newProfilePassword, setNewProfilePassword] = useState('');
  
  // Showcase Preset Photo Suggestions
  const PRESET_STOCK_IMAGES = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80', caption: 'Pernikahan Altar Alam Terbuka', category: 'Wedding' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80', caption: 'Dekorasi Meja Jamuan Lilin Romantis', category: 'Wedding' },
    { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80', caption: 'Cincin Kawin & Buket Bunga Layu', category: 'Wedding' },
    { url: 'https://images.unsplash.com/photo-1520854221256-13d71cc996ba?w=800&auto=format&fit=crop&q=80', caption: 'Kembang Api Malam Resepsi Pengantin', category: 'Wedding' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80', caption: 'Dekapan Mesra Pre-Wedding Sunset', category: 'Engagement' },
    { url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&auto=format&fit=crop&q=80', caption: 'Pelukan Golden Hour Romantis di Tebing', category: 'Engagement' },
    { url: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&auto=format&fit=crop&q=80', caption: 'Proses Manual Brew Kopi Estetik', category: 'Product' },
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', caption: 'Jam Tangan Kayu Minimalis Ringan', category: 'Product' },
    { url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80', caption: 'Parfum Lumina Lavender Studio', category: 'Product' },
    { url: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae0d76?w=800&auto=format&fit=crop&q=80', caption: 'Potret Kelulusan Wisuda Tersenyum', category: 'Graduation' },
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', caption: 'Momen Lempar Topi Toga Bersama-sama', category: 'Graduation' },
    { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80', caption: 'Balon Pastel & Dekorasi Lilin 17 Tahun', category: 'Birthday' },
    { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80', caption: 'Detik-Detik Tiup Lilin Kue Cokelat', category: 'Birthday' }
  ];

  // Selected Album for photo editing
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(
    currentPhotographer.albums.length > 0 ? currentPhotographer.albums[0].id : null
  );

  // States for creating album
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumCategory, setNewAlbumCategory] = useState<'Wedding' | 'Engagement' | 'Birthday' | 'Graduation' | 'Product' | 'Other'>('Wedding');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState('');

  // States for adding photos
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState(new Date().toISOString().split('T')[0]);

  // Upload mechanics
  const [uploadTab, setUploadTab] = useState<'local' | 'drive'>('local');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // UI States
  const [copiedLink, setCopiedLink] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newTag, setNewTag] = useState('');

  const currentAlbum = currentPhotographer.albums.find(a => a.id === activeAlbumId) || currentPhotographer.albums[0];

  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?photographer=${currentPhotographer.username}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      triggerNotification('Tautan Portofolio berhasil disalin!');
    }).catch(() => {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCreateNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || !newProfileUsername.trim()) return;
    
    const formattedUsername = newProfileUsername.toLowerCase().replace(/\s+/g, '');
    onCreatePhotographer(newProfileName, formattedUsername, newProfilePassword.trim() || undefined);
    setNewProfileName('');
    setNewProfileUsername('');
    setNewProfilePassword('');
    triggerNotification(`Profil baru ${newProfileName} berhasil dibuat!`);
  };

  const handleUpdateProfileValue = (field: keyof Photographer, value: any) => {
    onUpdatePhotographer({
      ...currentPhotographer,
      [field]: value
    });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (currentPhotographer.specialtyTags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
    const updatedTags = [...currentPhotographer.specialtyTags, newTag.trim()];
    handleUpdateProfileValue('specialtyTags', updatedTags);
    setNewTag('');
    triggerNotification('Tag keahlian ditambahkan!');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = currentPhotographer.specialtyTags.filter(t => t !== tagToRemove);
    handleUpdateProfileValue('specialtyTags', updatedTags);
    triggerNotification('Tag keahlian dihapus!');
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    // Check if an album with the same name (case-insensitive) or same category-name combo already exists to avoid duplicates
    const trimmedTitle = newAlbumTitle.trim();
    const existingAlbum = currentPhotographer.albums.find(
      a => a.name.toLowerCase().trim() === trimmedTitle.toLowerCase() ||
           (a.category.toLowerCase().trim() === newAlbumCategory.toLowerCase().trim() &&
            trimmedTitle.toLowerCase() === newAlbumCategory.toLowerCase().trim())
    );

    if (existingAlbum) {
      setActiveAlbumId(existingAlbum.id);
      setNewAlbumTitle('');
      setNewAlbumDesc('');
      setNewAlbumCover('');
      setShowAddAlbum(false);
      triggerNotification(`Katalog "${existingAlbum.name}" sudah ada! Dialihkan ke katalog yang sudah ada untuk menambahkan foto.`);
      return;
    }

    const finalCover = newAlbumCover.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80';
    const newAlbum: Album = {
      id: 'album-' + Date.now(),
      name: trimmedTitle,
      description: newAlbumDesc,
      category: newAlbumCategory,
      coverUrl: finalCover,
      photos: []
    };

    const updatedAlbums = [...currentPhotographer.albums, newAlbum];
    onUpdatePhotographer({
      ...currentPhotographer,
      albums: updatedAlbums
    });

    setActiveAlbumId(newAlbum.id);
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setNewAlbumCover('');
    setShowAddAlbum(false);
    triggerNotification('Album kategori baru berhasil dibuat!');
  };

  const handleDeleteAlbum = (idToDelete: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh album ini beserta semua foto di dalamnya?')) {
      const updatedAlbums = currentPhotographer.albums.filter(a => a.id !== idToDelete);
      onUpdatePhotographer({
        ...currentPhotographer,
        albums: updatedAlbums
      });
      if (activeAlbumId === idToDelete) {
        setActiveAlbumId(updatedAlbums.length > 0 ? updatedAlbums[0].id : null);
      }
      triggerNotification('Album berhasil didelete.');
    }
  };

  const processUrl = (inputUrl: string): string => {
    if (!inputUrl) return '';
    const trimmed = inputUrl.trim();
    // Allow local raw base64 uploads
    if (trimmed.startsWith('data:image/')) {
      return trimmed;
    }
    // Parse Google Drive shared link
    const driveMatch = trimmed.match(/(?:\/d\/|id=)([\w-]{25,})/);
    if (driveMatch && driveMatch[1]) {
      // Returns instant load googleusercontent layout
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    // Return empty string to filter out generic internet URLs for portfolio protection
    return '';
  };

  const handleAddPhoto = (url: string = '', caption: string = '') => {
    if (!activeAlbumId) {
      alert('Buat album terlebih dahulu sebelum menambahkan foto!');
      return;
    }

    const rawUrl = url || newPhotoUrl;
    const targetUrl = processUrl(rawUrl);
    const targetCaption = caption || newPhotoCaption;

    if (!targetUrl.trim()) {
      alert('Maaf, penambahan foto dari URL internet umum dinonaktifkan demi menjaga orisinalitas portofolio karya Anda agar terhindar dari klaim hak cipta pihak lain tanpa izin.\n\nSilakan gunakan opsi "Galeri Lokal" (Unggah langsung dari perangkat Anda) atau pastikan tautan Google Drive Anda valid dan diatur ke Publik ("Siapa saja dengan link").');
      return;
    }

    const newPhotoId = 'photo-' + Date.now() + Math.random().toString(36).substr(2, 4);
    const newPhoto: Photo = {
      id: newPhotoId,
      url: targetUrl,
      caption: targetCaption || 'Materi Pemotretan Estetik',
      date: newPhotoDate
    };

    const updatedAlbums = currentPhotographer.albums.map(a => {
      if (a.id === activeAlbumId) {
        return {
          ...a,
          photos: [...a.photos, newPhoto]
        };
      }
      return a;
    });

    onUpdatePhotographer({
      ...currentPhotographer,
      albums: updatedAlbums
    });

    if (!url) {
      setNewPhotoUrl('');
      setNewPhotoCaption('');
    }
    triggerNotification('Foto berhasil ditambahkan ke koleksi!');
  };

  const handleLocalFilesUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!activeAlbumId) {
      alert('Buat album terlebih dahulu sebelum mengunggah foto!');
      return;
    }

    setIsUploading(true);
    let loadedCount = 0;
    const filesArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    const totalFiles = filesArray.length;

    if (totalFiles === 0) {
      setIsUploading(false);
      return;
    }

    filesArray.forEach((file) => {
      // Warn on files over 4MB if there are multiple large files, to keep localStorage smooth
      if (file.size > 4 * 1024 * 1024) {
        console.warn('File size greater than 4MB, storage performance might vary.');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        if (base64Data) {
          const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const capitalizedCaption = nameWithoutExtension
            .split(/[-_\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          handleAddPhoto(base64Data, capitalizedCaption);
        }
        loadedCount++;
        if (loadedCount === totalFiles) {
          setIsUploading(false);
          triggerNotification(`Berhasil memuat ${totalFiles} foto dari Galeri!`);
        }
      };

      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === totalFiles) {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    const updatedAlbums = currentPhotographer.albums.map(a => {
      if (a.id === activeAlbumId) {
        return {
          ...a,
          photos: a.photos.filter(p => p.id !== photoId)
        };
      }
      return a;
    });

    onUpdatePhotographer({
      ...currentPhotographer,
      albums: updatedAlbums
    });
    triggerNotification('Foto dihapus.');
  };

  const handleUpdateBookingStatus = (bookingId: string) => {
    const updatedBookings = currentPhotographer.bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: b.status === 'New' ? 'Replied' as const : 'Completed' as const
        };
      }
      return b;
    });

    onUpdatePhotographer({
      ...currentPhotographer,
      bookings: updatedBookings
    });
    triggerNotification('Status booking diperbarui!');
  };

  const handleDeleteBooking = (bookingId: string) => {
    const updatedBookings = currentPhotographer.bookings.filter(b => b.id !== bookingId);
    onUpdatePhotographer({
      ...currentPhotographer,
      bookings: updatedBookings
    });
    triggerNotification('Inkuiri booking dibersihkan.');
  };

  const activeThemeColor = currentPhotographer.themeColor || '#C5A059';

  return (
    <div className={`flex-1 flex flex-col md:flex-row overflow-hidden transition-colors duration-300 ${
      themeMode === 'light' 
        ? 'bg-[#F4F4F7] text-neutral-800' 
        : 'bg-[#0A0A0A] text-[#E0E0E0]'
    }`}>
      {/* SIDEBAR FOR PROFILE SETUP */}
      <aside className={`w-full md:w-80 border-b md:border-b-0 md:border-r p-6 flex flex-col gap-6 overflow-y-auto shrink-0 transition-colors duration-300 ${
        themeMode === 'light'
          ? 'bg-white border-neutral-200'
          : 'bg-[#121212] border-[#2A2A2A]'
      }`}>
        
        {/* CURRENT SESSION USER WORKSPACE CARD */}
        <div className={`p-3.5 rounded-xl border space-y-2 transition-colors duration-300 ${
          themeMode === 'light'
            ? 'bg-neutral-50 border-neutral-200'
            : 'bg-[#1A1A1A] border-[#2D2D2D]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Akses Sesi Aktif</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
              currentUser.role === 'admin' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {currentUser.role === 'admin' ? 'Super Admin' : 'Fotografer'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-colors ${
              themeMode === 'light'
                ? 'bg-neutral-200 text-neutral-700 border-neutral-300'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}>
              {currentUser.name.charAt(0)}
            </div>
            <p className={`text-xs font-semibold truncate flex-1 ${themeMode === 'light' ? 'text-neutral-900' : 'text-white'}`}>{currentUser.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-1.5 py-1.5 bg-red-950/20 hover:bg-red-500 hover:text-white text-red-400 transition-all font-mono text-[9px] rounded-lg border border-red-900/30 font-bold uppercase cursor-pointer"
          >
            Keluar Sesi (Logout)
          </button>
        </div>

        {/* SELECT/CREATE PHOTOGRAPHER DECK - CONDITIONAL ON ADMIN */}
        <div>
          {currentUser.role === 'admin' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2.5 flex items-center justify-between">
                  <span>Pilih Fotografer Kelolaan</span>
                  <RefreshCw className="w-3 h-3 text-neutral-600" />
                </h3>
                <div className="space-y-1.5">
                  <select
                    value={currentPhotographer.id}
                    onChange={(e) => {
                      onSelectPhotographer(e.target.value);
                      setActiveAlbumId(null);
                      const prof = photographers.find(p => p.id === e.target.value);
                      if (prof && prof.albums.length > 0) {
                        setActiveAlbumId(prof.albums[0].id);
                      }
                    }}
                    className={`w-full text-sm rounded-lg px-3 py-2 outline-none focus:border-[#C5A059] transition-colors cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-neutral-50 text-neutral-800 border border-neutral-355'
                        : 'bg-[#1A1A1A] text-white border border-[#333]'
                    }`}
                  >
                    {photographers.map((p) => (
                      <option key={p.id} value={p.id} className={themeMode === 'light' ? 'bg-white text-neutral-800' : 'bg-[#121212]'}>
                        {p.name} (@{p.username})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Create Mini Form */}
              <form onSubmit={handleCreateNewProfile} className={`p-3 rounded-lg border space-y-2 transition-colors ${
                themeMode === 'light'
                  ? 'bg-neutral-50 border-neutral-200'
                  : 'bg-[#181818] border-[#252525]'
              }`}>
                <span className="text-[9px] font-mono text-[#C5A059] block font-semibold tracking-wider">DAFTARKAN FOTOGRAFER BARU</span>
                <input
                  type="text"
                  placeholder="Nama Lengkap Bisnis"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  required
                  className={`w-full text-xs py-1.5 px-2.5 rounded outline-none focus:border-[#C5A059] transition-colors ${
                    themeMode === 'light'
                      ? 'bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400'
                      : 'bg-[#111] border border-[#2B2B2B] text-white placeholder-neutral-600'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Username (e.g. andiphotos)"
                  value={newProfileUsername}
                  onChange={(e) => setNewProfileUsername(e.target.value)}
                  required
                  className={`w-full text-xs py-1.5 px-2.5 rounded outline-none focus:border-[#C5A059] transition-colors ${
                    themeMode === 'light'
                      ? 'bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400'
                      : 'bg-[#111] border border-[#2B2B2B] text-white placeholder-neutral-600'
                  }`}
                />
                <input
                  type="password"
                  placeholder="Kata Sandi Akun"
                  value={newProfilePassword}
                  onChange={(e) => setNewProfilePassword(e.target.value)}
                  required
                  className={`w-full text-xs py-1.5 px-2.5 rounded outline-none focus:border-[#C5A059] transition-colors ${
                    themeMode === 'light'
                      ? 'bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400'
                      : 'bg-[#111] border border-[#2B2B2B] text-white placeholder-neutral-600'
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full py-1.5 text-[10px] font-bold uppercase rounded font-mono cursor-pointer transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-200 hover:bg-[#C5A059] text-neutral-800 hover:text-black'
                      : 'bg-[#ffeedd] bg-neutral-800 hover:bg-[#C5A059] hover:text-black text-neutral-300'
                  }`}
                >
                  + Daftarkan Akun Baru
                </button>
              </form>

              {/* ACCOUNT DELETION BOARD FOR BUILD-IN DEVELOPER/SUPERADMIN */}
              <div className={`border-t pt-4 space-y-2 ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'}`}>
                <span className="text-[9px] font-mono text-neutral-500 block font-semibold uppercase tracking-wider">Kelola Akun ({photographers.length})</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {photographers.map(p => (
                    <div key={p.id} className={`flex items-center justify-between p-2 rounded border text-xs transition-colors ${
                      themeMode === 'light'
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
                        : 'bg-[#151515] border-[#222] text-[#E0E0E0]'
                    }`}>
                      <div className="truncate pr-1">
                        <p className={`font-medium truncate text-xs ${themeMode === 'light' ? 'text-neutral-900 font-semibold' : 'text-white'}`}>{p.name}</p>
                        <p className="text-[9px] text-neutral-500 font-mono truncate">@{p.username}</p>
                      </div>
                      {photographers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus akun fotografer ${p.name}? Semua album, foto, dan inkuiri booking miliknya akan hilang permanen!`)) {
                              onDeletePhotographer(p.id);
                            }
                          }}
                          className="p-1 hover:bg-red-950/40 rounded text-red-400 hover:text-red-500 cursor-pointer transition-colors"
                          title="Hapus Akun Permanen"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-3 rounded-lg border transition-colors ${
              themeMode === 'light'
                ? 'bg-neutral-50 border-neutral-200'
                : 'bg-[#181818] border-[#252525]'
            }`}>
              <span className="text-[9px] font-mono text-neutral-500 block mb-1 font-semibold">TENTANG AKUN ANDA</span>
              <p className={`text-xs ${themeMode === 'light' ? 'text-neutral-700' : 'text-neutral-200'}`}>Anda masuk sebagai fotografer aktif resmi.</p>
              <p className="text-[10px] text-neutral-500 mt-1">Anda hanya dapat melihat dan mengedit portofolio, album, dan inkuiri booking milik Anda sendiri guna menjamin privasi antar-fotografer.</p>
            </div>
          )}
        </div>

        {/* PROFILE METADATA SECTION */}
        <div className={`border-t pt-4 space-y-4 ${themeMode === 'light' ? 'border-neutral-200 shadow-sm' : 'border-[#222]'}`}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Edit Profil Aktif</h3>
          
          <div className="space-y-1.5">
            <label className={`text-[11px] font-mono flex items-center gap-1 transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>
              <User className="w-3 h-3" /> Nama Lengkap Bisnis
            </label>
            <input
              type="text"
              value={currentPhotographer.name}
              onChange={(e) => handleUpdateProfileValue('name', e.target.value)}
              className={`w-full rounded px-3 py-1.5 text-xs outline-none focus:border-[#C5A059] transition-colors ${
                themeMode === 'light'
                  ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 focus:bg-white'
                  : 'bg-[#1A1A1A] border-[#333] text-white'
              }`}
            />
          </div>

          {/* PROFILE PICTURE (AVATAR) CONFIGURATION BLOCK */}
          <div className={`space-y-3 pb-3.5 border-b transition-colors ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#262626]'}`}>
            <label className={`text-[11px] font-mono flex items-center justify-between transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" style={{ color: activeThemeColor }} />
                Foto Profil Fotografer (Avatar)
              </span>
              <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border transition-colors ${
                themeMode === 'light' ? 'bg-neutral-100 border-neutral-300 text-neutral-600' : 'bg-black border-[#222] text-neutral-500'
              }`}>
                Tampilan Portofolio
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Circular Avatar Preview */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 transition-colors duration-300 flex items-center justify-center bg-neutral-800" style={{ borderColor: activeThemeColor }}>
                  <img 
                    src={currentPhotographer.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'} 
                    alt="Foto Profil" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Upload & Link Controls */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex gap-2">
                  {/* File Upload Trigger Button */}
                  <div className={`relative flex-1 group border border-dashed rounded-lg p-2 text-center transition-all cursor-pointer ${
                    themeMode === 'light'
                      ? 'border-neutral-300 hover:border-neutral-500 bg-neutral-50 hover:bg-neutral-100/80'
                      : 'border-[#333] hover:border-neutral-500 bg-[#161616] hover:bg-[#1C1C1C]'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleUpdateProfileValue('avatarUrl', reader.result as string);
                            triggerNotification('Foto profil berhasil diperbarui!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex items-center justify-center gap-1.5 z-0 relative py-0.5">
                      <Upload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                      <span className={`text-[10px] font-medium ${themeMode === 'light' ? 'text-neutral-800' : 'text-neutral-300'}`}>Unggah Foto</span>
                    </div>
                  </div>

                  {/* Reset to Stock Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateProfileValue('avatarUrl', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80');
                      triggerNotification('Foto profil diatur kembali ke bawaan.');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                      themeMode === 'light'
                        ? 'bg-neutral-150 text-neutral-700 border border-neutral-300 hover:bg-neutral-200'
                        : 'bg-neutral-900 text-neutral-400 border border-[#2B2B2B] hover:text-white hover:bg-neutral-850'
                    }`}
                  >
                    Bawaan
                  </button>
                </div>

                {/* Direct Link Input */}
                <input
                  type="text"
                  placeholder="Atau tempel link gambar profil (.jpg, .png, dsb)"
                  value={currentPhotographer.avatarUrl && currentPhotographer.avatarUrl.startsWith('data:') ? '' : currentPhotographer.avatarUrl}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (val) {
                      handleUpdateProfileValue('avatarUrl', val);
                    }
                  }}
                  className={`w-full border rounded-lg px-2.5 py-1 text-[10px] focus:border-[#C5A059] outline-none font-mono transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white'
                      : 'bg-[#161616] border border-[#2B2B2B] text-white placeholder-neutral-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* CUSTOM LOGO CONFIGURATION BLOCK */}
          <div className={`space-y-2 border-y py-3.5 my-1 transition-colors ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#262626]'}`}>
            <label className={`text-[11px] font-mono flex items-center justify-between transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>
              <span className="flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-[#C5A059]" style={{ color: activeThemeColor }} />
                Logo Kustom Fotografer
              </span>
              <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border transition-colors ${
                themeMode === 'light' ? 'bg-neutral-100 border-neutral-300 text-neutral-600' : 'bg-black border-[#222] text-neutral-500'
              }`}>
                Header Publik
              </span>
            </label>

            {currentPhotographer.logoUrl ? (
              <div className={`p-3 rounded-lg border flex items-center justify-between gap-3 animate-fade-in transition-colors ${
                themeMode === 'light' ? 'bg-neutral-50 border-neutral-250 shadow-sm text-neutral-800' : 'bg-black/50 border-[#2a2a2a] text-white'
              }`}>
                <div className="flex items-center gap-2 max-w-[70%]">
                  <div className={`w-10 h-10 rounded overflow-hidden flex items-center justify-center p-1.5 border transition-colors ${
                    themeMode === 'light' ? 'bg-white border-neutral-300' : 'bg-[#151515] border-[#333]'
                  }`}>
                    <img 
                      src={currentPhotographer.logoUrl} 
                      alt="Logo Brand" 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="truncate">
                    <span className={`text-[10px] font-mono block truncate ${themeMode === 'light' ? 'text-neutral-800 font-semibold' : 'text-white'}`}>Logo Aktif</span>
                    <span className="text-[8px] text-emerald-500 font-mono block font-semibold">✓ Terpasang in Header</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateProfileValue('logoUrl', '');
                    triggerNotification('Logo kustom dibersihkan. Kembali menggunakan Monogram Klasik.');
                  }}
                  className={`p-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase text-xs ${
                    themeMode === 'light'
                      ? 'bg-red-50 hover:bg-red-100 border border-red-300 text-red-650'
                      : 'bg-red-950/40 hover:bg-red-900 border border-red-900/40 text-red-400 hover:text-white'
                  }`}
                >
                  <Trash className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in">
                {/* File Upload Selector */}
                <div className={`relative group border border-dashed rounded-lg p-3 text-center transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'border-neutral-300 hover:border-neutral-500 bg-neutral-50 hover:bg-neutral-100/80 shadow-sm'
                    : 'border-[#333] hover:border-neutral-500 bg-[#161616] hover:bg-[#1C1C1C]'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleUpdateProfileValue('logoUrl', reader.result as string);
                          triggerNotification('Logo kustom berhasil diunggah langsung!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="space-y-1 z-0 relative">
                    <Upload className="w-4 h-4 mx-auto text-neutral-500 group-hover:text-neutral-800 transition-colors" />
                    <p className={`text-[10px] font-medium ${themeMode === 'light' ? 'text-neutral-800' : 'text-neutral-300'}`}>Unggah Berkas Logo</p>
                    <p className="text-[8px] text-neutral-500 font-mono">Seret gambar atau klik untuk memilih (.PNG, .JPG)</p>
                  </div>
                </div>

                {/* Direct Link Input */}
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Atau tempel link logo eksternal/raw..."
                      onChange={(e) => {
                        if (e.target.value.trim().startsWith('http') || e.target.value.trim().startsWith('data:')) {
                          handleUpdateProfileValue('logoUrl', e.target.value.trim());
                        }
                      }}
                      className={`flex-1 border rounded-lg px-2.5 py-1 text-[10px] focus:border-[#C5A059] outline-none font-mono transition-colors ${
                        themeMode === 'light'
                          ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white'
                          : 'bg-[#161616] border border-[#2B2B2B] text-white placeholder-neutral-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={`text-[11px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Biografi Kreatif</label>
            <textarea
              rows={3}
              value={currentPhotographer.bio}
              onChange={(e) => handleUpdateProfileValue('bio', e.target.value)}
              className={`w-full border rounded px-3 py-1.5 text-xs outline-none focus:border-[#C5A059] resize-none leading-relaxed transition-colors ${
                themeMode === 'light'
                  ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                  : 'bg-[#1A1A1A] border-[#333] text-white'
              }`}
            />
          </div>

          {/* TAGS EDITOR */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Tag Spesialisasi / Event</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Tambah tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className={`flex-1 border rounded px-2.5 py-1 text-xs outline-none transition-colors ${
                  themeMode === 'light'
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white'
                    : 'bg-[#1A1A1A] border-[#333] text-white placeholder-neutral-600'
                }`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={`px-2.5 text-xs rounded transition-colors ${
                  themeMode === 'light'
                    ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium'
                    : 'bg-neutral-800 hover:bg-[#333] text-white'
                }`}
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {currentPhotographer.specialtyTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] border px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-100 border-neutral-200 text-neutral-700 font-medium'
                      : 'bg-neutral-900 border-[#333] text-neutral-300'
                  }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[10px] text-red-500 hover:text-red-650 font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className={`border-t pt-4 space-y-3 transition-colors ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'}`}>
            <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-mono block font-semibold">Kontak & Medsos</span>
            
            <div className="space-y-1">
              <label className={`text-[9px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-500'}`}>WhatsApp (e.g. 6281..)</label>
              <input
                type="text"
                value={currentPhotographer.whatsapp}
                onChange={(e) => handleUpdateProfileValue('whatsapp', e.target.value)}
                className={`w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-[#C5A059] transition-colors ${
                  themeMode === 'light'
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                    : 'bg-[#1A1A1A] border-[#333] text-white'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-[9px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-500'}`}>Instagram Username</label>
              <input
                type="text"
                value={currentPhotographer.instagram}
                onChange={(e) => handleUpdateProfileValue('instagram', e.target.value)}
                className={`w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-[#C5A059] transition-colors ${
                  themeMode === 'light'
                    ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                    : 'bg-[#1A1A1A] border-[#333] text-white'
                }`}
              />
            </div>
          </div>

          {/* PASSWORD RESET / CHANGE PASSWORD BLOCK FOR LOGGED IN PHOTOGRAPHER */}
          <div className={`border-t pt-4 space-y-3 transition-colors ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'}`}>
            <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-mono block font-semibold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" style={{ color: activeThemeColor || '#C5A059' }} /> Keamanan Akun & Sandi
            </span>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className={`text-[9px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-500'}`}>Kata Sandi Baru</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Masukkan sandi baru..."
                    id="new-password-input"
                    className={`flex-1 border rounded px-2.5 py-1 text-xs outline-none focus:border-[#C5A059] transition-colors ${
                      themeMode === 'light'
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:bg-white'
                        : 'bg-[#1A1A1A] border-[#333] text-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-password-input') as HTMLInputElement | null;
                      if (!input || !input.value.trim()) {
                        triggerNotification('Harap masukkan sandi baru.');
                        return;
                      }
                      const newPass = input.value.trim();
                      if (newPass.length < 4) {
                        triggerNotification('Sandi baru minimal 4 karakter.');
                        return;
                      }
                      handleUpdateProfileValue('password', newPass);
                      input.value = '';
                      triggerNotification('✓ Kata sandi berhasil diperbarui!');
                    }}
                    className="px-3 py-1 bg-[#C5A059] hover:bg-[#DBC18A] text-black text-xs font-mono font-bold rounded cursor-pointer transition-colors"
                  >
                    Ubah
                  </button>
                </div>
                <p className="text-[8px] text-neutral-500 font-mono">Simpan baik-baik kata sandi baru Anda untuk login berikutnya.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SHARING BOARD */}
        <div className={`mt-auto border-t pt-4 space-y-2 ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'}`}>
          <div className={`p-3 rounded border transition-colors ${
            themeMode === 'light' ? 'bg-neutral-50 border-neutral-200 shadow-sm' : 'bg-[#121212] border-[#222]'
          }`}>
            <h4 className="text-[#C5A059] text-[11px] font-semibold flex items-center gap-1.5 mb-1" style={{ color: activeThemeColor }}>
              <Globe className="w-3.5 h-3.5" style={{ color: activeThemeColor }} /> Portofolio Siap Bagikan
            </h4>
            <p className="text-[10px] text-neutral-500 mb-2">Gunakan link ini untuk presentasi klien Anda:</p>
            <div className="flex gap-1.5">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}${window.location.pathname}?photographer=${currentPhotographer.username}`}
                className={`flex-1 text-[10px] font-mono px-2 py-1.5 rounded border select-all transition-colors ${
                  themeMode === 'light'
                    ? 'bg-white text-neutral-700 border-neutral-300'
                    : 'bg-black text-neutral-400 border-[#222]'
                }`}
              />
              <button
                onClick={handleCopyLink}
                className={`p-1 px-1.5 rounded text-xs transition-colors flex items-center justify-center cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
                title="Salin Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-500 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <button
              onClick={onViewPublicPortofolio}
              className={`w-full mt-2 py-1.5 text-[10px] transition-colors rounded uppercase font-bold flex items-center justify-center gap-1 cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-neutral-800 text-white hover:bg-neutral-900 border border-neutral-600'
                  : 'bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200'
              }`}
            >
              Lihat Tampilan Publik <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* CORE CONTROL HUB AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6">
        
        {/* TOP STATUS AND SUCCESS NOTIFY */}
        <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-5 transition-colors ${
          themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'
        }`}>
          <div>
            <h2 className={`text-xl sm:text-2xl font-serif italic flex items-center gap-2 transition-colors ${
              themeMode === 'light' ? 'text-neutral-900 font-semibold' : 'text-white'
            }`}>
              <Camera className="w-6 h-6 text-[#C5A059]" style={{ color: activeThemeColor }} />
              Workspace Editor Foto
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Mengatur Album Kategori, Desain Tampilan, dan Inkuiri Booking {currentPhotographer.name}.</p>
          </div>

          <div className="flex items-center gap-2">
            {successMsg && (
              <span className={`text-[11px] border px-3 py-1.5 rounded animate-fade-in font-mono ${
                themeMode === 'light'
                  ? 'bg-green-50 border-green-250 text-green-700 font-semibold'
                  : 'bg-green-500/10 border-green-500/20 text-green-400'
              }`}>
                {successMsg}
              </span>
            )}
          </div>
        </div>

        {/* LAYOUT AND THEME STYLING CONFIG (REQUIRED BY TEMA) */}
        <section className={`border rounded-xl p-5 shadow-sm space-y-4 transition-colors ${
          themeMode === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#121212] border-[#2A2A2A]'
        }`}>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: activeThemeColor }} />
            <h3 className={`text-xs uppercase tracking-wider font-mono font-semibold transition-colors ${
              themeMode === 'light' ? 'text-neutral-800' : 'text-white'
            }`}>Tampilan Portofolio Publik Klien</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            <div className="space-y-2">
              <label className={`text-xs font-mono block transition-colors ${themeMode === 'light' ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}>Format Layout Kategori Utama</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Classic Album', label: 'Buku Album', icon: BookOpen },
                  { name: 'Interactive Cards', label: 'Desain Kartu', icon: Layers },
                  { name: 'Masonry Grid', label: 'Grid Modern', icon: LayoutGrid }
                ].map((layout) => {
                  const IconComp = layout.icon;
                  const isActive = currentPhotographer.layoutStyle === layout.name;
                  return (
                    <button
                      key={layout.name}
                      type="button"
                      onClick={() => {
                        handleUpdateProfileValue('layoutStyle', layout.name);
                        triggerNotification(`Tata Kelola layout diubah ke: ${layout.label}!`);
                      }}
                      className={`py-3 px-2 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                        isActive
                          ? (themeMode === 'light' ? 'bg-neutral-100 text-neutral-950 font-semibold border-neutral-600 shadow-sm' : 'bg-[#1D1D1D] text-white')
                          : (themeMode === 'light' ? 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-400' : 'bg-neutral-900/50 border-[#222] text-neutral-400 hover:border-neutral-600')
                      }`}
                      style={{ borderColor: isActive ? activeThemeColor : undefined }}
                    >
                      <IconComp className="w-4 h-4" style={{ color: isActive ? activeThemeColor : undefined }} />
                      <span className="text-[10px] font-mono">{layout.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-mono block transition-colors ${themeMode === 'light' ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}>Warna Aksen Unsur Estetik</label>
              <div className="flex flex-wrap gap-3 py-1 items-center">
                {[
                  { hex: '#C5A059', name: 'Gold / Emas Klasik' },
                  { hex: '#5984C5', name: 'Modern Blue / Biru' },
                  { hex: '#C55959', name: 'Warm Sunset Coral' },
                  { hex: '#59C57D', name: 'Organic Green / Sage' }
                ].map((color) => {
                  const isActive = currentPhotographer.themeColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        handleUpdateProfileValue('themeColor', color.hex);
                        triggerNotification(`Warna tema visual berhasil diubah ke ${color.name}!`);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative ${
                        isActive 
                          ? (themeMode === 'light' ? 'scale-110 border-neutral-800' : 'scale-110 border-white') 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isActive && (
                        <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center ${
                          themeMode === 'light' ? 'bg-neutral-800 text-white' : 'bg-white text-black'
                        }`}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
                <span className={`text-[11px] font-mono pl-2 transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-500'}`}>
                  Aktif: {currentPhotographer.themeColor}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ALBUM CATEGORIES AND PHOTOS MANAGER */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h3 className={`text-xs uppercase tracking-wider font-mono flex items-center gap-2 transition-colors ${
              themeMode === 'light' ? 'text-neutral-800 font-semibold' : 'text-neutral-400'
            }`}>
              <span>🗂️ Daftar Album / Event Kategori ({currentPhotographer.albums.length})</span>
            </h3>
            <button
              onClick={() => {
                setShowAddAlbum(!showAddAlbum);
              }}
              className={`py-1.5 px-3 rounded hover:bg-[#C5A059] hover:text-black transition-colors border text-xs font-mono flex items-center gap-1 cursor-pointer ${
                themeMode === 'light'
                ? 'bg-white border-neutral-300 hover:border-neutral-450 hover:bg-neutral-50 text-neutral-850 font-medium'
                : 'bg-[#1A1A1A] border-[#333] text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5 animate-pulse" /> Buat Album Kategori Baru
            </button>
          </div>

          {/* Form Create Album */}
          {showAddAlbum && (
            <form 
              onSubmit={handleCreateAlbum} 
              className={`p-4 rounded-xl border space-y-3 animate-fade-in transition-colors ${
                themeMode === 'light' ? 'bg-white border-neutral-300 shadow-md' : 'bg-[#121212] border-[#C5A059]/40'
              }`}
              style={{ borderColor: themeMode === 'light' ? undefined : `${activeThemeColor}55` }}
            >
              <span className={`text-[11px] font-mono block uppercase tracking-wider ${themeMode === 'light' ? 'text-neutral-800 font-bold' : 'text-white'}`}>Detil Album Baru</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Judul Kegiatan / Album</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Portrait Sesi Widya & Riki"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    className={`w-full rounded px-3 py-1.5 text-xs outline-none focus:border-[#C5A059] transition-colors ${
                      themeMode === 'light' 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                        : 'bg-[#1C1C1C] border border-[#333] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Kategori Utama</label>
                  <select
                    value={newAlbumCategory}
                    onChange={(e: any) => setNewAlbumCategory(e.target.value)}
                    className={`w-full rounded px-3 py-1.5 text-xs focus:border-[#C5A059] outline-none transition-colors ${
                      themeMode === 'light' 
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-800 focus:bg-white' 
                        : 'bg-[#1C1C1C] border border-[#333] text-white'
                    }`}
                  >
                    <option value="Wedding">Wedding (Pernikahan)</option>
                    <option value="Engagement">Engagement (Prewedding/Tunangan)</option>
                    <option value="Birthday">Birthday (Ulang Tahun/Event Pribadi)</option>
                    <option value="Graduation">Graduation (Wisuda/Akademis)</option>
                    <option value="Product">Product (Foto Produk / Katalog)</option>
                    <option value="Other">Other / Acara Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Deskripsi Acara</label>
                <input
                  type="text"
                  placeholder="Ceritakan tentang momen, atmosfer, lokasi, atau konsep foto ini..."
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  className={`w-full rounded px-3 py-1.5 text-xs outline-none focus:border-[#C5A059] transition-colors ${
                    themeMode === 'light' 
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                      : 'bg-[#1C1C1C] border border-[#333] text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>URL Sampul Foto (Kosongkan jika ingin memakai default)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash..."
                  value={newAlbumCover}
                  onChange={(e) => setNewAlbumCover(e.target.value)}
                  className={`w-full rounded px-3 py-1.5 text-xs outline-none focus:border-[#C5A059] font-mono transition-colors ${
                    themeMode === 'light' 
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:bg-white' 
                      : 'bg-[#1C1C1C] border border-[#333] text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAlbum(false)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-650 font-semibold'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 font-bold text-xs rounded transition-colors cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-neutral-800 text-white hover:bg-neutral-900'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  Simpan Album
                </button>
              </div>
            </form>
          )}

          {/* ACTIVE ALBUMS CARDS */}
          {currentPhotographer.albums.length === 0 ? (
            <div className={`border rounded-xl p-8 text-center transition-colors ${
              themeMode === 'light' ? 'bg-white border-neutral-250 shadow-sm' : 'bg-[#121212] border-[#2A2A2A]'
            }`}>
              <p className="text-sm font-mono text-neutral-500">Belum ada album kategori dibuat. Mulai dengan mengklik "Buat Album Kategori Baru" di atas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ALBUMS NAVIGATION DECK */}
              <div className="lg:col-span-1 space-y-2.5">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase font-semibold">Pilih Album Yang Ingin Dikelola</span>
                <div className="space-y-2">
                  {currentPhotographer.albums.map((album) => {
                    const isActive = album.id === activeAlbumId;
                    return (
                      <div
                        key={album.id}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                          isActive
                            ? themeMode === 'light' 
                              ? 'bg-white border-neutral-800 shadow-md ring-1 ring-neutral-450' 
                              : 'bg-[#181818] border-neutral-600'
                            : themeMode === 'light' 
                              ? 'bg-white border-neutral-200 hover:border-neutral-450 shadow-sm text-neutral-800' 
                              : 'bg-neutral-900/60 border-[#222] hover:border-neutral-800'
                        }`}
                        onClick={() => setActiveAlbumId(album.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span 
                              className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider block mb-1.5 w-max"
                              style={{ backgroundColor: `${activeThemeColor}15`, color: activeThemeColor }}
                            >
                              {album.category}
                            </span>
                            <h4 className={`font-semibold text-sm line-clamp-1 transition-colors ${
                              themeMode === 'light' ? 'text-neutral-900' : 'text-white'
                            }`}>{album.name}</h4>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAlbum(album.id);
                            }}
                            className={`p-0.5 transition-colors cursor-pointer ${
                              themeMode === 'light' ? 'text-neutral-400 hover:text-red-500' : 'text-neutral-600 hover:text-red-400'
                            }`}
                            title="Hapus Album"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className={`text-[11px] line-clamp-1 mt-1 transition-colors ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-500'}`}>{album.description}</p>
                        
                        <div className={`flex items-center justify-between pt-3 border-t mt-3 transition-colors ${
                          themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'
                        }`}>
                          <span className={`text-[10px] font-mono transition-colors ${
                            themeMode === 'light' ? 'text-neutral-650' : 'text-neutral-400'
                          }`}>{album.photos.length} Foto dimasukkan</span>
                          {isActive && <span className="text-[9px] px-2 py-0.5 rounded font-mono font-semibold" style={{ color: activeThemeColor, backgroundColor: `${activeThemeColor}11` }}>Dikelola</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EDITOR COLUMN: PHOTOS OF ACTIVE ALBUM */}
              <div className={`border rounded-xl p-5 space-y-5 lg:col-span-2 transition-colors ${
                themeMode === 'light' ? 'bg-white border-neutral-250 shadow-sm' : 'bg-[#121212] border-[#2A2A2A]'
              }`}>
                {currentAlbum ? (
                  <>
                    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3.5 gap-2 transition-colors ${
                      themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'
                    }`}>
                      <div>
                        <h4 className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                          themeMode === 'light' ? 'text-neutral-900 font-bold' : 'text-white'
                        }`}>
                          Mengatur Foto Koleksi: <span className="italic font-serif" style={{ color: activeThemeColor }}>{currentAlbum.name}</span>
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{currentAlbum.photos.length} total foto terunggah di album kategori ini.</p>
                      </div>
                    </div>

                    {/* ADD PHOTO INTERACTIVE FORM WITH LOCAL GALLERY AND G-DRIVE INTEGRATIONS */}
                    <div className={`p-4 rounded-xl border space-y-4 transition-colors ${
                      themeMode === 'light' ? 'bg-neutral-50 border-neutral-200' : 'bg-[#1A1A1A] border-[#2B2B2B]'
                    }`}>
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 transition-colors ${
                        themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'
                      }`}>
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold" style={{ color: activeThemeColor }}>
                          + Metode Penginputan Karya Foto Terverifikasi
                        </span>

                        <div className={`flex gap-1 p-1 rounded-lg border transition-colors ${
                          themeMode === 'light' ? 'bg-neutral-100 border-neutral-200' : 'bg-black/40 border-[#252525]'
                        }`}>
                          <button
                            type="button"
                            onClick={() => setUploadTab('local')}
                            className={`px-3 py-1 text-[10px] font-mono rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                              uploadTab === 'local' 
                                ? themeMode === 'light' ? 'bg-white text-neutral-900 font-bold shadow-sm' : 'bg-neutral-800 text-white font-semibold' 
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            <Upload className="w-3 h-3" /> Galeri Lokal
                          </button>
                          <button
                            type="button"
                            onClick={() => setUploadTab('drive')}
                            className={`px-3 py-1 text-[10px] font-mono rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                              uploadTab === 'drive' 
                                ? themeMode === 'light' ? 'bg-white text-neutral-900 font-bold shadow-sm' : 'bg-neutral-800 text-white font-semibold' 
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            <HardDrive className="w-3 h-3" /> Google Drive Link
                          </button>
                        </div>
                      </div>

                      {/* LOCAL GALLERY UPLOADER */}
                      {uploadTab === 'local' && (
                        <div className="space-y-3">
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              handleLocalFilesUpload(e.dataTransfer.files);
                            }}
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                              dragOver 
                                ? 'border-[#C5A059] bg-[#C5A059]/5' 
                                : themeMode === 'light'
                                  ? 'border-neutral-300 hover:border-neutral-500 bg-neutral-100/50 hover:bg-neutral-100 shadow-sm'
                                  : 'border-[#2B2B2B] hover:border-neutral-500 bg-black/15 hover:bg-[#151515]'
                            }`}
                            style={{ borderColor: dragOver ? activeThemeColor : undefined }}
                            onClick={() => document.getElementById('local-file-selector')?.click()}
                          >
                            <input
                              id="local-file-selector"
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleLocalFilesUpload(e.target.files)}
                            />

                            {isUploading ? (
                              <div className="flex flex-col items-center gap-1.5 py-2">
                                <RefreshCw className="w-8 h-8 text-[#C5A059] animate-spin" style={{ color: activeThemeColor }} />
                                <span className="text-xs font-mono text-neutral-500">Sedang memproses & menyalurkan foto...</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-neutral-500" style={{ color: dragOver ? activeThemeColor : undefined }} />
                                <div>
                                  <p className={`text-xs font-medium transition-colors ${themeMode === 'light' ? 'text-neutral-800 font-semibold' : 'text-neutral-200'}`}>Klik untuk pilih berkas foto, atau Seret File (Drag & Drop) ke Sini</p>
                                  <p className="text-[10px] text-neutral-500 mt-1 font-mono">Mendukung file JPG, PNG, WEBP asli hasil pemotretan (Bisa multi-upload sekaligus)</p>
                                </div>
                              </>
                            )}
                          </div>

                          <div className={`flex items-center gap-4 justify-between p-2.5 rounded-lg border transition-colors ${
                            themeMode === 'light' ? 'bg-white border-neutral-200' : 'bg-black/25 border-[#222]'
                          }`}>
                            <span className={`text-[10px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Atur Tanggal Untuk Hasil Upload Di Atas:</span>
                            <input
                              type="date"
                              value={newPhotoDate}
                              onChange={(e) => setNewPhotoDate(e.target.value)}
                              className={`rounded px-2.5 py-1 text-xs focus:border-[#C5A059] outline-none font-mono transition-colors ${
                                themeMode === 'light' ? 'bg-neutral-50 border border-neutral-300 text-neutral-800' : 'bg-[#121212] border border-[#2E2E2E] text-white'
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* GOOGLE DRIVE & PUBLIC DIRECT LINK IMPORTER */}
                      {uploadTab === 'drive' && (
                        <div className="space-y-3.5 animate-fade-in">
                          <div className={`border p-3 rounded-lg text-[10px] font-mono leading-normal flex gap-2 transition-colors ${
                            themeMode === 'light' ? 'bg-[#EDF2FC] border-blue-200 text-blue-800' : 'bg-[#111A2E]/50 border-blue-900/30 text-blue-300'
                          }`}>
                            <span className="text-sm shrink-0">💡</span>
                            <div>
                              <strong className={`block mb-0.5 ${themeMode === 'light' ? 'text-blue-900 font-bold' : 'text-white'}`}>Panduan Penginputan File Google Drive:</strong>
                              1. Pastikan akses berkas foto di Google Drive Anda di-set ke <span className="text-white font-semibold">"Siapa saja yang memiliki link" (Anyone with the link)</span> agar publik bisa melihat.<br />
                              2. Masukkan link Google Drive (misalnya hasil klik kanan dan pilih "Salin Link") di bawah, sistem kami akan langsung menyulapnya menjadi render gambar langsung secara otomatis!
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1">
                              <label className={`text-[9px] font-mono flex items-center gap-1 transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>
                                <Link className="w-3.5 h-3.5 text-neutral-500" /> Tautan Google Drive Resmi Anda
                              </label>
                              <input
                                type="text"
                                placeholder="Plester tautan file Google Drive Anda (e.g. https://drive.google.com/...)"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                className={`w-full rounded px-2.5 py-1.5 text-xs focus:border-[#C5A059] outline-none font-mono transition-colors ${
                                  themeMode === 'light' ? 'bg-white border border-neutral-300 text-neutral-800' : 'bg-[#121212] border border-[#2E2E2E] text-white'
                                }`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className={`text-[9px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Tanggal Pemotretan</label>
                              <input
                                type="date"
                                value={newPhotoDate}
                                onChange={(e) => setNewPhotoDate(e.target.value)}
                                className={`w-full rounded px-2.5 py-1.5 text-xs focus:border-[#C5A059] outline-none font-mono transition-colors ${
                                  themeMode === 'light' ? 'bg-white border border-neutral-300 text-neutral-800' : 'bg-[#121212] border border-[#2E2E2E] text-white'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 space-y-1">
                              <label className={`text-[9px] font-mono transition-colors ${themeMode === 'light' ? 'text-neutral-600 font-semibold' : 'text-neutral-400'}`}>Beri Keterangan Momen / Caption Foto</label>
                              <input
                                type="text"
                                placeholder="Beri keterangan foto yang manis dan detail..."
                                value={newPhotoCaption}
                                onChange={(e) => setNewPhotoCaption(e.target.value)}
                                className={`w-full rounded px-2.5 py-1.5 text-xs focus:border-[#C5A059] outline-none transition-colors ${
                                  themeMode === 'light' ? 'bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400' : 'bg-[#121212] border border-[#2E2E2E] text-white'
                                }`}
                              />
                            </div>

                            <div className="flex items-end justify-end">
                              <button
                                type="button"
                                onClick={() => handleAddPhoto()}
                                className={`py-1.5 px-4 font-semibold text-xs rounded uppercase tracking-tight w-full sm:w-auto cursor-pointer transition-colors ${
                                  themeMode === 'light' ? 'bg-neutral-800 text-white hover:bg-neutral-950 font-bold' : 'bg-white text-black hover:bg-neutral-200'
                                }`}
                              >
                                Impor Dari Drive
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PHOTOS LIST AT WORK */}
                    <div className="space-y-2">
                      <span className={`text-[10px] font-mono block uppercase font-semibold transition-colors ${themeMode === 'light' ? 'text-neutral-700' : 'text-neutral-400'}`}>Daftar Foto di Album</span>
                      
                      {currentAlbum.photos.length === 0 ? (
                        <div className={`rounded-lg p-5 border border-dashed text-center text-xs font-mono transition-colors ${
                          themeMode === 'light' ? 'bg-neutral-50 border-neutral-300 text-neutral-500' : 'bg-neutral-900/50 border-neutral-800 text-neutral-500'
                        }`}>
                          Belum ada foto dikatalogkan. Silakan unggah karya orisinal Anda menggunakan opsi Galeri Lokal atau sematkan Link Google Drive di atas!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                          {currentAlbum.photos.map((photo) => (
                            <div key={photo.id} className={`rounded-lg p-2.5 border flex gap-3 items-center justify-between group transition-colors ${
                              themeMode === 'light' ? 'bg-neutral-50 border-neutral-200 shadow-sm' : 'bg-[#1A1A1A] border-[#252525]'
                            }`}>
                              <div className={`w-12 h-12 rounded overflow-hidden shrink-0 border transition-colors ${
                                themeMode === 'light' ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-800 border-[#2A2A2A]'
                              }`}>
                                <img src={photo.url} alt="sub" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold line-clamp-1 transition-colors ${themeMode === 'light' ? 'text-neutral-950' : 'text-white'}`}>{photo.caption}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] font-mono font-semibold" style={{ color: activeThemeColor }}>{photo.date}</span>
                                  <span className="text-[8px] text-neutral-500 font-mono">ID: {photo.id.substr(photo.id.length - 4)}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id)}
                                className={`p-1 cursor-pointer transition-colors ${
                                  themeMode === 'light' ? 'text-neutral-400 hover:text-red-600' : 'text-neutral-500 hover:text-red-400'
                                }`}
                                title="Buang Foto"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={`flex-1 flex flex-col justify-center items-center p-8 italic text-sm transition-colors ${
                    themeMode === 'light' ? 'text-neutral-500' : 'text-neutral-600'
                  }`}>
                    Silakan pilih atau tambahkan album kategori kegiatan di kolom kiri.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* CLIENT BOOKINGS / INQUIRIES LOG */}
        <section className={`border rounded-xl p-5 space-y-4 transition-colors ${
          themeMode === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#121212] border-[#2A2A2A]'
        }`}>
          <div className={`flex justify-between items-center border-b pb-3 transition-colors ${
            themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'
          }`}>
            <h3 className={`text-xs uppercase tracking-wider font-mono flex items-center gap-2 transition-colors ${
              themeMode === 'light' ? 'text-neutral-800 font-bold' : 'text-white'
            }`}>
              <MessageSquare className="w-4 h-4 text-green-500" />
              <span>📬 Inkuiri Booking & Pesan Calon Konsumen ({currentPhotographer.bookings.length})</span>
            </h3>
            <span className="text-[10px] text-neutral-500 font-mono">Disimpan di browser lokal Anda</span>
          </div>

          {currentPhotographer.bookings.length === 0 ? (
            <p className="text-xs text-neutral-500 font-mono italic text-center py-4">Belum ada inkuiri masuk dari calon konsumen. Portofolio Anda siap menanti!</p>
          ) : (
            <div className="space-y-3.5">
              {currentPhotographer.bookings.map((booking) => (
                <div 
                  key={booking.id}
                  className={`p-4 rounded-lg border flex flex-col md:flex-row justify-between gap-4 transition-all ${
                    booking.status === 'New' 
                      ? themeMode === 'light'
                        ? 'bg-green-50/50 border-green-250 text-neutral-850 shadow-sm'
                        : 'bg-[#181C15] border-green-900/40 text-neutral-300' 
                      : themeMode === 'light'
                        ? 'bg-neutral-50/50 border-neutral-200 text-neutral-600'
                        : 'bg-[#141414] border-[#222] text-neutral-400'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm transition-colors ${
                        themeMode === 'light' ? 'text-neutral-900' : 'text-white'
                      }`}>{booking.clientName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold transition-colors ${
                        themeMode === 'light' ? 'bg-neutral-200 text-neutral-700' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {booking.eventType}
                      </span>
                      <span className="text-[9px] font-mono flex items-center gap-1 font-bold" style={{ color: activeThemeColor }}>
                        <Calendar className="w-3 h-3" /> Event: {booking.eventDate}
                      </span>
                    </div>

                    <p className={`text-xs leading-normal px-3 py-2 rounded mt-1.5 italic font-light transition-colors ${
                      themeMode === 'light' ? 'bg-white border border-neutral-150 text-neutral-700' : 'bg-black/40 text-neutral-300'
                    }`}>
                      "{booking.message}"
                    </p>

                    <div className={`flex flex-wrap gap-x-4 gap-y-1 pt-2.5 text-[10px] font-mono transition-colors ${
                      themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-500'
                    }`}>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {booking.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {booking.phone}</span>
                      <span className="ml-auto text-[9px] text-neutral-400">Didaftarkan: {new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end items-end gap-1.5 shrink-0 self-end md:self-center">
                    {booking.status === 'New' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(booking.id)}
                        className="py-1 px-3 text-[#111111] hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-750 text-[10px] font-bold rounded cursor-pointer transition-colors"
                        style={{ backgroundColor: activeThemeColor }}
                      >
                        ✓ Tandai Direspon
                      </button>
                    )}
                    {booking.status === 'Replied' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateBookingStatus(booking.id)}
                        className={`py-1 px-3 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                          themeMode === 'light'
                            ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 border border-neutral-300'
                            : 'bg-neutral-850 text-neutral-300 hover:bg-neutral-700 border border-[#333]'
                        }`}
                      >
                        ✓ Selesaikan Kerja
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleDeleteBooking(booking.id)}
                      className={`py-1 px-3 text-[10px] rounded cursor-pointer transition-colors ${
                        themeMode === 'light' ? 'text-neutral-500 hover:text-red-600 hover:bg-red-50' : 'text-neutral-500 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      Dibelakang layar / Buang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
