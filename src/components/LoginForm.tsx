import React, { useState } from 'react';
import { Photographer } from '../types';
import { INITIAL_PHOTOGRAPHERS } from '../data';
import { 
  Camera, Lock, User, ShieldAlert, Key, Eye, EyeOff, UserPlus, 
  Sparkles, ChevronLeft, HelpCircle, CheckCircle 
} from 'lucide-react';

interface SessionUser {
  role: 'admin' | 'photographer';
  photographerId?: string;
  username: string;
  name: string;
}

interface LoginFormProps {
  photographers: Photographer[];
  onLogin: (session: SessionUser) => void;
  onRegister: (name: string, username: string, password?: string) => void;
  onUpdatePassword?: (photographerId: string, newPassword: string) => void;
  themeMode?: 'dark' | 'light';
}

export default function LoginForm({ 
  photographers, 
  onLogin, 
  onRegister, 
  onUpdatePassword, 
  themeMode = 'dark' 
}: LoginFormProps) {
  // Modes: 'login' or 'register'
  const [isRegister, setIsRegister] = useState(false);

  // Forgot Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'username' | 'verify' | 'reset'>('username');
  const [forgotUsername, setForgotUsername] = useState('');
  const [foundPhotographer, setFoundPhotographer] = useState<Photographer | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [newForgotPassword, setNewForgotPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Masking helpers for Forgot Password
  const maskEmailAddress = (emailStr: string) => {
    if (!emailStr) return '***';
    const parts = emailStr.split('@');
    if (parts.length < 2) return '***';
    const local = parts[0];
    const domain = parts[1];
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    return `${local.substring(0, 2)}***${local[local.length - 1]}@${domain}`;
  };

  const maskPhoneNumber = (phoneStr: string) => {
    if (!phoneStr) return '***';
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length <= 4) return '***';
    return `${digits.substring(0, 4)}*****${digits.substring(digits.length - 3)}`;
  };

  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register states
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMsg('Harap isi nama pengguna dan sandi.');
      return;
    }

    // 1. Check if Super Admin / Developer
    if (cleanUsername === 'admin' && cleanPassword === 'psiko4dm1n') {
      onLogin({
        role: 'admin',
        username: 'psiko4dm1n',
        name: 'Super Admin Developer'
      });
      return;
    }

    // 2. Check standard Photographers
    const match = photographers.find(
      p => p.username.toLowerCase() === cleanUsername
    );

    if (match) {
      // Look up in INITIAL_PHOTOGRAPHERS too for fallback password
      const initMatch = INITIAL_PHOTOGRAPHERS.find(ip => ip.id === match.id);
      const fallbackPassword = initMatch?.password || match.username;
      const expectedPassword = match.password || fallbackPassword;

      if (cleanPassword === expectedPassword) {
        onLogin({
          role: 'photographer',
          photographerId: match.id,
          username: match.username,
          name: match.name
        });
      } else {
        setErrorMsg('Kata sandi salah. Harap coba lagi atau hubungi Developer.');
      }
    } else {
      setErrorMsg('Nama pengguna (username) fotografer tidak terdaftar.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = registerName.trim();
    const formattedUsername = registerUsername.toLowerCase().trim().replace(/\s+/g, '');
    const trimmedPassword = registerPassword.trim();

    if (!trimmedName || !formattedUsername || !trimmedPassword) {
      setErrorMsg('Harap isi lengkap semua kolom pendaftaran.');
      return;
    }

    if (formattedUsername === 'admin') {
      setErrorMsg('Username "admin" dilindungi khusus untuk Super Admin Developer.');
      return;
    }

    if (formattedUsername.length < 3) {
      setErrorMsg('Username minimal harus sepanjang 3 karakter.');
      return;
    }

    // Check unique username
    const isTaken = photographers.some(p => p.username.toLowerCase() === formattedUsername);
    if (isTaken) {
      setErrorMsg(`Username "@${formattedUsername}" sudah digunakan oleh fotografer lain.`);
      return;
    }

    // Triggers registration & auto-login inside App.tsx
    onRegister(trimmedName, formattedUsername, trimmedPassword);
  };

  return (
    <div id="login-container" className={`flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-300 ${
      themeMode === 'light' ? 'bg-[#EDEFF2]' : 'bg-[#070707]'
    }`}>
      {/* Decorative ambient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div id="login-card" className={`w-full max-w-md rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10 transition-colors duration-300 ${
        themeMode === 'light' 
          ? 'bg-white/95 border border-neutral-200 shadow-xl' 
          : 'bg-[#121212]/90 border border-[#262626]'
      }`}>
        
        {/* Brand header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#735A2D] rounded-xl flex items-center justify-center text-black font-bold shadow-lg shadow-[#C5A059]/10">
            {isForgotPassword ? (
              <HelpCircle className="w-6 h-6 text-black" />
            ) : (
              <Camera className="w-6 h-6 text-black" />
            )}
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase font-sans ${themeMode === 'light' ? 'text-neutral-900' : 'text-white'}`}>
              {isForgotPassword ? 'Pemulihan Sandi' : isRegister ? 'Daftar Portofolio' : 'Akses Workspace'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {isForgotPassword 
                ? 'Pulihkan kata sandi akun fotografer Anda secara aman' 
                : isRegister 
                  ? 'Buat akun Anda secara mandiri untuk langsung memiliki galeri premium!' 
                  : 'Masuk untuk mengelola album, bio, & inkuiri booking Anda'}
            </p>
          </div>
        </div>

        {/* Dynamic Mode Switch Links */}
        {!isForgotPassword && (
          <div className={`flex border-b mb-6 text-xs text-center font-mono ${themeMode === 'light' ? 'border-neutral-200' : 'border-[#222]'}`}>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMsg('');
              }}
              className={`flex-1 pb-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                !isRegister ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : (themeMode === 'light' ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300')
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMsg('');
              }}
              className={`flex-1 pb-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                isRegister ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : (themeMode === 'light' ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-neutral-300')
              }`}
            >
              Daftar Baru ✨
            </button>
          </div>
        )}

        {/* Global Error Notice */}
        {errorMsg && (
          <div className="p-3 mb-4 bg-red-950/40 border border-red-900/40 rounded-lg flex items-start gap-2 text-red-400 text-xs animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isForgotPassword ? (
          /* FORGOT PASSWORD WORKFLOW STEP-BY-STEP */
          <div className="space-y-4 animate-fade-in">
            {/* STEP 1: ENTER USERNAME */}
            {forgotStep === 'username' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg('');
                const clean = forgotUsername.trim().toLowerCase();
                if (!clean) {
                  setErrorMsg('Harap masukkan username Anda.');
                  return;
                }
                const match = photographers.find(p => p.username.toLowerCase() === clean);
                if (match) {
                  setFoundPhotographer(match);
                  setForgotStep('verify');
                  setVerificationInput('');
                  setErrorMsg('');
                } else {
                  setErrorMsg(`Username "@${clean}" tidak terdaftar di sistem kami.`);
                }
              }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Nama Pengguna (Username) Akun
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 text-xs font-mono">
                      @
                    </span>
                    <input
                      type="text"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      placeholder="Username Anda (misalnya: dikawijaya)"
                      className={`w-full rounded-lg pl-8 pr-4 py-2.5 text-sm transition-colors ${
                        themeMode === 'light'
                          ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                          : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                      }`}
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono">Kami akan mencari profil Anda untuk memverifikasi kontak pemulihan.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setErrorMsg('');
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase font-mono tracking-wider transition-colors border cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                        : 'bg-neutral-900 border-[#2B2B2B] hover:bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#C5A059] hover:bg-[#DBC18A] text-black font-bold text-xs uppercase rounded-lg transition-all tracking-wider font-mono cursor-pointer"
                  >
                    Cari Akun
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: VERIFY CONTACT (EMAIL/WHATSAPP) */}
            {forgotStep === 'verify' && foundPhotographer && (
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg('');
                const inputVal = verificationInput.trim().toLowerCase();
                const cleanPhoneInput = inputVal.replace(/\D/g, '');
                
                const dbEmail = foundPhotographer.email.toLowerCase().trim();
                const dbPhone = foundPhotographer.whatsapp.replace(/\D/g, '');

                if (inputVal === dbEmail || (cleanPhoneInput && cleanPhoneInput === dbPhone)) {
                  setForgotStep('reset');
                  setNewForgotPassword('');
                  setErrorMsg('');
                } else {
                  setErrorMsg('Data kontak verifikasi tidak cocok dengan profil terdaftar Anda.');
                }
              }} className="space-y-4">
                <div className="p-3 rounded-lg border transition-colors text-xs space-y-1.5 leading-relaxed bg-[#C5A059]/5 border-[#C5A059]/20">
                  <p className={`font-semibold ${themeMode === 'light' ? 'text-neutral-900 font-bold' : 'text-white'}`}>Informasi Akun Ditemukan:</p>
                  <p className="text-neutral-400 font-mono text-[11px]"><strong className="text-[#C5A059]">Nama:</strong> {foundPhotographer.name}</p>
                  <div className="space-y-0.5 text-[10px] font-mono text-neutral-500 pt-1 border-t border-[#C5A059]/10">
                    <p>📧 Email Terdaftar: <strong className="text-neutral-400">{maskEmailAddress(foundPhotographer.email)}</strong></p>
                    {foundPhotographer.whatsapp && <p>📱 No. WhatsApp: <strong className="text-neutral-400">+{maskPhoneNumber(foundPhotographer.whatsapp)}</strong></p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Konfirmasi Kontak Verifikasi
                  </label>
                  <input
                    type="text"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    placeholder="Masukkan alamat email lengkap atau no WA..."
                    className={`w-full rounded-lg px-4 py-2.5 text-sm transition-colors ${
                      themeMode === 'light'
                        ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                        : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                    }`}
                    required
                    autoFocus
                  />
                  <p className="text-[10px] text-neutral-500 font-mono">Harap ketik ulang salah satu kontak utama lengkap untuk membuktikan kepemilikan Anda.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('username');
                      setErrorMsg('');
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase font-mono tracking-wider transition-colors border cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                        : 'bg-neutral-900 border-[#2B2B2B] hover:bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#C5A059] hover:bg-[#DBC18A] text-black font-bold text-xs uppercase rounded-lg transition-all tracking-wider font-mono cursor-pointer"
                  >
                    Verifikasi
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: RESET TO NEW PASSWORD */}
            {forgotStep === 'reset' && foundPhotographer && (
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg('');
                const cleanPass = newForgotPassword.trim();
                if (cleanPass.length < 4) {
                  setErrorMsg('Sandi baru Anda harus memiliki minimal 4 karakter.');
                  return;
                }

                if (onUpdatePassword) {
                  onUpdatePassword(foundPhotographer.id, cleanPass);
                }

                // Auto login!
                onLogin({
                  role: 'photographer',
                  photographerId: foundPhotographer.id,
                  username: foundPhotographer.username,
                  name: foundPhotographer.name
                });
              }} className="space-y-4">
                <div className="p-3 mb-2 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-lg text-xs flex gap-2">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Verifikasi Sukses! Silakan tetapkan kata sandi baru untuk akun Anda agar langsung login.</span>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      value={newForgotPassword}
                      onChange={(e) => setNewForgotPassword(e.target.value)}
                      placeholder="Masukkan sandi baru..."
                      className={`w-full rounded-lg pl-10 pr-10 py-2.5 text-sm transition-colors ${
                        themeMode === 'light'
                          ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                          : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                      }`}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#C5A059] hover:bg-[#DBC18A] active:scale-[0.98] text-black font-bold text-sm uppercase rounded-lg transition-all tracking-wider shadow-md shadow-[#C5A059]/10 cursor-pointer flex items-center justify-center gap-2 font-mono"
                >
                  <Lock className="w-4 h-4" />
                  Simpan & Masuk Akun
                </button>
              </form>
            )}
          </div>
        ) : !isRegister ? (
          /* 1. LOGIN FORM FACE */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Nama Pengguna (Username)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="dikawijaya atau admin"
                  className={`w-full rounded-lg pl-10 pr-4 py-2.5 text-sm transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                      : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Kata Sandi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-lg pl-10 pr-10 py-2.5 text-sm transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                      : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lupa Sandi Trigger Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setForgotStep('username');
                  setForgotUsername('');
                  setVerificationInput('');
                  setNewForgotPassword('');
                  setErrorMsg('');
                }}
                className={`text-[10px] font-mono hover:underline transition-colors cursor-pointer ${
                  themeMode === 'light' ? 'text-[#735A2D] hover:text-[#C5A059]' : 'text-neutral-500 hover:text-[#C5A059]'
                }`}
              >
                Lupa kata sandi?
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-[#C5A059] hover:bg-[#DBC18A] active:scale-[0.98] text-black font-bold text-sm uppercase rounded-lg transition-all tracking-wider shadow-md shadow-[#C5A059]/10 cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              <Lock className="w-4 h-4" />
              Masuk
            </button>
          </form>
        ) : (
          /* 2. REGISTRATION FORM FACE */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Nama Bisnis / Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 justify-center">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </span>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Contoh: Budi Santoso Photography"
                  className={`w-full rounded-lg pl-10 pr-4 py-2.5 text-sm transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                      : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Username Portofolio (Untuk Link URL)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 font-mono text-xs">
                  @
                </span>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="budiphotos"
                  className={`w-full rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                      : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                  }`}
                  required
                />
              </div>
              <p className="text-[9px] text-neutral-500 font-mono">Contoh alamat portfolio publik Anda: www.domain/?photographer={registerUsername || 'username'}</p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={`text-[11px] uppercase tracking-wider font-mono block ${themeMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Sandi Akun</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Sandi keamanan Anda"
                  className={`w-full rounded-lg pl-10 pr-10 py-2.5 text-sm transition-colors ${
                    themeMode === 'light'
                      ? 'bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#C5A059]'
                      : 'bg-[#181818] border border-[#2B2B2B] text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-[#C5A059] hover:bg-[#DBC18A] active:scale-[0.98] text-black font-bold text-sm uppercase rounded-lg transition-all tracking-wider shadow-md shadow-[#C5A059]/10 cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
