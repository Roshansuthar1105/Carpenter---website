import { useState } from 'react'
import { SERVICES } from '../data/services'

type FilterType = 'all' | 'wood' | 'aluminium' | 'repair'

const FAQ_ITEMS = [
  { q: 'क्या शर्मा जी घर पर आकर नाप लेते हैं?', a: 'हाँ, 20 किमी के दायरे में बिल्कुल मुफ़्त घर पर नाप लिया जाता है। कोई छुपा हुआ शुल्क नहीं।' },
  { q: 'कितने दिन में काम पूरा होता है?', a: 'एक दरवाजा 5-7 दिन में, अलमारी 7-10 दिन में, और पूरे घर का काम 20-30 दिन में पूरा किया जाता है।' },
  { q: 'क्या कीमत बाद में बदलती है?', a: 'नहीं। एक बार कोटेशन तय हो जाने के बाद कोई अतिरिक्त चार्ज नहीं लगाया जाता। लिखित कोटेशन दी जाती है।' },
  { q: 'क्या लकड़ी दीमक-रोधी है?', a: 'हाँ, हम केवल दीमक-रोधी उपचारित शीशम और सागवान ही लगाते हैं। 10 साल की दीमक गारंटी भी मिलती है।' },
  { q: 'एल्युमिनियम और लकड़ी में क्या फर्क है?', a: 'लकड़ी पारंपरिक और गर्म लुक देती है, जबकि एल्युमिनियम पूरी तरह वाटरप्रूफ, कम रखरखाव वाला और आधुनिक है। शर्मा जी आपकी जरूरत के हिसाब से सही सलाह देंगे।' },
]

export default function Services() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredServices = SERVICES.filter(s => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'repair') return s.type === 'repair'
    if (activeFilter === 'wood') return s.type === 'wood' || s.type === 'both'
    if (activeFilter === 'aluminium') return s.type === 'aluminium' || s.type === 'both'
    return false
  })

  const filters: { key: FilterType; labelH: string }[] = [
    { key: 'all', labelH: 'सभी सेवाएँ' },
    { key: 'wood', labelH: 'लकड़ी (Wood)' },
    { key: 'aluminium', labelH: 'एल्युमिनियम (Aluminium)' },
    { key: 'repair', labelH: 'मरम्मत व पॉलिश' },
  ]

  return (
    <div className="flex flex-col w-full">
      {/* Hero banner */}
      <div className="bg-primary text-on-primary py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">2024-25 की दरें — पारदर्शी हिसाब</span>
          <h1 className="font-headline font-extrabold text-3xl md:text-4xl mt-2">सेवाओं के रेट और पारदर्शी दाम सूची</h1>
          <p className="text-on-primary-container text-sm mt-2 max-w-2xl">
            काम का फोटो भेजें, 10 मिनट में रेट जानिए। घर पर नाप और कोटेशन बिल्कुल मुफ़्त।
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="tel:+919876543210" className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
              Direct Call: 98765-43210
            </a>
            <a
              href="https://wa.me/919876543210?text=Photo%20bhej%20raha%20hoon%20rate%20ke%20liye"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#15803d' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_camera</span>
              WhatsApp Photo for Estimate
            </a>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-surface-container-low border-b border-outline-variant sticky top-36 z-30">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-label font-semibold whitespace-nowrap transition-colors ${activeFilter === f.key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                type="button"
              >
                {f.labelH}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services list */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex flex-col gap-10">
        {filteredServices.map(cat => (
          <div key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-7 bg-secondary rounded-full inline-block" />
              <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
              <div>
                <h3 className="font-headline font-bold text-primary text-xl">{cat.titleHindi}</h3>
                <span className="text-on-surface-variant text-xs">{cat.titleEn}</span>
              </div>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-surface-container text-tertiary font-label font-semibold capitalize">{cat.type}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map(item => (
                <div key={item.id} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <img src={item.image} alt={item.nameEn} className="w-full h-40 object-cover" loading="lazy" />
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <div className="font-headline font-bold text-on-surface text-base">{item.nameHindi}</div>
                      <div className="text-on-surface-variant text-xs">{item.nameEn}</div>
                    </div>
                    <p className="text-on-surface-variant text-sm flex-1">{item.descHindi}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.specs.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant mt-2">
                      <div>
                        <span className="font-headline font-bold text-secondary text-lg">₹{item.startingPrice.toLocaleString('en-IN')}</span>
                        <span className="text-on-surface-variant text-xs ml-1">/ {item.unit}</span>
                      </div>
                      <a href="tel:+919876543210" className="px-3 py-1 bg-surface-container text-primary rounded-lg text-sm font-bold hover:bg-surface-container-high transition-colors">
                        कॉल करें
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* FAQ */}
        <div>
          <h3 className="font-headline font-bold text-primary text-xl mb-4">गाँव के साथियों के सवाल और जवाब</h3>
          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-container-low transition-colors"
                  type="button"
                >
                  <span className="font-label font-semibold text-on-surface text-sm pr-4">{faq.q}</span>
                  <span className="material-symbols-outlined text-primary shrink-0">
                    {openFaq === i ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

