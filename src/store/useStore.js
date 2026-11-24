import { create } from 'zustand'

// Decoupled lightweight scroll state for locked 60 FPS WebGL RAF loop
export const webglScrollState = {
  progress: 0,
  exploded: 0
}

export const ARTISAN_COFFEES = [
  {
    id: 'caffe-espresso-chilled',
    code: '01',
    name: 'Caffè Espresso Chilled',
    volume: '220 ml',
    price: 185,
    tag: 'İmza Edisyon',
    description: 'Sub-Zero Cryo damıtma, zengin krema ve karamelize çikolata gövdesi',
    notes: 'Karamel, Kakao, Fındık',
    accentColor: '#C89D7C'
  },
  {
    id: 'sub-zero-cold-brew',
    code: '02',
    name: 'Sub-Zero Cold Brew',
    volume: '220 ml',
    price: 195,
    tag: '18 Saat Damıtma',
    description: '-2°C sub-zero yavaş ekstraksiyon ile asiditesi yumuşatılmış ipeksi soğuk kahve',
    notes: 'Bitter Çikolata, Esmer Şeker, Vanilya',
    accentColor: '#8C674B'
  },
  {
    id: 'yirgacheffe-single-origin',
    code: '03',
    name: 'Yirgacheffe Single Origin',
    volume: '220 ml',
    price: 220,
    tag: 'Nadir Hasat Lot ETH-491',
    description: 'Etiyopya yüksek yaylalarından anaerobik fermantasyon, bergamot ve yasemin berraklığı',
    notes: 'Yabani Yasemin, Calabria Bergamotu, Şeftali',
    accentColor: '#006241'
  },
  {
    id: 'antigua-volcanic-geisha',
    code: '04',
    name: 'Antigua Volcanic Geisha',
    volume: '220 ml',
    price: 260,
    tag: 'Volkanik Lot GTM-492',
    description: 'Agua Yanardağı yamaçlarında yetişen Geisha varyetesi; bal peteği ve volkanik mineral zarafeti',
    notes: 'Dağ Çiçeği Balı, Kakao, Meyer Limonu',
    accentColor: '#B68862'
  },
  {
    id: 'velvet-cortado-chilled',
    code: '05',
    name: 'Velvet Cortado Chilled',
    volume: '200 ml',
    price: 190,
    tag: 'İpeksi Doku',
    description: 'Düşük ısıda pastorize ipeksi tam yağlı süt ile dengelenmiş çift shot artisanal espresso',
    notes: 'Kavrulmuş Fındık, Sıcak Baharatlar, Krema',
    accentColor: '#D4A882'
  }
]

const INITIAL_ORDERS = [
  {
    id: 'AETH-SIP-2026-881',
    name: 'Deniz Altan',
    phone: '+90 532 889 12 40',
    location: 'Bebek Mah. Cevdetpaşa Cad. No: 42 D: 5, Beşiktaş / İstanbul',
    coffeeId: 'caffe-espresso-chilled',
    coffeeName: '01 // Caffè Espresso Chilled (220ml)',
    quantity: 2,
    unitPrice: 185,
    totalPrice: 370,
    notes: 'Sub-zero soğuk zincir termal çantasında teslim edilsin.',
    status: 'Hazırlanıyor',
    createdAt: '2026-11-24 19:15'
  },
  {
    id: 'AETH-SIP-2026-882',
    name: 'Selin Yılmaz',
    phone: '+90 541 230 45 12',
    location: 'Etiler Mah. Nisbetiye Cad. No: 18 K: 3, Beşiktaş / İstanbul',
    coffeeId: 'yirgacheffe-single-origin',
    coffeeName: '03 // Yirgacheffe Single Origin (220ml)',
    quantity: 1,
    unitPrice: 220,
    totalPrice: 220,
    notes: 'Zile basmadan önce telefonla arayabilirsiniz.',
    status: 'Kuryede',
    createdAt: '2026-11-24 19:40'
  },
  {
    id: 'AETH-SIP-2026-883',
    name: 'Alexander Lindqvist',
    phone: '+46 70 123 4567',
    location: 'Levent Mah. Çamlık Cad. No: 12, Beşiktaş / İstanbul',
    coffeeId: 'antigua-volcanic-geisha',
    coffeeName: '04 // Antigua Volcanic Geisha (220ml)',
    quantity: 2,
    unitPrice: 260,
    totalPrice: 520,
    notes: 'Leave at front desk reception.',
    status: 'Teslim Edildi',
    createdAt: '2026-11-24 18:20'
  }
]

function getStoredOrders() {
  try {
    const raw = localStorage.getItem('aether_orders')
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Orders storage read failed:', e)
  }
  return INITIAL_ORDERS
}

function saveStoredOrders(list) {
  try {
    localStorage.setItem('aether_orders', JSON.stringify(list))
  } catch (e) {
    console.warn('Orders storage write failed:', e)
  }
}

