import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Swords,
  Shield,
  Sparkles,
  BarChart3,
  Award,
  Users,
  Compass,
  ArrowRight,
  Flame,
  ArrowLeft,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PortalSelectionProps {
  roomCode: string;
  onChangeRoomCode: (code: string) => void;
  onSelectRole: (role: 'student' | 'teacher') => void;
  onBackToModeSelect: () => void;
}

export const PortalSelection: React.FC<PortalSelectionProps> = ({
  roomCode,
  onChangeRoomCode,
  onSelectRole,
  onBackToModeSelect,
}) => {
  const [studentRoomInput, setStudentRoomInput] = useState(roomCode || 'XI-MIPA-1');
  const [teacherRoomInput, setTeacherRoomInput] = useState(roomCode || 'XI-MIPA-1');

  const handleGenerateRoom = () => {
    sound.playClick();
    const classes = ['XI-MIPA-1', 'XI-MIPA-2', 'XI-IPS-1', 'XII-MIPA-3', 'X-FOKUS-1'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    setTeacherRoomInput(randomClass);
    onChangeRoomCode(randomClass);
  };

  const handleTeacherSubmit = () => {
    sound.playClick();
    const finalCode = teacherRoomInput.trim().toUpperCase() || 'XI-MIPA-1';
    onChangeRoomCode(finalCode);
    onSelectRole('teacher');
  };

  const handleStudentSubmit = () => {
    sound.playClick();
    const finalCode = studentRoomInput.trim().toUpperCase() || 'XI-MIPA-1';
    onChangeRoomCode(finalCode);
    onSelectRole('student');
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#080D1A] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background Magical Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-[110px]" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080D1A_90%)]" />
      </div>

      {/* Top Header with Back Button */}
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              sound.playClick();
              onBackToModeSelect();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ganti Mode Penggunaan</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/60 text-indigo-300 font-pixel text-xs font-bold uppercase tracking-wider">
            MODE A: DENGAN PENDAMPINGAN GURU
          </span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-rpg tracking-wide drop-shadow">
            PORTAL RUANG KELAS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Tentukan peranmu: Masuk sebagai <strong>Guru</strong> untuk mengontrol Master Timer & memantau kelas, atau sebagai <strong>Siswa</strong> untuk bergabung ke Guild.
          </p>
        </div>
      </div>

      {/* Center: The Two Big RPG Gateway Portals (SISWA VS GURU) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* PORTAL 1: SISWA (STUDENT) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-slate-900/90 via-[#0D182E]/85 to-slate-950/95 border-2 border-teal-500/50 shadow-[0_10px_35px_rgba(20,184,166,0.25)] flex flex-col justify-between overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 flex items-center justify-center border-2 border-teal-300/60 shadow-lg shadow-teal-950/80">
                <Swords className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400/60 text-teal-300 font-pixel text-xs font-bold uppercase tracking-wider">
                PORTAL SISWA
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-wide">
              Masuk sebagai Siswa
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Masukkan Kode Ruang Kelas yang diberikan oleh Gurumu, pilih Guild Kelompok, dan mulai pertempuran fokus bersama kawan satu regu!
            </p>

            {/* Room Code Input for Student */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/90 border border-teal-500/40 space-y-2">
              <label className="block text-xs font-bold text-teal-300 font-rpg flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                <span>Masukkan Kode Ruang Kelas Guru:</span>
              </label>
              <input
                type="text"
                value={studentRoomInput}
                onChange={(e) => setStudentRoomInput(e.target.value.toUpperCase())}
                placeholder="Misal: XI-MIPA-1"
                maxLength={20}
                className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 rounded-xl px-3.5 py-2 text-sm font-bold text-white tracking-wider outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Timer di layar siswa akan otomatis disinkronkan oleh Master Timer Guru.
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!studentRoomInput.trim()}
              onClick={handleStudentSubmit}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-rpg font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-teal-950/80 border border-teal-300/60 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>MASUK RUANG KELAS & PILIH GUILD</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* PORTAL 2: GURU / PENGAWAS KELAS (TEACHER) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-slate-900/90 via-[#1E1B4B]/70 to-slate-950/95 border-2 border-indigo-500/50 shadow-[0_10px_35px_rgba(99,102,241,0.25)] flex flex-col justify-between overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center border-2 border-indigo-300/60 shadow-lg shadow-indigo-950/80">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/60 text-indigo-300 font-pixel text-xs font-bold uppercase tracking-wider">
                PORTAL GURU
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-rpg text-white tracking-wide">
              Masuk sebagai Guru
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Buat atau kelola Ruang Kelas. Anda memiliki <strong>Kontrol Penuh atas Master Timer Pomodoro</strong> dan live monitoring dashboard seluruh kelompok.
            </p>

            {/* Room Code Creator for Teacher */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/90 border border-indigo-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-indigo-300 font-rpg flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Kode Ruang Kelas Baru:</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRoom}
                  className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Acak Kode</span>
                </button>
              </div>

              <input
                type="text"
                value={teacherRoomInput}
                onChange={(e) => setTeacherRoomInput(e.target.value.toUpperCase())}
                placeholder="Misal: XI-MIPA-1"
                maxLength={20}
                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 rounded-xl px-3.5 py-2 text-sm font-bold text-white tracking-wider outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Bagikan kode ini ke siswa agar mereka masuk ke ruang kelas yang sama.
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!teacherRoomInput.trim()}
              onClick={handleTeacherSubmit}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-rpg font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-indigo-950/80 border border-indigo-300/60 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BUAT RUANG & BUKA LIVE DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Footer Info */}
      <div className="relative z-10 max-w-xl mx-auto w-full text-center pb-2 text-[11px] text-slate-400 flex items-center justify-center gap-4">
        <span>🎮 School-Life RPG v2.5</span>
        <span>•</span>
        <span>Teacher-Guided Multiplayer</span>
        <span>•</span>
        <span>Master Timer Synchronized</span>
      </div>

    </div>
  );
};
