import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Skull, ShieldAlert, Swords, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface ReturnWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  penaltyType: 'hp' | 'shield' | 'both';
  heroName: string;
  infractionCount: number;
}

export const ReturnWarningModal: React.FC<ReturnWarningModalProps> = ({
  isOpen,
  onClose,
  penaltyType,
  heroName,
  infractionCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative bg-gradient-to-b from-[#1E0B10] via-[#16060A] to-[#0A0204] border-2 border-red-500 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-[0_0_50px_rgba(239,68,68,0.7)] text-slate-100 overflow-hidden"
      >
        {/* Blood Pulsing Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/90 border-2 border-red-500/80 flex items-center justify-center shadow-lg shadow-red-950/80">
            <AlertTriangle className="w-7 h-7 text-red-400 animate-bounce" />
          </div>
          <span className="px-3 py-1 rounded-full bg-red-950/90 border border-red-500/50 text-red-300 font-pixel text-[11px] font-bold uppercase tracking-wider">
            PELANGGARAN #{infractionCount}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black font-rpg text-red-100 tracking-wide leading-tight">
          ⚠️ PERINGATAN DISTRAKSI!
        </h3>
        <p className="text-xs text-rose-300/90 mt-1 font-semibold">
          App-Restriction Engine mendeteksi perpindahan aplikasi / keluar tab!
        </p>

        {/* Penalty Card */}
        <div className="my-4 p-4 rounded-2xl bg-black/60 border border-red-500/40 space-y-2.5">
          <div className="text-xs text-slate-200 leading-relaxed">
            Kamu terdeteksi <strong>meninggalkan sesi fokus</strong> (pindah ke media sosial, aplikasi lain, atau mengunci layar HP).
          </div>

          <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-900/90 flex items-center justify-center shrink-0">
              {penaltyType === 'shield' ? (
                <ShieldAlert className="w-5 h-5 text-amber-300 animate-pulse" />
              ) : (
                <Skull className="w-5 h-5 text-red-200 animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-red-200 font-rpg">
                {penaltyType === 'shield'
                  ? 'HP HERO HABIS ➔ PENALTI PERISAI TIM!'
                  : 'PENALTI DARAH (HP) KARAKTER!'}
              </div>
              <div className="text-[11px] font-pixel text-amber-300 font-bold">
                {penaltyType === 'shield'
                  ? 'HP Karaktermu sudah 0%! Perisai Tim terkikis -15%!'
                  : `HP Karakter (${heroName}) terpotong -20%!`}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            *Lord Prokrastinasi menyerang regumu saat pertahanan fokusmu melemah.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-rpg font-bold text-sm tracking-wider shadow-lg shadow-red-950/80 border border-amber-300/60 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Swords className="w-4 h-4 text-amber-200" />
            <span>KEMBALI FOKUS KE DUNGEON 🛡️</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
