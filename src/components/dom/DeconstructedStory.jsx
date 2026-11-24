import React from 'react'
import { useStore } from '../../store/useStore'

export default function DeconstructedStory() {
  const { activeFlavorIndex, flavors, explodedProgress, setExplodedProgress, setCursor } = useStore()
  const activeFlavor = flavors[activeFlavorIndex]

  const steps = [
    {
      num: '01',
      title: 'Sub-Zero Damıtma',
      desc: '-2°C kontrollü sıcaklıkta 18 saat boyunca damla damla süzülen saf espresso özütü. Isıl işlem uygulanmadığı için acılaşma engellenir.'
    },
    {
      num: '02',
      title: 'Altın Krema Emülsiyonu',
      desc: 'Yüksek irtifa Arabica çekirdeklerinin taze kahve yağları ve mikro hava kabarcıkları birleşerek kadifemsi, tiger-stripe dokulu yoğun kremayı oluşturur.'
    },
    {
      num: '03',
      title: 'Doğal Mineral Filtresi',
      desc: 'Yüksek irtifa dağ suları kireçtaşı katmanlarından süzülerek 7.8 pH berraklığına ulaşır ve kahve asiditesini mükemmel dengeler.'
    },
    {
      num: '04',
      title: 'Hermetik İki Kademeli Kapak',
      desc: 'Koku buharını ve nitrojen basıncını içeride hapseden polipropilen kilitli kapak. Açıldığı anda taze çekilmiş kahve patlaması serbest kalır.'
    }
  ]

  return (
    <section id="story" className="relative w-full py-36 md:py-44 px-6 md:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Split Hero Layout for Section 03: Left Column for Text & Slider, Right Column Open for 3D Cup & Splash */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          {/* Left Column: High-Contrast Editorial Text & Interactive Deconstruction Slider */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <div className="text-xs font-mono tracking-[0.25em] font-semibold text-[#8C674B] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006241]" />
              <span>BÖLÜM 03 // DEKOMPOZE HASSASİYET</span>
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#2C1D18] mb-6 leading-[1.05]">
              Dekompoze <br className="hidden md:inline" />
              <span className="italic font-serif font-normal text-[#8C674B]">Hassasiyet.</span>
            </h2>

            <p className="text-[#2C1D18]/85 text-base md:text-lg font-normal leading-relaxed max-w-lg mb-8">
              Kapak açıldığında açığa çıkan taze kavrulmuş Arabica yağları, 
              kristalize krema taçlanması ve sıfır yerçekimli espresso patlamasını interaktif olarak keşfedin.
            </p>

            {/* Interactive Macro Slider Control */}
            <div className="w-full max-w-md border border-[#2C1D18]/15 p-5 bg-[#EFECE6]/80 backdrop-blur-sm rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[#2C1D18] tracking-[0.2em] font-semibold uppercase mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C89D7C] animate-pulse" />
                  KAPAK AÇILIMI & KREMA SIÇRAMASI
                </span>
                <span className="text-[#006241] font-bold text-sm">
                  {Math.round(explodedProgress * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedProgress}
                onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#2C1D18]/20 rounded-lg appearance-none cursor-pointer accent-[#2C1D18]"
                onMouseEnter={() => setCursor('drag', 'AÇ / PATLAT')}
                onMouseLeave={() => setCursor('default')}
              />

              <div className="flex justify-between text-[10px] font-mono text-[#2C1D18]/60 uppercase mt-2.5">
                <span>0% KAPALI</span>
                <span>50% BASINÇ TAHLİYESİ</span>
                <span>100% KREMA PATLAMASI</span>
              </div>
            </div>
          </div>

          {/* Right Column: Kept completely empty in DOM so the 3D Cup & Espresso Splash can be fully visible without any text collision */}
          <div className="hidden lg:block lg:col-span-6 pointer-events-none h-[420px]" aria-hidden="true" />
        </div>

        {/* 4-Column Architectural Swiss Grid Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#2C1D18]/15 bg-[#EFECE6]/40">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className={`p-8 md:p-10 bg-transparent hover:bg-[#EFECE6]/80 transition-colors ${
                idx < 3 ? 'lg:border-r border-[#2C1D18]/15' : ''
              } ${idx % 2 === 0 ? 'md:border-r border-[#2C1D18]/15' : ''}`}
            >
              <div className="text-xs font-mono text-[#8C674B] tracking-[0.25em] font-semibold mb-8">
                {s.num} // 04
              </div>

              <h3 className="font-display text-xl font-bold text-[#2C1D18] mb-3 tracking-tight">
                {s.title}
              </h3>

              <p className="text-sm text-[#2C1D18]/80 font-normal leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
