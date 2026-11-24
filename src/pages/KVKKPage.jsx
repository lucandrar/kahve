import React from 'react'
import { ShieldCheck, ArrowLeft, Printer, Lock, FileText, CheckCircle2, Building, Mail, Phone, MapPin } from 'lucide-react'

export default function KVKKPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#F4F0EB] text-[#2C1D18] font-sans selection:bg-[#2C1D18] selection:text-[#F4F0EB] py-12 px-6 sm:px-12">
      {/* Container */}
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation & Actions Top Bar */}
        <div className="flex items-center justify-between border-b border-[#2C1D18]/15 pb-6">
          <a
            href="#"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#8C674B] hover:text-[#2C1D18] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Ana Sayfaya Dön</span>
          </a>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[#2C1D18]/20 bg-[#EFECE6] hover:bg-[#2C1D18] hover:text-[#F4F0EB] text-xs font-mono tracking-wider transition-all"
            >
              <Printer size={13} />
              <span>Belgeyi Yazdır</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#2C1D18] flex items-center justify-center font-display text-xs text-[#2C1D18] font-bold">
                Æ
              </div>
              <span className="font-display tracking-[0.25em] text-sm font-bold text-[#2C1D18]">
                AETHER ESPRESSO
              </span>
            </div>
          </div>
        </div>

        {/* Official Header Dossier */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#EFECE6] border border-[#2C1D18]/15 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold">
            <ShieldCheck size={16} />
            <span>HUKUKİ VE DİJİTAL UYUM DAİRESİ</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2C1D18]">
            Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni
          </h1>

          <p className="text-sm text-[#2C1D18]/80 leading-relaxed font-normal">
            6698 Sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) Madde 10 ve Aydınlatma Yükümlülüğünün
            Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca hazırlanmıştır.
          </p>

          {/* Corporate Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#2C1D18]/10 text-xs font-mono">
            <div>
              <span className="text-[#2C1D18]/50 uppercase block">Veri Sorumlusu</span>
              <span className="font-bold text-[#2C1D18]">AETHER ESPRESSO LABS SAN. VE TİC. A.Ş.</span>
            </div>
            <div>
              <span className="text-[#2C1D18]/50 uppercase block">Mersis No</span>
              <span className="font-bold text-[#2C1D18]">0012-9842-1102-0001</span>
            </div>
            <div>
              <span className="text-[#2C1D18]/50 uppercase block">Yürürlük Tarihi</span>
              <span className="font-bold text-[#2C1D18]">24 Kasım 2026</span>
            </div>
            <div>
              <span className="text-[#2C1D18]/50 uppercase block">Kapsam</span>
              <span className="font-bold text-[#2C1D18]">Sipariş, Teslimat & Rezervasyon</span>
            </div>
          </div>
        </div>

        {/* Structured Legal Content */}
        <div className="space-y-10 text-sm sm:text-[15px] text-[#2C1D18]/85 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">01.</span>
              <span>Veri Sorumlusunun Kimliği</span>
            </h2>
            <p>
              İşbu Aydınlatma Metni ile <strong>AETHER ESPRESSO LABS SANAYİ VE TİCARET A.Ş.</strong> (“AETHER ESPRESSO”
              veya “Şirket”) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu
              sıfatıyla siz değerli müşterilerimizin, ziyaretçilerimizin ve sipariş sahiplerimizin kişisel verilerini hangi
              kapsamda işlediğimizi, sakladığımızı ve koruduğumuzu kamuoyunun bilgisine sunarız.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">02.</span>
              <span>İşlenen Kişisel Veri Kategorileri</span>
            </h2>
            <p>
              Web sitemiz üzerinden kahve siparişi ("Sipariş Et"), özel tadım rezervasyonu veya arşiv bülteni kaydı
              oluştururken aşağıdaki kategorilerdeki kişisel verileriniz işlenmektedir:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#2C1D18]/10 space-y-1">
                <div className="font-bold text-[#2C1D18] uppercase">Kimlik & İletişim Verileri</div>
                <div className="text-[#2C1D18]/70">Adınız, soyadınız, telefon numaranız, e-posta adresiniz.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#2C1D18]/10 space-y-1">
                <div className="font-bold text-[#2C1D18] uppercase">Lokasyon & Teslimat Bilgileri</div>
                <div className="text-[#2C1D18]/70">Teslimat adresi, ilçe/mahalle bilgisi, coğrafi koordinat/konum desteği.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#2C1D18]/10 space-y-1">
                <div className="font-bold text-[#2C1D18] uppercase">Sipariş & Tercih Verileri</div>
                <div className="text-[#2C1D18]/70">Seçilen kahve edisyonu, adet, sipariş/tahsisat kodu, özel barista notları.</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EFECE6] border border-[#2C1D18]/10 space-y-1">
                <div className="font-bold text-[#2C1D18] uppercase">İşlem Güvenliği Verileri</div>
                <div className="text-[#2C1D18]/70">IP adresi, işlem zaman damgası (timestamp), şifrelenmiş token doğrulaması.</div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">03.</span>
              <span>Kişisel Verilerin İşlenme Amaçları</span>
            </h2>
            <p>
              Toplanan kişisel verileriniz, KVKK’nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde;
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#2C1D18]/80">
              <li>
                Online siparişlerinizin oluşturulması, sub-zero soğuk zincir ambalajlama ve hızlı teslimat lojistiğinin sağlanması,
              </li>
              <li>
                Sipariş teyidi, durum güncellemeleri ve kurye koordinasyonu amacıyla sizinle telefon ve SMS aracılığıyla iletişime geçilmesi,
              </li>
              <li>
                Finansal, muhasebesel faturalandırma ve mevzuattan kaynaklanan e-ticaret yükümlülüklerinin eksiksiz ifası,
              </li>
              <li>
                Müşteri memnuniyetinin değerlendirilmesi ve özel tahsisat edisyonları hakkında talep edilmişse bilgilendirme yapılması,
              </li>
              <li>
                Şirket bilgi güvenliği süreçlerinin ve yönetim terminallerinin yetkisiz erişimlere karşı korunması,
              </li>
            </ul>
            <p>amaçlarıyla sınırlı, ölçülü ve bağlantılı olarak işlenmektedir.</p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">04.</span>
              <span>Kişisel Verilerin Aktarılması</span>
            </h2>
            <p>
              AETHER ESPRESSO, toplanan kişisel verilerinizi <strong>asla üçüncü taraf pazarlama, reklam veya veri ticareti şirketlerine satmaz ve devretmez</strong>.
            </p>
            <p>
              Verileriniz yalnızca; siparişin kapınıza ulaştırılması amacıyla anlaşmalı özel soğuk zincir kurye ortaklarımıza,
              yasal zorunluluklar gereği kanunen yetkili kamu kurum ve adli mercilere, ve veri güvenliği sağlanan şifreli bulut altyapı sağlayıcılarımıza KVKK Madde 8 ve 9 çerçevesinde aktarılmaktadır.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">05.</span>
              <span>Veri Güvenliği ve Saklama Süresi</span>
            </h2>
            <p>
              Kişisel verileriniz 256-bit SSL şifreleme ve modern veritabanı güvenlik duvarlarıyla korunmaktadır.
              Sipariş ve fatura kayıtları, Türk Ticaret Kanunu ve Vergi Usul Kanunu uyarınca yasal zorunlu saklama süresi olan 10 yıl boyunca saklanır; sürenin dolmasını takiben güvenli biçimde yok edilir veya tamamen anonim hale getirilir.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">06.</span>
              <span>İlgili Kişinin Hakları (KVKK Madde 11)</span>
            </h2>
            <p>
              KVKK’nın 11. maddesi uyarınca, veri sahibi olarak dilediğiniz zaman Şirketimize başvurarak;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6] flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C89D7C] shrink-0" />
                <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6] flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C89D7C] shrink-0" />
                <span>İşlenmişse buna ilişkin bilgi talep etme</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6] flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C89D7C] shrink-0" />
                <span>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6] flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C89D7C] shrink-0" />
                <span>Eksik veya yanlış işlenmişse düzeltilmesini talep etme</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6] flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C89D7C] shrink-0" />
                <span>KVKK Madde 7 şartları çerçevesinde silinmesini veya yok edilmesini isteme</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#2C1D18]/15 bg-[#EFECE6] flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#C89D7C] shrink-0" />
                <span>Kanuna aykırı işleme sebebiyle zarara uğraması halinde tazminat talep etme</span>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4 pt-4 border-t border-[#2C1D18]/15">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1D18] flex items-center gap-2">
              <span className="text-[#8C674B] font-mono text-base">07.</span>
              <span>Başvuru ve İletişim Kanalları</span>
            </h2>
            <p>
              Haklarınıza ilişkin taleplerinizi yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da Şirketimize daha önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresinizi kullanmak suretiyle aşağıdaki kanallardan iletebilirsiniz:
            </p>

            <div className="p-6 rounded-2xl bg-[#EFECE6] border border-[#2C1D18]/15 space-y-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#8C674B]" />
                <div>
                  <strong>E-Posta:</strong> <a href="mailto:kvkk@aether-espresso.com" className="underline hover:text-[#8C674B]">kvkk@aether-espresso.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building size={16} className="text-[#8C674B]" />
                <div>
                  <strong>Şirket Unvanı:</strong> AETHER ESPRESSO LABS SAN. VE TİC. A.Ş.
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#8C674B]" />
                <div>
                  <strong>Fiziki Tebligat Adresi:</strong> Maslak Mah. Büyükdere Cad. No: 255 Nurol Plaza B Blok K: 14 Sarıyer / İstanbul
                </div>
              </div>
            </div>

            <p className="text-xs text-[#2C1D18]/70">
              Başvurularınız Şirketimizce talebin niteliğine göre en kısa sürede ve en geç <strong>30 (otuz) gün</strong> içinde ücretsiz olarak sonuçlandırılacaktır.
            </p>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-[#2C1D18]/15 flex items-center justify-between">
          <a
            href="#"
            className="px-6 py-3 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Ana Sayfaya Dön</span>
          </a>

          <span className="text-xs font-mono text-[#2C1D18]/50">
            AETHER ESPRESSO LEGAL ARCHIVE © 2026
          </span>
        </div>
      </div>
    </div>
  )
}
