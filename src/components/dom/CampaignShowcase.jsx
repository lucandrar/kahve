import React from 'react'
import { Play, X, ArrowUpRight } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function CampaignShowcase() {
  const { isReelOpen, setReelOpen, setCursor } = useStore()

  return (
    <section id="campaign" className="relative w-full py-36 md:py-48 px-6 md:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Solid Fill */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 pb-8 border-b border-[#2C1D18]/15 bg-[#EFECE6]/90 p-8 rounded-2xl">
          <div>
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006241]" />
              <span>BÖLÜM 05 // SİNEMATİK ARŞİV</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#2C1D18]">
              Volkanik Hasat Belgeseli
            </h2>
          </div>
          <p className="max-w-md text-base text-[#2C1D18]/85 font-normal leading-relaxed">
            Antigua yanardağ eteklerinde şafak vakti başlayan hasat ve 
            18 saatlik sub-zero damıtma sürecinin görsel kaydı.
          </p>
        </div>

        {/* Editorial Minimalist Cinema Frame */}
        <div
          className="relative w-full aspect-[16/9] md:aspect-[21/9] border border-[#2C1D18]/20 bg-[#1E1410] overflow-hidden cursor-pointer group shadow-xl rounded-2xl"
          onClick={() => setReelOpen(true)}
          onMouseEnter={() => setCursor('hover')}
          onMouseLeave={() => setCursor('default')}
        >
          {/* Subtle natural film grain & monochrome vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60" />

          {/* Micro Telemetry */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-6 text-xs font-mono font-medium text-[#F4F0EB]/90 tracking-[0.2em] uppercase">
            <span>4K 60FPS BELGESEL</span>
            <span>ANTIGUA 1,950M</span>
          </div>

          <div className="absolute top-6 right-6 md:top-8 md:right-8 text-xs font-mono font-medium text-[#F4F0EB]/90 tracking-[0.2em] uppercase flex items-center gap-1.5">
            <span>ARŞİV FİLMİ 01:45</span>
            <ArrowUpRight size={14} className="text-[#C89D7C]" />
          </div>

          {/* Center Restrained Play Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full border border-[#F4F0EB]/30 bg-[#F4F0EB]/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#C89D7C]">
              <Play size={22} className="text-[#F4F0EB] fill-[#F4F0EB] translate-x-0.5" />
            </div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#F4F0EB] font-semibold">
              Koleksiyon Filmini Oynat
            </span>
          </div>
        </div>
      </div>

      {/* Showreel Modal */}
      {isReelOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-16">
          <button
            onClick={() => setReelOpen(false)}
            className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-full max-w-4xl aspect-video border border-white/20 bg-[#140D0A] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-2xl">
            <div className="text-xs font-mono text-[#C89D7C] tracking-[0.25em] font-medium uppercase mb-4">
              ARŞİV KAYDI // VOLKANİK HASAT SEFERİ
            </div>
            <h3 className="font-display text-3xl md:text-5xl text-white font-bold tracking-tight mb-4">
              AETHER ESPRESSO: Sub-Zero Sublimation
            </h3>
            <p className="text-sm md:text-base font-mono text-white/80 tracking-[0.1em] max-w-md mx-auto leading-relaxed">
              Taze hasat edilen çekirdeklerin uçucu yağlarını yerinde koruma altına alan taşınabilir azot ekstraksiyon süreci.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
