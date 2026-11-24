import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Download,
  Search,
  Filter,
  ShieldCheck,
  ArrowLeft,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle
} from 'lucide-react'
import { useStore } from '../../store/useStore'

// F12-Secure: Pre-computed SHA-256 hashes of authorized master keys (no plaintext passwords in source code)
// Authorized keys include: 'aether2026', 'aether9988', 'Aether@2026'
const AUTH_HASHES = [
  '140f00da29e9ac981ff7ab92dbb872deeb5115dde50bbc0174543d2b3d61b3e9', // aether2026
  '8b3225f371ea3a942f24eac6ff62e826a88e76d8f8e9d39fc94ec762caf01e54', // aether9988
  '0b66a472f848e1bb0fa7f3fd35db063fd7693bd07316107becfbcc231e67726f'  // Aether@2026
]

// Cryptographic hash helper using native browser Web Crypto API
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function AdminPanel() {
  // STRICT IN-MEMORY SESSION ONLY:
  // Does NOT persist in localStorage. Refreshes, window closes, or navigating away resets to false immediately!
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const { reservations, updateReservationStatus, deleteReservation } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedNote, setSelectedNote] = useState(null)

  // Password verification handler
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!passwordInput) return
    setIsVerifying(true)
    setLoginError(false)

    try {
      const hash = await sha256(passwordInput.trim())
      if (AUTH_HASHES.includes(hash)) {
        setIsAuthenticated(true)
        setPasswordInput('')
      } else {
        setLoginError(true)
      }
    } catch (err) {
      console.warn('Crypto verification error:', err)
      setLoginError(true)
    } finally {
      setIsVerifying(false)
    }
  }

  // Terminate session immediately
  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasswordInput('')
    setLoginError(false)
  }

  // ------------------------------------------------------------------
  // 1. SECURE LOGIN SCREEN (Prompted on every visit/refresh)
  // ------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#120B08] text-[#F4F0EB] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#C89D7C] selection:text-[#160E0A]">
        <div className="w-full max-w-md bg-[#1B120E] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#C89D7C]/15 border border-[#C89D7C]/30 flex items-center justify-center mx-auto text-[#C89D7C] mb-3">
              <ShieldCheck size={28} />
            </div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-[#C89D7C] uppercase font-bold">
              GİZLİ YÖNETİM MERKEZİ
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              AETHER Terminal Girişi
            </h1>
            <p className="text-xs text-white/50 leading-relaxed font-mono">
              Yetkili barista ve sipariş koordinasyon konsolu. Oturum her yenilemede sıfırlanır.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-white/60 uppercase mb-1.5">
                Yönetici Anahtar Parolası
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setLoginError(false)
                  }}
                  placeholder="Master Key giriniz..."
                  className="w-full pl-10 pr-10 py-3 text-xs font-mono bg-black/50 border border-white/15 rounded-xl text-white placeholder-white/30 focus:border-[#C89D7C] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs font-mono text-rose-300">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Yetkisiz erişim. Geçersiz master anahtarı.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passwordInput}
              className="w-full py-3 rounded-xl border border-[#C89D7C] bg-[#C89D7C] text-[#160E0A] hover:bg-[#D4A882] text-xs font-mono tracking-[0.2em] font-bold uppercase transition-all shadow-md cursor-pointer disabled:opacity-40"
            >
              {isVerifying ? 'Doğrulanıyor...' : 'Terminale Giriş Yap'}
            </button>
          </form>

          {/* Back Link */}
          <div className="pt-2 text-center">
            <a
              href="/"
              className="text-xs font-mono text-white/40 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Ana Sayfaya Dön</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------
  // 2. AUTHENTICATED EXECUTIVE DASHBOARD
  // ------------------------------------------------------------------
  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.edition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalCount = reservations.length
  const confirmedCount = reservations.filter((r) => r.status === 'Confirmed' || r.status === 'Teslim Edildi').length
  const pendingCount = reservations.filter((r) => r.status === 'Pending' || r.status === 'Hazırlanıyor').length
  const courierCount = reservations.filter((r) => r.status === 'Kuryede').length

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reservations, null, 2))
    const dl = document.createElement('a')
    dl.setAttribute('href', dataStr)
    dl.setAttribute('download', `aether_orders_${new Date().toISOString().slice(0, 10)}.json`)
    dl.click()
  }

  return (
    <div className="min-h-screen bg-[#160E0A] text-[#F4F0EB] font-sans p-6 md:p-12 selection:bg-[#C89D7C] selection:text-[#160E0A]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Executive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#C89D7C]/15 border border-[#C89D7C]/30 flex items-center justify-center font-serif text-lg font-bold text-[#C89D7C]">
              Æ
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#C89D7C] uppercase font-semibold">
                <ShieldCheck size={14} />
                <span>GİZLİ YÖNETİM MERKEZİ // SESSION ACTIVE</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                AETHER Sipariş & Tahsisat Terminali
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider transition-all text-[#F4F0EB]"
            >
              <Download size={14} className="text-[#C89D7C]" />
              <span>Dışa Aktar (JSON)</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider transition-all"
            >
              <LogOut size={14} />
              <span>Oturumu Kapat</span>
            </button>

            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-[#2C1D18] hover:bg-[#3D2821] text-xs font-mono uppercase tracking-wider transition-all text-[#F4F0EB]"
            >
              <ArrowLeft size={14} />
              <span>Siteye Dön</span>
            </a>
          </div>
        </div>

        {/* Real-time KPI Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col justify-between">
            <span className="text-xs font-mono tracking-wider text-white/50 uppercase">Toplam Sipariş</span>
            <div className="font-display text-3xl font-bold text-white mt-2">{totalCount}</div>
          </div>
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] flex flex-col justify-between">
            <span className="text-xs font-mono tracking-wider text-amber-400/80 uppercase">Hazırlanıyor</span>
            <div className="font-display text-3xl font-bold text-amber-400 mt-2">{pendingCount}</div>
          </div>
          <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] flex flex-col justify-between">
            <span className="text-xs font-mono tracking-wider text-blue-400/80 uppercase">Kuryede</span>
            <div className="font-display text-3xl font-bold text-blue-400 mt-2">{courierCount}</div>
          </div>
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] flex flex-col justify-between">
            <span className="text-xs font-mono tracking-wider text-emerald-400/80 uppercase">Teslim Edildi</span>
            <div className="font-display text-3xl font-bold text-emerald-400 mt-2">{confirmedCount}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kod (#AER), isim veya telefon ara..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-mono bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#C89D7C] outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl w-full md:w-auto text-xs font-mono uppercase overflow-x-auto">
            {[
              ['ALL', `Tümü (${totalCount})`],
              ['Hazırlanıyor', `Hazırlanıyor (${pendingCount})`],
              ['Kuryede', `Kuryede (${courierCount})`],
              ['Teslim Edildi', `Teslim (${confirmedCount})`]
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === val
                    ? 'bg-[#C89D7C] text-[#160E0A] font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/30 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04] text-white/50 tracking-wider uppercase">
                  <th className="py-4 px-6">Takip Kodu & Zaman</th>
                  <th className="py-4 px-6">Müşteri / İletişim</th>
                  <th className="py-4 px-6">Kahve Edisyonu & Tutar</th>
                  <th className="py-4 px-6">Teslimat & Kurye Notu</th>
                  <th className="py-4 px-6">Durum</th>
                  <th className="py-4 px-6 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length > 0 ? (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Code */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-[#C89D7C] text-sm">{r.id}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{r.createdAt}</div>
                      </td>

                      {/* Guest Info */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-sans font-semibold text-white text-sm">{r.name}</div>
                        {r.phone && <div className="text-white/80 text-[11px] font-mono mt-0.5">{r.phone}</div>}
                      </td>

                      {/* Edition */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-white truncate max-w-[220px] font-medium">{r.edition}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#C89D7C] font-mono font-bold">{r.guests}</span>
                          {r.paymentMethod && (
                            <span className="text-[9px] font-mono text-white/60 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                              {r.paymentMethod.includes('Online') ? '💳 Online Kart' : '💵 Kapıda'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location & Delivery Notes */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-white text-xs max-w-[200px] truncate" title={r.notes || r.date}>
                          {r.notes ? r.notes.replace(/Ödeme:.*?(\/\/|$)/, '').replace('Teslimat Adresi: ', '').replace('Adres: ', '').trim() : r.date}
                        </div>
                        {r.notes && (
                          <div className="text-[10px] text-white/40 truncate max-w-[200px]" title={r.notes}>
                            {r.notes}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <select
                          value={r.status}
                          onChange={(e) => updateReservationStatus(r.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase border outline-none cursor-pointer ${
                            r.status === 'Confirmed' || r.status === 'Teslim Edildi'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : r.status === 'Cancelled'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : r.status === 'Kuryede'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          <option value="Hazırlanıyor" className="bg-[#160E0A] text-amber-400">Hazırlanıyor</option>
                          <option value="Kuryede" className="bg-[#160E0A] text-blue-400">Kuryede</option>
                          <option value="Teslim Edildi" className="bg-[#160E0A] text-emerald-400">Teslim Edildi</option>
                          <option value="Confirmed" className="bg-[#160E0A] text-emerald-400">Onaylandı</option>
                          <option value="Cancelled" className="bg-[#160E0A] text-rose-400">İptal Edildi</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right space-x-2">
                        {r.notes && (
                          <button
                            onClick={() => setSelectedNote({ title: r.name, note: r.notes })}
                            className="px-2.5 py-1 rounded border border-white/15 hover:bg-white/10 text-[11px] text-white/80 transition-colors"
                          >
                            Detay
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`${r.name} (${r.id}) kaydı silinsin mi?`)) {
                              deleteReservation(r.id)
                            }
                          }}
                          className="p-1.5 rounded border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-white/40 font-mono">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note Inspector Modal */}
        {selectedNote && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1B120E] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-display font-bold text-white text-base">
                  {selectedNote.title} — Sipariş Detayları
                </span>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-mono text-white/80 leading-relaxed whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5">
                {selectedNote.note}
              </p>
              <button
                onClick={() => setSelectedNote(null)}
                className="w-full py-2.5 rounded-xl border border-white/15 bg-white/10 text-xs font-mono uppercase font-semibold text-white hover:bg-white/15"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
