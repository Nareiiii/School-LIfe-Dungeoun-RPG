import React, { useState } from 'react';
import { BookOpen, Sparkles, X, Sword, Brain, Star, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface MetacognitiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subject: string;
    topic: string;
    summary: string;
    comprehensionRating: number;
  }) => void;
  expMultiplier: number;
}

const SAMPLE_SUBJECTS = [
  'Matematika & Kalkulus',
  'Fisika & Mekanika',
  'Biologi & Genetika',
  'Kimia Organik',
  'Informatika & Pemrograman',
  'Sejarah Indonesia & Dunia',
  'Bahasa Inggris & Literasi',
  'Ekonomi & Akuntansi',
];

const PROMPT_STARTERS = [
  'Inti utama dari materi ini adalah...',
  'Rumus / aturan penting yang harus kuingat yaitu...',
  'Langkah kunci untuk memecahkan soal tipe ini adalah...',
  'Hubungan sebab-akibat yang kutemukan adalah...',
];

export const MetacognitiveModal: React.FC<MetacognitiveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  expMultiplier,
}) => {
  const [subject, setSubject] = useState(SAMPLE_SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [comprehensionRating, setComprehensionRating] = useState(4);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Approximate sentence counter
  const sentenceCount = summary.trim() ? summary.split(/[.!?]+/).filter(Boolean).length : 0;
  const baseDamage = 800 + (summary.length > 25 ? 400 : 0) + (comprehensionRating * 100);
  const calculatedDamage = Math.round(baseDamage * expMultiplier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || summary.trim().length < 10) {
      setErrorMsg('Tuliskan rangkuman minimal 1 kalimat bermakna (minimal 10 huruf)!');
      return;
    }
    setErrorMsg('');
    sound.playCrit();
    onSubmit({
      subject,
      topic: topic.trim() || 'Fokus Sesi Ini',
      summary: summary.trim(),
      comprehensionRating,
    });
  };

  const handleStarterClick = (starter: string) => {
    sound.playClick();
    if (!summary) {
      setSummary(starter + ' ');
    } else {
      setSummary((prev) => `${prev.trim()} ${starter} `);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-purple-500/50 p-5 sm:p-6 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow ambient header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-purple-500/30 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-950 to-indigo-950 border border-purple-400/60 flex items-center justify-center p-1 shadow-lg shadow-purple-950/80 shrink-0">
            <img src="/sprites/mage.svg" alt="Mage" className="w-full h-full object-contain filter drop-shadow select-none animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                Fitur Menit ke-25
              </span>
              <span className="text-xs text-amber-300 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Mantra Sintesis
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-rpg tracking-wide mt-0.5">
              Metacognitive Checkpoint
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          Refleksikan apa yang baru saja kelompokmu pelajari. Rangkuman ini akan diubah menjadi <strong className="text-purple-300">serangan sihir penghancur</strong> ke Boss Distraksi!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Subject & Topic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mata Pelajaran
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                {SAMPLE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Topik / Bab Materi
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="misal: Turunan Trigonometri"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Rangkuman 1-2 Kalimat */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Input Rangkuman Materi Belajar (1-2 Kalimat)
              </label>
              <span className={`text-[11px] font-semibold ${sentenceCount >= 1 ? 'text-teal-400' : 'text-slate-400'}`}>
                {sentenceCount} Kalimat terdeteksi
              </span>
            </div>

            {/* Quick Starters / Idea Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PROMPT_STARTERS.map((starter, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleStarterClick(starter)}
                  className="text-[10px] bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/50 text-slate-300 rounded-lg px-2 py-1 transition cursor-pointer"
                >
                  + {starter.substring(0, 24)}...
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tuliskan 1-2 kalimat ringkas intisari konsep yang baru saja dipelajari bersama kelompok..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none leading-relaxed"
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errorMsg}</p>
            )}
          </div>

          {/* Self-Assessment: Tingkat Pemahaman */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tingkat Penguasaan Materi oleh Kelompok:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 1, label: 'Masih Ragu' },
                { val: 2, label: 'Cukup Paham' },
                { val: 3, label: 'Paham Mantap' },
                { val: 4, label: 'Siap Ajari Teman' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setComprehensionRating(item.val);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    comprehensionRating === item.val
                      ? 'bg-purple-950/90 border-purple-400 text-white shadow-md shadow-purple-950'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-center mb-0.5">
                    <Star
                      className={`w-3.5 h-3.5 ${
                        comprehensionRating >= item.val
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] font-bold leading-tight">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Combat Attack Preview Box */}
          <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-950 p-3 rounded-xl border border-purple-500/40 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">
                Kekuatan Serangan Mantra:
              </div>
              <div className="font-pixel text-sm sm:text-base font-bold text-amber-300">
                {calculatedDamage.toLocaleString()} DMG
                <span className="text-[10px] font-sans text-slate-400 font-normal ml-1">
                  (Termasuk Ranger {expMultiplier.toFixed(1)}x Buff)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-teal-400 flex items-center gap-1 font-semibold justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Catatan Tersimpan
              </span>
              <span className="text-[10px] text-slate-400">Jurnal Kelas</span>
            </div>
          </div>

          {/* Action Button: SERANG BOSS */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-purple-600 text-white font-bold text-sm border border-red-400/50 hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-red-950/80 cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sword className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="tracking-wide uppercase font-rpg font-bold">
              Serang Boss! (Luncurkan Mantra Pemahaman)
            </span>
          </button>
        </form>

      </div>
    </div>
  );
};
