"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScanSuccess, onClose }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    let isRunning = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (result) => {
          isRunning = false;
          scanner
            .stop()
            .then(() => onScanSuccess(result))
            .catch(() => onScanSuccess(result));
        },
        () => {},
      )
      .then(() => {
        isRunning = true;
      })
      .catch(() => {
        setError("Kamera tidak bisa diakses. Cek izin kamera browser kamu.");
      });

    return () => {
      if (isRunning) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center gap-4 p-4">
      <p className="font-display text-white text-[14px] uppercase tracking-widest">
        Scan QR Kelas
      </p>

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ width: 280, height: 280 }}
      >
        <div id="qr-reader" style={{ width: 280, height: 280 }} />
        {/* scan line animasi */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-[#7c6dfa] opacity-80 scan-line"
          style={{ top: 0 }}
        />
        {/* corner borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#7c6dfa] rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#7c6dfa] rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#7c6dfa] rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#7c6dfa] rounded-br-lg" />
      </div>

      {error && (
        <p className="text-[#fa6d8a] text-[12px] text-center">{error}</p>
      )}

      <button
        onClick={onClose}
        className="mt-2 px-6 py-2.5 rounded-xl border border-[#2a2a35] text-[#666] text-[13px] font-display hover:border-[#fa6d8a] hover:text-[#fa6d8a] transition-colors"
      >
        Tutup
      </button>
    </div>
  );
}