const INITIAL_RESERVATIONS = [
  {
    id: 'AETH-2026-981',
    name: 'Deniz Altan',
    email: 'deniz.altan@studioarch.com',
    phone: '+90 532 889 12 40',
    edition: '01 — Yirgacheffe Anaerobic',
    guests: '2 Kişi',
    date: '2026-11-28',
    time: '14:30',
    notes: 'Sub-zero damıtma prosesi ve asidite profili hakkında özel tadım.',
    status: 'Confirmed',
    createdAt: '2026-11-24 14:15'
  },
  {
    id: 'AETH-2026-982',
    name: 'Selin & Can Yılmaz',
    email: 'selin.yilmaz@luxbrand.ch',
    phone: '+90 541 230 45 12',
    edition: '02 — Antigua Volcanic Geisha',
    guests: '4 Kişi',
    date: '2026-11-29',
    time: '16:00',
    notes: 'Özel hasat Geisha serisi ve volkanik mineral eşleşmesi.',
    status: 'Pending',
    createdAt: '2026-11-24 16:30'
  },
  {
    id: 'AETH-2026-983',
    name: 'Alexander Lindqvist',
    email: 'a.lindqvist@nordicdesign.se',
    phone: '+46 70 123 4567',
    edition: '03 — Huila Pink Bourbon',
    guests: '1 Kişi',
    date: '2026-12-01',
    time: '11:00',
    notes: 'Architecture & coffee packaging curation meeting.',
    status: 'Confirmed',
    createdAt: '2026-11-24 18:00'
  }
]

function getStoredReservations() {
  try {
    const raw = localStorage.getItem('aether_reservations')
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Storage read failed:', e)
  }
  return INITIAL_RESERVATIONS
}

function saveStoredReservations(list) {
  try {
    localStorage.setItem('aether_reservations', JSON.stringify(list))
  } catch (e) {
    console.warn('Storage write failed:', e)
  }
}

