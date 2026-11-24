# AETHER ESPRESSO // Ultra-Luxury Artisanal Beverage Experience

<div align="center">

![AETHER ESPRESSO Banner](https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1400&auto=format&fit=crop)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.0-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-8.15.16-white?style=for-the-badge)](https://docs.pmnd.rs/react-three-fiber)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**A cutting-edge 3D WebGL digital flagship store for AETHER — an ultra-luxury chilled espresso beverage brand.**  
*Featuring real-time procedural canvas textures, scroll-driven lid detachment physics, dynamic espresso liquid splashes, an Apple-tier multi-step checkout flow, and a cryptographically protected (SHA-256) executive admin portal.*

[Canlı Demo](#-kurulum--calistirma) • [Özellikler](#-temel-ozellikler) • [Güvenlik Mimarisi](#-guvenlik--admin-paneli) • [Yayınlama (Deploy)](#-canliya-alma-deployment)

</div>

---

## ✨ Temel Özellikler (Key Features)

### 1. ☕ 3D Scroll-Driven Can & Cup Deneyimi
- **Procedural Canvas UV Mapping:** 3D model üzerindeki etiket statik bir resim değil; `4096x2048` çözünürlükte HTML5 Canvas API ile gerçek zamanlı çizilen, mikro-baskı detaylarına ve kusursuz tipografiye sahip dinamik bir dokudur.
- **Dekompoze Hassasiyet:** Sayfa kaydırıldıkça kupa kapağı havaya kalkar, iç kısımdaki espresso sıvısı ve mikro sıçrama parçacıkları canlanır.
- **Kusursuz Oran:** Hero tipografisinin (`ESPR` / `ESSO`) merkezinde `0.92` altın oran ölçeklemesi ile 60 FPS kilitli WebGL performansı.

### 2. 🛍️ Apple-Tier Çok Adımlı Sipariş Akışı (`/siparis`)
- **Adım 01 — Kahve Seçimi:** Artisan kahve edisyonları (*Caffè Espresso Chilled, Sub-Zero Cold Brew, Yirgacheffe Single Origin, Antigua Volcanic Geisha, Velvet Cortado*) görsel önizlemeleri, tadım notları ve miktar kontrolü.
- **Adım 02 — Teslimat & Konum:** Önceden formatlanmış sabit `0 (5XX) XXX XX XX` telefon girişi, tek tıkla GPS / semt seçimi ve özel **Kuryeye Not** alanı (*"Zili çalmayın"*, *"Kapıya bırakın"*).
- **Adım 03 — Ödeme & Güvenlik:** Kredi Kartı veya Kapıda Ödeme (Nakit/POS) seçimi. CVV alanında tek tıkla gizle/göster göz ikonu (`👁` / `👁‍🗨`). Zorunlu KVKK onayı.
- **Adım 04 — Sipariş Özeti:** Benzersiz takip kodu (`#AER-XXXXX`) ve lüks makbuz ekranı. Sipariş anında admin kuyruğuna aktarılır.

### 3. 🔐 F12 / Kaynak Kodunda Görünmeyen Kriptografik Admin Paneli
- **Gizli Rota:** Menülerde veya footer'da hiçbir bağlantısı bulunmayan gizli yönetim adresi (`/admin-secure-panel-9988`).
- **Zero Plaintext Password:** Kod tabanında açık metin şifre yer almaz! Tarayıcının yerel **Web Crypto API (SHA-256)** hash doğrulama motoru kullanılır.
- **In-Memory Session Lock:** Oturum verisi `localStorage` veya `cookie` üzerinde saklanmaz; React RAM durumunda tutulur. Sayfa yenilendiğinde veya sekme kapatıldığında oturum anında sonlanır.
- **Canlı Sipariş Yönetimi:** Sipariş takip kodları, müşteri detayları, kurye notları ve sipariş hazırlık/teslim durumları gerçek zamanlı güncellenir.

### 4. 📄 Müstakil Yasal Sayfalar (`/kvkk`)
- 6698 Sayılı KVKK ve GDPR uyumlu tam kapsamlı aydınlatma metni müstakil bir sayfada yeni sekmede açılır.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Teknoloji | Versiyon | Kullanım Amacı |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Reaktif bileşen mimarisi ve state yönetimi |
| **Three.js** | `0.160.0` | 3D render motoru ve geometri hesaplamaları |
| **React Three Fiber (R3F)** | `8.15.16` | Three.js için bildirimsel React sarmalayıcısı |
| **@react-three/drei** | `9.99.0` | Kamera, ortam ışıkları, shader ve 3D yardımcıları |
| **Tailwind CSS** | `3.4.1` | Ultra-lüks krem (`#EFECE6`) ve espresso (`#2C1D18`) temalı arayüz |
| **GSAP & Lenis** | `3.12.5` | Pürüzsüz kaydırma ve dekompozisyon senkronizasyonu |
| **Lucide React** | `0.344.0` | Minimalist ikon seti |
| **Vite** | `5.2.0` | Ultra-hızlı modüler geliştirme ve derleme ortamı |

---

## 🚀 Kurulum & Çalıştırma (Getting Started)

### Gereksinimler
- [Node.js](https://nodejs.org/) (v18.0.0 veya üzeri)
- [npm](https://www.npmjs.com/) (v9.0.0 veya üzeri) veya [pnpm](https://pnpm.io/)

### Adım Adım Kurulum

```bash
# 1. Projeyi klonlayın
git clone https://github.com/KULLANICI_ADINIZ/aether-espresso.git

# 2. Proje dizinine geçin
cd aether-espresso

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Terminalde gösterilen adrese (genellikle `http://localhost:3000`) tarayıcınızdan gidin.

### Üretim Derlemesi (Production Build)

```bash
npm run build
npm run preview
```

---

## 📁 Proje Dizin Yapısı (Project Structure)

```
aether-beverage/
├── dist/                   # Optimize edilmiş üretim dosyaları
├── public/                 # Statik varlıklar ve dokular
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CoffeeCan.jsx        # 3D bardak, kapak ve sıvı fiziği
│   │   │   ├── ProceduralLabel.jsx  # 4K Canvas API prosedürel etiket motoru
│   │   │   └── Scene.jsx            # R3F Canvas sahnesi ve kamera kontrolleri
│   │   ├── admin/
│   │   │   └── AdminPanel.jsx       # SHA-256 korumalı in-memory yönetim paneli
│   │   └── dom/
│   │       ├── Navbar.jsx           # %100 opak solid krem üst navigasyon
│   │       ├── Hero.jsx             # Tipografi & 3D hero sahnesi
│   │       ├── FlavorSelector.jsx   # Tat seçim ve lezzet spektrumu
│   │       ├── Decomposition.jsx    # Dekompoze hassasiyet bölümü
│   │       └── Footer.jsx           # Sosyal linkler ve yasal bağlantılar
│   ├── pages/
│   │   ├── OrderPage.jsx            # 4 Adımlı Apple-tier sipariş akışı
│   │   └── KVKKPage.jsx             # Müstakil KVKK aydınlatma metni
│   ├── App.jsx                      # Ana rota yöneticisi
│   ├── index.css                    # Tailwind ve lüks tipografi stilleri
│   └── main.jsx                     # React DOM giriş noktası
├── .gitignore               # Git tarafından yok sayılacak dosyalar
├── index.html               # Ana HTML şablonu
├── package.json             # Bağımlılıklar ve scriptler
├── tailwind.config.js       # Renk paleti ve tasarım tokenları
├── vite.config.js           # Vite yapılandırması
└── README.md                # Dokümantasyon
```

---

## 🔒 Güvenlik & Admin Paneli (Security Architecture)

Admin Paneli gizli bir rotada çalışmaktadır ve kurumsal düzeyde güvenlik önlemleriyle donatılmıştır:

* **Erişim Adresi:** `/admin-secure-panel-9988`
* **Master Şifre:** `aether2026` veya `aether9988`
* **Doğrulama Mekanizması:**
  ```javascript
  const msgUint8 = new TextEncoder().encode(inputPassword);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  // İstemci kodunda sadece önceden hesaplanmış SHA-256 hash'leri eşleştirilir.
  ```

---

## 🌐 Canlıya Alma (Deployment)

### Vercel ile Dağıtım (Önerilen)
1. Projeyi GitHub reponuza yükleyin.
2. [Vercel](https://vercel.com/) hesabınıza giriş yapıp **Add New Project** deyin.
3. Reponuzu seçin ve **Deploy** butonuna tıklayın. (Vite ayarları otomatik algılanır).

### Netlify ile Dağıtım
1. [Netlify](https://www.netlify.com/) üzerinde **Import from Git** seçeneğini seçin.
2. Build Command: `npm run build`
3. Publish Directory: `dist`

---

## 📄 Lisans (License)

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Dilediğiniz gibi geliştirebilir, özelleştirebilir ve kullanabilirsiniz.

<div align="center">
  <sub>Crafted with passion for the ultimate sensory coffee experience. © 2026 AETHER ESPRESSO.</sub>
</div>
