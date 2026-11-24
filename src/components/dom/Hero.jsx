import React from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useStore } from '../../store/useStore'

/**
 * Custom Ultra-Thin 1.2px Hairline SVG Icons
 */
function BeanIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-35 12 12)" />
      <path d="M7.5 7.5c2 2 3.5 5 2.5 8s3 1.5 5 1.5" />
    </svg>
  )
}

function ExtractionIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h16M7 10v4a5 5 0 0 0 10 0v-4M9 3h6M12 3v3M12 18v3" />
      <circle cx="12" cy="19.5" r="1.5" />
    </svg>
  )
}

function CremaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 1 6 6c0 4-6 12-6 12S6 13 6 9a6 6 0 0 1 6-6z" />
      <path d="M12 7a2 2 0 0 1 2 2" />
    </svg>
  )
}

export default function Hero() {
  const { activeFlavorIndex, flavors, setCursor, setOrderOpen } = useStore()
  const activeFlavor = flavors[activeFlavorIndex]

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden pt-24 pb-8 px-6 md:px-12">
      {/* ------------------------------------------------------------------ */}
      {/* ATMOSPHERIC BACKGROUND ILLUMINATION & WARM CAUSTIC LIGHT RAYS      */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Warm amber & espresso radial vignette glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[160px] opacity-25"
          style={{ background: 'radial-gradient(circle, #D49B55 0%, #C89D7C 40%, rgba(244, 240, 235, 0) 75%)' }}
        />
        {/* Subtle diagonal ambient light beam */}
        <div
          className="absolute -top-32 -left-32 w-[60vw] h-[120vh] rotate-[28deg] blur-[120px] opacity-15"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(200, 157, 124, 0.4) 50%, rgba(244, 240, 235, 0) 100%)' }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. LAYER BEHIND 3D ESPRESSO CUP (z-0): Renders "ESPR"              */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <div className="flex flex-col items-center text-center -translate-y-2 md:-translate-y-6">
          {/* Upper Visible Word */}
          <span className="font-display font-extrabold text-[clamp(4.5rem,14.5vw,13.5rem)] leading-[0.88] tracking-tighter text-[#2C1D18]">
            ESPR
          </span>
          {/* Lower Ghost Spacer */}
          <span className="font-display font-extrabold text-[clamp(4.5rem,14.5vw,13.5rem)] leading-[0.88] tracking-tighter opacity-0 select-none pointer-events-none" aria-hidden="true">
            ESSO
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. TOP ARCHITECTURAL PRINT FRAMING (In front, z-20)                */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col gap-4 pointer-events-auto">
        <div className="w-full flex items-center justify-between py-3 border-b border-[#2C1D18]/15 text-[11px] font-mono tracking-[0.25em] uppercase text-[#2C1D18]/70">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89D7C]" />
            <span>KAHVENİN EN SAF, EN GÜÇLÜ HALİ</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[#2C1D18]/60">
            <span>EDİSYON NO. {activeFlavor.number}</span>
            <span>·</span>
            <span>{activeFlavor.origin}</span>
            <span>·</span>
            <span>KAHVE SANATININ EN SAF HALİ</span>
          </div>
        </div>
      </div>

      {/* (The 3D Ceramic Espresso Cup, Crema, and Zero-G Beans render at z-10) */}

      {/* ------------------------------------------------------------------ */}
      {/* 3. LAYER IN FRONT OF 3D CUP (z-20): Renders "ESSO" Overlapping     */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20">
        <div className="flex flex-col items-center text-center -translate-y-2 md:-translate-y-6">
          {/* Upper Ghost Spacer */}
          <span className="font-display font-extrabold text-[clamp(4.5rem,14.5vw,13.5rem)] leading-[0.88] tracking-tighter opacity-0 select-none pointer-events-none" aria-hidden="true">
            ESPR
          </span>
          {/* Lower Visible Word in Deep Espresso Overlapping the Saucer/Cup */}
          <span className="font-display font-extrabold text-[clamp(4.5rem,14.5vw,13.5rem)] leading-[0.88] tracking-tighter text-[#2C1D18] drop-shadow-sm">
            ESSO
          </span>
          {/* Micro-Brand Tagline */}
          <p className="font-mono text-xs md:text-sm tracking-[0.35em] uppercase text-[#2C1D18]/70 mt-2">
            AETHER CRAFT ESPRESSO // ARTISANAL ARCHIVE
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. BOTTOM ARCHITECTURAL SPEC STRIP (In front, z-20)                */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-20 w-full max-w-7xl mx-auto pt-6 border-t border-[#2C1D18]/15 pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Spec 1: Taze Çekirdekler */}
          <div className="flex items-start gap-4 py-4 md:py-2 md:pr-6 md:border-r border-[#2C1D18]/15">
            <div className="p-2.5 rounded-lg border border-[#2C1D18]/15 bg-[#EFECE6]/70 text-[#2C1D18]">
              <BeanIcon className="w-6 h-6 text-[#C89D7C]" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[#2C1D18]">
                TAZE ÇEKİRDEKLER
              </div>
              <div className="text-sm text-[#2C1D18]/70 mt-0.5">
                {activeFlavor.stats.beans} · {activeFlavor.stats.altitude}
              </div>
            </div>
          </div>

          {/* Spec 2: Özenle Çekildi */}
          <div className="flex items-start gap-4 py-4 md:py-2 md:px-6 md:border-r border-[#2C1D18]/15">
            <div className="p-2.5 rounded-lg border border-[#2C1D18]/15 bg-[#EFECE6]/70 text-[#2C1D18]">
              <ExtractionIcon className="w-6 h-6 text-[#C89D7C]" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[#2C1D18]">
                ÖZENLE ÇEKİLDİ
              </div>
              <div className="text-sm text-[#2C1D18]/70 mt-0.5">
                {activeFlavor.stats.extraction} Yavaş Sub-Zero Damıtma
              </div>
            </div>
          </div>

          {/* Spec 3: Yoğun Lezzet & Interactive CTA */}
          <div className="flex items-center justify-between py-4 md:py-2 md:pl-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg border border-[#2C1D18]/15 bg-[#EFECE6]/70 text-[#2C1D18]">
                <CremaIcon className="w-6 h-6 text-[#C89D7C]" />
              </div>
              <div>
                <div className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-[#2C1D18]">
                  YOĞUN LEZZET
                </div>
                <div className="text-sm text-[#2C1D18]/70 mt-0.5">
                  {activeFlavor.stats.temp} Cryo Koruma · Zengin Krema
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#flavors"
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2C1D18]/30 hover:border-[#2C1D18] hover:bg-[#2C1D18]/5 text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all duration-300"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
              >
                <span>KEŞFET</span>
                <ArrowDown size={13} />
              </a>

              <a
                href="#siparis"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-sm cursor-pointer"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
              >
                <span>Sipariş Et</span>
                <ArrowUpRight size={13} className="text-[#C89D7C]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
