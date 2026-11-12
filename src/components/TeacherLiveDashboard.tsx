import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Award,
  BellRing,
  Sparkles,
  Users,
  Shield,
  Flame,
  BookOpen,
  Trophy,
  AlertTriangle,
  TrendingUp,
  FastForward,
  CheckCircle2,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { GuildLeaderboardEntry, DistractionLog } from '../types/game';
import { sound } from '../utils/audio';

interface TeacherLiveDashboardProps {
  roomCode: string;
  timeLeft: number;
  isRunning: boolean;
  timerMode: 'focus' | 'break';
  sessionDuration: number;
  sessionRound: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSetTimerDuration: (minutes: number) => void;
  onFastForwardTimer: () => void;
  guilds: GuildLeaderboardEntry[];
  distractionLogs: DistractionLog[];
  onTeacherAppreciate: () => void;
  onTeacherReminder: () => void;
  onOpenJournal: () => void;
}

const DURATION_OPTIONS = [10, 20, 25, 30, 40, 50];

export const TeacherLiveDashboard: React.FC<TeacherLiveDashboardProps> = ({
  roomCode,
  timeLeft,
  isRunning,
  timerMode,
  sessionDuration,
  sessionRound,
  onToggleTimer,
  onResetTimer,
  onSetTimerDuration,
  onFastForwardTimer,
  guilds,
  distractionLogs,
  onTeacherAppreciate,
  onTeacherReminder,
  onOpenJournal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'leaderboard' | 'distractions'>('overview');

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalViolations = distractionLogs.length;
  const totalFocusMinutes = guilds.reduce((acc, curr) => acc + curr.focusMinutes, 0);
  const totalEXP = guilds.reduce((acc, curr) => acc + curr.totalExp, 0);

  return (
    <div className="w-full space-y-4 pb-10 select-none">
      
      {/* 1. MASTER TIMER & CLASSROOM CONTROL CONSOLE (GURU EXCLUSIVE) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#111C3D] via-[#0E172F] to-[#0A1024] border-2 border-indigo-500/50 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Room & Teacher Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-400 text-indigo-300 font-pixel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>KODE ROOM: {roomCode}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Online Live Broadcast Aktif</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                Sesi #{sessionRound}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-rpg tracking-wide">
              Teacher Live Monitoring & Master Timer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Kontrol terpusat sesi Pomodoro kelas. Setiap perubahan timer (Mulai, Jeda, Reset, Durasi) otomatis tersinkronisasi ke seluruh layar siswa di kelas <strong className="text-teal-300">{roomCode}</strong>.
            </p>
          </div>

          {/* Master Pomodoro Control Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-indigo-400/40 shadow-inner">
            
            {/* Countdown Display */}
            <div className="text-center sm:text-left pr-2 sm:border-r border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-rpg">
                Master Pomodoro ({timerMode === 'focus' ? 'Fokus' : 'Break'}):
              </span>
              <div
                className={`font-pixel text-2xl sm:text-3xl font-black tracking-wider ${
                  isRunning
                    ? 'text-teal-300 drop-shadow-[0_0_12px_rgba(45,212,191,0.8)]'
                    : 'text-slate-200'
                }`}
              >
                {formattedTime}
              </div>
            </div>

            {/* Timer Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleTimer();
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black font-rpg flex items-center gap-1.5 transition shadow-lg active:scale-95 cursor-pointer ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/80'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/80'
                }`}
                title={isRunning ? 'Jeda Timer Kelas' : 'Mulai Timer Kelas'}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>JEDA KELAS</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>MULAI KELAS</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onResetTimer();
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onFastForwardTimer();
                }}
                className="px-3 py-2 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 text-orange-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Simulasikan waktu selesai seketika"
              >
                <FastForward className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Percepat</span>
              </button>
            </div>

          </div>

        </div>

        {/* Master Duration Selector (Guru Only) */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold font-rpg">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Atur Durasi Pomodoro Seluruh Siswa:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {DURATION_OPTIONS.map((dur) => {
              const isActive = sessionDuration === dur;
              return (
                <button
                  key={dur}
                  onClick={() => {
                    sound.playClick();
                    onSetTimerDuration(dur);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border border-indigo-300 shadow-md font-black'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{dur} Menit</span>
                </button>
              );
            })}
          </div>

          {/* Quick Teacher Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTeacherAppreciation();
                onTeacherAppreciate();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg border border-amber-300 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 fill-current" />
              <span>Apresiasi Kelas (+500 EXP)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onTeacherReminder();
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-indigo-300" />
              <span>Kirim Pengingat</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl font-rpg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Live Guild Status ({guilds.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`px-3.5 py-1.5 rounded-xl font-rpg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'leaderboard'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Classroom Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('distractions')}
          className={`px-3.5 py-1.5 rounded-xl font-rpg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'distractions'
              ? 'bg-rose-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Log Distraksi Siswa ({totalViolations})</span>
        </button>

        <button
          onClick={onOpenJournal}
          className="ml-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Jurnal Catatan Materi</span>
        </button>
      </div>

      {/* 3. VIEW 1: LIVE STATUS SELURUH GUILD DI KELAS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {guilds.map((g, idx) => (
              <div
                key={g.id || g.name}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{g.badge || '🦅'}</span>
                      <div>
                        <h4 className="font-rpg font-bold text-white text-sm sm:text-base leading-tight">
                          {g.name}
                        </h4>
                        <span className="text-[10px] text-amber-300 font-semibold truncate block">
                          {g.motto}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 font-pixel text-[10px] font-bold text-slate-300">
                      Rank #{idx + 1}
                    </span>
                  </div>

                  {/* Dual Gauges: Shield & EXP */}
                  <div className="space-y-2 my-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-teal-400" />
                          <span>Perisai Tim:</span>
                        </span>
                        <strong className="text-teal-300 font-pixel text-xs">{g.shieldIntegrity}%</strong>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-teal-900/60 p-0.2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${g.shieldIntegrity}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-900">
                      <div>
                        <span className="text-slate-500 block">Total EXP:</span>
                        <strong className="text-amber-400 font-pixel text-xs">{g.totalExp} EXP</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Waktu Fokus:</span>
                        <strong className="text-white font-pixel text-xs">{g.focusMinutes}m</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Anggota: {g.membersCount || 4} Siswa</span>
                  <span className="text-emerald-400 font-semibold">● Terhubung</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW 2: CLASSROOM LEADERBOARD TABEL LENGKAP */}
      {activeSubTab === 'leaderboard' && (
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-rpg font-bold text-base text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Peringkat Nilai & Ketahanan Fokus Kelas {roomCode}</span>
            </h3>
            <span className="text-xs text-slate-400">Total {guilds.length} Kelompok</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-rpg uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Peringkat</th>
                  <th className="py-2.5 px-3">Nama Guild / Kelompok</th>
                  <th className="py-2.5 px-3 text-center">Ketahanan Shield</th>
                  <th className="py-2.5 px-3 text-center">Waktu Fokus</th>
                  <th className="py-2.5 px-3 text-center">Rangkuman</th>
                  <th className="py-2.5 px-3 text-right">Total Skor EXP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {guilds.map((g, index) => (
                  <tr key={g.id || g.name} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          index === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : index === 1
                            ? 'bg-slate-300 text-slate-950'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs sm:text-sm font-rpg flex items-center gap-1.5">
                        <span>{g.badge || '🦅'}</span>
                        <span>{g.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{g.motto}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-pixel font-bold text-xs ${
                          g.shieldIntegrity >= 80 ? 'text-teal-300' : 'text-amber-400'
                        }`}
                      >
                        {g.shieldIntegrity}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-pixel text-slate-200">
                      {g.focusMinutes}m
                    </td>
                    <td className="py-3 px-3 text-center text-purple-300 font-pixel">
                      {g.checkpointsCompleted || 0}
                    </td>
                    <td className="py-3 px-3 text-right font-pixel font-bold text-amber-300 text-sm">
                      {g.totalExp} EXP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. VIEW 3: LIVE FEED LOG DISTRAKSI SISWA */}
      {activeSubTab === 'distractions' && (
        <div className="rounded-2xl bg-slate-950/80 border border-rose-500/30 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-rpg font-bold text-base text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Riwayat Insiden Distraksi Siswa (App-Restriction Live Feed)</span>
            </h3>
            <span className="text-xs text-rose-300 font-pixel font-bold">
              {totalViolations} Insiden
            </span>
          </div>

          {distractionLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <span>Semua siswa berdisiplin penuh. Belum ada insiden pelanggaran tercatat.</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {distractionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-red-950 border border-red-500 flex items-center justify-center text-xs font-bold text-red-300">
                      ⚠️
                    </span>
                    <div>
                      <div className="font-bold text-white font-rpg">
                        {log.heroName}
                      </div>
                      <div className="text-[11px] text-rose-300 font-medium">
                        {log.reason}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 font-pixel">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
