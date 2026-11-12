import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Skull,
  Shield,
  Zap,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BellRing,
  Volume2,
  VolumeX,
  Compass,
  FastForward,
  Users,
  Award,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  HeartHandshake,
  Crosshair,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { Boss, CharacterRole, DistractionLog, UsageMode } from '../types/game';
import { sound } from '../utils/audio';
import battlefieldBg from '../assets/images/rpg_isometric_battlefield_1794074866458.jpg';

interface BossArenaProps {
  usageMode?: UsageMode;
  guildName: string;
  classCode: string;
  boss: Boss;
  characters: CharacterRole[];
  isHit: boolean;
  slashActive: boolean;
  floatingDamages: Array<{ id: string; text: string; isCrit?: boolean; isShield?: boolean }>;
  streakCount: number;
  expMultiplier: number;
  // Dual Bar System
  shieldHp: number;
  maxShieldHp: number;
  // Pomodoro Timer System
  timeLeft: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onFastForwardTimer?: () => void;
  sessionRound: number;
  timerMode: 'focus' | 'break';
  onSetTimerDuration: (seconds: number, mode: 'focus' | 'break') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  // Knight & Ranger Active Skill Visuals
  isShieldWallActive?: boolean;
  shieldWallShimmer?: boolean;
  shieldWallTimer?: number;
  isEagleEyeActive?: boolean;
  arrowStrikeActive?: boolean;
  eagleEyeTimer?: number;
  // Boss Attack on Violation Visuals
  isBossAttacking?: boolean;
  bossAttackTarget?: string | null;
  darkProjectileActive?: boolean;
  heroHitTarget?: string | null;
  heroFloatingText?: { [key: string]: string | null };
  // User Role & Dynamic Control Panel Props
  userRole: 'student' | 'teacher';
  selectedRoleId: string;
  distractionLogs: DistractionLog[];
  // Direct Skill Handlers
  onKnightShieldWall: () => void;
  onMageCheckpoint: () => void;
  onHealerMotivate: () => void;
  onRangerEagleEye: () => void;
  // Violation Handlers
  onKnightDistract: () => void;
  onMageDistract: () => void;
  onHealerDistract: () => void;
  onRangerDistract: () => void;
  // Teacher Action Handlers
  onTeacherAppreciate: () => void;
  onTeacherReminder: () => void;
}

