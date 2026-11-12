import React, { useState } from 'react';
import { Download, Smartphone, X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, show small badge or hide
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        <span>PWA Aktif</span>
      </div>
    );
  }

  // Chromium / Android flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-sm shadow-teal-900/50 cursor-pointer active:scale-95"
        title="Pasang aplikasi School-Life RPG di smartphone/laptop"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          title="Panduan pasang di iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0F172A] border border-teal-500/40 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal-400" />
                  Install di iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Agar pengalaman Co-op Study Dungeon terasa seperti gim aplikasi bawaan:
              </p>
              <ol className="text-xs text-slate-300 space-y-2.5 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">1</span>
                  <span>Ketuk tombol <strong>Share</strong> (ikon kotak dengan panah ke atas) di bilah navigasi Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">2</span>
                  <span>Gulir ke bawah dan pilih <strong>"Add to Home Screen" (Tambahkan ke Layar Utama)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">3</span>
                  <span>Buka Study RPG langsung dari ikon di layar depan HP Anda!</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-950 transition"
              >
                Dimengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
