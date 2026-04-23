"use client";
import { useState } from "react";
import QrScanner from "@/components/QrScanner";

const mockData = {
  schoolName: "SMP Negeri 1 Curup",
  nama: "Budi Santoso",
  streak: 100,
  kelas: "7A",
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"absen" | "leaderboard">("absen");
  const [absenStatus, setAbsenStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = async (qrResult: string) => {
    setShowScanner(false);
    setAbsenStatus("loading");

    const res = await fetch("/api/absen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrCode: qrResult }),
    });

    setAbsenStatus(res.ok ? "success" : "error");
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .streak-glow { box-shadow: 0 0 30px rgba(255,160,50,0.25); }
        .card { background: #17171f; border: 1px solid #2a2a35; }
        .pill { background: #1e1e28; border: 1px solid #2a2a35; }
        @keyframes pulse-soft { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .pulse { animation: pulse-soft 2s ease-in-out infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.4s 0.1s ease forwards; opacity:0; }
        .fade-up-3 { animation: fadeUp 0.4s 0.2s ease forwards; opacity:0; }
        .fade-up-4 { animation: fadeUp 0.4s 0.3s ease forwards; opacity:0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .tab-active { background: #7c6dfa; color: white; }
        .tab-inactive { color: #666; }
        @media(min-width:768px){
          .layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; max-width: 900px; margin: 0 auto; }
        }
      `}</style>

      {showScanner && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="p-4 pb-8 max-w-md mx-auto md:max-w-none">
        <div className="layout">
          {/* LEFT PANEL */}
          <div className="space-y-3">
            <div className="fade-up flex items-center justify-between py-2">
              <div>
                <p className="text-[11px] text-[#555] uppercase tracking-widest font-display">
                  Sekolah
                </p>
                <p className="font-display font-700 text-[15px] text-white leading-tight">
                  {mockData.schoolName}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#2a2a35] border border-[#3a3a48] flex items-center justify-center text-lg">
                👤
              </div>
            </div>

            <div className="fade-up-2 card rounded-2xl p-4 streak-glow">
              <div className="flex items-center gap-3">
                <div className="text-3xl pulse">🔥</div>
                <div>
                  <p className="font-display font-800 text-2xl text-[#ffaa33] leading-none">
                    {mockData.streak} Days
                  </p>
                  <p className="text-[12px] text-[#666] mt-0.5">
                    Streak kehadiran
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[11px] text-[#444]">Halo,</p>
                  <p className="font-display text-[13px] font-600 text-[#aaa]">
                    {mockData.nama}
                  </p>
                  <p className="text-[11px] text-[#444]">
                    Kelas {mockData.kelas}
                  </p>
                </div>
              </div>
            </div>

            <div className="fade-up-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowScanner(true)}
                className="card rounded-xl p-3 text-left hover:border-[#7c6dfa] transition-colors"
              >
                <p className="text-lg mb-1">📷</p>
                <p className="font-display text-[13px] font-600 text-white">
                  Absen
                </p>
                <p className="text-[11px] text-[#555]">Scan QR kelas</p>
              </button>
              <button
                onClick={() => (window.location.href = "/izin")}
                className="card rounded-xl p-3 text-left hover:border-[#fa6d8a] transition-colors"
              >
                <p className="text-lg mb-1">🏥</p>
                <p className="font-display text-[13px] font-600 text-white">
                  Izin / Sakit
                </p>
                <p className="text-[11px] text-[#555]">Upload surat</p>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-3 mt-3 md:mt-0">
            <div className="fade-up-3 pill rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setActiveTab("absen")}
                className={`flex-1 rounded-lg py-2 text-[13px] font-display font-600 transition-all ${activeTab === "absen" ? "tab-active" : "tab-inactive"}`}
              >
                Status Absen
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`flex-1 rounded-lg py-2 text-[13px] font-display font-600 transition-all ${activeTab === "leaderboard" ? "tab-active" : "tab-inactive"}`}
              >
                Leaderboard
              </button>
            </div>

            {activeTab === "absen" && (
              <div className="fade-up-4 card rounded-2xl p-5 flex flex-col items-center gap-4 min-h-48">
                {absenStatus === "idle" && (
                  <>
                    <p className="text-[12px] text-[#555] uppercase tracking-widest font-display">
                      Belum absen hari ini
                    </p>
                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-full bg-[#7c6dfa] hover:bg-[#6a5de8] transition-colors rounded-xl py-3 font-display font-600 text-[14px]"
                    >
                      Scan QR Sekarang
                    </button>
                    <p className="text-[11px] text-[#444] text-center">
                      Pastikan kamu berada di area sekolah
                    </p>
                  </>
                )}
                {absenStatus === "loading" && (
                  <>
                    <div className="text-2xl spin">⏳</div>
                    <p className="text-[13px] text-[#666]">Memverifikasi...</p>
                  </>
                )}
                {absenStatus === "success" && (
                  <>
                    <div className="text-4xl">✅</div>
                    <p className="font-display font-700 text-[16px] text-white">
                      Absen Berhasil!
                    </p>
                    <p className="text-[12px] text-[#555]">
                      Streak kamu bertambah 🔥
                    </p>
                  </>
                )}
                {absenStatus === "error" && (
                  <>
                    <div className="text-4xl">❌</div>
                    <p className="font-display font-700 text-[16px] text-white">
                      Gagal Absen
                    </p>
                    <p className="text-[12px] text-[#555]">
                      QR tidak valid atau sudah kadaluarsa
                    </p>
                    <button
                      onClick={() => setAbsenStatus("idle")}
                      className="text-[12px] text-[#7c6dfa] underline"
                    >
                      Coba lagi
                    </button>
                  </>
                )}
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div className="fade-up-4 card rounded-2xl p-4 space-y-2">
                <p className="text-[12px] text-[#555] uppercase tracking-widest font-display mb-3">
                  Top Streak
                </p>
                {[
                  { rank: 1, nama: "Siti Rahayu", streak: 142, kelas: "8A" },
                  { rank: 2, nama: "Budi Santoso", streak: 100, kelas: "7A" },
                  { rank: 3, nama: "Ahmad Fauzi", streak: 87, kelas: "7B" },
                  { rank: 4, nama: "Dewi Lestari", streak: 73, kelas: "8B" },
                  { rank: 5, nama: "Rizky P.", streak: 61, kelas: "8A" },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className={`flex items-center gap-3 p-2.5 rounded-xl ${item.nama === mockData.nama ? "bg-[#7c6dfa20] border border-[#7c6dfa40]" : "bg-[#1e1e28]"}`}
                  >
                    <span
                      className="font-display font-800 text-[13px] w-5 text-center"
                      style={{
                        color:
                          item.rank === 1
                            ? "#ffaa33"
                            : item.rank === 2
                              ? "#aaa"
                              : item.rank === 3
                                ? "#cd7f32"
                                : "#444",
                      }}
                    >
                      {item.rank}
                    </span>
                    <div className="flex-1">
                      <p className="text-[13px] font-500 text-white">
                        {item.nama}
                      </p>
                      <p className="text-[11px] text-[#444]">{item.kelas}</p>
                    </div>
                    <span className="text-[12px] text-[#ffaa33] font-display font-700">
                      🔥 {item.streak}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="fade-up-4 rounded-xl border border-dashed border-[#2a2a35] p-3 text-center">
              <p className="text-[11px] text-[#333] uppercase tracking-widest font-display">
                Ads — versi gratis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