export const BossArena: React.FC<BossArenaProps> = ({
  usageMode = 'teacher_guided',
  guildName,
  classCode,
  boss,
  characters,
  isHit,
  slashActive,
  floatingDamages,
  streakCount,
  expMultiplier,
  shieldHp,
  maxShieldHp,
  timeLeft,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onFastForwardTimer,
  sessionRound,
  timerMode,
  onSetTimerDuration,
  isMuted,
  onToggleMute,
  isShieldWallActive = false,
  shieldWallShimmer = false,
  shieldWallTimer = 0,
  isEagleEyeActive = false,
  arrowStrikeActive = false,
  eagleEyeTimer = 0,
  isBossAttacking = false,
  bossAttackTarget = null,
  darkProjectileActive = false,
  heroHitTarget = null,
  heroFloatingText = {},
  userRole,
  selectedRoleId,
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
}) => {
  const bossHpPercent = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));
  const shieldPercent = Math.max(0, Math.min(100, Math.round((shieldHp / maxShieldHp) * 100)));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Distraction stats for Teacher
  const totalViolations = distractionLogs.length;
  const sosmedCount = distractionLogs.filter((l) => l.reason.toLowerCase().includes('sosmed')).length;
  const appGameCount = distractionLogs.filter((l) => l.reason.toLowerCase().includes('game') || l.reason.toLowerCase().includes('aplikasi')).length;
  const awayCount = distractionLogs.filter((l) => l.reason.toLowerCase().includes('layar') || l.reason.toLowerCase().includes('meja') || l.reason.toLowerCase().includes('tergeser')).length;
  const focusCompliancePercent = Math.max(70, Math.min(100, 100 - totalViolations * 6));

  return (
    <div className="w-full space-y-3 sm:space-y-4 pb-8 font-sans select-none">
      
      {/* ========================================================
          1. HEADER ATAS (TIMER POMODORO & NAMA GUILD & AUDIO)
          ======================================================== */}
      <div className="rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 px-3 sm:px-6 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Guild Name Badge & Session */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-red-950/90 to-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-bold uppercase tracking-wider shadow">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Raid Arena • {guildName || 'Guild Garuda'}</span>
          </div>
          
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Sesi #{sessionRound}
          </span>

          {classCode && (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-[11px] text-indigo-300">
              Kelas: {classCode}
            </span>
          )}
        </div>

        {/* Center: Glassmorphic Pomodoro Countdown Timer */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-3.5 py-1 rounded-xl border border-white/15 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 hidden xs:inline">
              {timerMode === 'focus' ? 'Fokus' : 'Break'}:
            </span>
            <span
              className={`font-pixel text-lg sm:text-xl font-bold tracking-wider transition ${
                isRunning
                  ? 'text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.7)]'
                  : 'text-slate-200'
              }`}
            >
              {formattedTime}
            </span>
          </div>

          {/* Play/Pause & Reset Controls (Locked for Student in Mode A) */}
          {usageMode === 'teacher_guided' && userRole === 'student' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 text-xs font-bold shadow">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isRunning ? '⏳ Berjalan (Dikontrol Guru)' : '⏸️ Dijeda oleh Guru'}</span>
            </div>
          ) : (
            <>
              {/* Play/Pause Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleTimer();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer active:scale-95 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
                title={isRunning ? 'Jeda Pomodoro' : 'Mulai Pomodoro'}
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

              {/* Reset Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  onResetTimer();
                }}
                className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/10 transition cursor-pointer"
                title="Reset Pomodoro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* ⏩ Simulasi Percepat (Waktu Habis) */}
          <button
            onClick={() => {
              sound.playClick();
              if (onFastForwardTimer) onFastForwardTimer();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/60 transition active:scale-95 cursor-pointer border border-amber-300/60"
            title="Simulasikan waktu habis seketika dan tampilkan Laporan Hasil Performa Tim (Raid Outcome)"
          >
            <FastForward className="w-3.5 h-3.5 fill-current text-amber-200 animate-pulse" />
            <span className="hidden sm:inline">⏩ Simulasi Percepat</span>
            <span className="sm:hidden">⏩ Percepat</span>
          </button>
        </div>

        {/* Right: EXP Multiplier & Audio Mute Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>EXP {expMultiplier.toFixed(1)}x</span>
          </div>

          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isMuted
                ? 'bg-slate-900/80 border-slate-700 text-slate-500'
                : 'bg-teal-950/70 border-teal-500/50 text-teal-400'
            }`}
            title={isMuted ? 'Nyalakan Audio RPG' : 'Matikan Audio RPG'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* ========================================================
          2. FLOATING BOSS HP HEADER (BAR DARAH BOSS DISTRAKSI)
          ======================================================== */}
      <div className="bg-slate-950/80 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-red-500/40 shadow-xl shadow-red-950/30">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-500 flex items-center justify-center shrink-0 shadow">
              <Skull className="w-4 h-4 text-red-300 animate-pulse" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-pixel text-red-400 uppercase tracking-wider">
                  TARGET UTAMA (BOSS DISTRAKSI):
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-900/70 text-red-200 border border-red-700 font-bold">
                  Lv.{boss.level}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-rpg tracking-wide">
                {boss.name}
              </h3>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <div className="font-pixel text-sm sm:text-base font-black text-red-400">
              {bossHpPercent}%
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium">
              {boss.hp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP
            </span>
          </div>
        </div>

        {/* Crimson Health Bar */}
        <div className="h-3 sm:h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-red-900 shadow-inner relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 transition-all duration-500 shadow-md relative overflow-hidden"
            style={{ width: `${bossHpPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* ========================================================
          3. VISUAL 2D ISOMETRIC ARENA (4 HEROES VS MONSTER BOSS)
          Proporsi awal pas di tengah: 4 hero hadap kanan, Boss di kanan
          ======================================================== */}
      <div
        className="relative w-full rounded-3xl border-2 border-amber-900/40 shadow-[0_12px_45px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col justify-between bg-slate-950 bg-cover bg-center bg-no-repeat transition-all min-h-[340px] sm:min-h-[390px] md:min-h-[440px]"
        style={{
          backgroundImage: `url(${battlefieldBg})`,
        }}
      >
        {/* Ambient Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-slate-950/80 pointer-events-none" />

        {/* Ambient Spores */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-[90px]" />
        </div>

        {/* Directional Tag */}
        <div className="absolute top-3 left-4 z-15 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/75 backdrop-blur-md border border-amber-600/40 text-amber-200 text-[10px] font-rpg shadow">
          <Compass className="w-3 h-3 text-amber-400" />
          <span>Jalur Hutan Fokus • Medan Pertempuran Isometrik</span>
        </div>

        {/* Floating Combat Damage Numbers */}
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <AnimatePresence>
            {floatingDamages.map((dmg) => (
              <motion.div
                key={dmg.id}
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: -100, scale: dmg.isCrit ? 1.4 : 1 }}
                exit={{ opacity: 0, y: -140 }}
                transition={{ duration: 0.95, ease: 'easeOut' }}
                className={`absolute font-pixel font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] select-none px-4 py-1.5 rounded-full border ${
                  dmg.isShield
                    ? 'text-cyan-300 bg-slate-950/90 border-cyan-400 text-sm shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                    : dmg.isCrit
                    ? 'text-amber-300 bg-red-950/95 border-amber-400 text-base sm:text-xl shadow-[0_0_25px_rgba(245,158,11,0.7)] animate-pulse'
                    : 'text-red-400 bg-slate-950/90 border-red-500/60 text-sm'
                }`}
              >
                {dmg.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Arcane Slash Visual Strike */}
        {slashActive && (
          <div className="absolute inset-0 pointer-events-none z-45 flex items-center justify-center overflow-hidden">
            <div className="w-[140%] h-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[1px] animate-slash shadow-[0_0_40px_#38BDF8]" />
            <div className="w-[140%] h-1.5 bg-white animate-slash" />
          </div>
        )}

        {/* Shield Wall Shimmer Barrier */}
        {shieldWallShimmer && (
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-start pl-8 sm:pl-16 overflow-hidden animate-in fade-in duration-300">
            <div className="w-80 h-80 rounded-full border-4 border-cyan-300/90 shadow-[0_0_90px_rgba(34,211,238,0.85)] animate-ping" />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-200 font-pixel text-xs sm:text-sm font-bold bg-cyan-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-cyan-400 shadow-2xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-300 animate-bounce" />
              <span>🛡️ BENTENG PELINDUNG AKTIF (+10% SHIELD)</span>
            </div>
          </div>
        )}

        {/* Ranger Arrow Strike & Sniper Reticle */}
        {arrowStrikeActive && (
          <div className="absolute inset-0 pointer-events-none z-45 flex items-center justify-center">
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-amber-400 animate-spin flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-amber-300 animate-pulse" />
              <div className="absolute w-full h-0.5 bg-amber-400/80" />
              <div className="absolute h-full w-0.5 bg-amber-400/80" />
            </div>

            <motion.div
              initial={{ x: '10%', y: '50%', opacity: 0, scale: 0.5 }}
              animate={{ x: '80%', y: '40%', opacity: 1, scale: 1.3 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute text-4xl select-none"
            >
              🏹💨
            </motion.div>
          </div>
        )}

        {/* Dark Void Projectile on Violation Attack */}
        {darkProjectileActive && (
          <div className="absolute inset-0 pointer-events-none z-45 overflow-hidden">
            <motion.div
              initial={{ x: '75%', y: '45%', opacity: 0.9, scale: 0.8 }}
              animate={{ x: '25%', y: '45%', opacity: 1, scale: 1.6 }}
              transition={{ duration: 0.35, ease: 'easeIn' }}
              className="absolute flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-700 via-rose-600 to-red-600 blur-sm shadow-[0_0_40px_rgba(220,38,38,0.95)] animate-spin" />
              <div className="absolute text-3xl">☄️</div>
            </motion.div>
          </div>
        )}

        {/* MAIN ARENA BATTLE GROUND: 4 HEROES (LEFT) VS BOSS (RIGHT) */}
        <div className="relative z-20 flex-1 w-full flex items-center justify-between px-3 sm:px-8 py-5 sm:py-6">
          
          {/* SISI KIRI: 4 HEROES DALAM FORMASI ISOMETRIK (MENGHADAP KANAN ➔) */}
          <div className="relative z-20 flex flex-col items-start justify-center w-5/12 sm:w-1/2">
            
            <div className="mb-2 sm:mb-3 px-2.5 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-teal-500/30 text-[10px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5 shadow">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Formasi Hero (Menghadap Kanan ➔)</span>
            </div>

            {/* Grid 4 Heroes Staggered */}
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-7 gap-y-3 sm:gap-y-5 w-full max-w-sm">
              {characters.map((char, index) => {
                const charHpPercent = Math.round((char.hp / char.maxHp) * 100);
                const isFrontline = char.id === 'knight' || char.id === 'mage';
                const staggerClass = isFrontline ? 'translate-x-2 sm:translate-x-4' : 'translate-x-0';
                const isTargetedHit = heroHitTarget === char.id;
                const isSelectedHero = char.id === selectedRoleId;

                return (
                  <div
                    key={char.id}
                    className={`flex flex-col items-center relative transition-transform duration-300 ${staggerClass} group`}
                  >
                    {/* Floating Text Over Hero */}
                    <AnimatePresence>
                      {heroFloatingText[char.id] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.6 }}
                          animate={{ opacity: 1, y: -40, scale: 1.1 }}
                          exit={{ opacity: 0, y: -65 }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="absolute -top-9 z-50 pointer-events-none font-pixel text-[10px] font-black text-rose-300 bg-red-950/95 px-2.5 py-0.5 rounded-full border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.85)] whitespace-nowrap animate-bounce"
                        >
                          {heroFloatingText[char.id]}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Floating Strategy Mini HP Bar */}
                    <div className="mb-1 flex flex-col items-center z-30 select-none">
                      <div className="bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/15 shadow flex items-center gap-1 text-[9px] font-bold leading-none">
                        <span className="font-rpg text-white">{char.name.split(' ')[0]}</span>
                        <span
                          className={`font-pixel ${
                            charHpPercent >= 80 ? 'text-emerald-400' : charHpPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
                          }`}
                        >
                          {charHpPercent}%
                        </span>
                      </div>

                      <div className="w-14 sm:w-18 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700/80 mt-0.5 shadow">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            charHpPercent >= 80
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : charHpPercent >= 50
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-red-600 to-rose-400'
                          }`}
                          style={{ width: `${charHpPercent}%` }}
                        />
                      </div>

                      {/* Active Buff Mini Floating Tag */}
                      {char.id === 'knight' && isShieldWallActive && (
                        <span className="mt-0.5 px-1.5 py-0.2 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-400 text-[8px] font-bold animate-pulse">
                          🛡️ {formatTimer(shieldWallTimer)}
                        </span>
                      )}
                      {char.id === 'ranger' && isEagleEyeActive && (
                        <span className="mt-0.5 px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-400 text-[8px] font-bold animate-pulse">
                          🎯 {formatTimer(eagleEyeTimer)}
                        </span>
                      )}
                    </div>

                    {/* Hero Sprite & Pedestal */}
                    <motion.div
                      animate={
                        isTargetedHit
                          ? { x: [-8, 8, -6, 6, 0], scale: [0.9, 1.15, 0.95, 1] }
                          : { y: [0, -3.5, 0] }
                      }
                      transition={
                        isTargetedHit
                          ? { duration: 0.45, ease: 'easeInOut' }
                          : { duration: 2.2 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }
                      }
                      className="relative cursor-pointer flex flex-col items-center"
                      onClick={() => {
                        sound.playClick();
                        if (userRole === 'student' && isSelectedHero) {
                          if (char.id === 'knight') onKnightShieldWall();
                          if (char.id === 'mage') onMageCheckpoint();
                          if (char.id === 'healer') onHealerMotivate();
                          if (char.id === 'ranger') onRangerEagleEye();
                        }
                      }}
                      title={isSelectedHero ? `Karakter Kamu: ${char.name}` : `Rekan Tim: ${char.name}`}
                    >
                      {/* Impact Explosion */}
                      {isTargetedHit && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-red-600/40 blur-md animate-ping" />
                          <span className="absolute text-3xl filter drop-shadow-[0_0_20px_#EF4444] animate-bounce">
                            💥
                          </span>
                        </div>
                      )}

                      {/* Sprite Avatar */}
                      <div
                        className={`relative w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 transition-transform duration-200 group-hover:scale-105 ${
                          isTargetedHit ? 'brightness-150 contrast-125 filter drop-shadow-[0_0_25px_#EF4444]' : ''
                        } ${isSelectedHero ? 'ring-2 ring-amber-400 rounded-full' : ''}`}
                      >
                        <img
                          src={char.spriteUrl || `/sprites/${char.id}.svg`}
                          alt={char.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] select-none pointer-events-none"
                        />
                      </div>

                      {/* Pedestal */}
                      <div
                        className={`w-12 sm:w-15 h-3.5 sm:h-4.5 rounded-[100%] -mt-1.5 transition-all ${
                          isTargetedHit
                            ? 'bg-red-600/40 border border-red-400 shadow-[0_0_15px_#EF4444]'
                            : isSelectedHero
                            ? 'bg-amber-500/30 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                            : 'bg-black/60 border border-white/20 shadow-md'
                        }`}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SISI KANAN: MONSTER BOSS DISTRAKSI "LORD PROKRASTINASI & DOOMSCROLL" */}
          <div className="relative z-20 flex flex-col items-center justify-center w-7/12 sm:w-1/2">
            
            {/* Floating Mini HP Bar Directly Over Boss */}
            <div className="mb-1 flex flex-col items-center z-30 select-none">
              <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-red-500/50 shadow-md flex items-center gap-1.5 text-[10px] font-bold">
                <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="font-rpg text-red-200">{boss.name}</span>
                <span className="font-pixel text-red-400">{bossHpPercent}%</span>
              </div>

              <div className="w-32 sm:w-44 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-red-800 mt-1 shadow">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                  style={{ width: `${bossHpPercent}%` }}
                />
              </div>
            </div>

            {/* Colossal Boss Sprite: FLIPPED (-scale-x-100) facing LEFT */}
            <motion.div
              animate={
                isBossAttacking
                  ? { x: [-30, -55, -20, 0], scale: [1.05, 1.25, 1.1, 1] }
                  : isHit
                  ? { x: [12, -12, 8, -8, 0], scale: [0.95, 1.08, 0.98, 1] }
                  : { y: [0, -7, 0] }
              }
              transition={
                isBossAttacking
                  ? { duration: 0.5, ease: 'easeOut' }
                  : isHit
                  ? { duration: 0.45, ease: 'easeInOut' }
                  : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="relative cursor-pointer flex flex-col items-center"
            >
              {/* Radial Boss Aura */}
              <div
                className={`absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-red-600/30 via-purple-600/30 to-rose-600/30 blur-2xl animate-pulse pointer-events-none transition-all ${
                  isBossAttacking ? 'scale-125 from-red-600/60 via-purple-700/60' : ''
                }`}
              />

              <div
                className={`relative transition-all duration-200 ${
                  isHit
                    ? 'brightness-200 contrast-150'
                    : isBossAttacking
                    ? 'brightness-125 contrast-125 filter drop-shadow-[0_0_35px_rgba(239,68,68,0.95)]'
                    : ''
                }`}
              >
                <img
                  src={boss.spriteUrl || '/sprites/boss-demon.svg'}
                  alt={boss.name}
                  className="w-48 h-48 xs:w-56 xs:h-56 sm:w-68 sm:h-68 md:w-80 md:h-80 object-contain filter drop-shadow-[0_16px_40px_rgba(0,0,0,0.95)] select-none pointer-events-none transform -scale-x-100 hover:scale-x-[-1.04] transition-transform duration-300"
                />
              </div>

              {/* Boss Pedestal */}
              <div className="w-36 sm:w-48 md:w-56 h-5 sm:h-7 rounded-[100%] bg-red-950/80 border border-red-600/50 -mt-3.5 shadow-[0_0_20px_rgba(239,68,68,0.7)]" />
            </motion.div>

            {/* Debuff Badges below Boss */}
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1 max-w-xs">
              {boss.distractionDebuffs.map((debuff, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-950/85 border border-purple-500/40 text-purple-200 text-[9px] font-semibold shadow"
                >
                  <BellRing className="w-2.5 h-2.5 text-purple-400" />
                  {debuff}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          4. PERISAI PERTAHANAN KELOMPOK (TEAM SHIELD GAUGE)
          Tepat berada di bawah area visual arena pertempuran
          ======================================================== */}
      <div
        className={`p-3 sm:p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border transition-all shadow-xl ${
          isShieldWallActive
            ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)]'
            : shieldHp < 300
            ? 'border-amber-500/80 shadow-amber-950/50 animate-pulse'
            : 'border-teal-500/50 shadow-teal-950/40'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg ${
                isShieldWallActive ? 'bg-cyan-900 border-cyan-300' : 'bg-teal-950 border-teal-400'
              } border flex items-center justify-center shrink-0 shadow`}
            >
              <Shield className={`w-4 h-4 ${isShieldWallActive ? 'text-cyan-200' : 'text-teal-200'}`} />
            </div>
            <div className="truncate">
              <div className="text-[9px] font-pixel text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>PERISAI PERTAHANAN KELOMPOK (TEAM SHIELD):</span>
                {isShieldWallActive && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 text-[8px] font-sans font-bold animate-pulse">
                    Benteng Wall Aktif (+10%)
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white truncate font-rpg tracking-wide">
                {isShieldWallActive
                  ? 'Benteng Pelindung Menyerap Pelanggaran!'
                  : shieldPercent >= 70
                  ? 'Benteng Baja Kokoh Pertahankan Fokus'
                  : shieldPercent >= 40
                  ? 'Perisai Retak Akibat Distraksi'
                  : 'Kondisi Kritis! Waspada Pelanggaran'}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <div className="font-pixel text-sm sm:text-base font-black text-teal-300">
              {shieldPercent}%
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium">
              {shieldHp.toLocaleString()} / {maxShieldHp.toLocaleString()} SP
            </span>
          </div>
        </div>

        {/* Blue/Teal Shield Gauge Bar */}
        <div className="h-3 sm:h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-teal-900 shadow-inner relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 transition-all duration-500 shadow-md relative overflow-hidden"
            style={{ width: `${shieldPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* ========================================================
          5. GRID 4 ROLE HERO DI BAGIAN BAWAH (GRID 2 KOLOM X 2 BARIS)
          Memuat 4 kartu hero: Bima Knight, Citra Mage, Dewi Healer, Faris Ranger
          Role terpilih menampilkan Skil Aktif jelas & tombol melanggar.
          ======================================================== */}
      <div className="space-y-2.5">
        
        {/* Dock Header & Teacher Control jika Guru */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold font-rpg text-slate-200 flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Status & Skil 4 Role Hero • {guildName || 'Guild Garuda'}</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Grid 2 Kolom x 2 Baris)
            </span>
          </div>

          {/* Tombol Spesial Guru jika login sebagai Guru */}
          {userRole === 'teacher' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playTeacherAppreciation();
                  onTeacherAppreciate();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-lg border border-amber-300 transition active:scale-95 cursor-pointer flex items-center gap-1.5 animate-pulse"
                title="Berikan Apresiasi (+500 EXP & +10% Shield)"
              >
                <Award className="w-4 h-4 fill-current" />
                <span>Berikan Apresiasi (+500 EXP)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onTeacherReminder();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-900/70 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1"
                title="Kirim pengingat fokus"
              >
                <BellRing className="w-3.5 h-3.5 text-indigo-300" />
                <span>Pengingat</span>
              </button>
            </div>
          )}
        </div>

        {/* GRAFIK DISTRAKSI GURU JIKA MODE GURU */}
        {userRole === 'teacher' && (
          <div className="bg-slate-950/85 p-3 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Grafik Kepatuhan Fokus Kelas: <strong className="text-emerald-400">{focusCompliancePercent}%</strong> ({totalViolations} Insiden)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <span>📱 Sosmed: <strong className="text-rose-400">{sosmedCount}</strong></span>
              <span>🎮 Game: <strong className="text-amber-400">{appGameCount}</strong></span>
              <span>💤 Tinggalkan Meja: <strong className="text-purple-400">{awayCount}</strong></span>
            </div>
          </div>
        )}

        {/* GRID 2 KOLOM X 2 BARIS (4 HERO CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {characters.map((char) => {
            const isSelected = char.id === selectedRoleId;
            const hpPercent = Math.round((char.hp / char.maxHp) * 100);
            const isTargetedHit = heroHitTarget === char.id;

            return (
              <div
                key={char.id}
                className={`rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden backdrop-blur-md shadow-xl ${
                  isSelected
                    ? 'bg-slate-900/95 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                    : 'bg-slate-950/80 border border-slate-800/90 opacity-90'
                } ${
                  isTargetedHit
                    ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] bg-red-950/50 animate-pulse scale-[1.01]'
                    : ''
                }`}
              >
                {/* Selected Role Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wide flex items-center gap-1 shadow">
                      ⭐ Karakter Kamu
                    </span>
                  </div>
                )}

                {/* Unselected Teammate Badge */}
                {!isSelected && (
                  <div className="absolute top-2 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[9px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-400" />
                      Rekan Tim
                    </span>
                  </div>
                )}

                {/* Header: Sprite Avatar, Name, Title, HP */}
                <div>
                  <div className="flex items-center gap-3 mb-2 min-w-0 pr-16">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden p-1 shadow-md ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-400/80'
                          : 'bg-slate-900 border-slate-700'
                      }`}
                    >
                      <img
                        src={char.spriteUrl || `/sprites/${char.id}.svg`}
                        alt={char.name}
                        className="w-full h-full object-contain filter drop-shadow select-none"
                      />
                    </div>

                    <div className="truncate">
                      <h4 className="font-rpg text-sm sm:text-base font-bold text-white truncate leading-tight">
                        {char.name}
                      </h4>
                      <p className="text-xs text-amber-300 font-semibold truncate">
                        {char.title}
                      </p>
                    </div>
                  </div>

                  {/* HP Gauge */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-400 font-pixel">KESEHATAN (HP):</span>
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

                  {/* Status One-liner */}
                  <div className="text-[11px] text-slate-300 bg-slate-900/70 px-2.5 py-1 rounded-xl border border-white/10 mb-2 truncate">
                    {char.id === 'knight' && isShieldWallActive ? (
                      <span className="text-cyan-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                        Benteng Pelindung Aktif ({formatTimer(shieldWallTimer)})
                      </span>
                    ) : char.id === 'ranger' && isEagleEyeActive ? (
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-amber-400 animate-pulse" />
                        Focus Combo Aktif ({formatTimer(eagleEyeTimer)})
                      </span>
                    ) : (
                      char.status
                    )}
                  </div>
                </div>

                {/* Action Area:
                    Jika peran terpilih: tampilkan Skil Aktif & Simulasi Melanggar
                    Jika rekan lain: tampilkan keahlian unik & status otomatis */}
                <div className="mt-auto pt-1">
                  {userRole === 'student' && isSelected ? (
                    <div className="space-y-1.5">
                      
                      {/* KNIGHT ACTIVE SKILL */}
                      {char.id === 'knight' && (
                        <>
                          <button
                            onClick={() => {
                              sound.playShieldDeflect();
                              onKnightShieldWall();
                            }}
                            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer leading-tight ${
                              isShieldWallActive
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-cyan-300 shadow-cyan-900/80 animate-pulse'
                                : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white border-blue-400/60 hover:brightness-110 shadow-blue-950/80'
                            }`}
                            title="Knight mengaktifkan Benteng Pelindung (+10% Perisai Tim & Serap Penalti 5 Menit)"
                          >
                            <Shield className="w-4 h-4 text-cyan-200 shrink-0" />
                            <span className="truncate">
                              {isShieldWallActive
                                ? `🛡️ Benteng (${formatTimer(shieldWallTimer)})`
                                : '🛡️ Benteng Pelindung (Shield Wall)'}
                            </span>
                          </button>

                          <button
                            onClick={onKnightDistract}
                            className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-xs font-semibold border border-red-500/40 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                            title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span className="truncate">⚠️ Simulasi Melanggar: HP Tergeser</span>
                          </button>
                        </>
                      )}

                      {/* MAGE ACTIVE SKILL */}
                      {char.id === 'mage' && (
                        <>
                          <button
                            onClick={() => {
                              sound.playMagicSpell();
                              onMageCheckpoint();
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white font-bold text-xs sm:text-sm border border-purple-400/60 hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/80 active:scale-95 cursor-pointer leading-tight"
                            title="Buka Metacognitive Checkpoint untuk rangkum materi & serang Boss!"
                          >
                            <BookOpen className="w-4 h-4 text-purple-200 shrink-0 animate-bounce" />
                            <span className="truncate">📖 Metacognitive Checkpoint</span>
                          </button>

                          <button
                            onClick={onMageDistract}
                            className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-xs font-semibold border border-red-500/40 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                            title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span className="truncate">⚠️ Simulasi Melanggar: Buka Sosmed</span>
                          </button>
                        </>
                      )}

                      {/* HEALER ACTIVE SKILL */}
                      {char.id === 'healer' && (
                        <>
                          <button
                            onClick={() => {
                              sound.playHeal();
                              onHealerMotivate();
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white font-bold text-xs sm:text-sm border border-teal-400/60 hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg shadow-teal-950/80 active:scale-95 cursor-pointer leading-tight"
                            title="Kirim pesan motivasi untuk pulihkan HP teman & pulihkan Shield tim!"
                          >
                            <HeartHandshake className="w-4 h-4 text-emerald-200 shrink-0" />
                            <span className="truncate">💚 Kirim Motivasi (Support Boost)</span>
                          </button>

                          <button
                            onClick={onHealerDistract}
                            className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-xs font-semibold border border-red-500/40 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                            title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span className="truncate">⚠️ Simulasi Melanggar: Tinggalkan Meja</span>
                          </button>
                        </>
                      )}

                      {/* RANGER ACTIVE SKILL */}
                      {char.id === 'ranger' && (
                        <>
                          <button
                            onClick={() => {
                              sound.playArrowShot();
                              onRangerEagleEye();
                            }}
                            className={`w-full py-2.5 px-3 rounded-xl text-slate-950 font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer leading-tight ${
                              isEagleEyeActive
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 border-amber-200 shadow-amber-950/80 animate-pulse'
                                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 border-amber-300 hover:brightness-110 shadow-amber-950/80'
                            }`}
                            title="Ranger mengaktifkan Radar Fokus (-1.500 HP Boss & Combo 5 Menit)"
                          >
                            <Crosshair className="w-4 h-4 text-slate-950 shrink-0" />
                            <span className="truncate">
                              {isEagleEyeActive
                                ? `🏹 Eagle Eye (${formatTimer(eagleEyeTimer)})`
                                : '🏹 Radar Fokus (Eagle Eye)'}
                            </span>
                          </button>

                          <button
                            onClick={onRangerDistract}
                            className="w-full py-1.5 px-2 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-rose-300 text-xs font-semibold border border-red-500/40 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                            title="Simulasikan anggota melanggar (-25% HP & -15% Shield)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span className="truncate">⚠️ Simulasi Melanggar: Pindah Game</span>
                          </button>
                        </>
                      )}

                    </div>
                  ) : (
                    /* REKAN TIM LAINNYA: KARTU BERSIH TANPA TOMBOL SKIL */
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-300 mb-0.5">
                        <span className="font-semibold text-teal-400 flex items-center gap-1 font-rpg">
                          <CheckCircle2 className="w-3 h-3 text-teal-400" />
                          Rekan Tim Siaga
                        </span>
                        <span className="text-[10px] text-slate-400">Otomatis</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {char.specialTrait}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
