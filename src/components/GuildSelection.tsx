import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Users,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Trophy,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { GuildLeaderboardEntry } from '../types/game';
import { sound } from '../utils/audio';

interface GuildSelectionProps {
  roomCode: string;
  guilds: GuildLeaderboardEntry[];
  selectedGuildName: string;
  onSelectGuild: (guildName: string) => void;
  onCreateGuild: (newGuildName: string, motto: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const GuildSelection: React.FC<GuildSelectionProps> = ({
  roomCode,
  guilds,
  selectedGuildName,
  onSelectGuild,
  onCreateGuild,
  onContinue,
  onBack,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newGuildNameInput, setNewGuildNameInput] = useState('');
  const [newGuildMottoInput, setNewGuildMottoInput] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildNameInput.trim()) return;
    sound.playClick();
    onCreateGuild(newGuildNameInput.trim(), newGuildMottoInput.trim() || 'Fokus Belajar & Taklukkan Distraksi');
    setIsCreatingNew(false);
    setNewGuildNameInput('');
    setNewGuildMottoInput('');
  };

  const isCurrentSelectionValid = Boolean(selectedGuildName.trim());

  return (
    <div className="min-h-[100dvh] w-full bg-[#080D1A] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background Magic Dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-2">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portal</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-400/60 text-indigo-300 font-pixel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>RUANG KELAS: {roomCode}</span>
          </span>
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-rpg tracking-wide drop-shadow">
            PILIH ATAU BUAT GUILD KELOMPOK
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Bergabunglah dengan kelompok belajar yang sudah terdaftar di kelas <strong className="text-teal-300">{roomCode}</strong> atau bentuk Guild baru bersama temanmu.
          </p>
        </div>
      </div>

      {/* Guild Selection Grid */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-5 space-y-4">
        
        {/* Toggle Create Form */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Guild Terdaftar di Ruang Kelas ({guilds.length})</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsCreatingNew(!isCreatingNew);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>{isCreatingNew ? 'Batal' : '+ Buat Guild Baru'}</span>
          </button>
        </div>

        {/* Create Guild Form Modal Inline */}
        {isCreatingNew && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreate}
            className="p-4 rounded-2xl bg-slate-950/90 border border-teal-400/60 shadow-xl space-y-3"
          >
            <div className="text-xs font-bold text-teal-300 font-rpg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Registrasi Guild / Kelompok Baru di Kelas {roomCode}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Nama Guild Kelompok: <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newGuildNameInput}
                  onChange={(e) => setNewGuildNameInput(e.target.value)}
                  placeholder="Misal: Guild Garuda / Kelompok 4"
                  maxLength={30}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Motto / Slogan Tim:
                </label>
                <input
                  type="text"
                  value={newGuildMottoInput}
                  onChange={(e) => setNewGuildMottoInput(e.target.value)}
                  placeholder="Misal: Fokus Maksimal, Nilai Sempurna"
                  maxLength={50}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!newGuildNameInput.trim()}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
              >
                Simpan & Pilih Guild
              </button>
            </div>
          </motion.form>
        )}

        {/* Guild Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {guilds.map((g) => {
            const isSelected = selectedGuildName === g.name;

            return (
              <motion.div
                key={g.id || g.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sound.playClick();
                  onSelectGuild(g.name);
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/90 to-slate-950/95 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wide flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3 text-slate-950" />
                      Dipilih
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0 shadow">
                      {g.badge || '🦅'}
                    </div>
                    <div className="truncate pr-12">
                      <h3 className="font-rpg text-sm sm:text-base font-bold text-white truncate">
                        {g.name}
                      </h3>
                      <p className="text-[10px] text-amber-300 font-semibold truncate">
                        {g.motto}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 my-2.5 bg-slate-900/60 p-2 rounded-xl border border-white/5">
                    <div>
                      <span className="text-slate-400 block">Total EXP:</span>
                      <strong className="text-amber-400 font-pixel text-xs">{g.totalExp} EXP</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Perisai Tim:</span>
                      <strong className="text-teal-400 font-pixel text-xs">{g.shieldIntegrity}%</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Anggota: {g.membersCount || 4} Siswa</span>
                  <span className={`font-bold font-rpg ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Terpilih' : 'Pilih Guild ➔'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          Guild Terpilih: <strong className="text-amber-300 font-rpg">{selectedGuildName || 'Belum dipilih'}</strong>
        </div>

        <motion.button
          whileHover={isCurrentSelectionValid ? { scale: 1.02 } : {}}
          whileTap={isCurrentSelectionValid ? { scale: 0.98 } : {}}
          disabled={!isCurrentSelectionValid}
          onClick={() => {
            if (isCurrentSelectionValid) {
              sound.playClick();
              onContinue();
            }
          }}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-rpg font-bold text-xs sm:text-sm tracking-wider transition flex items-center justify-center gap-2 ${
            isCurrentSelectionValid
              ? 'bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white shadow-lg shadow-teal-950/80 border border-teal-300/60 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>LANJUT KE PEMILIHAN HERO</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

    </div>
  );
};
