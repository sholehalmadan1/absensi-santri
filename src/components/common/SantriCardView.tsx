import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Santri, PesantrenInfo } from '../../types';
import { Download, Printer, RotateCw, Check, Sparkles, Building2, ShieldCheck } from 'lucide-react';

interface SantriCardViewProps {
  santri: Santri;
  pesantren: PesantrenInfo;
  colorScheme?: 'emerald' | 'navy' | 'maroon';
  showControls?: boolean;
}

export const SantriCardView: React.FC<SantriCardViewProps> = ({
  santri,
  pesantren,
  colorScheme = 'emerald',
  showControls = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate payload for QR Code
  const qrPayload = JSON.stringify({
    nis: santri.nis,
    id: santri.id,
    nama: santri.nama,
    pesantren: pesantren.namaPondok,
    type: 'KARTU_SANTRI_DIGITAL',
  });

  const getThemeClasses = () => {
    switch (colorScheme) {
      case 'navy':
        return {
          gradient: 'from-slate-900 via-indigo-950 to-blue-900',
          accent: 'border-blue-400/40 text-blue-300',
          badge: 'bg-blue-600/30 text-blue-200 border-blue-400/30',
          headerBg: 'bg-indigo-950/80',
          glow: 'shadow-blue-500/10',
        };
      case 'maroon':
        return {
          gradient: 'from-stone-950 via-rose-950 to-amber-950',
          accent: 'border-amber-400/40 text-amber-300',
          badge: 'bg-rose-600/30 text-rose-200 border-amber-400/30',
          headerBg: 'bg-rose-950/80',
          glow: 'shadow-rose-500/10',
        };
      case 'emerald':
      default:
        return {
          gradient: 'from-emerald-950 via-teal-950 to-slate-950',
          accent: 'border-emerald-400/40 text-emerald-300',
          badge: 'bg-emerald-600/30 text-emerald-200 border-emerald-400/30',
          headerBg: 'bg-emerald-950/80',
          glow: 'shadow-emerald-500/10',
        };
    }
  };

  const theme = getThemeClasses();

  const handleCopyQR = () => {
    navigator.clipboard.writeText(santri.nis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div
        className="w-full max-w-[370px] h-[230px] sm:h-[240px] perspective cursor-pointer transition-all duration-300 select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${theme.gradient} text-white p-4 shadow-xl border border-white/20 backface-hidden overflow-hidden flex flex-col justify-between`}
          >
            {/* Islamic geometric background watermark */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full border-8 border-white/5 pointer-events-none rotate-45"></div>
            <div className="absolute right-12 bottom-6 w-28 h-28 rounded-full border-2 border-white/5 pointer-events-none"></div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-sm shadow">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wide uppercase leading-tight line-clamp-1">
                    {pesantren.namaPondok}
                  </h4>
                  <p className="text-[10px] text-slate-300 tracking-wider font-mono">
                    KARTU TANDA SANTRI (KTS)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-white/10 text-emerald-300 border border-emerald-400/30">
                  {pesantren.tahunAjaran}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex items-center gap-3 my-auto pt-1">
              {/* Photo with Frame */}
              <div className="relative shrink-0">
                <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-md bg-slate-800">
                  <img
                    src={santri.fotoUrl}
                    alt={santri.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded shadow">
                  {santri.gender === 'L' ? 'SANTRIWAN' : 'SANTRIWATI'}
                </div>
              </div>

              {/* Santri Data */}
              <div className="flex-1 min-w-0 pr-1">
                <h3 className="font-bold text-sm leading-tight text-white line-clamp-1">
                  {santri.nama}
                </h3>
                <div className="mt-1 space-y-0.5 text-[11px]">
                  <p className="text-emerald-300 font-mono font-semibold tracking-wider flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">NIS:</span>
                    <span>{santri.nis}</span>
                  </p>
                  <p className="text-slate-300 truncate">
                    <span className="text-slate-400">Kamar:</span> {santri.kamar}
                  </p>
                  <p className="text-slate-300 truncate">
                    <span className="text-slate-400">Formal:</span> {santri.kelasFormal}
                  </p>
                  <p className="text-slate-300 truncate">
                    <span className="text-slate-400">Diniyah:</span> {santri.kelasDiniyah}
                  </p>
                </div>
              </div>

              {/* Scannable High-Contrast QR Code */}
              <div className="shrink-0 flex flex-col items-center bg-white p-1.5 rounded-xl shadow-lg border border-slate-200">
                <QRCodeSVG
                  value={santri.nis}
                  size={64}
                  level="M"
                  includeMargin={false}
                />
                <span className="text-[8px] font-mono font-bold text-slate-800 mt-0.5">
                  SCAN PRESENSI
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-slate-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Resmi Pesantren Al-Hikmah
              </span>
              <span className="text-amber-300 font-mono">Klik kartu utk balik ↷</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-4 shadow-xl border border-white/20 backface-hidden rotate-y-180 overflow-hidden flex flex-col justify-between`}
          >
            {/* Back Header */}
            <div className="border-b border-white/15 pb-1 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                TATA TERTIB & KETENTUAN KARTU SANTRI
              </p>
            </div>

            {/* Rules */}
            <div className="text-[9px] text-slate-300 space-y-1 my-auto pr-1">
              <p>1. Kartu ini adalah identitas resmi santri selama menempuh tholabul 'ilmi.</p>
              <p>2. Wajib dibawa saat presensi sholat fardhu, ngaji kitab, tahfidz, & sekolah.</p>
              <p>3. Dilarang memindahtangankan kartu kepada santri lain.</p>
              <p>4. Apabila hilang / rusak, segera lapor ke Bagian Keamanan / Pengasuhan.</p>
            </div>

            {/* Signature & Digital Stamp */}
            <div className="flex items-end justify-between pt-1 border-t border-white/10">
              <div className="text-[8px] text-slate-400">
                <p>Darul Hikmah, {pesantren.tahunAjaran}</p>
                <p className="text-[9px] font-mono text-emerald-400">NIS: {santri.nis}</p>
              </div>

              <div className="text-center relative">
                {/* Stamp visual */}
                <div className="absolute -top-3 -left-4 w-12 h-12 rounded-full border border-emerald-400/50 flex items-center justify-center pointer-events-none rotate-12 opacity-80">
                  <span className="text-[7px] text-emerald-300 font-bold uppercase text-center leading-none">
                    TERVERIFIKASI
                    <br />
                    PESANTREN
                  </span>
                </div>
                <div className="text-[9px] font-semibold text-slate-200">Pengasuh Pesantren,</div>
                <div className="h-4"></div>
                <div className="text-[9px] font-bold text-emerald-300 underline decoration-emerald-500">
                  {pesantren.pengasuh}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      {showControls && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            title="Balik Kartu"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Balik Kartu</span>
          </button>
          <button
            onClick={handleCopyQR}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            title="Salin NIS / Barcode"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Salin NIS ({santri.nis})</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 shadow transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      )}
    </div>
  );
};
