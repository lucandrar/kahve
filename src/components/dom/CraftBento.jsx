import React from 'react'
import { useStore } from '../../store/useStore'

export default function CraftBento() {
  const { setCursor } = useStore()

  return (
    <section id="craft" className="relative w-full py-36 md:py-48 px-6 md:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Solid Fill */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 pb-8 border-b border-[#2C1D18]/15 bg-[#EFECE6]/90 p-8 rounded-2xl">
          <div>
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006241]" />
              <span>BÖLÜM 04 // STANDARTLAR & PROTOKOL</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#2C1D18]">
              Zanaat Manifestosu
            </h2>
          </div>
          <p className="max-w-md text-base text-[#2C1D18]/85 font-normal leading-relaxed">
            Sıfır katkı, sıfır ilave şeker. Yalnızca volkanik dağ kahvesi ve 
            zamana yayılan soğuk damıtma ustalığı.
          </p>
        </div>

        {/* Architectural Bento Layout with 100% Solid Opaque Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-[#2C1D18]/15 rounded-2xl overflow-hidden shadow-sm bg-[#EFECE6]">
          {/* Card 1: -2°C Sub-Zero Extraction (Span 7) */}
          <div
            className="md:col-span-7 p-10 md:p-14 md:border-r border-b md:border-b-0 border-[#2C1D18]/15 flex flex-col justify-between bg-[#EFECE6] hover:bg-[#F4F0EB] transition-colors"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-16">
              Termal Protokol · Kriyojenik Süzme
            </div>

            <div>
              <div className="font-display text-6xl md:text-7xl font-extrabold text-[#2C1D18] tracking-tighter mb-4">
                -2°C
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C1D18] mb-3 tracking-tight">
                Sub-Zero Soğuk Ekstraksiyon
              </h3>
              <p className="text-base text-[#2C1D18]/80 font-normal leading-relaxed max-w-[55ch]">
                Geleneksel sıcak demlemelerin kahve yağlarını yakan yüksek ısısına karşılık, 
                AETHER -2°C'de damıtılarak acılaşma engellenir ve aromatik terpenler %99.4 oranında canlı tutulur.
              </p>
            </div>
          </div>

          {/* Card 2: 18 Saat (Span 5) */}
          <div
            className="md:col-span-5 p-10 md:p-14 flex flex-col justify-between bg-[#F4F0EB] hover:bg-[#EFECE6] transition-colors"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-16">
              Zaman Faktörü · Yavaş Akış
            </div>

            <div>
              <div className="font-display text-6xl md:text-7xl font-extrabold text-[#2C1D18] tracking-tighter mb-4">
                18 Saat
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C1D18] mb-3 tracking-tight">
                Gravitasyonel Damıtma
              </h3>
              <p className="text-base text-[#2C1D18]/80 font-normal leading-relaxed">
                Her damla, kireçtaşı ile dengelenmiş soğuk dağ suyunun öğütülmüş Arabica yatağından 
                yerçekimiyle süzülmesiyle elde edilir. Doğal olarak tatlı ve pürüzsüz.
              </p>
            </div>
          </div>

          {/* Card 3: 100% Arabica (Span 5) */}
          <div
            className="md:col-span-5 p-10 md:p-14 border-t md:border-r border-[#2C1D18]/15 flex flex-col justify-between bg-[#F4F0EB] hover:bg-[#EFECE6] transition-colors"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-16">
              Varyete Saflığı
            </div>

            <div>
              <div className="font-display text-6xl md:text-7xl font-extrabold text-[#2C1D18] tracking-tighter mb-4">
                100%
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C1D18] mb-3 tracking-tight">
                Yüksek İrtifa Arabica
              </h3>
              <p className="text-base text-[#2C1D18]/80 font-normal leading-relaxed">
                Yalnızca 1,800 metre ve üzeri volkanik yaylalardan elle toplanan mikro-parti çekirdekler.
                Sıfır dolgu maddesi, sıfır yapay aroma verici.
              </p>
            </div>
          </div>

          {/* Card 4: Sürdürülebilirlik & Hermetik Ambalaj (Span 7) */}
          <div
            className="md:col-span-7 p-10 md:p-14 border-t border-[#2C1D18]/15 flex flex-col justify-between bg-[#EFECE6] hover:bg-[#F4F0EB] transition-colors"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-16">
              Ekolojik Döngü · PP 05 Koruması
            </div>

            <div>
              <div className="font-display text-6xl md:text-7xl font-extrabold text-[#2C1D18] tracking-tighter mb-4">
                Sonsuz
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C1D18] mb-3 tracking-tight">
                Geri Dönüştürülebilir Polipropilen
              </h3>
              <p className="text-base text-[#2C1D18]/80 font-normal leading-relaxed max-w-[55ch]">
                Hafif ve çevreye duyarlı ambalaj mimarisi. Karbon ayak izini geleneksel cam şişelere 
                kıyasla %68 oranında azaltır ve tazeliği hermetik kilit ile hapseder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
