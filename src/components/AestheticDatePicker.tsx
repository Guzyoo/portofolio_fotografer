import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, Check } from 'lucide-react';

interface AestheticDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  themeColor: string;
  themeMode?: 'dark' | 'light';
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_LABELS = ['Mi', 'Se', 'Sl', 'Ra', 'Ka', 'Ju', 'Sa'];

export default function AestheticDatePicker({ selectedDate, onChange, themeColor, themeMode = 'dark' }: AestheticDatePickerProps) {
  const today = new Date();
  
  // Set default date to today if empty on first load
  useEffect(() => {
    if (!selectedDate) {
      const todayString = formatDateToString(today);
      onChange(todayString);
    }
  }, [selectedDate, onChange]);

  // Calendar navigation state
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);

  // Synchronize view window with outer selection changes
  useEffect(() => {
    if (selectedDate) {
      const dateParts = selectedDate.split('-');
      if (dateParts.length === 3) {
        const y = parseInt(dateParts[0], 10);
        const m = parseInt(dateParts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setViewYear(y);
          setViewMonth(m);
        }
      }
    }
  }, [selectedDate]);

  function formatDateToString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }

  function getHumanReadableDate(dateStr: string): string {
    if (!dateStr) return 'Pilih Tanggal Booking...';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const day = d.getDate();
      const month = MONTH_NAMES[d.getMonth()];
      const year = d.getFullYear();
      
      const dayOfWeekOptions = { weekday: 'long' as const };
      const dayName = d.toLocaleDateString('id-ID', dayOfWeekOptions);

      return `${dayName}, ${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  }

  // Generate Quick Automatic Date Presets
  const getQuickPresets = () => {
    const presets = [];

    // 1. Besok (Tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    presets.push({
      label: 'Besok',
      date: formatDateToString(tomorrow),
      desc: 'H+1 Pemotretan'
    });

    // 2. Sabtu Ini (This Saturday) / Akhir Pekan Ini
    const satIni = new Date();
    const currentDay = satIni.getDay(); // 0-6
    const daysUntilSaturday = (6 - currentDay + 7) % 7;
    // If it is already Saturday, configure next weekend
    const addDays = daysUntilSaturday === 0 ? 7 : daysUntilSaturday;
    satIni.setDate(satIni.getDate() + addDays);
    presets.push({
      label: 'Sabtu Besok',
      date: formatDateToString(satIni),
      desc: 'Weekend Sesi'
    });

    // 3. Bulan Depan (Next Month - 1st)
    const bulanDepan = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    presets.push({
      label: 'Awal Bulan Depan',
      date: formatDateToString(bulanDepan),
      desc: `1 ${MONTH_NAMES[bulanDepan.getMonth()]}`
    });

    return presets;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Generate days grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // Sunday=0, Monday=1, ...

  const calendarGrid = [];
  
  // Fillers for empty days of preceding month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarGrid.push({ isCurrent: false, dayNum: 0 });
  }

  // Active days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarGrid.push({ isCurrent: true, dayNum: d });
  }

  const handleSelectDay = (dayNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const selected = new Date(viewYear, viewMonth, dayNum);
    const dateStr = formatDateToString(selected);
    onChange(dateStr);
    setShowCalendar(false);
  };

  const currentPresets = getQuickPresets();

  return (
    <div id="aesthetic-date-picker-root" className="space-y-2 relative">
      <label className={`text-[10px] font-mono tracking-wider flex items-center justify-between transition-colors ${
        themeMode === 'light' ? 'text-neutral-500 font-medium' : 'text-neutral-400'
      }`}>
        <span>Tanggal Sesi Foto Direncanakan</span>
        <span className="text-neutral-500 text-[9px] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" style={{ color: themeColor }} /> Tanggal Terpilih & Terintegrasi
        </span>
      </label>

      {/* Quick Auto Presets Row - Scrollable horizontally to prevent wrapping/cutoff */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-1.5 pb-2 scrollbar-none max-w-full">
        {currentPresets.map((preset) => {
          const isActive = selectedDate === preset.date;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.date)}
              className="py-1 px-2.5 rounded-lg text-[9px] font-mono transition-all flex items-center gap-1 border cursor-pointer shrink-0"
              style={{
                backgroundColor: isActive ? `${themeColor}20` : (themeMode === 'light' ? '#FAFAFB' : '#161616'),
                borderColor: isActive ? themeColor : (themeMode === 'light' ? '#E5E5E5' : '#222222'),
                color: isActive ? (themeMode === 'light' ? '#000000' : '#FFFFFF') : (themeMode === 'light' ? '#666666' : '#888888'),
              }}
            >
              {isActive && <Check className="w-2.5 h-2.5" style={{ color: themeColor }} />}
              <div>
                <span className="font-semibold">{preset.label}</span>
                <span className="opacity-60 text-[8px] block">{preset.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Trigger Selector Field */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className={`w-full border rounded-xl px-3.5 py-3 text-xs transition-all text-left flex items-center justify-between cursor-pointer ${
            themeMode === 'light'
              ? 'bg-[#FAFAFA] hover:bg-neutral-100 border-neutral-300 text-neutral-800'
              : 'bg-[#181818] hover:bg-[#1E1E1E] border-[#2B2B2B] text-white hover:border-neutral-500'
          }`}
          style={{ borderColor: showCalendar ? themeColor : undefined }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: themeColor }} />
            <span className={`${selectedDate ? (themeMode === 'light' ? 'text-neutral-900' : 'text-white') : 'text-neutral-500'} font-medium`}>
              {getHumanReadableDate(selectedDate)}
            </span>
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md ${
            themeMode === 'light' ? 'text-neutral-700 bg-neutral-100 border border-neutral-200' : 'text-[#999] bg-neutral-900 border border-[#2A2A2A]'
          }`}>
            {showCalendar ? 'TENTUKAN' : 'KALENDAR'}
          </span>
        </button>

        {/* Floating Beautiful Calendar Container */}
        <AnimatePresence>
          {showCalendar && (
            <>
              {/* Overlay Backdrop to close when clicking outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowCalendar(false)} 
              />

              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`absolute z-50 left-0 right-0 mt-2 border rounded-2xl p-4 shadow-2xl space-y-3 max-w-sm mx-auto ${
                  themeMode === 'light' ? 'bg-white border-neutral-300 shadow-xl text-neutral-800' : 'bg-[#141414] border-[#2C2C2C] text-white'
                }`}
              >
                {/* Month/Year Controller Header */}
                <div className={`flex items-center justify-between border-b pb-2.5 ${themeMode === 'light' ? 'border-neutral-200' : 'border-neutral-900/60'}`}>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className={`p-1 px-1.5 border rounded-lg transition-colors ${
                      themeMode === 'light' ? 'bg-neutral-105 hover:bg-neutral-200 border-neutral-300 text-neutral-750' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-white/70'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className={`text-xs font-mono font-semibold tracking-widest uppercase ${themeMode === 'light' ? 'text-neutral-800' : 'text-white'}`}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className={`p-1 px-1.5 border rounded-lg transition-colors ${
                      themeMode === 'light' ? 'bg-neutral-105 hover:bg-neutral-200 border-neutral-300 text-neutral-750' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-white/70'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grid Day Labels */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {DAY_LABELS.map((lbl, idx) => (
                    <span 
                      key={lbl} 
                      className={`text-[9px] font-mono uppercase tracking-wider ${
                        idx === 0 ? 'text-red-500 font-bold' : (themeMode === 'light' ? 'text-neutral-400' : 'text-neutral-500')
                      }`}
                    >
                      {lbl}
                    </span>
                  ))}
                </div>

                {/* Calendar Grid Date Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarGrid.map((item, idx) => {
                    if (item.dayNum === 0) {
                      return <div key={`empty-${idx}`} />;
                    }

                    const itemDate = new Date(viewYear, viewMonth, item.dayNum);
                    const itemDateStr = formatDateToString(itemDate);
                    const isSelected = selectedDate === itemDateStr;
                    
                    const isPassed = itemDate.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

                    return (
                      <button
                        key={`day-${item.dayNum}`}
                        type="button"
                        disabled={isPassed}
                        onClick={(e) => handleSelectDay(item.dayNum, e)}
                        className={`text-xs py-1.5 rounded-lg transition-all font-mono font-medium flex items-center justify-center cursor-pointer ${
                          isSelected 
                            ? 'text-white font-bold scale-105 shadow-md' 
                            : isPassed
                              ? (themeMode === 'light' ? 'text-neutral-300 line-through pointer-events-none' : 'text-neutral-700 pointer-events-none line-through')
                              : (themeMode === 'light' ? 'text-neutral-700 hover:bg-neutral-100' : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white')
                        }`}
                        style={{
                          backgroundColor: isSelected ? themeColor : undefined,
                        }}
                      >
                        {item.dayNum}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom interactive guide */}
                <div className="text-[9px] font-mono text-center pt-2 border-t flex items-center justify-center gap-1.5 transition-colors" style={{ color: themeColor, borderColor: themeMode === 'light' ? '#EBECEF' : '#1F1F1F' }}>
                  <Sparkles className="w-3 h-3 text-neutral-500 shrink-0" /> Ketuk untuk mengonfirmasi jadwal otomatis
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
