import React, { useState } from 'react';
import { Trophy, Medal, Award, Flame, Shield, Search, Sparkles, Users, BookOpen, Clock, PlusCircle } from 'lucide-react';
import { GuildLeaderboardEntry } from '../types/game';
import { sound } from '../utils/audio';

interface TeacherLeaderboardProps {
  guilds: GuildLeaderboardEntry[];
  onAwardBonusExp: (guildId?: string) => void;
  onOpenJournal: () => void;
}

export const TeacherLeaderboard: React.FC<TeacherLeaderboardProps> = ({
  guilds,
  onAwardBonusExp,
  onOpenJournal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'semester'>('week');
  const [teacherNotif, setTeacherNotif] = useState<string | null>(null);

  const filteredGuilds = guilds
    .filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.motto.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.totalExp - a.totalExp);

  // Compute classroom aggregate stats
  const totalClassMinutes = guilds.reduce((acc, curr) => acc + curr.focusMinutes, 0);
  const totalBossesDefeated = guilds.reduce((acc, curr) => acc + curr.bossesDefeated, 0);
  const totalCheckpoints = guilds.reduce((acc, curr) => acc + curr.checkpointsCompleted, 0);

  const handleBonusAll = () => {
    sound.playVictory();
    onAwardBonusExp();
    setTeacherNotif('✨ Apresiasi Guru Berhasil! Semua guild menerima +300 EXP dan Berkat Fokus!');
    setTimeout(() => setTeacherNotif(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Teacher Dashboard Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1B365D] via-[#0E2849] to-[#0A1A33] border border-blue-500/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Teacher & Guild Dashboard
              </span>
              <span className="text-xs text-slate-400">Kelas XI-MIPA 1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-rpg tracking-wide">
              Peringkat Belajar Kelompok (Classroom Leaderboard)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Pantau dedikasi fokus belajar, ketahanan perisai terhadap distraksi, dan rangkuman metakognitif seluruh kelompok kelas.
            </p>
          </div>

          {/* Teacher Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBonusAll}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/60 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Apresiasi Guru (+300 EXP)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenJournal();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Jurnal Catatan Siswa</span>
            </button>
          </div>
        </div>

        {/* Live teacher alert toast */}
        {teacherNotif && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/80 border border-amber-400/60 text-amber-200 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{teacherNotif}</span>
          </div>
        )}

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Total Waktu Fokus</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-pixel">
              {totalClassMinutes} <span className="text-xs font-sans font-normal text-slate-400">Menit</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Boss Distraksi Tumbang</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-rose-400 font-pixel">
              {totalBossesDefeated} <span className="text-xs font-sans font-normal text-slate-400">Boss</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Catatan Rangkuman</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-purple-300 font-pixel">
              {totalCheckpoints} <span className="text-xs font-sans font-normal text-slate-400">Sintesis</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Kelompok Terdaftar</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-blue-300 font-pixel">
              {guilds.length} <span className="text-xs font-sans font-normal text-slate-400">Guild</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F172A] p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Guild (Garuda, Harimau...)"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1 rounded-md transition ${
              timeFilter === 'today' ? 'bg-teal-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-3 py-1 rounded-md transition ${
              timeFilter === 'week' ? 'bg-teal-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => setTimeFilter('semester')}
            className={`px-3 py-1 rounded-md transition ${
              timeFilter === 'semester' ? 'bg-teal-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semester Ini
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-[#0B132B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Nama Kelompok (Guild)</th>
                <th className="py-3.5 px-4 text-center">Menit Fokus</th>
                <th className="py-3.5 px-4 text-center">Boss Selesai</th>
                <th className="py-3.5 px-4 text-center">Checkpoint</th>
                <th className="py-3.5 px-4 text-center">Perisai Tim</th>
                <th className="py-3.5 px-4 text-right">Total EXP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGuilds.map((guild, index) => {
                const rank = index + 1;
                const isCurrentParty = guild.isCurrentParty;

                return (
                  <tr
                    key={guild.id}
                    className={`transition ${
                      isCurrentParty
                        ? 'bg-teal-950/40 hover:bg-teal-900/40 border-l-4 border-l-teal-400'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Rank column */}
                    <td className="py-3.5 px-4 text-center font-bold">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-sm">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/50">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/50">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400 font-pixel text-xs">#{rank}</span>
                      )}
                    </td>

                    {/* Guild Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{guild.badge}</span>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white font-rpg text-sm sm:text-base">
                            <span>{guild.name}</span>
                            {isCurrentParty && (
                              <div className="inline-flex items-center gap-1.5 ml-1.5">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-sans font-bold bg-teal-500 text-slate-950 uppercase">
                                  Kelompokmu
                                </span>
                                <div className="hidden sm:inline-flex items-center -space-x-1.5 bg-slate-900/80 px-1.5 py-0.5 rounded-full border border-teal-500/40">
                                  <img src="/sprites/knight.svg" alt="Knight" className="w-4 h-4 object-contain" />
                                  <img src="/sprites/mage.svg" alt="Mage" className="w-4 h-4 object-contain" />
                                  <img src="/sprites/healer.svg" alt="Healer" className="w-4 h-4 object-contain" />
                                  <img src="/sprites/ranger.svg" alt="Ranger" className="w-4 h-4 object-contain" />
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 italic">
                            "{guild.motto}" • {guild.membersCount} Anggota
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Menit Fokus */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-slate-200">
                        {guild.focusMinutes}m
                      </span>
                    </td>

                    {/* Boss Defeated */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-rose-400">
                        <Flame className="w-3.5 h-3.5" />
                        {guild.bossesDefeated}
                      </span>
                    </td>

                    {/* Checkpoints */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-purple-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        {guild.checkpointsCompleted}
                      </span>
                    </td>

                    {/* Shield Integrity */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <Shield className={`w-3.5 h-3.5 ${guild.shieldIntegrity >= 70 ? 'text-teal-400' : 'text-amber-400'}`} />
                        <span className="font-bold text-slate-300 font-pixel text-[11px]">
                          {guild.shieldIntegrity}%
                        </span>
                      </div>
                    </td>

                    {/* Total EXP */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-pixel text-xs sm:text-sm font-bold text-amber-400">
                        {guild.totalExp.toLocaleString()} XP
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Lv.{guild.level} Scholar
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
