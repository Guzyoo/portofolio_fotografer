import { useState, useEffect } from 'react';
import { Photographer, Booking } from './types';
import { INITIAL_PHOTOGRAPHERS } from './data';
import AdminPanel from './components/AdminPanel';
import ClientView from './components/ClientView';
import LoginForm from './components/LoginForm';
import { 
  Camera, Settings, Eye, Globe, ChevronRight, User, 
  Sparkles, Smartphone, Check, Play, Share2
} from 'lucide-react';

interface SessionUser {
  role: 'admin' | 'photographer';
  photographerId?: string;
  username: string;
  name: string;
}

export default function App() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [activePhotographerId, setActivePhotographerId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'editor' | 'public'>('editor');
  const [globalNotif, setGlobalNotif] = useState<string>('');

  // Sesi pengguna aktif (Admin atau Fotografer tertentu)
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(() => {
    const saved = localStorage.getItem('photofolio_pro_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // 1. Initial Load & Local Storage seeding
  useEffect(() => {
    const stored = localStorage.getItem('photofolio_pro_data');
    let loadedPhotographers: Photographer[] = [];

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Photographer[];
        let migrated = false;
        loadedPhotographers = parsed.map(p => {
          // Cari fotografer asli untuk mendapatkan kata sandinya
          const initMatch = INITIAL_PHOTOGRAPHERS.find(init => init.id === p.id);
          if (initMatch && initMatch.password && !p.password) {
            migrated = true;
            return { ...p, password: initMatch.password };
          }
          return p;
        });
        if (migrated) {
          localStorage.setItem('photofolio_pro_data', JSON.stringify(loadedPhotographers));
        }
      } catch (e) {
        loadedPhotographers = INITIAL_PHOTOGRAPHERS;
      }
    } else {
      loadedPhotographers = INITIAL_PHOTOGRAPHERS;
      localStorage.setItem('photofolio_pro_data', JSON.stringify(INITIAL_PHOTOGRAPHERS));
    }

    setPhotographers(loadedPhotographers);

    // 2. URL Sharing Link Detection (?photographer=giripratama)
    const params = new URLSearchParams(window.location.search);
    const sharedUsername = params.get('photographer');

    if (sharedUsername) {
      const match = loadedPhotographers.find(p => p.username.toLowerCase() === sharedUsername.toLowerCase());
      if (match) {
        setActivePhotographerId(match.id);
        setViewMode('public');
        setGlobalNotif(`Membuka portofolio publik: ${match.name}`);
        setTimeout(() => setGlobalNotif(''), 4000);
        return;
      }
    }

    // Default active profile
    if (loadedPhotographers.length > 0) {
      // Jika login sebagai fotografer biasa, langsung arahkan ke profilnya
      const savedSessionStr = localStorage.getItem('photofolio_pro_session');
      if (savedSessionStr) {
        try {
          const session = JSON.parse(savedSessionStr);
          if (session.role === 'photographer' && session.photographerId) {
            const match = loadedPhotographers.find(p => p.id === session.photographerId);
            if (match) {
              setActivePhotographerId(match.id);
              return;
            }
          }
        } catch {}
      }
      setActivePhotographerId(loadedPhotographers[0].id);
    }
  }, []);

  // Sinkronisasi active profile jika currentUser fotografer berubah
  useEffect(() => {
    if (currentUser && currentUser.role === 'photographer' && currentUser.photographerId) {
      setActivePhotographerId(currentUser.photographerId);
    }
  }, [currentUser]);

  // Save changes helper
  const savePhotographersData = (updated: Photographer[]) => {
    setPhotographers(updated);
    localStorage.setItem('photofolio_pro_data', JSON.stringify(updated));
  };

  const handleLogin = (session: SessionUser) => {
    setCurrentUser(session);
    localStorage.setItem('photofolio_pro_session', JSON.stringify(session));
    if (session.role === 'photographer' && session.photographerId) {
      setActivePhotographerId(session.photographerId);
    }
    setGlobalNotif(`Berhasil masuk sebagai: ${session.name}`);
    setTimeout(() => setGlobalNotif(''), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('photofolio_pro_session');
    
    // Reset active profile ke index pertama setelah sign out
    if (photographers.length > 0) {
      setActivePhotographerId(photographers[0].id);
    }
    setGlobalNotif("Sesi aktif berhasil ditutup.");
    setTimeout(() => setGlobalNotif(''), 3000);
  };

  const handleSelectPhotographer = (id: string) => {
    // Standard user tidak boleh switch, tapi double check safety
    if (currentUser?.role === 'photographer' && currentUser.photographerId !== id) {
      return;
    }
    setActivePhotographerId(id);
  };

  const handleCreatePhotographer = (name: string, username: string, password?: string) => {
    const newId = 'photographer-' + Date.now();
    const newProfile: Photographer = {
      id: newId,
      username: username,
      password: password || username, // fallback sandi ke username jika dikosongkan
      name: name,
      bio: `Halo! Saya adalah ${name}, fotografer profesional siap menangkap kilatan cahaya dan senyuman tulus Anda.`,
      specialtyTags: ['Potret', 'Lifestyle'],
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      whatsapp: '628123456789',
      instagram: username,
      email: `${username}@gmail.com`,
      themeColor: '#C5A059',
      layoutStyle: 'Classic Album',
      albums: [],
      bookings: []
    };

    const updated = [...photographers, newProfile];
    savePhotographersData(updated);
    setActivePhotographerId(newId);
  };

  const handleRegisterPhotographer = (name: string, username: string, password?: string) => {
    const newId = 'photographer-' + Date.now();
    const newProfile: Photographer = {
      id: newId,
      username: username,
      password: password || username,
      name: name,
      bio: `Halo! Saya adalah ${name}, fotografer profesional siap menangkap kilatan cahaya dan senyuman tulus Anda.`,
      specialtyTags: ['Potret', 'Lifestyle'],
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      whatsapp: '628123456789',
      instagram: username,
      email: `${username}@gmail.com`,
      themeColor: '#C5A059',
      layoutStyle: 'Classic Album',
      albums: [],
      bookings: []
    };

    const updated = [...photographers, newProfile];
    savePhotographersData(updated);
    setActivePhotographerId(newId);
    
    // Auto-login!
    handleLogin({
      role: 'photographer',
      photographerId: newId,
      username: username,
      name: name
    });
  };

  const handleDeletePhotographer = (idToDelete: string) => {
    if (photographers.length <= 1) {
      setGlobalNotif("Gagal menghapus: Harus ada minimal 1 profil fotografer di sistem!");
      setTimeout(() => setGlobalNotif(''), 4000);
      return;
    }

    const updated = photographers.filter(p => p.id !== idToDelete);
    savePhotographersData(updated);

    if (activePhotographerId === idToDelete) {
      setActivePhotographerId(updated[0].id);
    }

    setGlobalNotif("Akun fotografer berhasil dihapus secara permanen.");
    setTimeout(() => setGlobalNotif(''), 4000);
  };

  const handleUpdatePhotographer = (updatedProfile: Photographer) => {
    const updated = photographers.map(p => {
      if (p.id === updatedProfile.id) {
        return updatedProfile;
      }
      return p;
    });
    savePhotographersData(updated);
  };

  // Safe submission of bookings from the client side
  const handleSubmitBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: 'book-' + Date.now(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    const updated = photographers.map(p => {
      if (p.id === activePhotographerId) {
        return {
          ...p,
          bookings: [newBooking, ...p.bookings]
        };
      }
      return p;
    });

    savePhotographersData(updated);
  };

  const activePhotographer = photographers.find(p => p.id === activePhotographerId) || photographers[0];

  if (!activePhotographer) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A] text-white">
        <div className="text-center space-y-2 font-mono">
          <p className="animate-pulse">Memuat Database Fotografer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans flex flex-col overflow-x-hidden">
      
      {/* GLOBAL BANNER NOTIFICATION */}
      {globalNotif && (
        <div className="bg-[#C5A059] text-black text-center text-xs py-2 font-semibold tracking-wide animate-pulse flex items-center justify-center gap-2">
          <span>{globalNotif}</span>
          <button onClick={() => setGlobalNotif('')} className="font-bold underline ml-1">Tutup</button>
        </div>
      )}

      {/* TOP HEADER STATUS & DESK / VIEWER SWITCHER */}
      <header className="h-16 border-b border-[#2A2A2A] bg-[#121212] flex items-center justify-between px-4 sm:px-8 shrink-0 z-50 sticky top-0">
        
        {/* APP BRAND */}
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-md flex items-center justify-center text-black font-bold text-sm transition-transform shadow-md"
            style={{ backgroundColor: activePhotographer.themeColor || '#C5A059' }}
          >
            P
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-tight uppercase">
            Photofolio <span className="font-light" style={{ color: activePhotographer.themeColor || '#C5A059' }}>PRO</span>
          </span>
        </div>

        {/* WORKSPACE & CLIENT MODE DETECTOR */}
        <div className="bg-[#1A1A1A] p-1 rounded-lg border border-[#2D2D2D] flex items-center">
          <button
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'editor' 
                ? 'bg-neutral-800 text-white shadow-md' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Workspace Admin
          </button>
          
          <button
            onClick={() => setViewMode('public')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'public' 
                ? 'bg-neutral-800 text-white shadow-md' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Tampilan Publik
          </button>
        </div>

        {/* PROFILE BADGE OR SHARE LINK SIMULATOR */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono">
            Kreator: <strong className="text-white">{activePhotographer.name}</strong>
          </span>
          <div 
            className="w-8 h-8 rounded-full bg-cover bg-center border shadow-inner"
            style={{ 
              backgroundImage: `url(${activePhotographer.avatarUrl})`,
              borderColor: activePhotographer.themeColor || '#C5A059' 
            }}
          />
        </div>
      </header>

      {/* CORE FRAME CONTENT SCREEN */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'editor' ? (
          !currentUser ? (
            <LoginForm 
              photographers={photographers}
              onLogin={handleLogin}
              onRegister={handleRegisterPhotographer}
            />
          ) : (
            <AdminPanel 
              photographers={photographers}
              activeId={activePhotographerId}
              onSelectPhotographer={handleSelectPhotographer}
              onCreatePhotographer={handleCreatePhotographer}
              onUpdatePhotographer={handleUpdatePhotographer}
              onViewPublicPortofolio={() => setViewMode('public')}
              currentUser={currentUser}
              onLogout={handleLogout}
              onDeletePhotographer={handleDeletePhotographer}
            />
          )
        ) : (
          <ClientView 
            photographer={activePhotographer}
            onSubmitBooking={handleSubmitBooking}
          />
        )}
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <footer className="h-8 bg-[#121212] border-t border-[#2A2A2A] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#555] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 
            Session: Multi-Fotografer Portofolio Aktiv ({photographers.length} Profil Terdaftar)
          </span>
        </div>
        <div className="text-[10px] text-[#555] font-mono hidden sm:block">
          Ubah Layout: Classic Album, Polaroid Cards, Grid • Elegant Dark
        </div>
      </footer>
    </div>
  );
}
