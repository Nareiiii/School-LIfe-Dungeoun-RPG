import React, { useState } from 'react';
import { HeartHandshake, Sparkles, X, Send, Smile, ThumbsUp, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface MotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMotivation: (message: string) => void;
}

const PRESET_MOTIVATIONS = [
  'Semangat kawan! 10 menit lagi kita libas bab ini!',
  'Fokus kita luar biasa hari ini, terus pertahankan perisai tim!',
  'Jangan menyerah! Nilai ujian bagus sudah menanti kita di depan.',
  'Tarik napas dalam-dalam, mari selesaikan soal ini bersama!',
  'Ingat target guild kita masuk Top 1 Leaderboard Kelas!',
];

export const MotivationModal: React.FC<MotivationModalProps> = ({
  isOpen,
  onClose,
  onSendMotivation,
}) => {
  const [selectedMessage, setSelectedMessage] = useState(PRESET_MOTIVATIONS[0]);
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    const finalMsg = customMessage.trim() || selectedMessage;
    sound.playHeal();
    onSendMotivation(finalMsg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0F172A] border border-teal-500/50 p-5 sm:p-6 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow ambient header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-teal-500/30 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-950 to-emerald-950 border border-teal-300/60 flex items-center justify-center p-1 shadow-lg shadow-teal-950/80 shrink-0">
            <img src="/sprites/healer.svg" alt="Healer" className="w-full h-full object-contain filter drop-shadow select-none animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
              Role Healer: Berkat Moral
            </span>
            <h2 className="text-lg font-bold text-white font-rpg tracking-wide mt-0.5">
              Kirim Motivasi Tim
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Pilih atau ketik kata-kata penyemangat untuk kawan sekelompok. Pengiriman ini akan <strong className="text-teal-300">memulihkan HP Mage ke 100%</strong> dan menambah keutuhan Perisai Tim!
        </p>

        {/* Presets */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-semibold text-slate-300">
            Pilih Pesan Cepat:
          </label>
          {PRESET_MOTIVATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedMessage(preset);
                setCustomMessage('');
              }}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center gap-2 ${
                selectedMessage === preset && !customMessage
                  ? 'bg-teal-950/80 border-teal-400 text-white shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{preset}</span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Atau Ketik Pesan Khusus:
          </label>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Tulis pesan penyemangatmu sendiri..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>

        {/* Recovery perks */}
        <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Pemulihan HP Teman</span>
          </div>
          <div className="text-teal-400 font-bold font-pixel text-[11px]">
            +100% HP & +15% Shield
          </div>
        </div>

        {/* Send Action */}
        <button
          onClick={handleSend}
          className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-teal-950 active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Luncurkan Berkat Semangat</span>
        </button>

      </div>
    </div>
  );
};
