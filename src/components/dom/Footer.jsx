import React, { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { setCursor, setKVKKOpen, setLegalTab } = useStore()

  const openLegal = (tab) => {
    setLegalTab(tab)
    setKVKKOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
  }

  return (
    <footer className="relative w-full border-t border-[#2C1D18]/15 pt-28 pb-16 px-6 md:px-12 z-20 bg-[#EFECE6]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-20 border-b border-[#2C1D18]/15">
          {/* Brand Manifesto & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#2C1D18] flex items-center justify-center font-display text-xs text-[#2C1D18] font-bold">
                Æ
              </div>
              <span className="font-display tracking-[0.25em] text-lg text-[#2C1D18] font-bold">
                AETHER ESPRESSO
              </span>
            </div>
            <p className="text-[#2C1D18]/80 text-sm font-normal leading-relaxed max-w-sm">
              Artisanal zanaat kahvesi. Volkanik dağ çekirdekleri, sub-zero yavaş damıtma 
              ve sıvı azot korumalı hermetik ambalaj mimarisiyle şişelenir.
            </p>
            <div className="text-xs font-mono tracking-[0.2em] font-semibold text-[#C89D7C] uppercase">
              EST. 2026 // HASAT ARŞİVİ LOT 01–03
            </div>

            {/* Social Media Links with High-Contrast Thin-Stroke SVG Icons */}
            <div className="pt-2 flex items-center gap-3">
              {[
                {
                  name: 'Instagram',
                  href: 'https://instagram.com/aether.espresso',
                  icon: (
                    <svg className="w-4 h-4 fill-none stroke-current stroke-[1.75]" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  )
                },
                {
                  name: 'X (Twitter)',
                  href: 'https://x.com/aether_espresso',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )
                },
                {
                  name: 'YouTube',
                  href: 'https://youtube.com/@aether_espresso',
                  icon: (
                    <svg className="w-4 h-4 fill-none stroke-current stroke-[1.75]" viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="4" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                    </svg>
                  )
                },
                {
                  name: 'LinkedIn',
                  href: 'https://linkedin.com/company/aether-espresso',
                  icon: (
                    <svg className="w-4 h-4 fill-none stroke-current stroke-[1.75]" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )
                }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#2C1D18]/25 text-[#2C1D18]/80 hover:text-[#F4F0EB] hover:bg-[#2C1D18] hover:border-[#2C1D18] flex items-center justify-center transition-all bg-[#F4F0EB]/60 shadow-sm"
                  title={s.name}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8 text-xs font-mono font-medium">
            <div>
              <span className="text-[#2C1D18]/50 uppercase tracking-[0.2em] block mb-4">
                Mimari
              </span>
              <ul className="space-y-3 text-[#2C1D18]/80">
                <li><a href="#siparis" className="hover:text-[#2C1D18] font-bold text-[#8C674B] transition-colors">Online Sipariş ↗</a></li>
                <li><a href="#flavors" className="hover:text-[#2C1D18] transition-colors">Hasatlar</a></li>
                <li><a href="#story" className="hover:text-[#2C1D18] transition-colors">Anatomi</a></li>
                <li><a href="#craft" className="hover:text-[#2C1D18] transition-colors">Standartlar</a></li>
                <li><a href="#campaign" className="hover:text-[#2C1D18] transition-colors">Arşiv</a></li>
              </ul>
            </div>
            <div>
              <span className="text-[#2C1D18]/50 uppercase tracking-[0.2em] block mb-4">
                Yasal Uyum
              </span>
              <ul className="space-y-3 text-[#2C1D18]/80">
                <li>
                  <a
                    href="#kvkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2C1D18] text-left transition-colors font-semibold underline underline-offset-4 decoration-[#8C674B]/60 hover:decoration-[#2C1D18]"
                  >
                    KVKK Aydınlatma Metni ↗
                  </a>
                </li>
                <li>
                  <a
                    href="#kvkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2C1D18] text-left transition-colors font-medium"
                  >
                    Gizlilik İlkeleri
                  </a>
                </li>
                <li>
                  <a
                    href="#kvkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2C1D18] text-left transition-colors font-medium"
                  >
                    Çerez Politikası
                  </a>
                </li>
                <li>
                  <a
                    href="#kvkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2C1D18] text-left transition-colors font-medium"
                  >
                    Sürdürülebilirlik
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Allocation Email Notification */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-mono tracking-[0.2em] font-semibold text-[#C89D7C] uppercase block">
              Özel Parti Bildirimleri
            </span>
            <p className="text-sm text-[#2C1D18]/80 font-normal">
              Sınırlı tek kökenli hasat partilerine halka açılmadan önce erişim sağlayın.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 border border-[#2C1D18]/30 text-[#2C1D18] text-xs font-mono rounded-xl bg-[#F4F0EB]">
                <Check size={16} className="text-[#C89D7C]" />
                <span>Özel tahsisat listesine kaydoldunuz.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresinizi giriniz"
                  className="flex-1 bg-[#F4F0EB] border border-[#2C1D18]/20 px-4 py-3 text-xs font-mono text-[#2C1D18] placeholder-[#2C1D18]/40 focus:outline-none focus:border-[#2C1D18]"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1E1410] font-semibold text-xs font-mono tracking-[0.15em] uppercase transition-all flex items-center gap-1.5"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                >
                  <span>Kayıt</span>
                  <ArrowUpRight size={14} className="text-[#C89D7C]" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-mono text-[#2C1D18]/70 tracking-[0.12em]">
          <div>
            © 2026 AETHER ESPRESSO LABS SAN. VE TİC. A.Ş. TÜM HAKLARI SAKLIDIR.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2C1D18] transition-colors uppercase font-medium"
            >
              KVKK Aydınlatma Metni
            </a>
            <a
              href="#kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2C1D18] transition-colors uppercase font-medium"
            >
              Gizlilik Politikası
            </a>
            <a
              href="#kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2C1D18] transition-colors uppercase font-medium"
            >
              Çerez Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
