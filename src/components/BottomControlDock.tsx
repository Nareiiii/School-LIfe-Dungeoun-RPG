import React from 'react';
import {
  Shield,
  HeartHandshake,
  BookOpen,
  Crosshair,
  AlertTriangle,
  Sparkles,
  Award,
  BellRing,
  BarChart3,
  Bot,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { CharacterRole, Boss, DistractionLog } from '../types/game';
import { sound } from '../utils/audio';

interface BottomControlDockProps {
  userRole: 'student' | 'teacher';
  selectedRoleId: string;
  characters: CharacterRole[];
  shieldHp: number;
  maxShieldHp: number;
  boss: Boss;
  distractionLogs: DistractionLog[];
  // Student Skill Handlers
  onKnightShieldWall: () => void;
  onMageCheckpoint: () => void;
  onHealerMotivate: () => void;
  onRangerEagleEye: () => void;
  // Student Violation Handlers
  onKnightDistract: () => void;
  onMageDistract: () => void;
  onHealerDistract: () => void;
  onRangerDistract: () => void;
  // Teacher Actions
  onTeacherAppreciate: () => void;
  onTeacherReminder: () => void;
  // Buff States
  isShieldWallActive: boolean;
  shieldWallTimer: number;
  isEagleEyeActive: boolean;
  eagleEyeTimer: number;
  heroHitTarget?: string | null;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  userRole,
  selectedRoleId,
  characters,
  shieldHp,
  maxShieldHp,
  boss,
  distractionLogs,
  onKnightShieldWall,
  onMageCheckpoint,
  onHealerMotivate,
  onRangerEagleEye,
  onKnightDistract,
  onMageDistract,
  onHealerDistract,
  onRangerDistract,
  onTeacherAppreciate,
  onTeacherReminder,
  isShieldWallActive,
  shieldWallTimer,
  isEagleEyeActive,
  eagleEyeTimer,
  heroHitTarget = null,
}) => {
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const selectedChar = characters.find((c) => c.id === selectedRoleId) || characters[0];
  const teammates = characters.filter((c) => c.id !== selectedRoleId);
  const selectedHpPercent = Math.round((selectedChar.hp / selectedChar.maxHp) * 100);

  // Distraction Analytics for Teacher
  const totalViolations = distractionLogs.length;
  const sosmedCount = distractionLogs.filter((l) => l.reason.toLowerCase().includes('sosmed')).length;
  const appGameCount = distractionLogs.filter((l) => l.reason.toLowerCase().includes('game') || l.reason.toLowerCase().includes('aplikasi')).length;
  const awayCount = distractionLogs.filter((l) => l.reason.toLowerCase().includes('layar') || l.reason.toLowerCase().includes('meja') || l.reason.toLowerCase().includes('tergeser')).length;
  const focusCompliancePercent = Math.max(70, Math.min(100, 100 - totalViolations * 6));

  // =========================================================================
  // VIEW 1: TEACHER MONITORING DASHBOARD (GURU)
  // =========================================================================
  if (userRole === 'teacher') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 bg-slate-950/95 backdrop-blur-md border-t border-indigo-500/40 text-slate-100 overflow-y-auto">
        
        {/* Header Bar: Status & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-indigo-950 border border-indigo-400/60 text-indigo-300 font-pixel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Teacher Monitoring Dashboard
            </span>
            <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
              Kepatuhan Fokus: <strong className="text-emerald-400">{focusCompliancePercent}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTeacherAppreciation();
                onTeacherAppreciate();
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-950/80 border border-amber-300 transition active:scale-95 cursor-pointer flex items-center gap-2 animate-pulse"
              title="Kirim apresiasi guru: Berikan +500 EXP dan +10% Perisai Tim!"
            >
              <Award className="w-4 h-4 fill-current text-slate-950" />
              <span>Berikan Apresiasi (+500 EXP)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onTeacherReminder();
              }}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/50 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="Kirim pengingat fokus dari guru kepada seluruh siswa"
            >
              <BellRing className="w-4 h-4 text-indigo-300" />
              <span className="hidden sm:inline">Pengingat</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-auto py-2">
          
          {/* Kolom Kiri: Indikator Darah HP 4 Hero (Read-Only) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {characters.map((char) => {
              const hpPercent = Math.round((char.hp / char.maxHp) * 100);
              return (
                <div
                  key={char.id}
                  className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800 flex flex-col justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5 min-w-0">
                    <img
                      src={char.spriteUrl || `/sprites/${char.id}.svg`}
                      alt={char.name}
                      className="w-8 h-8 object-contain shrink-0 filter drop-shadow"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate leading-tight font-rpg">
                        {char.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{char.title}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-400 font-pixel">HP:</span>
                      <span
                        className={`font-pixel font-bold text-xs ${
                          hpPercent >= 80 ? 'text-emerald-400' : hpPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}
                      >
                        {hpPercent}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          hpPercent >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : hpPercent >= 50
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-red-600 to-rose-400'
                        }`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kolom Kanan: Grafik Analitik Distraksi */}
          <div className="md:col-span-5 bg-slate-900/95 rounded-2xl p-3 border border-indigo-500/30 flex flex-col justify-between shadow">
            <div className="flex items-center justify-between text-xs text-slate-200 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Grafik Analitik Distraksi
              </span>
              <span className="text-amber-300 font-pixel text-[11px]">
                {totalViolations} Insiden
              </span>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-28 truncate text-slate-400 font-medium">📱 Buka Sosmed:</span>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(15, (sosmedCount / Math.max(1, totalViolations)) * 100))}%` }}
                  />
                </div>
                <span className="font-pixel text-slate-300 w-5 text-right font-bold">{sosmedCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-28 truncate text-slate-400 font-medium">🎮 Pindah Game:</span>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, (appGameCount / Math.max(1, totalViolations)) * 100))}%` }}
                  />
                </div>
                <span className="font-pixel text-slate-300 w-5 text-right font-bold">{appGameCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-28 truncate text-slate-400 font-medium">💤 Tinggalkan Meja:</span>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, (awayCount / Math.max(1, totalViolations)) * 100))}%` }}
                  />
                </div>
                <span className="font-pixel text-slate-300 w-5 text-right font-bold">{awayCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STUDENT SINGLE-ROLE DYNAMIC SKILL PANEL (SISWA)
  // Aturan 2: Role yang dipilih aktif mendominasi tampilan (1 kolom penuh)
  // dengan tombol Skil Aktif besar & nyaman di-tap. 3 role lain berformat compact.
  // =========================================================================
  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-4 bg-slate-950/95 backdrop-blur-md border-t border-teal-500/30 text-slate-100 overflow-y-auto">
      
      {/* -----------------------------------------------------------------
          1. KARTU UTAMA HERO YANG DIPILIH AKTIF (MENDOMINASI 1 KOLOM PENUH)
          Ukuran font, bar HP, dan tombol skil aktif dibuat BESAR & RAMAH JARI
          ----------------------------------------------------------------- */}
      <div className="w-full rounded-2xl p-3 sm:p-4 bg-gradient-to-b from-slate-900/95 via-[#0E172B]/95 to-slate-950 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40 relative">
        
        {/* Top Header Card: Avatar, Name, Role Badge, HP Number */}
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Big Hero Sprite Avatar */}
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-amber-950/80 border-2 border-amber-400/80 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/60">
              <img
                src={selectedChar.spriteUrl || `/sprites/${selectedChar.id}.svg`}
                alt={selectedChar.name}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                  ⭐ Karakter Kamu
                </span>
                {isShieldWallActive && selectedChar.id === 'knight' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold text-[8px] animate-pulse">
                    Benteng: {formatTimer(shieldWallTimer)}
                  </span>
                )}
                {isEagleEyeActive && selectedChar.id === 'ranger' && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-400 font-bold text-[8px] animate-pulse">
                    Combo: {formatTimer(eagleEyeTimer)}
                  </span>
                )}
              </div>

              <h3 className="font-rpg text-base sm:text-lg font-black text-white truncate leading-tight mt-0.5">
                {selectedChar.name}
              </h3>
              <p className="text-xs text-amber-300 font-semibold truncate">
                {selectedChar.title}
              </p>
            </div>
          </div>

          {/* Large HP Percentage Display */}
          <div className="text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Kesehatan Fokus
            </div>
            <div
              className={`font-pixel text-xl sm:text-2xl font-black ${
                selectedHpPercent >= 80 ? 'text-emerald-400' : selectedHpPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {selectedHpPercent}%
            </div>
          </div>

        </div>

        {/* Large Health Bar */}
        <div className="mt-2 mb-1.5">
          <div className="h-2.5 sm:h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                selectedHpPercent >= 80
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300'
                  : selectedHpPercent >= 50
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
                  : 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400'
              }`}
              style={{ width: `${selectedHpPercent}%` }}
            />
          </div>
        </div>

        {/* Status Line */}
        <div className="text-[11px] text-slate-300 flex items-center justify-between mb-2.5 px-0.5">
          <span className="truncate italic">Status: {selectedChar.status}</span>
          <span className="text-[10px] text-teal-400 font-bold shrink-0 ml-2">
            Peran Aktif
          </span>
        </div>

        {/* -------------------------------------------------------------
            TOMBOL SKIL AKTIF UTAMA (BESAR, KONTRAS, SANGAT RAMAH DI-TAP HP)
            ------------------------------------------------------------- */}
        <div className="space-y-2">
          
          {/* KNIGHT ACTIVE SKILL */}
          {selectedChar.id === 'knight' && (
            <>
              <button
                onClick={() => {
                  sound.playShieldDeflect();
                  onKnightShieldWall();
                }}
                className={`w-full min-h-[48px] sm:min-h-[52px] py-2.5 px-4 rounded-xl font-black text-sm sm:text-base border transition-all flex items-center justify-center gap-2.5 shadow-xl active:scale-95 cursor-pointer leading-tight ${
                  isShieldWallActive
                    ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white border-cyan-300 shadow-cyan-900/90 animate-pulse'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-110 text-white border-blue-400/80 shadow-blue-950/90'
                }`}
                title="Knight mengaktifkan Benteng Pelindung (+10% Perisai Tim & Serap Penalti 5 Menit)"
              >
                <Shield className="w-5 h-5 text-cyan-200 shrink-0" />
                <span>
                  {isShieldWallActive
                    ? `🛡️ Benteng Pelindung (${formatTimer(shieldWallTimer)})`
                    : '🛡️ Benteng Pelindung (Shield Wall)'}
                </span>
              </button>

              <button
                onClick={onKnightDistract}
                className="w-full min-h-[38px] py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-rose-200 text-xs font-bold border border-red-500/50 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>⚠️ Simulasi Melanggar: HP Tergeser / Melamun</span>
              </button>
            </>
          )}

          {/* MAGE ACTIVE SKILL */}
          {selectedChar.id === 'mage' && (
            <>
              <button
                onClick={() => {
                  sound.playMagicSpell();
                  onMageCheckpoint();
                }}
                className="w-full min-h-[48px] sm:min-h-[52px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white font-black text-sm sm:text-base border border-purple-400/80 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-purple-950/90 active:scale-95 cursor-pointer leading-tight"
                title="Buka Metacognitive Checkpoint untuk rangkum materi & serang Boss!"
              >
                <BookOpen className="w-5 h-5 text-purple-200 shrink-0 animate-bounce" />
                <span>📖 Metacognitive Checkpoint (Rangkum & Serang)</span>
              </button>

              <button
                onClick={onMageDistract}
                className="w-full min-h-[38px] py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-rose-200 text-xs font-bold border border-red-500/50 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>⚠️ Simulasi Melanggar: Buka Sosmed / Instagram</span>
              </button>
            </>
          )}

          {/* HEALER ACTIVE SKILL */}
          {selectedChar.id === 'healer' && (
            <>
              <button
                onClick={() => {
                  sound.playHeal();
                  onHealerMotivate();
                }}
                className="w-full min-h-[48px] sm:min-h-[52px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:brightness-110 text-white font-black text-sm sm:text-base border border-teal-400/80 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-teal-950/90 active:scale-95 cursor-pointer leading-tight"
                title="Kirim pesan motivasi untuk pulihkan HP teman & pulihkan Shield tim!"
              >
                <HeartHandshake className="w-5 h-5 text-emerald-200 shrink-0" />
                <span>💚 Kirim Motivasi (Pulihkan HP & Shield)</span>
              </button>

              <button
                onClick={onHealerDistract}
                className="w-full min-h-[38px] py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-rose-200 text-xs font-bold border border-red-500/50 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>⚠️ Simulasi Melanggar: Tinggalkan Meja Belajar</span>
              </button>
            </>
          )}

          {/* RANGER ACTIVE SKILL */}
          {selectedChar.id === 'ranger' && (
            <>
              <button
                onClick={() => {
                  sound.playArrowShot();
                  onRangerEagleEye();
                }}
                className={`w-full min-h-[48px] sm:min-h-[52px] py-2.5 px-4 rounded-xl text-slate-950 font-black text-sm sm:text-base border transition-all flex items-center justify-center gap-2.5 shadow-xl active:scale-95 cursor-pointer leading-tight ${
                  isEagleEyeActive
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 border-amber-200 shadow-amber-950/90 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 border-amber-300 shadow-amber-950/90'
                }`}
                title="Ranger mengaktifkan Radar Fokus (-1.500 HP Boss & Combo 5 Menit)"
              >
                <Crosshair className="w-5 h-5 text-slate-950 shrink-0" />
                <span>
                  {isEagleEyeActive
                    ? `🏹 Eagle Eye (${formatTimer(eagleEyeTimer)})`
                    : '🏹 Radar Fokus (Eagle Eye: -1.500 HP)'}
                </span>
              </button>

              <button
                onClick={onRangerDistract}
                className="w-full min-h-[38px] py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-rose-200 text-xs font-bold border border-red-500/50 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>⚠️ Simulasi Melanggar: Pindah Tab / Buka Game</span>
              </button>
            </>
          )}

        </div>

      </div>

      {/* -----------------------------------------------------------------
          2. 3 ROLE LAIN YANG TIDAK DIPILIH (COMPACT / RINGKAS 3 KOLOM)
          Cukup tampilkan status ringkas (HP & Nama) agar hemat ruang di HP
          ----------------------------------------------------------------- */}
      <div className="w-full mt-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1.5 px-0.5">
          <span className="flex items-center gap-1 text-teal-400 font-rpg">
            <CheckCircle2 className="w-3 h-3 text-teal-400" />
            Rekan Tim Otomatis (3 Anggota):
          </span>
          <span className="text-slate-500 text-[9px]">Status Siaga</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {teammates.map((char) => {
            const hpPercent = Math.round((char.hp / char.maxHp) * 100);
            return (
              <div
                key={char.id}
                className="bg-slate-900/90 rounded-xl p-2 border border-slate-800/90 flex flex-col justify-between shadow-sm"
              >
                <div className="flex items-center gap-1.5 min-w-0 mb-1">
                  <img
                    src={char.spriteUrl || `/sprites/${char.id}.svg`}
                    alt={char.name}
                    className="w-6 h-6 object-contain shrink-0 filter drop-shadow"
                  />
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white truncate font-rpg leading-tight">
                      {char.name.split(' ')[0]}
                    </div>
                    <div className="text-[8px] text-slate-400 truncate">{char.title.split(' ')[0]}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[9px] mb-0.5 font-pixel">
                    <span className="text-slate-500">HP:</span>
                    <span
                      className={`font-bold ${
                        hpPercent >= 80 ? 'text-emerald-400' : hpPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {hpPercent}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        hpPercent >= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : hpPercent >= 50
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-red-600 to-rose-400'
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
