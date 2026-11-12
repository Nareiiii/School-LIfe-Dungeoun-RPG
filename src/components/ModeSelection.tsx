import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UsageMode } from '../types/game';
import { sound } from '../utils/audio';

interface ModeSelectionProps {
  onSelectMode: (mode: UsageMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-[100dvh] w-full bg-[#080D1A] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background Magic Cyber-Academic Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-teal-600/15 rounded-full blur-[110px]" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080D1A_90%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center pt-3 sm:pt-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-md mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>School-Life RPG • Seleksi Mode Pembelajaran</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-rpg tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
        >
          PILIH MODE PENGGUNAAN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed"
        >
          Tentukan metode sesi belajar: Terpandu bersama pengawasan Guru dan ruang kelas, atau Mandiri bersama kelompok belajarmu.
        </motion.p>
      </div>

      {/* Center: The Two Big Mode Cards (MODE A VS MODE B) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* MODE A: DENGAN PENDAMPINGAN GURU (TEACHER-GUIDED MULTIPLAYER) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playClick();
            onSelectMode('teacher_guided');
          }}
          className="group relative cursor-pointer rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#0F1B38]/90 via-[#0B142B]/85 to-slate-950/95 border-2 border-indigo-500/50 hover:border-indigo-400 shadow-[0_10px_35px_rgba(99,102,241,0.25)] hover:shadow-[0_15px_45px_rgba(99,102,241,0.4)] transition-all flex flex-col justify-between overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center border-2 border-indigo-300/60 shadow-lg shadow-indigo-950/80 group-hover:rotate-2 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-400/60 text-indigo-300 font-pixel text-xs font-bold uppercase tracking-wider">
                MODE A
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-wide group-hover:text-indigo-300 transition-colors">
              Dengan Pendampingan Guru
            </h2>
            <div className="text-[11px] font-semibold text-indigo-300 mt-0.5">
              Teacher-Guided Multiplayer Classroom
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              Sesi terstruktur di dalam ruang kelas. Guru memegang <strong>Kontrol Master Timer</strong>, memantau live status seluruh guild, dan <strong>Classroom Leaderboard</strong> aktif antar-kelompok!
            </p>

            {/* Feature Highlights */}
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Master Timer Guru:</strong> Timer Pomodoro tersinkronisasi dan dikontrol penuh oleh Guru.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Multiplayer Kelas:</strong> Siswa memilih/membuat Guild di dalam Kode Ruang Kelas yang sama.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Leaderboard Aktif:</strong> Peringkat dedikasi & ketahanan shield antar-kelompok kelas.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Apresiasi Guru (+500 EXP):</strong> Guru dapat memberi bonus & pantau grafik distraksi.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 font-rpg">
              Pilih Mode A & Buka Portal Kelas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-sm">
              🏫
            </div>
          </div>
        </motion.div>

        {/* MODE B: MANDIRI TANPA GURU (SELF-DIRECTED / SOLO-PARTY MODE) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playClick();
            onSelectMode('self_directed');
          }}
          className="group relative cursor-pointer rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#0A1F26]/90 via-[#07171D]/85 to-slate-950/95 border-2 border-teal-500/50 hover:border-teal-400 shadow-[0_10px_35px_rgba(20,184,166,0.25)] hover:shadow-[0_15px_45px_rgba(20,184,166,0.4)] transition-all flex flex-col justify-between overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/15 rounded-full blur-2xl group-hover:bg-teal-500/25 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 flex items-center justify-center border-2 border-teal-300/60 shadow-lg shadow-teal-950/80 group-hover:-rotate-2 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-950/90 border border-teal-400/60 text-teal-300 font-pixel text-xs font-bold uppercase tracking-wider">
                MODE B
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-wide group-hover:text-teal-300 transition-colors">
              Mandiri Tanpa Guru
            </h2>
            <div className="text-[11px] font-semibold text-teal-300 mt-0.5">
              Self-Directed / Solo-Party Study Dungeon
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              Belajar mandiri langsung bersama party kelompok belajarmu tanpa guru. <strong>Kontrol Timer bebas diatur siswa</strong>, tanpa pilihan guild lain, dan <strong>bebas tekanan leaderboard</strong>.
            </p>

            {/* Feature Highlights */}
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Kontrol Timer Mandiri:</strong> Siswa bebas memulai, jeda, reset, dan memilih durasi Pomodoro.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Single Party Focus:</strong> Fokus murni pada kelompok belajarmu sendiri (tanpa guild lain).</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Leaderboard Ditiadakan:</strong> Tidak ada fitur peringkat/ranking untuk pengalaman belajar privat.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Fitur Deteksi Otomatis Tetap Aktif:</strong> Melindungi fokus saat berpindah aplikasi di HP/Laptop.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-teal-400 group-hover:text-teal-300 flex items-center gap-1 font-rpg">
              Pilih Mode B & Masuk Lobby Mandiri
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </span>
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 text-sm">
              🛡️
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer Info */}
      <div className="relative z-10 max-w-xl mx-auto w-full text-center pb-2 text-[11px] text-slate-400 flex items-center justify-center gap-4">
        <span>🎮 School-Life RPG v2.5</span>
        <span>•</span>
        <span>App-Restriction Engine Active</span>
        <span>•</span>
        <span>Real-Time Online Room</span>
      </div>

    </div>
  );
};
