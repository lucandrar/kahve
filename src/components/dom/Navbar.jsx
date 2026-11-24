import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isMuted, toggleMute, setCursor, setOrderOpen } = useStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-[#EFECE6] border-b border-[#2C1D18]/10 shadow-sm transition-all duration-300 ${
        scrolled ? 'py-4' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Minimalist Monogram Brandmark */}
        <a
          href="#"
          className="flex items-center gap-3.5 group pointer-events-auto"
          onMouseEnter={() => setCursor('hover')}
          onMouseLeave={() => setCursor('default')}
        >
          <div className="w-8 h-8 rounded-full border border-[#2C1D18] flex items-center justify-center text-xs font-display font-bold text-[#2C1D18] transition-colors group-hover:bg-[#2C1D18] group-hover:text-[#F4F0EB]">
            Æ
          </div>
          <div className="flex flex-col">
            <span className="font-display tracking-[0.25em] text-sm font-extrabold text-[#2C1D18]">
              AETHER
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#8C674B] font-semibold -mt-0.5">
              ESPRESSO ARTISANAL
            </span>
          </div>
        </a>

        {/* Center Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-10 pointer-events-auto">
          {[
            { label: 'Seçki', href: '#flavors' },
            { label: 'Anatomi', href: '#story' },
            { label: 'Standartlar', href: '#craft' },
            { label: 'Belgesel', href: '#campaign' }
          ].map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-mono tracking-[0.2em] font-medium uppercase text-[#2C1D18]/70 hover:text-[#2C1D18] transition-colors duration-200"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
            >
              <span className="text-[#8C674B] mr-1.5 font-normal">0{idx + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Restrained Utility CTAs */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Audio toggle */}
          <button
            onClick={toggleMute}
            className="w-9 h-9 rounded-full border border-[#2C1D18]/25 flex items-center justify-center text-[#2C1D18]/70 hover:text-[#2C1D18] hover:border-[#2C1D18] transition-colors bg-[#EFECE6]/50"
            title={isMuted ? 'Ortam Sesini Aç' : 'Ortam Sesini Kapat'}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#C89D7C]" />}
          </button>

          {/* Order Express Route Link */}
          <a
            href="#siparis"
            className="px-5 py-2.5 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1E1410] text-xs font-mono tracking-[0.2em] font-semibold uppercase transition-all flex items-center gap-1.5 shadow-sm pointer-events-auto cursor-pointer"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            <span>Sipariş Et</span>
            <ArrowUpRight size={13} className="text-[#C89D7C]" />
          </a>
        </div>
      </div>
    </header>
  )
}
