import React, { useState } from 'react'
import { X, CheckCircle2, Calendar, Users, Coffee, Mail, User, Phone, Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function ReservationModal() {
  const { isReservationOpen, setReservationOpen, flavors, activeFlavorIndex, addReservation, setCursor, setKVKKOpen, setLegalTab } = useStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    edition: flavors[activeFlavorIndex]?.name || 'Yirgacheffe Anaerobic',
    guests: '2 Kişi',
    date: '2026-11-28',
    time: '14:30',
    notes: ''
  })

  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [createdCode, setCreatedCode] = useState('')

  if (!isReservationOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !kvkkAccepted) return

    const code = `AETH-2026-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newRes = {
      id: code,
      ...formData,
      status: 'Pending',
      createdAt
    }

    addReservation(newRes)
    setCreatedCode(code)
    setIsSubmitted(true)
  }

  const handleClose = () => {
    setReservationOpen(false)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        edition: flavors[activeFlavorIndex]?.name || 'Yirgacheffe Anaerobic',
        guests: '2 Kişi',
        date: '2026-11-28',
        time: '14:30',
        notes: ''
      })
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#160E0A]/85 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-[#F4F0EB] border border-[#2C1D18]/15 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 z-10 my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[#2C1D18]/15 flex items-center justify-center text-[#2C1D18]/70 hover:text-[#2C1D18] hover:border-[#2C1D18] transition-colors bg-[#EFECE6]/60"
          onMouseEnter={() => setCursor('hover')}
          onMouseLeave={() => setCursor('default')}
        >
          <X size={16} />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-semibold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006241]" />
                <span>ÖZEL TADIM SEANSI // PRIVATE ALLOCATION</span>
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-[#2C1D18]">
                Rezervasyon Talebi
              </h3>
              <p className="text-xs text-[#2C1D18]/75 font-normal mt-2 leading-relaxed">
                Sub-zero damıtılmış nadir hasat varyetelerini sommelier eşliğinde deneyimlemek için rezervasyon oluşturun.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                    Adınız Soyadınız *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Örn: Deniz Altan"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                    E-Posta Adresi *
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="deniz@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Guests Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                    İletişim Numarası
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+90 532 000 00 00"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                    Katılımcı Sayısı
                  </label>
                  <div className="relative">
                    <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all appearance-none cursor-pointer"
                    >
                      <option value="1 Kişi">1 Kişi (Bireysel Deneyim)</option>
                      <option value="2 Kişi">2 Kişi (Çift Tadımı)</option>
                      <option value="3-4 Kişi">3 - 4 Kişi (Özel Grup)</option>
                      <option value="5-6 Kişi">5 - 6 Kişi (Kurumsal Masa)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selected Edition & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                    Öncelikli Edisyon
                  </label>
                  <div className="relative">
                    <Coffee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <select
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all appearance-none cursor-pointer"
                    >
                      {flavors.map((f) => (
                        <option key={f.id} value={`${f.number} — ${f.name}`}>
                          {f.number} — {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                    Tercih Edilen Tarih
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1.5">
                  Özel İstekler / Alerjen Notları
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Damak tadı tercihleri veya özel koku hassasiyeti..."
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6]/60 focus:bg-[#FAF7F2] focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all resize-none"
                />
              </div>

              {/* KVKK Compliance Consent */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="kvkk-consent"
                  type="checkbox"
                  required
                  checked={kvkkAccepted}
                  onChange={(e) => setKvkkAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#2C1D18]/30 text-[#006241] focus:ring-[#006241] cursor-pointer"
                />
                <label htmlFor="kvkk-consent" className="text-[11px] text-[#2C1D18]/80 leading-snug cursor-pointer">
                  <span>6698 Sayılı </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLegalTab('kvkk')
                      setKVKKOpen(true)
                    }}
                    className="font-semibold text-[#8C674B] underline hover:text-[#2C1D18] transition-colors"
                  >
                    KVKK Aydınlatma Metni'ni
                  </button>
                  <span> okudum, kişisel verilerimin bu kapsamda işlenmesini ve tadım koordinasyonu için kullanılmasını onaylıyorum. *</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2C1D18]/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase text-[#2C1D18]/70 hover:text-[#2C1D18] transition-colors"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!kvkkAccepted}
                  className={`px-6 py-2.5 rounded-full border border-[#2C1D18] text-xs font-mono tracking-[0.2em] font-semibold uppercase transition-all shadow-md flex items-center gap-2 ${
                    kvkkAccepted
                      ? 'bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] cursor-pointer'
                      : 'bg-[#2C1D18]/40 text-[#F4F0EB]/60 cursor-not-allowed border-[#2C1D18]/30'
                  }`}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={() => setCursor('default')}
                >
                  <span>Talebi İlet</span>
                  <Sparkles size={13} className="text-[#C89D7C]" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#006241]/10 text-[#006241] flex items-center justify-center mx-auto mb-5 border border-[#006241]/20">
              <CheckCircle2 size={32} />
            </div>

            <div className="text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-semibold mb-2">
              REZERVASYON ONAY BEKLİYOR
            </div>

            <h3 className="font-display text-3xl font-bold text-[#2C1D18] mb-2">
              Talebiniz Alındı
            </h3>

            <p className="text-xs text-[#2C1D18]/70 max-w-sm mx-auto mb-6 leading-relaxed">
              Sayın <strong className="text-[#2C1D18]">{formData.name}</strong>, tadım seansı detayları incelenerek e-posta adresinize teyit iletilecektir.
            </p>

            {/* Confirmation Dossier Card */}
            <div className="p-5 rounded-2xl border border-[#2C1D18]/15 bg-[#EFECE6] text-left max-w-sm mx-auto mb-8 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2">
                <span className="text-[#2C1D18]/60 uppercase">Referans Kodu</span>
                <span className="font-bold text-[#2C1D18]">{createdCode}</span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2">
                <span className="text-[#2C1D18]/60 uppercase">Seçili Edisyon</span>
                <span className="text-[#2C1D18] truncate ml-4">{formData.edition}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#2C1D18]/60 uppercase">Tarih & Saat</span>
                <span className="text-[#2C1D18]">{formData.date} · {formData.time}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-md"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => setCursor('default')}
            >
              Tamamla
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
