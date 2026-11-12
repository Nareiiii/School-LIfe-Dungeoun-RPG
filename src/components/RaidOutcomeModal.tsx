import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  AlertTriangle,
  Shield,
  Sparkles,
  Users,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { CharacterRole, Boss } from '../types/game';
import { sound } from '../utils/audio';

interface RaidOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToLobby: () => void;
  shieldHp: number;
  maxShieldHp: number;
  characters: CharacterRole[];
  boss: Boss;
  sessionMinutes: number;
  expMultiplier: number;
}

export const RaidOutcomeModal: React.FC<RaidOutcomeModalProps> = ({
  isOpen,
  onClose,
  onReturnToLobby,
  shieldHp,
  maxShieldHp,
  characters,
  boss,
  sessionMinutes,
  expMultiplier,
}) => {
  const shieldPercent = Math.max(0, Math.min(100, Math.round((shieldHp / maxShieldHp) * 100)));
  const minHeroHp = Math.min(...characters.map((c) => Math.round((c.hp / c.maxHp) * 100)));
  const avgHeroHp = Math.round(
    characters.reduce((acc, c) => acc + (c.hp / c.maxHp) * 100, 0) / characters.length
  );

  // Criteria according to prompt specifications:
  // PERFORMA BAIK: Team Shield > 50% & HP Karakter tinggi (> 40%)
  // PERFORMA BURUK: Team Shield <= 30% atau HP Karakter rendah (<= 25%)
  const isGreatPerformance = shieldPercent > 50 && minHeroHp > 40;
  const isPoorPerformance = shieldPercent <= 30 || minHeroHp <= 25;

  const totalBaseExp = sessionMinutes * 50;
  const bonusExp = isGreatPerformance ? Math.round(totalBaseExp * 1.5) : Math.round(totalBaseExp * 0.6);

  useEffect(() => {
    if (isOpen) {
      if (isGreatPerformance) {
        sound.playVictory();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#10B981', '#F59E0B', '#38BDF8', '#8B5CF6'],
          });
        } catch {
          // safe fallback
        }
      } else if (isPoorPerformance) {
        sound.playWarningAlert();
      } else {
        sound.playHeal();
      }
    }
  }, [isOpen, isGreatPerformance, isPoorPerformance]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-xl rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl border-2 overflow-hidden my-auto ${
            isGreatPerformance
              ? 'bg-gradient-to-b from-[#0F2922] via-[#0A1A18] to-[#06100E] border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
              : isPoorPerformance
              ? 'bg-gradient-to-b from-[#2E1215] via-[#1B0C0E] to-[#100708] border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.35)]'
              : 'bg-gradient-to-b from-[#18233C] via-[#0E1528] to-[#080D1A] border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
          }`}
        >
          {/* Ambient Header Glow */}
          <div
            className={`absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full blur-3xl pointer-events-none opacity-40 ${
              isGreatPerformance ? 'bg-emerald-400' : isPoorPerformance ? 'bg-rose-500' : 'bg-amber-400'
            }`}
          />

          {/* OUTCOME BANNER */}
          <div className="text-center relative z-10 space-y-2 mb-5">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md ${
                isGreatPerformance
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60'
                  : isPoorPerformance
                  ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 animate-pulse'
                  : 'bg-amber-950/90 text-amber-300 border-amber-400/60'
              }`}
            >
              {isGreatPerformance ? (
                <>
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Sesi Selesai • Laporan Evaluasi Performa</span>
                </>
              ) : isPoorPerformance ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Sesi Selesai • Laporan Evaluasi Performa</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sesi Selesai • Laporan Evaluasi Performa</span>
                </>
              )}
            </div>

            <h2
              className={`font-rpg font-black text-xl sm:text-2xl md:text-3xl tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] ${
                isGreatPerformance
                  ? 'text-emerald-300'
                  : isPoorPerformance
                  ? 'text-rose-400'
                  : 'text-amber-300'
              }`}
            >
              {isGreatPerformance
                ? 'VICTORY: PERFORMA TIM SANGAT BAIK!'
                : isPoorPerformance
                ? 'DEFEAT / PERFORMA TIM PERLU EVALUASI'
                : 'HASIL PERFORMA: CUKUP BAIK & FOKUS'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {isGreatPerformance
                ? 'Luar biasa! Kolaborasi gotong royong seluruh anggota tim berhasil menjaga perisai dari godaan distraksi dan mengalahkan target fokus.'
                : isPoorPerformance
                ? 'Perisai kelompok terkuras akibat frekuensi pelanggaran distraksi yang tinggi. Evaluasi ritme fokus tim sebelum memulai sesi berikutnya.'
                : 'Sesi selesai dengan hasil cukup memuaskan. Tingkatkan konsistensi penulisan rangkuman materi untuk serangan lebih maksimal.'}
            </p>
          </div>

          {/* KEY METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 relative z-10">
            {/* 1. Sisa Shield */}
            <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>Perisai Tim</span>
              </div>
              <div
                className={`font-pixel text-lg font-bold ${
                  shieldPercent > 50
                    ? 'text-cyan-300'
                    : shieldPercent > 30
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {shieldPercent}%
              </div>
              <div className="text-[9px] text-slate-400">{shieldHp} / {maxShieldHp} SP</div>
            </div>

            {/* 2. Rata-rata HP Hero */}
            <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>Rata-rata HP</span>
              </div>
              <div
                className={`font-pixel text-lg font-bold ${
                  avgHeroHp >= 75
                    ? 'text-emerald-400'
                    : avgHeroHp >= 40
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {avgHeroHp}%
              </div>
              <div className="text-[9px] text-slate-400">Min: {minHeroHp}%</div>
            </div>

            {/* 3. Durasi Fokus */}
            <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Total Durasi</span>
              </div>
              <div className="font-pixel text-lg font-bold text-amber-300">
                {sessionMinutes}m
              </div>
              <div className="text-[9px] text-slate-400">Sesi Terjadwal</div>
            </div>

            {/* 4. EXP Reward */}
            <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Bonus EXP</span>
              </div>
              <div className="font-pixel text-lg font-bold text-yellow-300">
                +{bonusExp}
              </div>
              <div className="text-[9px] text-slate-400">
                {isGreatPerformance ? '+150% Gotong Royong' : 'Penalti Distraksi'}
              </div>
            </div>
          </div>

          {/* DETAIL PERAN 4 HERO */}
          <div className="bg-slate-950/70 p-3 sm:p-3.5 rounded-2xl border border-white/10 mb-5 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-rpg">
              <span>Status Akhir 4 Rekan Tim:</span>
              <span className="text-[10px] text-slate-400 font-normal">Kondisi Kesehatan Fokus</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {characters.map((char) => {
                const charHp = Math.round((char.hp / char.maxHp) * 100);
                return (
                  <div
                    key={char.id}
                    className="p-2 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2"
                  >
                    <img
                      src={char.spriteUrl || `/sprites/${char.id}.svg`}
                      alt={char.name}
                      className="w-7 h-7 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-white truncate leading-tight">
                        {char.name}
                      </div>
                      <div
                        className={`text-[9px] font-pixel font-bold ${
                          charHp >= 75
                            ? 'text-emerald-400'
                            : charHp >= 40
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        HP {charHp}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EVALUASI & REKOMENDASI SPESIFIK */}
          <div
            className={`p-3.5 rounded-2xl border mb-6 relative z-10 text-xs leading-relaxed space-y-1.5 ${
              isGreatPerformance
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                : isPoorPerformance
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 font-rpg text-sm">
              {isGreatPerformance ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pujian Kolaborasi Gotong Royong:</span>
                </>
              ) : isPoorPerformance ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Rincian & Rekomendasi Perbaikan Fokus:</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Catatan Refleksi Belajar:</span>
                </>
              )}
            </div>

            {isGreatPerformance && (
              <p className="text-[11px] text-emerald-200/90">
                Pertahanan tim sangat kokoh! Setiap anggota saling mengingatkan dan tidak tergiur membuka media sosial saat jam belajar berlangsung. Terus pertahankan ritme ini di ronde berikutnya untuk kenaikan Level Guild!
              </p>
            )}

            {isPoorPerformance && (
              <ul className="text-[11px] text-rose-200/90 list-disc pl-4 space-y-1">
                <li>
                  <strong>Tingkat Pelanggaran Tinggi:</strong> Banyak anggota terdeteksi menggeser HP atau membuka aplikasi lain, memicu serangan balik dari Boss Distraksi.
                </li>
                <li>
                  <strong>Solusi Praktis:</strong> Jauhkan gawai dari meja belajar, aktifkan skill <em>Benteng Pelindung</em> Knight di awal sesi, dan gunakan <em>Kirim Motivasi</em> Healer jika ada kawan yang lelah.
                </li>
              </ul>
            )}

            {!isGreatPerformance && !isPoorPerformance && (
              <p className="text-[11px] text-amber-200/90">
                Sesi berjalan moderat. Perisai sempat tergerus namun berhasil bertahan hingga akhir. Manfaatkan fitur <em>Metacognitive Checkpoint</em> lebih sering untuk menghasilkan serangan balik bertenaga ke Boss!
              </p>
            )}
          </div>

          {/* MODAL ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 relative z-10 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                onReturnToLobby();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-white/15 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembali ke Lobby (Sesi Baru)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Lanjut Belajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
