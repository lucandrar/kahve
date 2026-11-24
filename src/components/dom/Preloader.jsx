import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'

export default function Preloader() {
  const { isLoading, finishLoading } = useStore()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      const inc = Math.floor(Math.random() * 9) + 2
      current = Math.min(100, current + inc)
      setProgress(current)

      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          finishLoading()
        }, 400)
      }
    }, 32)

    return () => clearInterval(interval)
  }, [finishLoading])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#F4F0EB] flex flex-col justify-between p-8 md:p-14 transition-opacity duration-700 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between text-xs font-mono tracking-[0.25em] text-[#2C1D18]/60 uppercase">
        <span>AETHER ESPRESSO ARTISANAL</span>
        <span>HASAT 2026 // SINGLE ORIGIN</span>
      </div>

      <div className="max-w-md w-full mx-auto text-center">
        <div className="font-display text-7xl md:text-8xl text-[#2C1D18] font-bold tracking-tight mb-4">
          {progress < 10 ? `0${progress}` : progress}
        </div>
        <div className="w-full h-[1.5px] bg-[#2C1D18]/15 overflow-hidden relative mb-4">
          <div
            className="h-full bg-[#2C1D18] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs font-mono tracking-[0.2em] text-[#C89D7C] uppercase font-semibold">
          SUB-ZERO DAMITMA PROTOKOLÜ KALİBRE EDİLİYOR
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-[#2C1D18]/40 tracking-[0.2em] uppercase">
        <span>ETİYOPYA · GUATEMALA · KOLOMBİYA</span>
        <span>LOCKED 60 FPS</span>
      </div>
    </div>
  )
}
