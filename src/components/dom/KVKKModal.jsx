import React, { useState, useEffect } from 'react'
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function KVKKModal() {
  const { isKVKKOpen, setKVKKOpen, legalTab, setLegalTab, setCursor } = useStore()
  const activeTab = legalTab || 'kvkk'

  useEffect(() => {
    if (!isKVKKOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setKVKKOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isKVKKOpen, setKVKKOpen])

  if (!isKVKKOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#160E0A]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setKVKKOpen(false)}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-3xl bg-[#F4F0EB] border border-[#2C1D18]/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[85vh]">
        {/* Header Bar */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[#2C1D18]/10 flex items-center justify-between bg-[#EFECE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1D18] text-[#F4F0EB] flex items-center justify-center font-display font-bold text-sm">
              Æ
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#8C674B] uppercase font-bold">
                <ShieldCheck size={13} />
                <span>YASAL BİLGİLENDİRME & UYUM</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#2C1D18]">
                {activeTab === 'kvkk'
                  ? 'KVKK Aydınlatma Metni'
                  : activeTab === 'privacy'
                  ? 'Gizlilik Politikası'
                  : 'Çerez Politikası'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setKVKKOpen(false)}
            className="w-9 h-9 rounded-full border border-[#2C1D18]/15 flex items-center justify-center text-[#2C1D18]/70 hover:text-[#2C1D18] hover:border-[#2C1D18] transition-colors bg-[#F4F0EB]"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2C1D18]/10 bg-[#EFECE6]/60 px-6 sm:px-8 text-xs font-mono uppercase tracking-wider overflow-x-auto">
          {[
            { id: 'kvkk', label: '6698 Sayılı KVKK', icon: FileText },
            { id: 'privacy', label: 'Gizlilik İlkeleri', icon: Lock },
            { id: 'cookies', label: 'Çerez Politikası', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setLegalTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#2C1D18] text-[#2C1D18]'
                    : 'border-transparent text-[#2C1D18]/60 hover:text-[#2C1D18]'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#2C1D18]/85 leading-relaxed font-sans">
          {activeTab === 'kvkk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#2C1D18]/10 bg-[#EFECE6] font-mono text-xs space-y-1">
                <div><strong>Veri Sorumlusu:</strong> AETHER Beverage Labs Inc. / AETHER ESPRESSO</div>
                <div><strong>Kanun Dayanağı:</strong> 6698 Sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”)</div>
                <div><strong>Revizyon Tarihi:</strong> 24 Kasım 2026</div>
              </div>

              <h4 className="font-display text-base font-bold text-[#2C1D18] pt-2">
                1. Kişisel Verilerin İşlenme Amacı
              </h4>
              <p>
                AETHER ESPRESSO olarak, web sitemiz üzerinden gerçekleştirdiğiniz özel tadım rezervasyonları,
                sınırlı hasat tahsisat başvuruları ve bülten abonelikleri kapsamında ad, soyad, e-posta adresi,
                telefon numarası ve tadım tercihleri gibi kişisel verilerinizi; 6698 sayılı Kanun’un 5. ve 6.
                maddelerine uygun olarak, rezervasyon süreçlerinin teyidi, müşteri memnuniyeti ve mevzuattan kaynaklanan
                yükümlülüklerin yerine getirilmesi amacıyla işlemekteyiz.
              </p>

              <h4 className="font-display text-base font-bold text-[#2C1D18] pt-2">
                2. İşlenen Kişisel Verilerin Aktarımı
              </h4>
              <p>
                Toplanan kişisel verileriniz; kanunen yetkili kamu kurum ve kuruluşları haricinde kesinlikle üçüncü taraf
                reklam veya pazarlama şirketleriyle ticari amaçla paylaşılmaz ve satılmaz. Yalnızca rezervasyon ve
                iletişim altyapısını sağlayan güvenli, şifrelenmiş teknik iş ortaklarımıza aktarılmaktadır.
              </p>

              <h4 className="font-display text-base font-bold text-[#2C1D18] pt-2">
                3. Veri Güvenliği ve Saklama Süresi
              </h4>
              <p>
                Kişisel verileriniz uluslararası SSL şifreleme ve modern veri tabanı güvenlik protokolleriyle muhafaza
                edilir. Rezervasyon ve tadım geçmişi verileri yasal zamanaşımı sürelerinin sona ermesini takiben güvenli
                biçimde anonimleştirilerek arşivlenir veya tamamen silinir.
              </p>

              <h4 className="font-display text-base font-bold text-[#2C1D18] pt-2">
                4. İlgili Kişinin Hakları (KVKK Madde 11)
              </h4>
              <p>
                Kanun’un 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme,
                işlenmişse bilgi talep etme, amaca uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse
                düzeltilmesini isteme ve silinmesini talep etme hakkına sahiptir. Bu kapsamdaki taleplerinizi
                <strong className="text-[#2C1D18]"> kvkk@aether-espresso.com</strong> adresine iletebilirsiniz.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-display text-base font-bold text-[#2C1D18]">
                Gizlilik Politikamız
              </h4>
              <p>
                AETHER ESPRESSO, kullanıcılarının dijital mahremiyetine en üst düzeyde saygı gösterir. Ziyaretçilerimizin
                tıklama ve etkileşim telemetry verileri, yalnızca web deneyiminin performansını optimize etmek amacıyla
                anonim olarak değerlendirilir.
              </p>
              <p>
                Kullanıcı adı, telefon ve e-posta gibi tanımlayıcı bilgiler hiçbir koşul altında izinsiz üçüncü taraflara
                devredilmez. 256-bit şifrelenmiş bağlantılar ile verilerinizin tam gizliliği garanti altındadır.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h4 className="font-display text-base font-bold text-[#2C1D18]">
                Çerez (Cookie) Kullanımı
              </h4>
              <p>
                Web sitemizde yalnızca sitenin temel işlevlerini (rezervasyon formu durumu, ses tercihleri, tema ve 60 FPS
                grafik kalibrasyonu) sağlamak amacıyla zorunlu ve işlevsel çerezler kullanılmaktadır.
              </p>
              <p>
                Tarayıcınızın ayarlarından dilediğiniz zaman çerez tercihlerinizi değiştirebilir veya çerezleri silebilirsiniz.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#2C1D18]/10 bg-[#EFECE6] flex items-center justify-between text-xs font-mono">
          <span className="text-[#2C1D18]/60">
            AETHER ESPRESSO LEGAL COMPLIANCE © 2026
          </span>
          <button
            onClick={() => setKVKKOpen(false)}
            className="px-6 py-2 rounded-full border border-[#2C1D18] bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] uppercase tracking-wider font-semibold transition-all"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => setCursor('default')}
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  )
}
