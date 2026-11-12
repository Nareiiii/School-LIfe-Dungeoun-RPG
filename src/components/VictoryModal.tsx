import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RefreshCw, Star, Flame, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  bossName: string;
  onNextBoss: () => void;
  expEarned: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  bossName,
  onNextBoss,
  expEarned,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0D9488', '#F59E0B', '#8B5CF6', '#38BDF8'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#1B365D] via-[#0F1E38] to-[#091122] border-2 border-amber-400 p-6 text-center text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.4)]">
        
        {/* Animated Trophy Icon & Victorious Hero Party Lineup */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl shadow-amber-950 mb-3">
          <Trophy className="w-8 h-8 text-slate-950 fill-current animate-bounce" />
        </div>

        {/* Victorious Hero Squad Sprites */}
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <img src="/sprites/knight.svg" alt="Knight" className="w-11 h-11 object-contain filter drop-shadow animate-bounce" />
          <img src="/sprites/mage.svg" alt="Mage" className="w-11 h-11 object-contain filter drop-shadow animate-bounce [animation-delay:150ms]" />
          <img src="/sprites/healer.svg" alt="Healer" className="w-11 h-11 object-contain filter drop-shadow animate-bounce [animation-delay:300ms]" />
          <img src="/sprites/ranger.svg" alt="Ranger" className="w-11 h-11 object-contain filter drop-shadow animate-bounce [animation-delay:450ms]" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          🎉 DUNGEON CLEARED!
        </div>

        <h2 className="text-2xl font-black text-white font-rpg tracking-wide mb-1">
          Boss Distraksi Tumbang!
        </h2>
        <p className="text-xs text-slate-300 mb-5 max-w-xs mx-auto">
          Kelompokmu berhasil menaklukkan <strong className="text-amber-300 font-semibold">{bossName}</strong> berkat disiplin fokus dan perisai yang kokoh!
        </p>

        {/* Loot / Rewards Box */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-amber-500/30 mb-6 space-y-2 text-left">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Hadiah Kemenangan Co-op:
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              Bonus EXP Kelas
            </span>
            <span className="font-pixel text-amber-400 font-bold">+{expEarned} XP</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Pemulihan Perisai Penuh
            </span>
            <span className="font-pixel text-teal-300 font-bold">100% SP</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Guild Rank Multiplier
            </span>
            <span className="font-pixel text-purple-300 font-bold">+1 Streak</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNextBoss();
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-950/80 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Lanjut ke Tantangan / Boss Berikutnya</span>
        </button>

      </div>
    </div>
  );
};
