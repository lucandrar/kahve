import React, { useEffect, useState, useRef } from 'react'
import { useStore } from '../../store/useStore'

export default function CustomCursor() {
  const { cursorVariant } = useStore()
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const reqRef = useRef()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    let currentX = -100
    let currentY = -100
    const loop = () => {
      currentX += (pos.x - currentX) * 0.22
      currentY += (pos.y - currentY) * 0.22
      setTrailingPos({ x: currentX, y: currentY })
      reqRef.current = requestAnimationFrame(loop)
    }
    reqRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(reqRef.current)
    }
  }, [pos.x, pos.y, isVisible])

  if (!isVisible) return null

  const isHover = cursorVariant === 'hover' || cursorVariant === 'drag'

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. Sharp Espresso-Brown Core Dot */}
      <div
        className="fixed w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#2C1D18] transition-transform duration-150 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHover ? 0.6 : 1})`
        }}
      />

      {/* 2. Sleek Hairline Trailing Ring */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHover ? '48px' : '24px',
          height: isHover ? '48px' : '24px',
          backgroundColor: isHover ? 'rgba(200, 157, 124, 0.08)' : 'transparent',
          border: `1.2px solid ${isHover ? '#C89D7C' : 'rgba(44, 29, 24, 0.32)'}`
        }}
      />
    </div>
  )
}
