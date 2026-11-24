import React, { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Scene from './components/canvas/Scene'
import Navbar from './components/dom/Navbar'
import Hero from './components/dom/Hero'
import FlavorSelector from './components/dom/FlavorSelector'
import DeconstructedStory from './components/dom/DeconstructedStory'
import CraftBento from './components/dom/CraftBento'
import CampaignShowcase from './components/dom/CampaignShowcase'
import Footer from './components/dom/Footer'
import CustomCursor from './components/dom/CustomCursor'
import Preloader from './components/dom/Preloader'
import MusicPlayer from './components/dom/MusicPlayer'
import KVKKModal from './components/dom/KVKKModal'
import AdminPanel from './components/admin/AdminPanel'
import KVKKPage from './pages/KVKKPage'
import OrderPage from './pages/OrderPage'
import { webglScrollState, useStore } from './store/useStore'

export default function App() {
  const lenisRef = useRef(null)
  const { currentView, setCurrentView } = useStore()

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase()
      const hash = window.location.hash.toLowerCase()
      const search = window.location.search.toLowerCase()
      if (path.includes('siparis') || hash.includes('siparis')) {
        setCurrentView('siparis')
      } else if (path.includes('kvkk') || hash.includes('kvkk')) {
        setCurrentView('kvkk')
      } else if (
        path.includes('admin-secure-panel-9988') ||
        path.includes('admin-portal-secret-key-9988') ||
        hash.includes('admin-secure-panel-9988') ||
        hash.includes('admin-portal-secret-key-9988') ||
        search.includes('admin-secure-panel-9988') ||
        search.includes('admin-portal-secret-key-9988')
      ) {
        setCurrentView('admin')
      } else {
        setCurrentView('home')
      }
    }

    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [setCurrentView])

  // If standalone /siparis route is requested, render the dedicated Order page
  if (currentView === 'siparis') {
    return <OrderPage />
  }

  // If standalone /kvkk route is requested, render the dedicated KVKK page
  if (currentView === 'kvkk') {
    return <KVKKPage />
  }

  // If secret admin URL is accessed, render the executive Admin Terminal
  if (currentView === 'admin') {
    return <AdminPanel />
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2
    })
    lenisRef.current = lenis

    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0
      webglScrollState.progress = progress

      // Closed lid start & precision scroll-driven lid/slider sync in Section 03 ("Dekompoze Hassasiyet")
      const storyEl = document.getElementById('story')
      if (storyEl) {
        const rect = storyEl.getBoundingClientRect()
        const winH = window.innerHeight

        // Starts strictly at 0% when Section 03 enters, scaling smoothly to 100% as the section centers
        const startY = winH * 0.72
        const endY = winH * 0.12
        if (rect.top <= startY && rect.bottom >= 0) {
          const sectionProgress = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)))
          webglScrollState.exploded = sectionProgress
          useStore.setState({ explodedProgress: sectionProgress })
        } else if (rect.top > startY) {
          // Strictly closed (0%) before entering Section 03
          webglScrollState.exploded = 0
          useStore.setState({ explodedProgress: 0 })
        }
      }
    }

    lenis.on('scroll', onScroll)

    let animId
    function raf(time) {
      lenis.raf(time)
      animId = requestAnimationFrame(raf)
    }
    animId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div className="relative min-h-screen text-[#2C1D18] bg-[#F4F0EB] transition-colors duration-1000 overflow-x-hidden selection:bg-[#2C1D18] selection:text-[#F4F0EB]">
      {/* Tactile Heavy Cotton Art Paper Film-Grain Overlay */}
      <div className="film-grain-paper" />

      {/* Minimalist Editorial Custom Cursor (Dot + Hairline Ring) */}
      <CustomCursor />

      {/* Swiss Preloader */}
      <Preloader />

      {/* Fixed Luxury Minimalist Navbar */}
      <Navbar />

      {/* KVKK & Legal Compliance Modal */}
      <KVKKModal />

      {/* Sabrina Carpenter — Espresso Official Music Player Widget */}
      <MusicPlayer />

      {/* High-Performance 60 FPS 3D WebGL Canvas Layer (Fixed, z-10) */}
      <Scene />

      {/* Main Content Sections (Scrollable DOM Layer, without z-index on main so Hero z-0 stays behind Scene z-10 and other sections sit at z-20) */}
      <main className="relative flex flex-col">
        <Hero />
        <FlavorSelector />
        <DeconstructedStory />
        <CraftBento />
        <CampaignShowcase />
      </main>

      {/* Architectural Swiss Print Footer */}
      <Footer />
    </div>
  )
}
