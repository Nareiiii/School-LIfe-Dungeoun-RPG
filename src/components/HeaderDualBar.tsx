import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Skull, Flame, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderDualBarProps {
  bossHp: number;
  maxBossHp: number;
  bossName: string;
  shieldHp: number;
  maxShieldHp: number;
  timeLeft: number; // in seconds
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  sessionRound: number;
  timerMode: 'focus' | 'break';
  onSetTimerDuration: (seconds: number, mode: 'focus' | 'break') => void;
}

export const HeaderDualBar: React.FC<HeaderDualBarProps> = ({
  bossHp,
  maxBossHp,
  bossName,
  shieldHp,
  maxShieldHp,
  timeLeft,
  isRunning,
  onToggleTimer,
  onResetTimer,
  isMuted,
  onToggleMute,
  sessionRound,
  timerMode,
  onSetTimerDuration,
}) => {
  const bossHpPercent = Math.max(0, Math.min(100, Math.round((bossHp / maxBossHp) * 100)));
  const shieldPercent = Math.max(0, Math.min(100, Math.round((shieldHp / maxShieldHp) * 100)));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-40 bg-[#0E1626]/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all">
      {/* Top micro bar: Session status, sound, timer mode */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-2.5 pb-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/30">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Sesi #{sessionRound}</span>
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            {timerMode === 'focus' ? '⚔️ Fase Fokus Belajar' : '☕ Istirahat Pemulihan Tim'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick presets */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700/60 text-[11px]">
            <button
              onClick={() => {
                sound.playClick();
                onSetTimerDuration(25 * 60, 'focus');
              }}
              className={`px-2 py-0.5 rounded transition ${
                timerMode === 'focus' && timeLeft === 25 * 60
                  ? 'bg-teal-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              25m Pomodoro
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSetTimerDuration(5 * 60, 'break');
              }}
              className={`px-2 py-0.5 rounded transition ${
                timerMode === 'break'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5m Break
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border transition ${
              isMuted
                ? 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-slate-300'
                : 'bg-teal-950/60 border-teal-500/40 text-teal-400 hover:bg-teal-900/40'
            }`}
            title={isMuted ? 'Aktifkan Suara RPG' : 'Matikan Suara RPG'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Bar System Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-3 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* BAR 1: Boss Distraction HP Bar (Red, initially 75%) */}
          <div className="md:col-span-5 bg-gradient-to-r from-red-950/40 to-slate-900/80 p-2.5 rounded-xl border border-red-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-6 h-6 rounded-md bg-red-900/80 border border-red-500/60 flex items-center justify-center shrink-0">
                  <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-bold tracking-wider text-red-400 uppercase">
                    Boss Distraksi
                  </div>
                  <div className="text-xs font-bold text-white truncate font-rpg">
                    {bossName}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="font-pixel text-[11px] font-bold text-red-400">
                  {bossHpPercent}%
                </span>
                <span className="block text-[9px] text-slate-400">
                  {bossHp.toLocaleString()} / {maxBossHp.toLocaleString()} HP
                </span>
              </div>
            </div>

            {/* Red Health Progress Bar */}
            <div className="h-3.5 w-full bg-slate-950/90 rounded-full overflow-hidden p-0.5 border border-red-900/80 relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 transition-all duration-500 shadow-md shadow-red-900/60 relative overflow-hidden"
                style={{ width: `${bossHpPercent}%` }}
              >
                {/* Visual scanline/sheen animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

          {/* TIMER POMODORO (Center Hub) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center order-first md:order-none py-1">
            <div className="relative group">
              <div className={`text-2xl sm:text-3xl font-pixel font-bold tracking-wider transition ${
                isRunning ? 'text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'text-slate-300'
              }`}>
                {formattedTime}
              </div>
            </div>

            {/* Timer Action Buttons */}
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleTimer();
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition shadow cursor-pointer active:scale-95 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/50'
                }`}
                title={isRunning ? 'Jeda Timer Pomodoro' : 'Mulai Timer Pomodoro (25 Menit)'}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mulai</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onResetTimer();
                }}
                className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
                title="Reset Pomodoro ke 25:00"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* BAR 2: Team Shield Bar (Blue/Teal #0D9488, initially 90%) */}
          <div className={`md:col-span-5 bg-gradient-to-l from-teal-950/40 to-slate-900/80 p-2.5 rounded-xl border shadow-inner transition-all ${
            shieldHp < 300 ? 'border-amber-500/60 animate-pulse' : 'border-teal-500/30'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-left shrink-0 mr-2">
                <span className="font-pixel text-[11px] font-bold text-teal-400">
                  {shieldPercent}%
                </span>
                <span className="block text-[9px] text-slate-400">
                  {shieldHp.toLocaleString()} / {maxShieldHp.toLocaleString()} SP
                </span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0 flex-row-reverse text-right">
                <div className={`w-6 h-6 rounded-md bg-teal-900/80 border border-teal-500/60 flex items-center justify-center shrink-0 ${
                  shieldPercent > 50 ? 'shield-glow' : ''
                }`}>
                  <Shield className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                    Perisai Tim (Team Shield)
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1 justify-end">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>{shieldPercent >= 70 ? 'Benteng Baja Kokoh' : shieldPercent >= 40 ? 'Perisai Retak' : 'Perisai Kritis!'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blue/Teal Shield Progress Bar */}
            <div className="h-3.5 w-full bg-slate-950/90 rounded-full overflow-hidden p-0.5 border border-teal-900/80 relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 transition-all duration-500 shadow-md shadow-teal-900/60 relative overflow-hidden"
                style={{ width: `${shieldPercent}%` }}
              >
                {/* Light shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
