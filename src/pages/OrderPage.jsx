import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Banknote,
  Lock,
  Navigation,
  Clock,
  Check,
  Eye,
  EyeOff,
  Coffee,
  ChevronRight
} from 'lucide-react'
import { useStore } from '../store/useStore'

const COFFEE_MENU = [
  {
    id: 'caffe-espresso-chilled',
    code: '01',
    name: 'Caffè Espresso Chilled',
    volume: '220 ml',
    price: 185,
    tag: 'İmza Edisyon',
    notes: 'Karamel, Kakao, Fındık',
    accentColor: '#C89D7C',
    accentBg: '#2C1D18',
    description: '-2°C Cryo damıtma ve zengin krema katmanı ile dengelenmiş soğuk espresso.'
  },
  {
    id: 'sub-zero-cold-brew',
    code: '02',
    name: 'Sub-Zero Cold Brew',
    volume: '220 ml',
    price: 195,
    tag: '18 Saat Damıtma',
    notes: 'Bitter Çikolata, Esmer Şeker, Vanilya',
    accentColor: '#B68862',
    accentBg: '#1E1410',
    description: '18 saatlik sub-zero yavaş damıtma ile sıfır acılık ve ipeksi bir bitiş.'
  },
  {
    id: 'yirgacheffe-single-origin',
    code: '03',
    name: 'Yirgacheffe Single Origin',
    volume: '220 ml',
    price: 220,
    tag: 'Lot ETH-491',
    notes: 'Yabani Yasemin, Calabria Bergamotu, Şeftali',
    accentColor: '#006241',
    accentBg: '#093B28',
    description: 'Etiyopya yüksek yayla çekirdeklerinden anaerobik fermantasyon ile çiçeksi berraklık.'
  },
  {
    id: 'antigua-volcanic-geisha',
    code: '04',
    name: 'Antigua Volcanic Geisha',
    volume: '220 ml',
    price: 260,
    tag: 'Lot GTM-492',
    notes: 'Dağ Çiçeği Balı, Kakao, Meyer Limonu',
    accentColor: '#D4A882',
    accentBg: '#2C1D18',
    description: 'Agua Yanardağı yamaçlarında gölgede olgunlaşan nadir Geisha varyetesi.'
  },
  {
    id: 'velvet-cortado-chilled',
    code: '05',
    name: 'Velvet Cortado Chilled',
    volume: '200 ml',
    price: 190,
    tag: 'İpeksi Süt Eşleşmesi',
    notes: 'Kavrulmuş Fındık, Sıcak Baharatlar, Krema',
    accentColor: '#8C674B',
    accentBg: '#1A120E',
    description: 'Düşük ısıda pastörize ipeksi süt ile dengelenmiş çift shot artisanal espresso.'
  }
]

