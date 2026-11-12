import React from 'react';
import {
  Shield,
  HeartHandshake,
  Compass,
  AlertTriangle,
  BookOpen,
  Zap,
  ChevronRight,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { CharacterRole } from '../types/game';
import { sound } from '../utils/audio';

interface CharacterCardsProps {
  characters: CharacterRole[];
  // Skill Handlers
  onKnightShieldWall: () => void;
  onMageCheckpoint: () => void;
  onHealerMotivate: () => void;
  onRangerEagleEye: () => void;
  // Violation Handlers for all 4 roles
  onKnightDistract: () => void;
  onMageDistract: () => void;
  onHealerDistract: () => void;
  onRangerDistract: () => void;
  // Buff States
  isShieldWallActive: boolean;
  shieldWallTimer: number;
  isEagleEyeActive: boolean;
  eagleEyeTimer: number;
  heroHitTarget?: string | null;
  onRangerScout: () => void;
  expMultiplier: number;
}

export const CharacterCards: React.FC<CharacterCardsProps> = ({
  characters,
  heroHitTarget = null,
  onKnightShieldWall,
  onMageCheckpoint,
  onHealerMotivate,
  onRangerEagleEye,
  onKnightDistract,
  onMageDistract,
  onHealerDistract,
  onRangerDistract,
  isShieldWallActive,
  shieldWallTimer,
  isEagleEyeActive,
  eagleEyeTimer,
  onRangerScout,
  expMultiplier,
}) => {
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      {/* Glassmorphic Command Dock Header */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300 font-rpg">
          <ChevronRight className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Panel Status & Skill 4 Role Hero (Lengkap Skill & Simulasi Melanggar)</span>
        </div>
        <div className="flex items-center gap-2">
          {isShieldWallActive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-cyan-400/60 animate-pulse shadow-sm">
              <Shield className="w-3 h-3 text-cyan-400" />
              Benteng: {formatTimer(shieldWallTimer)}
            </span>
          )}
          {isEagleEyeActive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/60 animate-pulse shadow-sm">
              <Crosshair className="w-3 h-3 text-amber-400" />
              Focus Combo: {formatTimer(eagleEyeTimer)}
            </span>
          )}
          <span className="hidden sm:inline text-[11px] text-teal-300 font-semibold bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-teal-500/40">
            4 Anggota Aktif
          </span>
        </div>
      </div>

      {/* Horizontal Compact 4-Hero Glassmorphic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {characters.map((char) => {
          const hpPercent = Math.round((char.hp / char.maxHp) * 100);

          return (
            <div
              key={char.id}
              className={`rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 relative overflow-hidden bg-slate-950/75 backdrop-blur-md border shadow-xl hover:shadow-2xl ${
                heroHitTarget === char.id
                  ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] bg-red-950/40 animate-pulse scale-[1.02]'
                  : char.id === 'knight'
                  ? isShieldWallActive
                    ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] bg-slate-950/85'
                    : 'border-blue-500/40 hover:border-blue-400/70'
                  : char.id === 'mage'
                  ? 'border-purple-500/40 hover:border-purple-400/70'
                  : char.id === 'healer'
                  ? 'border-teal-500/40 hover:border-teal-400/70'
                  : isEagleEyeActive
                  ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] bg-slate-950/85'
                  : 'border-amber-500/40 hover:border-amber-400/70'
              }`}
            >
              {/* Glassmorphic Top Glow Accent */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1 rounded-b-full ${
                  char.id === 'knight'
                    ? isShieldWallActive
                      ? 'bg-cyan-300 animate-pulse shadow-[0_0_8px_#67e8f9]'
                      : 'bg-blue-400'
                    : char.id === 'mage'
                    ? 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
                    : char.id === 'healer'
                    ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]'
                    : isEagleEyeActive
                    ? 'bg-amber-300 animate-pulse shadow-[0_0_8px_#fde047]'
                    : 'bg-amber-400'
                }`}
              />

              {/* Header: Sprite Avatar, Name, Title & HP */}
              <div>
                <div className="flex items-center justify-between mb-2 pt-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-md relative overflow-hidden p-0.5 backdrop-blur-sm ${
                        char.id === 'knight'
                          ? 'bg-blue-950/80 border-blue-400/50'
                          : char.id === 'mage'
                          ? 'bg-purple-950/80 border-purple-400/50'
                          : char.id === 'healer'
                          ? 'bg-teal-950/80 border-teal-400/50'
                          : 'bg-amber-950/80 border-amber-400/50'
                      }`}
                    >
                      <img
                        src={char.spriteUrl || `/sprites/${char.id}.svg`}
                        alt={char.name}
                        className="w-full h-full object-contain filter drop-shadow select-none hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <div className="truncate">
                      <h4 className="font-rpg text-sm font-bold text-white truncate leading-tight">
                        {char.name}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate leading-none">
                        {char.title}
                      </p>
                    </div>
                  </div>

                  {/* HP Badge */}
                  <span
                    className={`font-pixel text-[10px] px-1.5 py-0.5 rounded-md border font-bold shrink-0 shadow-sm ${
                      hpPercent >= 90
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : hpPercent >= 60
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-red-950/80 text-red-300 border-red-500/50'
                    }`}
                  >
                    {hpPercent}%
                  </span>
                </div>

                {/* Mini HP Bar */}
                <div className="mb-2">
                  <div className="h-1.5 w-full bg-slate-950/90 rounded-full overflow-hidden border border-white/10 p-0.2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hpPercent >= 85
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : hpPercent >= 50
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-red-600 to-rose-400'
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>

                {/* Status One-liner */}
                <div className="text-[10px] text-slate-300 truncate bg-slate-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10 mb-2 font-medium">
                  {char.id === 'knight' && isShieldWallActive ? (
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                      Benteng Aktif ({formatTimer(shieldWallTimer)})
                    </span>
                  ) : char.id === 'ranger' && isEagleEyeActive ? (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Crosshair className="w-3 h-3 text-amber-400 animate-pulse" />
                      Eagle Eye ({formatTimer(eagleEyeTimer)})
                    </span>
                  ) : (
                    char.status
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS: DUA TOMBOL WAJIB (1 Skill Aktif + 1 Simulasi Melanggar) */}
              <div className="mt-auto space-y-1.5">
                
                {/* ----------------------------------------------------
                    ROLE 1: KNIGHT (Shield Wall & HP Tergeser)
                    ---------------------------------------------------- */}
                {char.id === 'knight' && (
                  <div className="space-y-1.5">
                    {/* Tombol Skill 1 */}
                    <button
                      onClick={() => {
                        sound.playShieldDeflect();
                        onKnightShieldWall();
                      }}
                      className={`w-full py-2 px-2.5 rounded-xl text-white font-bold text-xs border transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer leading-tight ${
                        isShieldWallActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-700 border-cyan-300 shadow-cyan-900/80 animate-pulse'
                          : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 border-blue-400/60 hover:brightness-110 shadow-blue-950/80'
                      }`}
                      title="Knight mengaktifkan Benteng Pelindung! Penalti tim diserap Knight selama 5 menit & Shield +10%"
                    >
                      <Shield className="w-4 h-4 text-cyan-200 shrink-0" />
                      <span className="truncate">
                        {isShieldWallActive
                          ? `🛡️ Benteng (${formatTimer(shieldWallTimer)})`
                          : '🛡️ Benteng Pelindung (Shield Wall)'}
                      </span>
                    </button>

                    {/* Tombol Melanggar 2 */}
                    <button
                      onClick={() => {
                        onKnightDistract();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-[11px] font-semibold border border-red-500/40 transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer backdrop-blur-sm shadow"
                      title="Simulasikan anggota melanggar: HP tergeser (-15% SP & Alarm)"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">⚠️ Simulasi Melanggar: HP Tergeser</span>
                    </button>
                  </div>
                )}

                {/* ----------------------------------------------------
                    ROLE 2: MAGE (Metacognitive Checkpoint & Buka Sosmed)
                    ---------------------------------------------------- */}
                {char.id === 'mage' && (
                  <div className="space-y-1.5">
                    {/* Tombol Skill 1 */}
                    <button
                      onClick={() => {
                        sound.playMagicSpell();
                        onMageCheckpoint();
                      }}
                      className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white font-bold text-xs border border-purple-400/60 hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/80 active:scale-95 cursor-pointer leading-tight"
                      title="Buka Metacognitive Checkpoint untuk rangkum materi & serang Boss!"
                    >
                      <BookOpen className="w-4 h-4 text-purple-200 shrink-0 animate-bounce" />
                      <span className="truncate">📖 Metacognitive Checkpoint</span>
                    </button>

                    {/* Tombol Melanggar 2 */}
                    <button
                      onClick={() => {
                        onMageDistract();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-[11px] font-semibold border border-red-500/40 transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer backdrop-blur-sm shadow"
                      title="Simulasikan anggota melanggar: Buka Sosmed / Instagram / TikTok (-15% SP & Alarm)"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">⚠️ Simulasi Melanggar: Buka Sosmed</span>
                    </button>
                  </div>
                )}

                {/* ----------------------------------------------------
                    ROLE 3: HEALER (Kirim Motivasi & Tinggalkan Layar)
                    ---------------------------------------------------- */}
                {char.id === 'healer' && (
                  <div className="space-y-1.5">
                    {/* Tombol Skill 1 */}
                    <button
                      onClick={() => {
                        sound.playHeal();
                        onHealerMotivate();
                      }}
                      className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white font-bold text-xs border border-teal-400/60 hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-lg shadow-teal-950/80 active:scale-95 cursor-pointer leading-tight"
                      title="Kirim pesan motivasi untuk pulihkan HP teman & pulihkan Shield tim!"
                    >
                      <HeartHandshake className="w-4 h-4 text-emerald-200 shrink-0" />
                      <span className="truncate">💚 Kirim Motivasi (Support Boost)</span>
                    </button>

                    {/* Tombol Melanggar 2 */}
                    <button
                      onClick={() => {
                        onHealerDistract();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-[11px] font-semibold border border-red-500/40 transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer backdrop-blur-sm shadow"
                      title="Simulasikan anggota melanggar: Tinggalkan Layar Belajar (-15% SP & Alarm)"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">⚠️ Simulasi Melanggar: Tinggalkan Layar</span>
                    </button>
                  </div>
                )}

                {/* ----------------------------------------------------
                    ROLE 4: RANGER (Radar Fokus & Pindah Aplikasi)
                    ---------------------------------------------------- */}
                {char.id === 'ranger' && (
                  <div className="space-y-1.5">
                    {/* Tombol Skill 1 */}
                    <button
                      onClick={() => {
                        sound.playArrowShot();
                        onRangerEagleEye();
                      }}
                      className={`w-full py-2 px-2.5 rounded-xl text-white font-bold text-xs border transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer leading-tight ${
                        isEagleEyeActive
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 border-amber-300 text-slate-950 shadow-amber-950 animate-pulse'
                          : 'bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 border-amber-400/60 hover:brightness-110 text-white shadow-amber-950/80'
                      }`}
                      title="Picu mode Focus Combo 5 Menit & serang Boss -1.500 HP!"
                    >
                      <Crosshair className="w-4 h-4 text-amber-200 shrink-0" />
                      <span className="truncate">
                        {isEagleEyeActive
                          ? `🎯 Lock-on (${formatTimer(eagleEyeTimer)})`
                          : '🏹 Radar Fokus (Eagle Eye)'}
                      </span>
                    </button>

                    {/* Tombol Melanggar 2 */}
                    <button
                      onClick={() => {
                        onRangerDistract();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-[11px] font-semibold border border-red-500/40 transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer backdrop-blur-sm shadow"
                      title="Simulasikan anggota melanggar: Pindah Aplikasi / Game (-15% SP & Alarm)"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">⚠️ Simulasi Melanggar: Pindah Aplikasi</span>
                    </button>

                    {/* Secondary EXP Multiplier indicator */}
                    <div className="flex items-center gap-1 pt-0.5">
                      <div className="flex-1 py-1 px-2 rounded-lg bg-slate-900/70 border border-amber-500/30 flex items-center justify-between text-[10px] backdrop-blur-sm">
                        <span className="font-semibold text-amber-200 flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 text-amber-400 fill-current" />
                          EXP Multiplier
                        </span>
                        <span className="font-pixel text-[10px] font-bold text-amber-300">
                          {expMultiplier.toFixed(1)}x
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          onRangerScout();
                        }}
                        className="py-1 px-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-amber-300 text-[10px] font-medium border border-amber-500/30 transition flex items-center justify-center gap-0.5 cursor-pointer backdrop-blur-sm"
                        title="Teropong Trik Belajar"
                      >
                        <Compass className="w-3 h-3 text-amber-400" />
                        <span>Scout</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
