import React, { useState } from 'react';
import { BookOpen, X, Star, Calendar, User, Search, CheckCircle } from 'lucide-react';
import { MetacognitiveEntry } from '../types/game';

interface StudyJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: MetacognitiveEntry[];
}

export const StudyJournalModal: React.FC<StudyJournalModalProps> = ({
  isOpen,
  onClose,
  entries,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchWord, setSearchWord] = useState('');

  if (!isOpen) return null;

  const subjects = Array.from(new Set(entries.map((e) => e.subject)));

  const filtered = entries.filter((e) => {
    const matchSub = filterSubject === 'all' || e.subject === filterSubject;
    const matchText =
      e.summary.toLowerCase().includes(searchWord.toLowerCase()) ||
      e.topic.toLowerCase().includes(searchWord.toLowerCase()) ||
      e.studentName.toLowerCase().includes(searchWord.toLowerCase());
    return matchSub && matchText;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F172A] border border-purple-500/40 p-5 sm:p-6 shadow-2xl text-slate-100 my-auto max-h-[85vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-400/50 flex items-center justify-center text-purple-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-rpg tracking-wide">
              Jurnal Catatan Metakognitif (Study Vault)
            </h2>
            <p className="text-xs text-slate-400">
              Arsip seluruh rangkuman materi belajar yang telah diubah menjadi serangan ke Boss Distraksi.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Cari kata kunci rangkuman / materi..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Entries list */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
              Belum ada catatan metakognitif yang cocok. Lakukan checkpoint di tombol Mage untuk membuat rangkuman baru!
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 hover:border-purple-500/40 transition space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30 text-[10px]">
                      {item.subject}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {item.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.comprehensionRating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 italic">
                  "{item.summary}"
                </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <img
                          src={
                            item.role.toLowerCase().includes('knight')
                              ? '/sprites/knight.svg'
                              : item.role.toLowerCase().includes('healer')
                              ? '/sprites/healer.svg'
                              : item.role.toLowerCase().includes('ranger')
                              ? '/sprites/ranger.svg'
                              : '/sprites/mage.svg'
                          }
                          alt={item.role}
                          className="w-4 h-4 object-contain"
                        />
                        {item.studentName} ({item.role})
                      </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {item.timestamp}
                    </span>
                  </div>
                  <span className="font-pixel font-bold text-amber-400">
                    -{item.damageDealt} DMG
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 shrink-0">
          <span>Menampilkan {filtered.length} dari {entries.length} catatan</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup Jurnal
          </button>
        </div>

      </div>
    </div>
  );
};