export default function OrderPage() {
  const store = useStore()
  const initialCoffeeId = store?.selectedCoffeeId || 'caffe-espresso-chilled'
  const addOrder = store?.addOrder || (() => {})

  // MULTI-STEP STATE: 1: Seçim, 2: Teslimat, 3: Ödeme, 4: Başarılı
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Coffee & Quantity
  const [selectedId, setSelectedId] = useState(initialCoffeeId)
  const [quantity, setQuantity] = useState(1)

  // Step 2: Personal & Location Details
  const [fullName, setFullName] = useState('')
  const [rawPhone, setRawPhone] = useState('') // exactly max 10 digits after leading '0'
  const [address, setAddress] = useState('')
  const [courierNotes, setCourierNotes] = useState('') // Dedicated text field: "Zili çalmayın", "Kapıya bırakın"

  // Step 3: Payment Method & Details
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'door'
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [showCvv, setShowCvv] = useState(false) // Toggle eye icon for CVV

  // Step 3: Mandatory KVKK
  const [kvkkAccepted, setKvkkAccepted] = useState(false)

  // Step 4: Final Confirmation
  const [orderReceipt, setOrderReceipt] = useState(null)
  const [locating, setLocating] = useState(false)

  const selectedCoffee = COFFEE_MENU.find((c) => c.id === selectedId) || COFFEE_MENU[0]
  const subtotal = selectedCoffee.price * quantity
  const shippingFee = 0 // Ücretsiz soğuk zincir teslimatı
  const total = subtotal + shippingFee

  // ------------------------------------------------------------------
  // PHONE FORMATTING: Pre-filled "0", exactly 10 digits allowed after 0
  // Format: 0 (5XX) XXX XX XX
  // ------------------------------------------------------------------
  const handlePhoneChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '')
    if (!digits) {
      setRawPhone('')
      return
    }
    if (digits.startsWith('0')) {
      digits = digits.slice(1)
    }
    // strictly limit to 10 digits following the leading 0
    setRawPhone(digits.slice(0, 10))
  }

  const getFormattedPhone = () => {
    let out = '0'
    if (rawPhone.length > 0) {
      out += ' (' + rawPhone.slice(0, 3)
    }
    if (rawPhone.length >= 3) {
      out += ') ' + rawPhone.slice(3, 6)
    }
    if (rawPhone.length >= 6) {
      out += ' ' + rawPhone.slice(6, 8)
    }
    if (rawPhone.length >= 8) {
      out += ' ' + rawPhone.slice(8, 10)
    }
    return out
  }

  const handleQuickNeighborhood = (hood) => {
    setAddress((prev) => (prev ? `${prev}, ${hood}` : `${hood}, İstanbul`))
  }

  const handleGetLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setAddress((prev) => (prev ? prev : 'Bebek / Beşiktaş, İstanbul'))
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        setAddress((prev) => (prev ? `${prev} (GPS: ${coords})` : `Mevcut Konum [${coords}] — Beşiktaş / İstanbul`))
        setLocating(false)
      },
      () => {
        setAddress((prev) => (prev ? prev : 'Bebek Mah. Cevdetpaşa Cad. Beşiktaş / İstanbul'))
        setLocating(false)
      },
      { timeout: 5000 }
    )
  }

  // Card validation
  const isCardComplete = () => {
    if (paymentMethod === 'door') return true
    return (
      cardHolder.trim().length >= 3 &&
      cardNumber.replace(/\s/g, '').length >= 15 &&
      cardExpiry.trim().length >= 4 &&
      cardCvv.trim().length >= 3
    )
  }

  // Final submit handler
  const handleFinalSubmit = (e) => {
    e.preventDefault()
    if (!kvkkAccepted || !isCardComplete()) return

    // Unique order tracking number format: #AER-88421
    const trackingNumber = `#AER-${Math.floor(10000 + Math.random() * 90000)}`
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const paymentLabel = paymentMethod === 'card'
      ? `Kredi Kartı (Online — **** ${cardNumber.replace(/\s/g, '').slice(-4) || '7841'})`
      : 'Kapıda Ödeme (Nakit / Temassız Kart)'

    const newOrder = {
      id: trackingNumber,
      name: fullName.trim(),
      phone: getFormattedPhone(),
      location: address.trim(),
      coffeeId: selectedCoffee.id,
      coffeeName: `${selectedCoffee.code} // ${selectedCoffee.name} (${selectedCoffee.volume})`,
      quantity,
      unitPrice: selectedCoffee.price,
      totalPrice: total,
      paymentMethod: paymentLabel,
      notes: courierNotes.trim(),
      status: 'Hazırlanıyor',
      createdAt
    }

    // Save to Zustand
    try {
      addOrder(newOrder)
    } catch (err) {
      console.warn('Zustand save failed:', err)
    }

    // Safe direct localStorage persistence for Admin Panel
    try {
      const raw = localStorage.getItem('aether_orders')
      const list = raw ? JSON.parse(raw) : []
      list.unshift(newOrder)
      localStorage.setItem('aether_orders', JSON.stringify(list))

      const resRaw = localStorage.getItem('aether_reservations')
      const resList = resRaw ? JSON.parse(resRaw) : []
      resList.unshift({
        id: newOrder.id,
        name: newOrder.name,
        email: newOrder.phone,
        phone: newOrder.phone,
        edition: `${newOrder.coffeeName} (${newOrder.quantity} Adet)`,
        guests: `${newOrder.totalPrice} ₺`,
        paymentMethod: newOrder.paymentMethod,
        date: newOrder.createdAt.slice(0, 10),
        time: newOrder.createdAt.slice(11),
        notes: `Ödeme: ${newOrder.paymentMethod} // Adres: ${newOrder.location} // Kurye Notu: ${newOrder.notes || 'Yok'}`,
        status: newOrder.status,
        createdAt: newOrder.createdAt
      })
      localStorage.setItem('aether_reservations', JSON.stringify(resList))
    } catch (err) {
      console.warn('LocalStorage save error:', err)
    }

    setOrderReceipt(newOrder)
    setCurrentStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#F4F0EB] text-[#2C1D18] font-sans selection:bg-[#2C1D18] selection:text-[#F4F0EB]">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP DEDICATED HEADER NAVBAR (Solid Opaque #EFECE6)               */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 bg-[#EFECE6] border-b border-[#2C1D18]/10 shadow-sm py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-[#2C1D18] flex items-center justify-center font-display text-xs text-[#2C1D18] font-bold group-hover:bg-[#2C1D18] group-hover:text-[#F4F0EB] transition-colors">
              Æ
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-[0.25em] text-sm font-extrabold text-[#2C1D18]">
                AETHER
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#8C674B] font-semibold -mt-0.5">
                CHECKOUT SYSTEM
              </span>
            </div>
          </a>

          <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
            <a
              href="#kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[#2C1D18]/70 hover:text-[#2C1D18] uppercase tracking-wider transition-colors"
            >
              <ShieldCheck size={14} className="text-[#8C674B]" />
              <span>KVKK Metni ↗</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2C1D18] hover:bg-[#2C1D18] hover:text-[#F4F0EB] text-xs font-mono uppercase tracking-[0.15em] font-semibold transition-all shadow-sm"
            >
              <ArrowLeft size={13} />
              <span>Ana Sayfa</span>
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN CHECKOUT CONTAINER                                         */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Apple-Tier Step Indicator Bar (Visible on Steps 1, 2, 3) */}
        {currentStep < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-xl mx-auto font-mono text-xs uppercase tracking-wider">
              {[
                { step: 1, label: '01 Seçim' },
                { step: 2, label: '02 Teslimat' },
                { step: 3, label: '03 Ödeme' }
              ].map((item, idx) => (
                <div key={item.step} className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (item.step < currentStep) setCurrentStep(item.step)
                    }}
                    disabled={item.step > currentStep}
                    className={`flex items-center gap-2 font-bold transition-all ${
                      currentStep === item.step
                        ? 'text-[#2C1D18]'
                        : item.step < currentStep
                        ? 'text-[#8C674B] cursor-pointer hover:text-[#2C1D18]'
                        : 'text-[#2C1D18]/30 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        currentStep === item.step
                          ? 'bg-[#2C1D18] text-[#F4F0EB]'
                          : item.step < currentStep
                          ? 'bg-[#8C674B] text-[#F4F0EB]'
                          : 'border border-[#2C1D18]/20 text-[#2C1D18]/40'
                      }`}
                    >
                      {item.step < currentStep ? <Check size={11} /> : item.step}
                    </span>
                    <span>{item.label}</span>
                  </button>
                  {idx < 2 && <ChevronRight size={14} className="text-[#2C1D18]/25" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 1: COFFEE SELECTION WITH PRODUCT VISUALS                      */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold">
                ADIM 01 // VARYETE SEÇİMİ
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#2C1D18]">
                Kahvenizi Belirleyin
              </h1>
              <p className="text-xs text-[#2C1D18]/70 leading-relaxed font-normal">
                Sub-zero damıtılmış zanaat espresso varyetelerimizden dilediğinizi seçiniz.
              </p>
            </div>

            {/* Product Visual Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COFFEE_MENU.map((coffee) => {
                const isSelected = coffee.id === selectedId
                return (
                  <div
                    key={coffee.id}
                    onClick={() => setSelectedId(coffee.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-[#2C1D18] bg-[#EFECE6] shadow-lg ring-2 ring-[#2C1D18]'
                        : 'border-[#2C1D18]/15 bg-[#EFECE6]/50 hover:bg-[#EFECE6]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Product Preview Artwork Medallion */}
                      <div
                        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-[#F4F0EB] shadow-md shrink-0 border border-white/20"
                        style={{ backgroundColor: coffee.accentBg }}
                      >
                        <span className="font-display text-xs font-bold" style={{ color: coffee.accentColor }}>
                          Æ
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider font-semibold">
                          {coffee.code}
                        </span>
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-base font-bold text-[#2C1D18]">
                            {coffee.name}
                          </span>
                          <span className="font-mono text-sm font-bold text-[#2C1D18]">
                            {coffee.price} ₺
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8C674B] font-semibold">
                          <span>{coffee.volume}</span>
                          <span>·</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#2C1D18]/5 border border-[#2C1D18]/10 text-[#2C1D18]/70">
                            {coffee.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#2C1D18]/75 leading-relaxed pt-1">
                          {coffee.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#2C1D18]/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#2C1D18]/60 text-[11px] truncate max-w-[280px]">
                        Notalar: <strong className="text-[#2C1D18]">{coffee.notes}</strong>
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isSelected ? 'bg-[#2C1D18] text-[#F4F0EB]' : 'text-[#2C1D18]/40'
                      }`}>
                        {isSelected ? 'Seçildi ✓' : 'Seç'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stepper & Bottom Action Bar */}
            <div className="p-6 rounded-3xl bg-[#EFECE6] border border-[#2C1D18]/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#2C1D18]/70 uppercase font-semibold">
                  Sipariş Miktarı:
                </span>
                <div className="flex items-center border border-[#2C1D18]/25 rounded-xl overflow-hidden bg-[#F4F0EB]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#2C1D18] hover:bg-[#2C1D18]/10 transition-colors cursor-pointer"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-bold text-[#2C1D18]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(24, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#2C1D18] hover:bg-[#2C1D18]/10 transition-colors cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className="text-xs font-mono text-[#8C674B]">
                  ({quantity} Adet × {selectedCoffee.price} ₺ = <strong>{total} ₺</strong>)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="px-8 py-3.5 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Devam Et</span>
                <ArrowRight size={14} className="text-[#C89D7C]" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 2: PERSONAL DETAILS & DELIVERY LOCATION                       */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold">
                ADIM 02 // TESLİMAT KOORDİNASYONU
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#2C1D18]">
                Teslimat Bilgileri
              </h1>
              <p className="text-xs text-[#2C1D18]/70 leading-relaxed font-normal">
                Kuryemizin sub-zero termal çantanızı ulaştırması için bilgilerinizi giriniz.
              </p>
            </div>

            <div className="p-6 sm:p-10 rounded-3xl bg-[#EFECE6] border border-[#2C1D18]/15 shadow-sm space-y-6">
              {/* Phone with Auto "0", strictly 10 digits after 0 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase font-semibold">
                    Telefon Numarası *
                  </label>
                  <span className="text-[10px] font-mono text-[#8C674B]">
                    Format: 0 (5XX) XXX XX XX ({rawPhone.length}/10)
                  </span>
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                  <input
                    type="tel"
                    required
                    value={getFormattedPhone()}
                    onChange={handlePhoneChange}
                    placeholder="0 (5XX) XXX XX XX"
                    className="w-full pl-10 pr-4 py-3 text-sm font-mono rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] font-bold tracking-wider transition-all"
                  />
                </div>
                {rawPhone.length > 0 && rawPhone.length < 10 && (
                  <p className="text-[10px] font-mono text-amber-700 mt-1">
                    Lütfen 10 haneli cep telefonu numaranızı tamamlayınız ({10 - rawPhone.length} hane kaldı).
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase font-semibold mb-1.5">
                  İsim Soyisim *
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Örn: Deniz Altan"
                    className="w-full pl-10 pr-4 py-3 text-sm font-medium rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase font-semibold">
                    Teslimat Adresi *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-[10px] font-mono text-[#8C674B] hover:text-[#2C1D18] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    <Navigation size={11} className={locating ? 'animate-spin' : ''} />
                    <span>{locating ? 'Konum Alınıyor...' : 'Mevcut Konumu Kullan'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mahalle, Cadde/Sokak, Bina No, Daire, İlçe/Şehir..."
                  className="w-full px-4 py-3 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all resize-none leading-relaxed"
                />

                <div className="flex items-center gap-1.5 flex-wrap pt-2 text-[10px] font-mono">
                  <span className="text-[#2C1D18]/50">Hızlı Semt Ekle:</span>
                  {['Bebek', 'Etiler', 'Nişantaşı', 'Levent', 'Moda / Kadıköy'].map((hood) => (
                    <button
                      key={hood}
                      type="button"
                      onClick={() => handleQuickNeighborhood(hood)}
                      className="px-2.5 py-1 rounded-full border border-[#2C1D18]/15 bg-[#F4F0EB] hover:bg-[#2C1D18] hover:text-[#F4F0EB] text-[#2C1D18]/80 transition-all cursor-pointer"
                    >
                      +{hood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedicated Courier Instructions Field ("Kuryeye Not") */}
              <div>
                <label className="block text-[11px] font-mono tracking-wider text-[#2C1D18]/70 uppercase font-semibold mb-1.5">
                  Kuryeye Not (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={courierNotes}
                  onChange={(e) => setCourierNotes(e.target.value)}
                  placeholder='Örn: "Zili çalmayın", "Kapıya bırakın", "Arayıp haber verin"...'
                  className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                />
              </div>

              {/* Step 2 Action Buttons */}
              <div className="pt-4 border-t border-[#2C1D18]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="px-6 py-3 rounded-full border border-[#2C1D18]/25 text-xs font-mono uppercase tracking-wider font-semibold hover:border-[#2C1D18] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Geri</span>
                </button>

                <button
                  type="button"
                  disabled={!fullName.trim() || rawPhone.length < 10 || !address.trim()}
                  onClick={() => {
                    setCurrentStep(3)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`px-8 py-3.5 rounded-full border border-[#2C1D18] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-md flex items-center gap-2 ${
                    fullName.trim() && rawPhone.length === 10 && address.trim()
                      ? 'bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] cursor-pointer'
                      : 'bg-[#2C1D18]/40 text-[#F4F0EB]/60 cursor-not-allowed border-[#2C1D18]/30'
                  }`}
                >
                  <span>Devam Et</span>
                  <ArrowRight size={14} className="text-[#C89D7C]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 3: PAYMENT & CHECKOUT                                         */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold">
                ADIM 03 // ÖDEME & DOĞRULAMA
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#2C1D18]">
                Ödeme Yöntemi
              </h1>
              <p className="text-xs text-[#2C1D18]/70 leading-relaxed font-normal">
                Online 3D Secure kart ödemesi veya kapıda temassız/nakit ödeme seçebilirsiniz.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="p-6 sm:p-10 rounded-3xl bg-[#EFECE6] border border-[#2C1D18]/15 shadow-sm space-y-6">
                {/* Method Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'card'
                        ? 'border-[#2C1D18] bg-[#F4F0EB] shadow-sm ring-1 ring-[#2C1D18]'
                        : 'border-[#2C1D18]/15 bg-[#F4F0EB]/50 hover:bg-[#F4F0EB]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className={paymentMethod === 'card' ? 'text-[#8C674B]' : 'text-[#2C1D18]/50'} />
                        <span className="font-display text-xs font-bold text-[#2C1D18]">
                          Kredi / Banka Kartı
                        </span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-[#2C1D18] bg-[#2C1D18]' : 'border-[#2C1D18]/30'
                      }`}>
                        {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-[#F4F0EB]" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-[#2C1D18]/70 leading-relaxed">
                      3D Secure güvenli altyapı. Visa, Mastercard, Troy desteklenir.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('door')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === 'door'
                        ? 'border-[#2C1D18] bg-[#F4F0EB] shadow-sm ring-1 ring-[#2C1D18]'
                        : 'border-[#2C1D18]/15 bg-[#F4F0EB]/50 hover:bg-[#F4F0EB]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Banknote size={16} className={paymentMethod === 'door' ? 'text-[#8C674B]' : 'text-[#2C1D18]/50'} />
                        <span className="font-display text-xs font-bold text-[#2C1D18]">
                          Kapıda Ödeme
                        </span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'door' ? 'border-[#2C1D18] bg-[#2C1D18]' : 'border-[#2C1D18]/30'
                      }`}>
                        {paymentMethod === 'door' && <div className="w-1.5 h-1.5 rounded-full bg-[#F4F0EB]" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-[#2C1D18]/70 leading-relaxed">
                      Teslimat anında nakit veya kurye POS cihazıyla temassız ödeme.
                    </p>
                  </div>
                </div>

                {/* Credit Card Inputs */}
                {paymentMethod === 'card' && (
                  <div className="p-5 rounded-2xl border border-[#2C1D18]/15 bg-[#F4F0EB] space-y-4">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#2C1D18]/10 text-[10px] font-mono text-[#8C674B] uppercase font-bold">
                      <span>Kart Bilgileri</span>
                      <span className="text-[#006241] flex items-center gap-1 font-semibold">
                        <Lock size={11} />
                        <span>256-Bit SSL 3D Secure</span>
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1">
                        Kart Üzerindeki İsim *
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="Örn: DENİZ ALTAN"
                        className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-wider uppercase transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1">
                        Kart Numarası *
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                          const formatted = v.match(/.{1,4}/g)?.join(' ') || v
                          setCardNumber(formatted)
                        }}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-widest font-semibold transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1">
                          Son Kullanma (AA/YY) *
                        </label>
                        <input
                          type="text"
                          required={paymentMethod === 'card'}
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                            if (v.length >= 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
                            setCardExpiry(v)
                          }}
                          placeholder="12/28"
                          className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-wider text-center font-semibold transition-all"
                        />
                      </div>

                      {/* CVV with Toggle Eye Icon */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase">
                            CVV Kodu *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="text-[10px] font-mono text-[#8C674B] hover:text-[#2C1D18] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {showCvv ? <EyeOff size={12} /> : <Eye size={12} />}
                            <span>{showCvv ? 'Gizle' : 'Göster'}</span>
                          </button>
                        </div>
                        <input
                          type={showCvv ? 'text' : 'password'}
                          required={paymentMethod === 'card'}
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-widest text-center font-semibold transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mandatory KVKK Checkbox */}
                <div className="p-4 rounded-2xl bg-[#F4F0EB] border border-[#2C1D18]/10 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      id="step3-kvkk-check"
                      type="checkbox"
                      required
                      checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#2C1D18]/30 text-[#006241] focus:ring-[#006241] cursor-pointer"
                    />
                    <label htmlFor="step3-kvkk-check" className="text-xs text-[#2C1D18]/80 leading-relaxed cursor-pointer">
                      <span>6698 Sayılı </span>
                      <a
                        href="#kvkk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#8C674B] underline underline-offset-2 hover:text-[#2C1D18] transition-colors"
                      >
                        KVKK Aydınlatma Metni'ni
                      </a>
                      <span> okudum ve onaylıyorum. Kişisel verilerimin sipariş hazırlığı, soğuk zincir teslimatı ve faturalandırma süreçleri kapsamında işlenmesine açık rıza veriyorum. *</span>
                    </label>
                  </div>
                </div>

                {/* Order Summary Recap Strip */}
                <div className="p-4 rounded-2xl bg-[#F4F0EB] border border-[#2C1D18]/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[#2C1D18]/60">Ödenecek Toplam Tutar:</span>
                    <div className="font-display text-lg font-bold text-[#2C1D18]">{total} ₺</div>
                  </div>
                  <span className="text-[11px] text-[#006241] font-semibold">
                    Ücretsiz Kurye Teslimatı
                  </span>
                </div>

                {/* Step 3 Action Buttons */}
                <div className="pt-2 border-t border-[#2C1D18]/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="px-6 py-3 rounded-full border border-[#2C1D18]/25 text-xs font-mono uppercase tracking-wider font-semibold hover:border-[#2C1D18] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Geri</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!kvkkAccepted || !isCardComplete()}
                    className={`px-8 py-3.5 rounded-full border border-[#2C1D18] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-md flex items-center gap-2 ${
                      kvkkAccepted && isCardComplete()
                        ? 'bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] cursor-pointer'
                        : 'bg-[#2C1D18]/40 text-[#F4F0EB]/60 cursor-not-allowed border-[#2C1D18]/30'
                    }`}
                  >
                    <span>Siparişi Tamamla</span>
                    <Sparkles size={14} className="text-[#C89D7C]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STEP 4: ORDER SUCCESS & TRACKING NUMBER (#AER-XXXXX)               */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 4 && (
          <div className="max-w-xl mx-auto py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-[#006241]/10 text-[#006241] flex items-center justify-center mx-auto mb-4 border border-[#006241]/25">
              <CheckCircle2 size={40} />
            </div>

            <div className="text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold">
              SİPARİŞİNİZ ALINDI // HAZIRLANIYOR
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#2C1D18]">
              Siparişiniz Yola Çıkmaya Hazır
            </h2>

            <p className="text-sm text-[#2C1D18]/75 max-w-md mx-auto leading-relaxed">
              Sayın <strong className="text-[#2C1D18]">{orderReceipt?.name}</strong>, siparişiniz sub-zero soğuk zincir termal ambalajında hazırlanmaktadır. Kuryemiz yola çıktığında telefonunuza SMS ile bilgilendirme yapılacaktır.
            </p>

            {/* Receipt Dossier Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#2C1D18]/15 bg-[#EFECE6] text-left space-y-3 text-xs font-mono shadow-sm">
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2.5">
                <span className="text-[#2C1D18]/60 uppercase">Takip Numarası</span>
                <span className="font-bold text-[#8C674B] text-base">{orderReceipt?.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2.5">
                <span className="text-[#2C1D18]/60 uppercase">Ürün & Adet</span>
                <span className="text-[#2C1D18] font-semibold text-right truncate ml-4">
                  {orderReceipt?.coffeeName} × {orderReceipt?.quantity}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2.5">
                <span className="text-[#2C1D18]/60 uppercase">Telefon</span>
                <span className="text-[#2C1D18] font-semibold text-right">
                  {orderReceipt?.phone}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2.5">
                <span className="text-[#2C1D18]/60 uppercase">Ödeme Yöntemi</span>
                <span className="font-bold text-[#2C1D18] text-right truncate ml-4">
                  {orderReceipt?.paymentMethod}
                </span>
              </div>
              {orderReceipt?.notes && (
                <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2.5">
                  <span className="text-[#2C1D18]/60 uppercase">Kurye Notu</span>
                  <span className="text-[#8C674B] font-semibold text-right truncate ml-4">
                    "{orderReceipt?.notes}"
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2.5">
                <span className="text-[#2C1D18]/60 uppercase">Toplam Tutar</span>
                <span className="font-bold text-[#2C1D18] text-base">{orderReceipt?.totalPrice} ₺</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#2C1D18]/60 uppercase">Teslimat Adresi</span>
                <span className="text-[#2C1D18] text-right truncate ml-4 max-w-[240px]">
                  {orderReceipt?.location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <a
                href="#"
                className="px-8 py-3.5 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-md"
              >
                Ana Sayfaya Dön
              </a>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1)
                  setOrderReceipt(null)
                  setQuantity(1)
                  setFullName('')
                  setRawPhone('')
                  setAddress('')
                  setCourierNotes('')
                  setCardHolder('')
                  setCardNumber('')
                  setCardExpiry('')
                  setCardCvv('')
                  setKvkkAccepted(false)
                }}
                className="px-6 py-3.5 rounded-full border border-[#2C1D18]/20 bg-[#EFECE6] hover:bg-[#2C1D18]/5 text-[#2C1D18] text-xs font-mono tracking-[0.15em] uppercase font-semibold transition-all cursor-pointer"
              >
                Yeni Sipariş Ver
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* 3. DEDICATED FOOTER (Zero Public Admin Links)                       */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-[#2C1D18]/15 bg-[#EFECE6] py-10 px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#2C1D18]/70">
          <div>
            © 2026 AETHER ESPRESSO LABS SAN. VE TİC. A.Ş. TÜM HAKLARI SAKLIDIR.
          </div>
          <div className="flex items-center gap-6">
            <a href="#kvkk" target="_blank" rel="noopener noreferrer" className="hover:text-[#2C1D18] underline transition-colors">
              KVKK Aydınlatma Metni ↗
            </a>
            <a href="#kvkk" target="_blank" rel="noopener noreferrer" className="hover:text-[#2C1D18] transition-colors">
              Gizlilik Politikası
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
