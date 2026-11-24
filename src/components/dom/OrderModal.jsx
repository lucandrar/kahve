import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, ShoppingBag, MapPin, Phone, User, Plus, Minus, ArrowUpRight, Sparkles, ShieldCheck, CreditCard, Banknote, Lock, Navigation } from 'lucide-react'
import { useStore } from '../../store/useStore'

const COFFEE_MENU = [
  {
    id: 'caffe-espresso-chilled',
    code: '01',
    name: 'Caffè Espresso Chilled',
    volume: '220 ml',
    price: 185,
    notes: 'Karamel, Kakao, Fındık'
  },
  {
    id: 'sub-zero-cold-brew',
    code: '02',
    name: 'Sub-Zero Cold Brew',
    volume: '220 ml',
    price: 195,
    notes: 'Bitter Çikolata, Esmer Şeker, Vanilya'
  },
  {
    id: 'yirgacheffe-single-origin',
    code: '03',
    name: 'Yirgacheffe Single Origin',
    volume: '220 ml',
    price: 220,
    notes: 'Yabani Yasemin, Calabria Bergamotu'
  },
  {
    id: 'antigua-volcanic-geisha',
    code: '04',
    name: 'Antigua Volcanic Geisha',
    volume: '220 ml',
    price: 260,
    notes: 'Dağ Çiçeği Balı, Kakao, Limon'
  },
  {
    id: 'velvet-cortado-chilled',
    code: '05',
    name: 'Velvet Cortado Chilled',
    volume: '200 ml',
    price: 190,
    notes: 'Kavrulmuş Fındık, Sıcak Baharatlar'
  }
]

