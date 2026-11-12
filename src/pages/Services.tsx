import { useState } from 'react'
import { SERVICES, WEDDING_COMBO, PRICE_CALCULATOR_ITEMS } from '../data/services'

type FilterType = 'all' | 'wood' | 'aluminium' | 'repair' | 'wedding'

const FAQ_ITEMS = [
  { q: 'क्या शर्मा जी घर पर आकर नाप लेते हैं?', a: 'हाँ, 20 किमी के दायरे में बिल्कुल मुफ़्त घर पर नाप लिया जाता है। कोई छुपा हुआ शुल्क नहीं।' },
  { q: 'कितने दिन में काम पूरा होता है?', a: 'एक दरवाजा 5-7 दिन में, अलमारी 7-10 दिन में, और पूरे घर का काम 20-30 दिन में पूरा किया जाता है।' },
  { q: 'क्या कीमत बाद में बदलती है?', a: 'नहीं। एक बार कोटेशन तय हो जाने के बाद कोई अतिरिक्त चार्ज नहीं लगाया जाता। लिखित कोटेशन दी जाती है।' },
  { q: 'क्या लकड़ी दीमक-रोधी है?', a: 'हाँ, हम केवल दीमक-रोधी उपचारित शीशम और सागवान ही लगाते हैं। 10 साल की दीमक गारंटी भी मिलती है।' },
  { q: 'एल्युमिनियम और लकड़ी में क्या फर्क है?', a: 'लकड़ी पारंपरिक और गर्म लुक देती है, जबकि एल्युमिनियम पूरी तरह वाटरप्रूफ, कम रखरखाव वाला और आधुनिक है। शर्मा जी आपकी जरूरत के हिसाब से सही सलाह देंगे।' },
]

export default function Services() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedCalcItem, setSelectedCalcItem] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredServices = SERVICES.filter(s => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'repair') return s.type === 'repair'
    if (activeFilter === 'wood') return s.type === 'wood' || s.type === 'both'
    if (activeFilter === 'aluminium') return s.type === 'aluminium' || s.type === 'both'
    return false
  })

  const calcItem = PRICE_CALCULATOR_ITEMS[selectedCalcItem]
  const totalPrice = calcItem.pricePerUnit * quantity

  const filters: { key: FilterType; labelH: string }[] = [
    { key: 'all', labelH: 'सभी सेवाएँ' },
    { key: 'wood', labelH: 'लकड़ी (Wood)' },
    { key: 'aluminium', labelH: 'एल्युमिनियम (Aluminium)' },
    { key: 'repair', labelH: 'मरम्मत व पॉलिश' },
    { key: 'wedding', labelH: 'शादी स्पेशल सेट' },
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
        {activeFilter !== 'wedding' && filteredServices.map(cat => (
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

        {/* Wedding combo */}
        {(activeFilter === 'all' || activeFilter === 'wedding') && (
          <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg border-2 border-secondary-container" style={{ background: 'linear-gradient(135deg, #ffdbc9 0%, #ffdcc3 100%)' }}>
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold uppercase mb-3">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>celebration</span>
                  शादी-विवाह स्पेशल महा-बचत सेट
                </div>
                <h3 className="font-headline font-bold text-primary text-2xl mb-2">{WEDDING_COMBO.titleHindi}</h3>
                <div className="space-y-2 mb-4">
                  {WEDDING_COMBO.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-primary">
                      <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>check_circle</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-on-surface-variant text-sm line-through">सामान्य भाव: ₹{WEDDING_COMBO.marketPrice.toLocaleString('en-IN')}</span>
                    <div className="font-headline font-bold text-secondary text-2xl">स्पेशल भाव: ₹{WEDDING_COMBO.offerPrice.toLocaleString('en-IN')}</div>
                  </div>
                  <span className="px-3 py-1 bg-error text-on-error rounded-full text-sm font-bold">₹{WEDDING_COMBO.savings.toLocaleString('en-IN')} की बचत</span>
                </div>
              </div>
              <div className="w-full lg:w-72 bg-surface-container-lowest rounded-2xl p-4 shadow-md text-center shrink-0">
                <img src={WEDDING_COMBO.image} alt="Wedding Furniture Set" className="w-full h-40 object-cover rounded-xl mb-3" loading="lazy" />
                <p className="text-sm text-on-surface-variant mb-3">मात्र ₹2,100 देकर बुकिंग पक्की करें</p>
                <a href={WEDDING_COMBO.whatsapp} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: '#15803d' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>event_available</span>
                  शादी पैकेज बुक करें (WhatsApp)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Budget calculator */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm" id="estimate-calc">
          <div className="text-center mb-6">
            <span className="text-secondary text-xs font-label uppercase tracking-widest font-bold">तुरंत हिसाब लगाएँ</span>
            <h3 className="font-headline font-bold text-primary text-xl mt-1">अपना मोटा अनुमानित बजट कैलकुलेट करें</h3>
          </div>
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="block font-label font-semibold text-primary text-sm mb-1">काम का प्रकार चुनें:</label>
              <select
                value={selectedCalcItem}
                onChange={e => setSelectedCalcItem(Number(e.target.value))}
                className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PRICE_CALCULATOR_ITEMS.map((item, i) => (
                  <option key={item.labelEn} value={i}>
                    {item.label} — ₹{item.pricePerUnit.toLocaleString('en-IN')}/{item.unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label font-semibold text-primary text-sm mb-1">संख्या: {quantity} {calcItem.unit}</label>
              <input
                type="range"
                min="1"
                max="20"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-on-surface-variant mt-1"><span>1</span><span>20</span></div>
            </div>
            <div className="bg-surface-container rounded-xl p-4 text-center">
              <div className="text-on-surface-variant text-sm">अनुमानित कुल लागत</div>
              <div className="font-headline font-extrabold text-secondary text-3xl mt-1">₹{totalPrice.toLocaleString('en-IN')}</div>
              <div className="text-on-surface-variant text-xs mt-1">* यह अनुमान है। असली दाम सटीक नाप के बाद तय होगा।</div>
            </div>
            <a
              href={`https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20mujhe%20${quantity}%20${encodeURIComponent(calcItem.labelEn)}%20ke%20liye%20rate%20chahiye.%20Budget%20approx%20Rs.${totalPrice}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#15803d' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
              इस हिसाब से WhatsApp पर बात करें
            </a>
          </div>
        </div>

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