export const useStore = create((set, get) => ({
  activeFlavorIndex: 0,
  flavors: [
    {
      id: 'yirgacheffe-anaerobic',
      number: '01',
      name: 'Yirgacheffe Anaerobic',
      vintage: 'Hasat 2026 // Single Origin',
      origin: 'Yirgacheffe, Etiyopya · 2,200m Rakım',
      subtitle: '18 saatlik sub-zero soğuk damıtma ve yabani yasemin notaları',
      description: 'Etiyopya yüksek yaylalarından tek çiftlik Yirgacheffe çekirdekleri. Oksijensiz fermantasyon sonrası -2°C sub-zero damıtma ile zenginleştirildi; narin bergamot ve yasemin aromasıyla benzersiz bir berraklık sunar.',
      accentColor: '#C89D7C', // Warm Artisan Bronze
      accentMuted: '#8C674B',
      canBaseColor: '#006241', // Emerald wave accent
      bgAccent: '#EFECE6',
      notes: ['Yabani Yasemin', 'Calabria Bergamotu', 'Karamelize Şeftali', 'Siyah Çay'],
      tastingNotes: 'Canlı narenciye asiditesi ile açılan, ipeksi gövde ve uzun süren çiçeksi bitişe sahip saf espresso deneyimi.',
      stats: {
        temp: '-2°C',
        extraction: '18 Saat',
        beans: '100% Arabica',
        batch: 'Lot ETH-491',
        volume: '220 ml',
        altitude: '2,200m'
      }
    },
    {
      id: 'antigua-geisha',
      number: '02',
      name: 'Antigua Volcanic Geisha',
      vintage: 'Hasat 2026 // Single Origin',
      origin: 'Antigua Vadisi, Guatemala · 1,950m Rakım',
      subtitle: 'Volkanik toprakta yetişen nadide Geisha çekirdekleri',
      description: 'Agua Yanardağı yamaçlarında gölgede olgunlaşan Geisha varyetesi. Azot korumalı mikro ekstraksiyon ile bal peteği ve kakao çekirdeği nüansları bozulmadan hapsedildi.',
      accentColor: '#B68862', // Deep Bronze
      accentMuted: '#7A573C',
      canBaseColor: '#160F0B',
      bgAccent: '#EFECE6',
      notes: ['Kakao Çekirdeği', 'Dağ Çiçeği Balı', 'Kakule Özütü', 'Meyer Limonu'],
      tastingNotes: 'Zengin kremamsı doku, dengeli asidite ve damakta eriyen bitter çikolata ve volkanik mineral derinliği.',
      stats: {
        temp: '-3°C',
        extraction: '16 Saat',
        beans: '100% Geisha',
        batch: 'Lot GTM-492',
        volume: '220 ml',
        altitude: '1,950m'
      }
    },
    {
      id: 'huila-bourbon',
      number: '03',
      name: 'Huila Pink Bourbon',
      vintage: 'Hasat 2026 // Single Origin',
      origin: 'San Agustin, Kolombiya · 1,850m Rakım',
      subtitle: 'Nadir Pembe Bourbon varyetesi ve kadife gövde',
      description: 'And Dağları eteklerinde elle toplanan nadir Pink Bourbon çekirdekleri. Düşük sıcaklıkta basınçlı demleme ile karamelize fındık ve kırmızı meyve zenginliği açığa çıkarıldı.',
      accentColor: '#D4A882', // Light Warm Bronze
      accentMuted: '#966D4C',
      canBaseColor: '#1E1410',
      bgAccent: '#EFECE6',
      notes: ['Kırmızı Erik', 'Kavrulmuş Fındık', 'Esmer Şeker', 'Kan Portakalı Kabuğu'],
      tastingNotes: 'Kadifemsi yoğun gövde, karamelize tatlılık ve taze çekilmiş kahve yağlarının kalıcı zarafeti.',
      stats: {
        temp: '-2°C',
        extraction: '20 Saat',
        beans: 'Pink Bourbon',
        batch: 'Lot COL-493',
        volume: '220 ml',
        altitude: '1,850m'
      }
    }
  ],
  setActiveFlavorIndex: (index) => set({ activeFlavorIndex: index }),

  // Manual interactive exploded/macro progress (Starts strictly at 0)
  explodedProgress: 0,
  setExplodedProgress: (p) => {
    webglScrollState.exploded = p
    set({ explodedProgress: p })
  },

  // Sleek Custom Cursor (Visual state only — zero intrusive floating text)
  cursorVariant: 'default',
  setCursor: (variant) => set({ cursorVariant: variant }),

  // Navigation View Router ('home' | 'siparis' | 'kvkk' | 'admin')
  currentView: (() => {
    if (typeof window === 'undefined') return 'home'
    const path = window.location.pathname.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    const search = window.location.search.toLowerCase()
    if (path.includes('siparis') || hash.includes('siparis')) return 'siparis'
    if (path.includes('kvkk') || hash.includes('kvkk')) return 'kvkk'
    if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) return 'admin'
    return 'home'
  })(),
  setCurrentView: (view) => {
    if (view === 'siparis') {
      window.location.hash = 'siparis'
    } else if (view === 'kvkk') {
      window.location.hash = 'kvkk'
    } else if (view === 'admin') {
      window.location.hash = 'admin-secure-panel-9988'
    } else {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname)
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    set({ currentView: view })
  },

  // Reel modal
  isReelOpen: false,
  setReelOpen: (open) => set({ isReelOpen: open }),

  // Order Modal & Cart State ("Sipariş Et")
  isOrderOpen: false,
  setOrderOpen: (open) => set({ isOrderOpen: open, isReservationOpen: open }),
  selectedCoffeeId: 'caffe-espresso-chilled',
  setSelectedCoffeeId: (id) => set({ selectedCoffeeId: id }),

  orders: getStoredOrders(),
  addOrder: (item) => {
    const list = [item, ...get().orders]
    saveStoredOrders(list)
    // Also sync to reservations for unified admin visibility
    const resItem = {
      id: item.id,
      name: item.name,
      email: item.phone,
      phone: item.phone,
      edition: `${item.coffeeName} (${item.quantity} Adet)`,
      guests: `${item.totalPrice} ₺`,
      paymentMethod: item.paymentMethod,
      date: item.createdAt.slice(0, 10),
      time: item.createdAt.slice(11),
      notes: `Ödeme: ${item.paymentMethod} // Teslimat Adresi: ${item.location} // ${item.notes || 'Not yok'}`,
      status: item.status,
      createdAt: item.createdAt
    }
    const resList = [resItem, ...get().reservations]
    saveStoredReservations(resList)
    set({ orders: list, reservations: resList })
  },
  updateOrderStatus: (id, status) => {
    const list = get().orders.map((o) => (o.id === id ? { ...o, status } : o))
    saveStoredOrders(list)
    const resList = get().reservations.map((r) => (r.id === id ? { ...r, status } : r))
    saveStoredReservations(resList)
    set({ orders: list, reservations: resList })
  },
  deleteOrder: (id) => {
    const list = get().orders.filter((o) => o.id !== id)
    saveStoredOrders(list)
    const resList = get().reservations.filter((r) => r.id !== id)
    saveStoredReservations(resList)
    set({ orders: list, reservations: resList })
  },

  // Backward compatibility alias for reservation modal
  isReservationOpen: false,
  setReservationOpen: (open) => set({ isReservationOpen: open, isOrderOpen: open }),

  reservations: getStoredReservations(),
  addReservation: (item) => {
    const list = [item, ...get().reservations]
    saveStoredReservations(list)
    set({ reservations: list })
  },
  updateReservationStatus: (id, status) => {
    const list = get().reservations.map((r) => (r.id === id ? { ...r, status } : r))
    saveStoredReservations(list)
    set({ reservations: list })
  },
  deleteReservation: (id) => {
    const list = get().reservations.filter((r) => r.id !== id)
    saveStoredReservations(list)
    set({ reservations: list })
  },

  // Loading state
  isLoading: true,
  finishLoading: () => set({ isLoading: false }),

  // Audio ambient toggle
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  // KVKK / Legal Modal
  isKVKKOpen: false,
  setKVKKOpen: (open) => set({ isKVKKOpen: open }),
  legalTab: 'kvkk',
  setLegalTab: (tab) => set({ legalTab: tab })
}))
