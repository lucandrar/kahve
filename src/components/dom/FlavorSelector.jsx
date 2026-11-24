import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function FlavorSelector() {
  const { activeFlavorIndex, setActiveFlavorIndex, flavors, setCursor, setOrderOpen, setSelectedCoffeeId } = useStore()
  const activeFlavor = flavors[activeFlavorIndex]

  return (
    <section id="flavors" className="relative w-full py-36 md:py-48 px-6 md:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Architectural Print Header with Solid Opaque Fill */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 pb-8 border-b border-[#2C1D18]/15 bg-[#EFECE6]/90 p-8 rounded-2xl">
          <div>
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006241]" />
              <span>ARŞİV // HASAT KOLEKSİYONU</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#2C1D18]">
              Tek Kökenli Seçki
            </h2>
          </div>
          <p className="max-w-md text-base text-[#2C1D18]/85 font-normal leading-relaxed">
            Volkanik yüksek yaylalardan elle toplanan nadir varyeteler. 
            Sub-zero yavaş damıtma ile çekirdeğin en saf aromatik profili hapsedildi.
          </p>
        </div>

        {/* Asymmetric Swiss-Grid Edition Selector with Solid Opaque Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#2C1D18]/15 mb-20 rounded-2xl overflow-hidden shadow-sm">
          {flavors.map((flavor, idx) => {
            const isActive = activeFlavorIndex === idx
            return (
              <button
                key={flavor.id}
                onClick={() => setActiveFlavorIndex(idx)}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
                className={`p-8 md:p-10 text-left transition-all duration-300 relative ${
                  idx < 2 ? 'md:border-r border-[#2C1D18]/15' : ''
                } ${
                  isActive
                    ? 'bg-[#EFECE6] text-[#2C1D18]'
                    : 'bg-[#F4F0EB] text-[#2C1D18]/70 hover:bg-[#EFECE6]'
                }`}
              >
                {/* Active Indicator Top Accent Bar */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ backgroundColor: flavor.accentColor }}
                  />
                )}

                <div className="flex items-center justify-between text-xs font-mono tracking-[0.2em] font-semibold uppercase text-[#2C1D18]/60 mb-6">
                  <span>EDİSYON NO. {flavor.number}</span>
                  <span className="text-[#8C674B]">{flavor.stats.altitude}</span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#2C1D18] mb-2 tracking-tight">
                  {flavor.name}
                </h3>

                <p className="text-sm font-mono tracking-wider text-[#8C674B] uppercase mb-6 font-semibold">
                  {flavor.origin}
                </p>

                <p className="text-sm text-[#2C1D18]/80 leading-relaxed font-normal mb-8">
                  {flavor.subtitle}
                </p>

                {/* Tactile Cupping Notes */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-[#2C1D18]/10">
                  {flavor.notes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-md bg-[#FAF7F2] border border-[#2C1D18]/10 text-[#2C1D18]/80"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Sommelier Tasting Dossier with 100% Solid Opaque Background */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-[#2C1D18]/15 rounded-2xl overflow-hidden bg-[#EFECE6] shadow-sm">
          <div className="md:col-span-7 p-10 md:p-14 md:border-r border-[#2C1D18]/15 flex flex-col justify-between bg-[#EFECE6]">
            <div>
              <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-4">
                DUYUSAL ANALİZ // SOMMELIER NOTLARI
              </div>
              <h4 className="font-display text-3xl font-bold text-[#2C1D18] mb-6 tracking-tight">
                {activeFlavor.name}
              </h4>
              <p className="text-base text-[#2C1D18]/85 leading-relaxed font-normal mb-8">
                {activeFlavor.description}
              </p>
              <blockquote className="p-6 border-l-2 border-[#8C674B] bg-[#F4F0EB] italic font-serif text-lg text-[#2C1D18]/90">
                "{activeFlavor.tastingNotes}"
              </blockquote>
            </div>

            <div className="pt-8 mt-8 border-t border-[#2C1D18]/10 flex items-center justify-between">
              <span className="text-xs font-mono tracking-[0.2em] text-[#2C1D18]/60 uppercase">
                HASAT ARŞİVİ // {activeFlavor.stats.batch}
              </span>
              <a
                href="#siparis"
                onClick={() => {
                  setSelectedCoffeeId(activeFlavor.id === 'yirgacheffe-anaerobic' ? 'yirgacheffe-single-origin' : activeFlavor.id === 'antigua-geisha' ? 'antigua-volcanic-geisha' : 'caffe-espresso-chilled')
                }}
                className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] font-semibold text-[#2C1D18] hover:text-[#8C674B] uppercase transition-colors cursor-pointer"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => setCursor('default')}
              >
                <span>Hemen Sipariş Ver</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="md:col-span-5 p-10 md:p-14 flex flex-col justify-between bg-[#F4F0EB]">
            <div>
              <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-8">
                EKSTRAKSİYON METRİKLERİ
              </div>
              <div className="space-y-6">
                {[
                  ['Hacim & Kapasite', activeFlavor.stats.volume],
                  ['Damıtma Süresi', activeFlavor.stats.extraction],
                  ['Termal Eşik', activeFlavor.stats.temp],
                  ['Varyete', activeFlavor.stats.beans],
                  ['Rakım', activeFlavor.stats.altitude]
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-baseline border-b border-[#2C1D18]/10 pb-3">
                    <span className="text-xs font-mono uppercase text-[#2C1D18]/70 tracking-wider">
                      {label}
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#2C1D18]">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#siparis"
              onClick={() => {
                setSelectedCoffeeId(activeFlavor.id === 'yirgacheffe-anaerobic' ? 'yirgacheffe-single-origin' : activeFlavor.id === 'antigua-geisha' ? 'antigua-volcanic-geisha' : 'caffe-espresso-chilled')
              }}
              className="mt-10 w-full py-4 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.25em] font-semibold uppercase transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
            >
              <span>Bu Edisyonu Sipariş Et</span>
              <ArrowUpRight size={14} className="text-[#C89D7C]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
