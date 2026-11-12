import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  BookOpen,
  HeartHandshake,
  Crosshair,
  Swords,
  Sparkles,
  Trophy,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  Flame,
  User,
  Clock,
  Lock,
  Unlock,
  School,
  AlertCircle,
} from 'lucide-react';
import { CharacterRole, UsageMode } from '../types/game';
import { sound } from '../utils/audio';
import battlefieldBg from '../assets/images/rpg_isometric_battlefield_1794074866458.jpg';

interface RoleSelectionLobbyProps {
  usageMode: UsageMode;
  characters: CharacterRole[];
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
  // Team / Guild inputs
  guildName: string;
  onChangeGuildName: (name: string) => void;
  playerName: string;
  onChangePlayerName: (name: string) => void;
  classCode: string;
  onChangeClassCode: (code: string) => void;
  sessionDuration: number; // in minutes (10, 20, 30, 40, 50)
  onChangeSessionDuration: (duration: number) => void;
  onStartRaid: () => void;
  onOpenLeaderboard: () => void;
  onBackToMode?: () => void;
}

const DURATION_OPTIONS = [10, 20, 30, 40, 50];

export const RoleSelectionLobby: React.FC<RoleSelectionLobbyProps> = ({
  usageMode,
  characters,
  selectedRoleId,
  onSelectRole,
  guildName,
  onChangeGuildName,
  playerName,
  onChangePlayerName,
  classCode,
  onChangeClassCode,
  sessionDuration,
  onChangeSessionDuration,
  onStartRaid,
  onOpenLeaderboard,
  onBackToMode,
}) => {
  const isRangerSelected = selectedRoleId === 'ranger';
  const selectedCharacter = characters.find((c) => c.id === selectedRoleId) || characters[0];

  // Validation: Nama Guild dan Nama Player harus diisi, dan 1 Role Hero dipilih
  const isGuildValid = guildName.trim().length > 0;
  const isPlayerValid = playerName.trim().length > 0;
  const isFormValid = isGuildValid && isPlayerValid && Boolean(selectedRoleId);

  return (
    <div
      className="relative w-full min-h-[calc(100vh-4.5rem)] rounded-3xl overflow-hidden border-2 border-slate-700/60 shadow-[0_12px_45px_rgba(0,0,0,0.8)] flex flex-col justify-between bg-cover bg-center bg-no-repeat transition-all"
      style={{
        backgroundImage: `url(${battlefieldBg})`,
      }}
    >
      {/* Dark Ambient Scrim for perfect Glassmorphic contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/90 via-[#0B132B]/80 to-[#080D1A]/95 pointer-events-none" />

      {/* Ambient Forest Magic Dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px]" />
      </div>

      {/* LOBBY CONTENT CONTAINER */}
      <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 flex flex-col flex-1 justify-between space-y-6">
        
        {/* HEADER: TITLE & MISSION BRIEF */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Lobby Pemilihan Peran & Registrasi Tim</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-rpg tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            School-Life RPG
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed drop-shadow">
            Daftarkan tim kelompok belajarmu, pilih peran pahlawan, dan taklukkan{' '}
            <span className="text-red-400 font-bold">Lord Prokrastinasi</span> di Co-op Study Dungeon!
          </p>
        </div>

        {/* ========================================================
            KOMPONEN INPUT NAMA GUILD, PLAYER, & KELAS (INTERACTIVE FORM)
            ======================================================== */}
        <div className="bg-slate-950/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-2xl max-w-4xl w-full mx-auto space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h3 className="font-rpg text-sm sm:text-base font-bold text-white tracking-wide">
                Registrasi Nama Team & Profil Siswa
              </h3>
            </div>
            <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-semibold flex items-center gap-1">
              <Users className="w-3 h-3 text-amber-400" />
              <span>Tim: {guildName || 'Belum Diisi'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Field 1: Nama Team / Guild Kelompok */}
            <div>
              <label htmlFor="guildNameInput" className="block text-xs font-bold text-slate-200 mb-1 font-rpg flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Nama Team / Guild: <span className="text-rose-400">*</span></span>
              </label>
              <div className="relative">
                <input
                  id="guildNameInput"
                  type="text"
                  value={guildName}
                  onChange={(e) => onChangeGuildName(e.target.value)}
                  placeholder="Misal: Guild Garuda / Kelompok 1"
                  maxLength={30}
                  className={`w-full bg-slate-900/95 border focus:ring-2 rounded-xl px-3.5 py-2 text-sm text-white font-bold placeholder:text-slate-500 outline-none transition shadow-inner ${
                    isGuildValid
                      ? 'border-amber-400/70 focus:border-amber-300 focus:ring-amber-400/30'
                      : 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-500/30'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ditampilkan di Header Arena & Leaderboard.
              </span>
            </div>

            {/* Field 2: Nama Lengkap / Nickname Siswa */}
            <div>
              <label htmlFor="playerNameInput" className="block text-xs font-bold text-slate-200 mb-1 font-rpg flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>Nama Siswa: <span className="text-rose-400">*</span></span>
              </label>
              <div className="relative">
                <input
                  id="playerNameInput"
                  type="text"
                  value={playerName}
                  onChange={(e) => onChangePlayerName(e.target.value)}
                  placeholder="Misal: Bima / Reifan"
                  maxLength={20}
                  className={`w-full bg-slate-900/95 border focus:ring-2 rounded-xl px-3.5 py-2 text-sm text-white font-bold placeholder:text-slate-500 outline-none transition shadow-inner ${
                    isPlayerValid
                      ? 'border-teal-400/70 focus:border-teal-300 focus:ring-teal-400/30'
                      : 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-500/30'
                  }`}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Nama hero pilihanmu di arena raid.
              </span>
            </div>

            {/* Field 3: Kode Ruang Kelas */}
            <div>
              <label htmlFor="classCodeInput" className="block text-xs font-bold text-slate-200 mb-1 font-rpg flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kode Ruang Kelas:</span>
              </label>
              <div className="relative">
                <input
                  id="classCodeInput"
                  type="text"
                  value={classCode}
                  onChange={(e) => onChangeClassCode(e.target.value)}
                  placeholder="Misal: XI-MIPA-1"
                  maxLength={15}
                  className="w-full bg-slate-900/95 border border-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 rounded-xl px-3.5 py-2 text-sm text-white font-bold placeholder:text-slate-500 outline-none transition shadow-inner"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dashboard monitoring pengawas guru.
              </span>
            </div>

          </div>

          {/* Durasi Sesi Belajar (Mode A: Dikontrol Guru vs Mode B: Mandiri) */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 font-rpg">
                  {usageMode === 'teacher_guided'
                    ? 'Master Timer Pomodoro Ruang Kelas:'
                    : 'Durasi Sesi Pomodoro Party:'}
                </span>
                <p className="text-[10px] text-slate-400">
                  {usageMode === 'teacher_guided' ? (
                    <span className="text-indigo-300 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-400" />
                      Timer dikontrol penuh oleh Guru ({sessionDuration} Menit).
                    </span>
                  ) : isRangerSelected ? (
                    <strong className="text-amber-300">Akses Ranger Terbuka: Bebas pilih durasi tim.</strong>
                  ) : (
                    <span>Hanya Ranger yang dapat mengatur durasi (Terkunci {sessionDuration}m).</span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:w-auto">
              {DURATION_OPTIONS.map((dur) => {
                const isActive = sessionDuration === dur;
                const canChangeDuration = usageMode === 'self_directed' && isRangerSelected;

                return (
                  <button
                    key={dur}
                    type="button"
                    disabled={!canChangeDuration}
                    onClick={() => {
                      if (canChangeDuration) {
                        sound.playClick();
                        onChangeSessionDuration(dur);
                      }
                    }}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                      isActive
                        ? usageMode === 'teacher_guided'
                          ? 'bg-indigo-900 text-indigo-200 border border-indigo-500 font-bold'
                          : isRangerSelected
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 border border-amber-300 shadow-md font-black'
                          : 'bg-slate-800 text-amber-400 border border-amber-500/50'
                        : canChangeDuration
                        ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/15 cursor-pointer'
                        : 'bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                    title={
                      usageMode === 'teacher_guided'
                        ? 'Master Timer dikontrol Guru'
                        : isRangerSelected
                        ? 'Klik untuk ubah durasi'
                        : 'Pilih Ranger untuk ubah durasi'
                    }
                  >
                    <span>{dur}m</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 4 CARDS HERO SELECTION GRID */}
        <div>
          <div className="text-center mb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-200 uppercase tracking-wider font-rpg flex items-center justify-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Pilih 1 Peran Pahlawanmu (3 Lainnya Rekan Otomatis)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {characters.map((char) => {
              const isSelected = selectedRoleId === char.id;

              return (
                <motion.div
                  key={char.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sound.playClick();
                    onSelectRole(char.id);
                  }}
                  className={`rounded-2xl p-4 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between backdrop-blur-md ${
                    isSelected
                      ? 'bg-slate-900/95 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/50'
                      : 'bg-slate-950/75 border border-white/10 hover:border-white/30 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wide flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3 text-slate-950" />
                        Dipilih
                      </span>
                    </div>
                  )}

                  {/* Character Avatar & Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden p-1 shadow-md ${
                          isSelected
                            ? 'bg-amber-950/80 border-amber-400'
                            : 'bg-slate-900 border-white/10'
                        }`}
                      >
                        <img
                          src={char.spriteUrl || `/sprites/${char.id}.svg`}
                          alt={char.name}
                          className="w-full h-full object-contain filter drop-shadow select-none"
                        />
                      </div>

                      <div className="truncate">
                        <h3 className="font-rpg text-base font-bold text-white truncate leading-tight">
                          {isSelected ? `${playerName || 'Pemain'} (${char.title.split(' ')[0]})` : char.name}
                        </h3>
                        <p className="text-xs text-amber-300 font-semibold truncate">
                          {char.title}
                        </p>
                      </div>
                    </div>

                    {/* Trait & Description */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] leading-relaxed">
                        <strong className="text-teal-300 block mb-0.5 font-rpg">Keahlian Unik:</strong>
                        <span>{char.specialTrait}</span>
                      </div>
                    </div>
                  </div>

                  {/* HP & Selection Action Footnote */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-pixel">HP: 100/100</span>
                    <span className={`font-bold font-rpg text-xs ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Peran Aktifmu' : 'Pilih Peran ➔'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION BAR: START RAID CTA WITH VALIDATION */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Tim & Karakter Terpilih:</div>
              <div className="text-sm font-bold text-white font-rpg flex flex-wrap items-center gap-1.5">
                <span className="text-amber-300">{guildName || '(Nama Tim Belum Diisi)'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-teal-300">{playerName || 'Pemain'}</span>
                <span className="text-xs text-slate-400">({selectedCharacter.title} • {sessionDuration}m)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* FITUR LEADERBOARD HANYA AKTIF PADA MODE A: DENGAN PENDAMPINGAN GURU */}
            {usageMode === 'teacher_guided' && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLeaderboard();
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Leaderboard Kelas</span>
              </button>
            )}

            {/* BIG START RAID BUTTON WITH VALIDATION */}
            <div className="w-full sm:w-auto flex flex-col items-center">
              <motion.button
                whileHover={isFormValid ? { scale: 1.03 } : {}}
                whileTap={isFormValid ? { scale: 0.97 } : {}}
                disabled={!isFormValid}
                onClick={() => {
                  if (isFormValid) {
                    sound.playClick();
                    onStartRaid();
                  }
                }}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl font-rpg font-black text-sm sm:text-base tracking-wider border-2 flex items-center justify-center gap-2.5 transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] border-amber-300 cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60 shadow-none'
                }`}
              >
                <Swords className={`w-5 h-5 ${isFormValid ? 'text-amber-200 animate-bounce' : 'text-slate-500'}`} />
                <span>MASUK DUNGEON / START RAID ({sessionDuration}M)</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {!isFormValid && (
                <span className="text-[11px] text-amber-300/90 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Harap isi Nama Team/Guild & Nama Siswa terlebih dahulu.
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
