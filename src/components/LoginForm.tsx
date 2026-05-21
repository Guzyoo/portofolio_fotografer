import React, { useState } from 'react';
import { Photographer } from '../types';
import { INITIAL_PHOTOGRAPHERS } from '../data';
import { Camera, Lock, User, ShieldAlert, Key, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';

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
}

export default function LoginForm({ photographers, onLogin, onRegister }: LoginFormProps) {
  // Modes: 'login' or 'register'
  const [isRegister, setIsRegister] = useState(false);

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
    if (cleanUsername === 'admin' && cleanPassword === 'admin') {
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
    <div id="login-container" className="flex-1 flex items-center justify-center bg-[#070707] p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative ambient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div id="login-card" className="w-full max-w-md bg-[#121212]/90 border border-[#262626] rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Brand header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#735A2D] rounded-xl flex items-center justify-center text-black font-bold shadow-lg shadow-[#C5A059]/10">
            <Camera className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
              {isRegister ? 'Daftar Portofolio' : 'Akses Workspace'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {isRegister 
                ? 'Buat akun Anda secara mandiri untuk langsung memiliki galeri premium!' 
                : 'Masuk untuk mengelola album, bio, & inkuiri booking Anda'}
            </p>
          </div>
        </div>

        {/* Dynamic Mode Switch Links */}
        <div className="flex border-b border-[#222] mb-6 text-xs text-center font-mono">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 pb-2.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              !isRegister ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'text-neutral-500 hover:text-neutral-300'
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
              isRegister ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Daftar Baru ✨
          </button>
        </div>

        {/* Global Error Notice */}
        {errorMsg && (
          <div className="p-3 mb-4 bg-red-950/40 border border-red-900/40 rounded-lg flex items-start gap-2 text-red-400 text-xs animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM FACE */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 block">Nama Pengguna (Username)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="dikawijaya atau admin"
                  className="w-full bg-[#181818] border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 block">Kata Sandi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181818] border border-[#2B2B2B] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059] transition-colors"
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
              <label className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 block">Nama Bisnis / Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 justify-center">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </span>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Contoh: Budi Santoso Photography"
                  className="w-full bg-[#181818] border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 block">Username Portofolio (Untuk Link URL)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 font-mono text-xs">
                  @
                </span>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="budiphotos"
                  className="w-full bg-[#181818] border border-[#2B2B2B] rounded-lg pl-8 pr-4 py-2.5 text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                  required
                />
              </div>
              <p className="text-[9px] text-neutral-500 font-mono">Contoh alamat portfolio publik Anda: www.domain/?photographer={registerUsername || 'username'}</p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 block">Sandi Akun</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Sandi keamanan Anda"
                  className="w-full bg-[#181818] border border-[#2B2B2B] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5A059] transition-colors"
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
