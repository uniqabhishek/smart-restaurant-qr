import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Printer, 
  ExternalLink, 
  Smartphone, 
  Sparkles,
  UtensilsCrossed 
} from 'lucide-react';
import { TableId } from '../../types/restaurant';

interface QRCodeStationProps {
  onOpenTable: (tableId: TableId) => void;
}

export const QRCodeStation: React.FC<QRCodeStationProps> = ({ onOpenTable }) => {
  const [activeTable, setActiveTable] = useState<TableId>(4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getTableUrl = (tId: TableId) => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?table=${tId}`;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const url = getTableUrl(activeTable);

    QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a', // deep slate
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [activeTable]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Table-${activeTable}-RestoFlow-QR.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col">
      {/* Station Header */}
      <div className="max-w-7xl mx-auto w-full mb-6 pb-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              SCAN THE QR <span className="text-orange-500">• QR ON EVERY TABLE</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Step 1/6 • Scan for menu • TABLE 4" • Physical tent display card generator with live scannable QR codes
          </p>
        </div>

        {/* Table Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900 rounded-xl border border-slate-800">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTable(t as TableId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTable === t
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Table {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-8 py-4">
        {/* Physical Table Tent Card Display Mockup (As shown in Reel Step 1/6) */}
        <div className="relative group">
          {/* Subtle 3D Card Shadow & Acrylic Stand Effect */}
          <div className="w-[300px] sm:w-[320px] bg-white text-slate-900 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-4 border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500 absolute top-0 left-0 right-0" />

            {/* Restaurant Brand Icon */}
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2 mt-2">
              <UtensilsCrossed className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-lg tracking-tight text-slate-900">
              RestoFlow
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Dine-In Digital Experience
            </p>

            {/* Live Generated QR Code Canvas */}
            <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-100 my-4 flex items-center justify-center">
              <canvas ref={canvasRef} className="rounded-xl w-[220px] h-[220px]" />
            </div>

            {/* Reel Step 1 text banner: "Scan for menu • TABLE 4" */}
            <div className="w-full py-2.5 px-3 bg-slate-900 text-white rounded-xl mb-3 shadow-md">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Scan for menu
              </div>
              <div className="text-lg font-black tracking-tight mt-0.5">
                TABLE {activeTable}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Point your phone camera to browse the menu, call waiter, and order directly.
            </p>
          </div>

          {/* Wooden / Acrylic Base stand shadow */}
          <div className="w-[280px] h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-full mx-auto mt-2 blur-[1px] opacity-80" />
        </div>

        {/* Station Actions & Explanations */}
        <div className="max-w-md w-full space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Table {activeTable} Tent Card
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Each table has its own unique QR code. When guests scan it with their camera, it immediately connects their phone to Table {activeTable} without needing app downloads or passwords.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onOpenTable(activeTable)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulate Guest Scan (Open Table {activeTable})</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Download High-Res QR Card (.PNG)</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print Table Tent Card</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 break-all">
              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">Target Destination URL:</span>
              {getTableUrl(activeTable)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