export default function OrderModal() {
  const store = useStore()
  const isOrderOpen = Boolean(store?.isOrderOpen)
  const setOrderOpen = store?.setOrderOpen || (() => {})
  const addOrder = store?.addOrder || (() => {})
  const selectedCoffeeId = store?.selectedCoffeeId || 'caffe-espresso-chilled'

  // Step 1: Coffee & Quantity
  const [selectedId, setSelectedId] = useState(selectedCoffeeId)
  const [quantity, setQuantity] = useState(1)

  // Step 2: Customer Details
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  // Step 3: Payment Method ('card' | 'door')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // Step 4: KVKK Consent
  const [kvkkAccepted, setKvkkAccepted] = useState(false)

  // Feedback states
  const [locating, setLocating] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderReceipt, setOrderReceipt] = useState(null)

  // Sync initial selection
  useEffect(() => {
    if (selectedCoffeeId && COFFEE_MENU.some((c) => c.id === selectedCoffeeId)) {
      setSelectedId(selectedCoffeeId)
    }
  }, [selectedCoffeeId])

  // ESC key listener
  useEffect(() => {
    if (!isOrderOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOrderOpen])

  if (!isOrderOpen) return null

  const selectedCoffee = COFFEE_MENU.find((c) => c.id === selectedId) || COFFEE_MENU[0]
  const totalPrice = (selectedCoffee?.price || 185) * (quantity || 1)

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

  const isCardComplete = () => {
    if (paymentMethod === 'door') return true
    return (
      cardHolder.trim().length >= 3 &&
      cardNumber.replace(/\s/g, '').length >= 15 &&
      cardExpiry.trim().length >= 4 &&
      cardCvv.trim().length >= 3
    )
  }

  const isSubmitReady = () => {
    return (
      fullName.trim().length >= 2 &&
      phone.trim().length >= 8 &&
      address.trim().length >= 5 &&
      kvkkAccepted &&
      isCardComplete()
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isSubmitReady()) return

    const orderId = `AETH-SIP-2026-${Math.floor(100 + Math.random() * 900)}`
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const paymentLabel = paymentMethod === 'card'
      ? `Kredi Kartı (Online — **** ${cardNumber.replace(/\s/g, '').slice(-4) || '7841'})`
      : 'Kapıda Ödeme (Nakit / Temassız Kart)'

    const newOrder = {
      id: orderId,
      name: fullName.trim(),
      phone: phone.trim(),
      location: address.trim(),
      coffeeId: selectedCoffee.id,
      coffeeName: `${selectedCoffee.code} // ${selectedCoffee.name} (${selectedCoffee.volume})`,
      quantity: quantity || 1,
      unitPrice: selectedCoffee.price,
      totalPrice,
      paymentMethod: paymentLabel,
      notes: notes.trim(),
      status: 'Hazırlanıyor',
      createdAt
    }

    // Save to Zustand
    try {
      addOrder(newOrder)
    } catch (err) {
      console.warn('Zustand addOrder error:', err)
    }

    // Direct safe localStorage backup for Admin Panel
    try {
      const raw = localStorage.getItem('aether_orders')
      const list = raw ? JSON.parse(raw) : []
      list.unshift(newOrder)
      localStorage.setItem('aether_orders', JSON.stringify(list))

      // Also sync to aether_reservations for backwards compatibility
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
        notes: `Ödeme: ${newOrder.paymentMethod} // Adres: ${newOrder.location} // ${newOrder.notes || 'Not yok'}`,
        status: newOrder.status,
        createdAt: newOrder.createdAt
      })
      localStorage.setItem('aether_reservations', JSON.stringify(resList))
    } catch (err) {
      console.warn('LocalStorage save error:', err)
    }

    setOrderReceipt(newOrder)
    setIsSubmitted(true)
  }

  const handleClose = () => {
    setOrderOpen(false)
    setTimeout(() => {
      setIsSubmitted(false)
      setOrderReceipt(null)
      setQuantity(1)
      setFullName('')
      setPhone('')
      setAddress('')
      setNotes('')
      setCardHolder('')
      setCardNumber('')
      setCardExpiry('')
      setCardCvv('')
      setPaymentMethod('card')
      setKvkkAccepted(false)
    }, 250)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 pointer-events-auto">
      {/* Background Dimmer click-to-close */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Solid Opaque Cream Card Container */}
      <div className="relative w-full max-w-xl bg-[#EFECE6] text-[#2C1D18] rounded-3xl p-6 sm:p-8 border border-[#2C1D18]/15 shadow-2xl max-h-[90vh] overflow-y-auto z-10 my-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[#2C1D18]/15 flex items-center justify-center text-[#2C1D18]/70 hover:text-[#2C1D18] hover:border-[#2C1D18] transition-colors bg-[#F4F0EB] shadow-sm z-20 cursor-pointer"
        >
          <X size={16} />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006241]" />
                <span>ARTISANAL EXPRESS // SOĞUK ZİNCİR</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C1D18]">
                Sipariş Oluştur
              </h2>
              <p className="text-xs text-[#2C1D18]/70 mt-1 leading-relaxed">
                Taze sub-zero damıtılmış espresso edisyonunuzu kapınıza sipariş edin.
              </p>
            </div>

            {/* 1. COFFEE SELECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-wider font-bold uppercase text-[#2C1D18] flex items-center gap-2">
                  <ShoppingBag size={14} className="text-[#8C674B]" />
                  <span>1. Kahve Seçimi</span>
                </span>
                <span className="text-[11px] font-mono text-[#8C674B]">
                  {selectedCoffee?.volume || '220 ml'}
                </span>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COFFEE_MENU.map((coffee) => {
                  const isSelected = coffee.id === selectedId
                  return (
                    <div
                      key={coffee.id}
                      onClick={() => setSelectedId(coffee.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2C1D18] bg-[#F4F0EB] shadow-sm ring-1 ring-[#2C1D18]'
                          : 'border-[#2C1D18]/15 bg-[#F4F0EB]/60 hover:bg-[#F4F0EB]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#8C674B]">
                            {coffee.code}
                          </span>
                          <span className="font-display text-xs font-bold text-[#2C1D18]">
                            {coffee.name}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#2C1D18] shrink-0">
                          {coffee.price} ₺
                        </span>
                      </div>
                      <div className="text-[10px] text-[#2C1D18]/65 mt-1 line-clamp-1">
                        {coffee.notes}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Stepper & Total */}
              <div className="p-3 rounded-2xl bg-[#F4F0EB] border border-[#2C1D18]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#2C1D18]/70 uppercase font-semibold">
                    Adet:
                  </span>
                  <div className="flex items-center border border-[#2C1D18]/20 rounded-xl overflow-hidden bg-[#EFECE6]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#2C1D18] hover:bg-[#2C1D18]/10 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-bold text-[#2C1D18]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(24, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#2C1D18] hover:bg-[#2C1D18]/10 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#2C1D18]/60 uppercase block">
                    Toplam Tutar
                  </span>
                  <span className="font-display text-lg font-bold text-[#2C1D18]">
                    {totalPrice} ₺
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CUSTOMER DETAILS */}
            <div className="space-y-3 pt-2 border-t border-[#2C1D18]/10">
              <span className="text-xs font-mono tracking-wider font-bold uppercase text-[#2C1D18] flex items-center gap-2">
                <MapPin size={14} className="text-[#8C674B]" />
                <span>2. İletişim & Teslimat Bilgileri</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1">
                    İsim Soyisim *
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Örn: Deniz Altan"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-1">
                    Telefon Numarası *
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1D18]/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 532 000 00 00"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase">
                    Konum / Teslimat Adresi *
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
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mahalle, Cadde/Sokak, Bina No, Daire, İlçe/Şehir..."
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-[#2C1D18]/15 bg-[#F4F0EB] focus:bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] transition-all resize-none"
                />

                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-mono">
                  <span className="text-[#2C1D18]/50">Hızlı Ekle:</span>
                  {['Bebek', 'Etiler', 'Nişantaşı', 'Levent', 'Moda / Kadıköy'].map((hood) => (
                    <button
                      key={hood}
                      type="button"
                      onClick={() => handleQuickNeighborhood(hood)}
                      className="px-2 py-0.5 rounded-full border border-[#2C1D18]/15 bg-[#F4F0EB] hover:bg-[#2C1D18] hover:text-[#F4F0EB] text-[#2C1D18]/80 transition-all cursor-pointer"
                    >
                      +{hood}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. PAYMENT METHOD */}
            <div className="space-y-3 pt-2 border-t border-[#2C1D18]/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-wider font-bold uppercase text-[#2C1D18] flex items-center gap-2">
                  <CreditCard size={14} className="text-[#8C674B]" />
                  <span>3. Ödeme Yöntemi</span>
                </span>
                <span className="text-[10px] font-mono text-[#006241] flex items-center gap-1 font-semibold">
                  <Lock size={11} />
                  <span>256-Bit SSL Güvenli</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Online Card Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? 'border-[#2C1D18] bg-[#F4F0EB] shadow-sm ring-1 ring-[#2C1D18]'
                      : 'border-[#2C1D18]/15 bg-[#F4F0EB]/60 hover:bg-[#F4F0EB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={15} className={paymentMethod === 'card' ? 'text-[#8C674B]' : 'text-[#2C1D18]/50'} />
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
                  <p className="text-[10px] text-[#2C1D18]/65">
                    Online 3D Secure güvenli ödeme (Visa, Mastercard, Troy).
                  </p>
                </div>

                {/* Door Option */}
                <div
                  onClick={() => setPaymentMethod('door')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'door'
                      ? 'border-[#2C1D18] bg-[#F4F0EB] shadow-sm ring-1 ring-[#2C1D18]'
                      : 'border-[#2C1D18]/15 bg-[#F4F0EB]/60 hover:bg-[#F4F0EB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={15} className={paymentMethod === 'door' ? 'text-[#8C674B]' : 'text-[#2C1D18]/50'} />
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
                  <p className="text-[10px] text-[#2C1D18]/65">
                    Teslimat anında nakit veya kurye POS cihazıyla temassız.
                  </p>
                </div>
              </div>

              {/* Credit Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-3.5 rounded-2xl border border-[#2C1D18]/15 bg-[#F4F0EB] space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#2C1D18]/10 text-[10px] font-mono text-[#8C674B] uppercase font-bold">
                    <span>Kart Bilgileri</span>
                    <span className="text-[#2C1D18]/50">3D Secure Doğrulama</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-0.5">
                      Kart Üzerindeki İsim *
                    </label>
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="Örn: DENİZ ALTAN"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-wider uppercase transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-0.5">
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
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-widest font-semibold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-0.5">
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
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-wider text-center font-semibold transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider text-[#2C1D18]/70 uppercase mb-0.5">
                        CVV / Güvenlik Kodu *
                      </label>
                      <input
                        type="password"
                        required={paymentMethod === 'card'}
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="•••"
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-[#2C1D18]/15 bg-white focus:border-[#2C1D18] outline-none text-[#2C1D18] tracking-widest text-center font-semibold transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. KVKK CONSENT */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#2C1D18]/10">
              <input
                id="order-kvkk-modal-check"
                type="checkbox"
                required
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#2C1D18]/30 text-[#006241] focus:ring-[#006241] cursor-pointer"
              />
              <label htmlFor="order-kvkk-modal-check" className="text-[11px] text-[#2C1D18]/80 leading-snug cursor-pointer">
                <span>6698 Sayılı </span>
                <a
                  href="/kvkk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#8C674B] underline underline-offset-2 hover:text-[#2C1D18] transition-colors"
                >
                  KVKK Aydınlatma Metni'ni
                </a>
                <span> okudum ve onaylıyorum. Kişisel verilerimin sipariş, soğuk zincir teslimatı ve ödeme süreçleri kapsamında işlenmesine rıza veriyorum. *</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-[#2C1D18]/10">
              <div className="text-xs font-mono text-[#2C1D18]/60">
                <span>Teslimat: </span>
                <strong className="text-[#2C1D18]">30–45 Dk</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-mono tracking-wider uppercase text-[#2C1D18]/70 hover:text-[#2C1D18] transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!isSubmitReady()}
                  className={`px-6 py-2.5 rounded-full border border-[#2C1D18] text-xs font-mono tracking-[0.15em] font-semibold uppercase transition-all shadow-md flex items-center gap-2 ${
                    isSubmitReady()
                      ? 'bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] cursor-pointer'
                      : 'bg-[#2C1D18]/40 text-[#F4F0EB]/60 cursor-not-allowed border-[#2C1D18]/30'
                  }`}
                >
                  <span>{paymentMethod === 'card' ? `Öde & Sipariş Ver (${totalPrice} ₺)` : `Siparişi Onayla (${totalPrice} ₺)`}</span>
                  <Sparkles size={13} className="text-[#C89D7C]" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#006241]/10 text-[#006241] flex items-center justify-center mx-auto mb-3 border border-[#006241]/20">
              <CheckCircle2 size={32} />
            </div>

            <div className="text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-semibold">
              SİPARİŞİNİZ ALINDI // HAZIRLANIYOR
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#2C1D18]">
              Afiyet Olsun!
            </h3>

            <p className="text-xs text-[#2C1D18]/70 max-w-sm mx-auto leading-relaxed">
              Sayın <strong className="text-[#2C1D18]">{orderReceipt?.name}</strong>, siparişiniz sub-zero korumalı soğuk zincir termal çantasında hazırlanarak kuryeye aktarılmaktadır.
            </p>

            <div className="p-4 rounded-2xl border border-[#2C1D18]/15 bg-[#F4F0EB] text-left max-w-sm mx-auto space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2">
                <span className="text-[#2C1D18]/60 uppercase">Takip Kodu</span>
                <span className="font-bold text-[#8C674B]">{orderReceipt?.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2">
                <span className="text-[#2C1D18]/60 uppercase">Ürün & Adet</span>
                <span className="text-[#2C1D18] font-semibold text-right truncate ml-2">
                  {orderReceipt?.coffeeName} × {orderReceipt?.quantity}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2">
                <span className="text-[#2C1D18]/60 uppercase">Ödeme</span>
                <span className="font-bold text-[#2C1D18] text-right truncate ml-2 text-[11px]">
                  {orderReceipt?.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#2C1D18]/10 pb-2">
                <span className="text-[#2C1D18]/60 uppercase">Toplam Tutar</span>
                <span className="font-bold text-[#2C1D18]">{orderReceipt?.totalPrice} ₺</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#2C1D18]/60 uppercase">Teslimat Adresi</span>
                <span className="text-[#2C1D18] text-right truncate ml-4 max-w-[190px]">
                  {orderReceipt?.location}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              type="button"
              className="px-8 py-3 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-md mt-4 cursor-pointer"
            >
              Tamamla
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
