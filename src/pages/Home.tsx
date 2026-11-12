import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BUSINESS } from '../data/business'

function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setSeconds(s => {
        if (s >= 29) { setPlaying(false); return 0 }
        return s + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [playing])

  const fmt = (s: number) => `0:${s.toString().padStart(2, '0')}`
  const heights = [35, 60, 25, 85, 50, 75, 40, 95, 65, 30, 70, 50, 90, 40, 60, 20, 75, 45, 80, 50, 25, 65, 95, 55, 30]

  return (
    <div className="bg-surface-container-high rounded-xl p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
          aria-label={playing ? 'Pause voice note' : 'Play voice note'}
          type="button"
        >
          <span className="material-symbols-outlined">{playing ? 'pause' : 'play_arrow'}</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1 font-label font-bold text-primary text-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>record_voice_over</span>
            शर्मा जी की आवाज़ में 30 सेकंड का संदेश
          </div>
          <div className="text-xs text-on-surface-variant">गाँव के बुज़ुर्गों के लिए बोलकर समझाया गया</div>
        </div>
        <span className="font-mono text-sm text-tertiary">{fmt(seconds)} / 0:30</span>
      </div>
      <div className="mt-3 flex items-end gap-0.5 h-8 overflow-hidden">
        {heights.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${playing ? 'bg-primary' : 'bg-outline-variant'}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-on-surface-variant italic px-1">{BUSINESS.voiceNote.transcript}</p>
    </div>
  )
}

export default function Home() {
  const [materialTab, setMaterialTab] = useState<'wood' | 'aluminium'>('wood')

  const woodAdvantages = [
    { icon: 'park', text: 'गर्मजोशी और पारंपरिक रूप' },
    { icon: 'architecture', text: 'नक्काशी व डिजाइन की पूरी स्वतंत्रता' },
    { icon: 'history', text: 'पीढ़ियों तक चलने वाली मजबूती' },
    { icon: 'spa', text: 'दीमक-रोधी उपचारित असली सागवान व शीशम' },
  ]

  const alumAdvantages = [
    { icon: 'water_drop', text: 'पूरी तरह वॉटरप्रूफ और सीलन-मुक्त' },
    { icon: 'build', text: 'शून्य रखरखाव, सालों-साल चमकदार' },
    { icon: 'style', text: 'आधुनिक स्लिम प्रोफाइल और चिकना लुक' },
    { icon: 'security', text: 'जंग और दीमक से 100% सुरक्षित जिंदल सेक्शन' },
  ]

  const servicePreview = [
    { icon: 'door_front', nameHindi: 'दरवाजे और चौखट', nameEn: 'Doors & Chaukhat', price: 3200 },
    { icon: 'window', nameHindi: 'खिड़कियाँ और जाली', nameEn: 'Windows & Jali', price: 2100 },
    { icon: 'shelves', nameHindi: 'अलमारी व वार्डरोब', nameEn: 'Almirahs', price: 9500 },
    { icon: 'bed', nameHindi: 'बेड और फर्नीचर', nameEn: 'Beds & Furniture', price: 12000 },
    { icon: 'temple_hindu', nameHindi: 'पूजा मंदिर', nameEn: 'Pooja Mandir', price: 2500 },
    { icon: 'agriculture', nameHindi: 'ट्रॉली और शेड', nameEn: 'Farm & Shop', price: 1500 },
  ]

  const villages = ['रामपुर', 'बिलासपुर', 'किठौर', 'दौराला', 'सरधना', 'मवाना', 'हस्तिनापुर', 'लावर', 'मुरादनगर', 'खतौली', 'गजरौला', 'पिलखुवा', 'अमरोहा', 'हापुड़', 'लोनी']

  return (
    <div className="flex flex-col w-full">
      {/* Status ribbon */}
      <div className="bg-surface-container-low border-b border-outline-variant py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse inline-block" />
            <span><strong className="text-on-surface">कारख़ाना चालू है:</strong> आज रामपुर, बिलासपुर और किठौर क्षेत्र में मुफ़्त होम नाप उपलब्ध है (Call before 5 PM)</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-bold">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified_user</span>
            100% असली शीशम व जिंदल गेज गारंटी
          </div>
        </div>
      </div>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Story + CTA */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>workspace_premium</span>
                25+ Years Experience (1999 से)
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-tertiary text-xs font-semibold">
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>handyman</span>
                मास्टर कारीगर: रामेश्वर शर्मा
              </span>
            </div>

            <div>
              <h1 className="font-headline font-extrabold text-primary leading-tight text-3xl md:text-5xl tracking-tight">
                25 वर्षों का अटूट भरोसा और बेमिसाल कारीगरी
              </h1>
              <p className="mt-2 font-headline text-secondary font-semibold text-lg">
                गाँव-घर, बाज़ार की दुकानों और शादियों के लिए पक्का शीशम-सागवान व जिंदल एल्युमिनियम का काम
              </p>
            </div>

            <p className="text-on-surface-variant text-base leading-relaxed">
              न कोई बिचौलिया, न कोई नकली प्लाईवुड। रामपुर-बिलासपुर क्षेत्र के 15+ गाँवों में 500+ घरों का विश्वास। हम खुद आपके घर आकर नाप लेते हैं और सैंपल दिखाते हैं।
            </p>

            <AudioPlayer />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-3 p-4 rounded-xl text-on-secondary font-bold text-base shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#904d00', boxShadow: '0 2px 0 #663500' }}
              >
                <span className="material-symbols-outlined text-2xl">phone_in_talk</span>
                <div className="text-left">
                  <div>सीधे कॉल करें</div>
                  <div className="text-xs font-normal opacity-80">98765-43210</div>
                </div>
              </a>
              <a
                href={BUSINESS.whatsappEstimate}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 rounded-xl text-on-tertiary font-bold text-base shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#263447', boxShadow: '0 2px 0 #1a2535' }}
              >
                <span className="material-symbols-outlined text-2xl">chat</span>
                <div className="text-left">
                  <div>व्हाट्सएप पर फोटो भेजें</div>
                  <div className="text-xs font-normal opacity-80">तुरंत रेट पाएँ</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Artisan photo + trust card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden min-h-80 flex-1">
              <img
                src="https://placehold.co/500x600/542809/ffdbc9?text=Rameshwar+Sharma+Ji"
                alt="Shri Rameshwar Sharma - Master Artisan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-on-primary">
                <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold uppercase tracking-wide">Master Artisan</span>
                <h2 className="font-headline font-bold text-xl mt-1">{BUSINESS.artisanNameHindi}</h2>
                <p className="text-xs text-primary-fixed italic mt-1">"हथौड़े और रंदे की आवाज़ मेरी ज़िंदगी है।"</p>
                <div className="mt-2 flex items-center justify-between bg-primary-container/70 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="material-symbols-outlined text-secondary-fixed" style={{ fontSize: '18px' }}>verified</span>
                    <span>पंजीकृत स्थानीय वर्कशॉप</span>
                  </div>
                  <span className="font-mono text-sm text-secondary-fixed font-bold">ESTD. 1999</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl">balance</span>
              </div>
              <div>
                <div className="font-headline font-bold text-primary text-lg">खरा नाप, खरा दाम</div>
                <div className="text-on-surface-variant text-sm">एक बार तय हुआ तो बीच में कोई एक्स्ट्रा खर्चा नहीं जोड़ा जाता।</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-surface-container-high py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { icon: 'workspace_premium', value: '25+', label: 'Years Exp.', labelH: 'वर्षों का अनुभव' },
            { icon: 'cottage', value: '500+', label: 'Homes', labelH: 'घर सजाए' },
            { icon: 'location_on', value: '15+', label: 'Villages', labelH: 'गाँव सेवित' },
            { icon: 'handshake', value: '5-Year', label: 'Warranty', labelH: 'वारंटी' },
            { icon: 'straighten', value: 'Free', label: 'Home Visit', labelH: 'होम नाप मुफ़्त' },
            { icon: 'verified', value: '100%', label: 'Genuine', labelH: 'असली माल' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-secondary text-2xl">{s.icon}</span>
              <span className="font-headline font-extrabold text-primary text-xl">{s.value}</span>
              <span className="text-on-surface font-semibold text-xs">{s.label}</span>
              <span className="text-on-surface-variant text-xs">{s.labelH}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wood vs Aluminium toggle */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="text-center mb-4">
          <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">लकड़ी या एल्युमिनियम</span>
          <h2 className="font-headline font-bold text-primary text-2xl mt-1">आपकी जरूरत के अनुसार सही सलाह</h2>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMaterialTab('wood')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${materialTab === 'wood' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
            type="button"
          >
            <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: '18px' }}>park</span>
            लकड़ी / Wood
          </button>
          <button
            onClick={() => setMaterialTab('aluminium')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${materialTab === 'aluminium' ? 'bg-tertiary text-on-tertiary shadow-md' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
            type="button"
          >
            <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: '18px' }}>view_in_ar</span>
            एल्युमिनियम / Aluminium
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(materialTab === 'wood' ? woodAdvantages : alumAdvantages).map(a => (
            <div key={a.text} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col items-center text-center gap-2">
              <span className={`material-symbols-outlined text-3xl ${materialTab === 'wood' ? 'text-secondary' : 'text-tertiary'}`}>{a.icon}</span>
              <span className="text-sm font-label font-semibold text-on-surface">{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-surface-container-low py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest">हमारी सेवाएँ</span>
            <h2 className="font-headline font-bold text-primary text-2xl mt-1">लकड़ी और एल्युमिनियम का हर काम</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {servicePreview.map(s => (
              <Link
                key={s.icon}
                to="/services"
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
                </div>
                <div>
                  <div className="font-headline font-bold text-on-surface text-sm">{s.nameHindi}</div>
                  <div className="text-on-surface-variant text-xs">{s.nameEn}</div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-primary bg-secondary-fixed/60 border border-secondary-fixed">
                    ₹{s.price.toLocaleString('en-IN')} से शुरू
                  </span>
                  <span className="material-symbols-outlined text-primary text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/services" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>list</span>
              सभी सेवाएँ और दाम देखें
            </Link>
          </div>
        </div>
      </section>

      {/* Trust rules */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="text-center mb-6">
          <span className="text-secondary text-xs font-label uppercase tracking-widest">गाँव के भाई शर्मा जी पर क्यों भरोसा करते हैं?</span>
          <h2 className="font-headline font-bold text-primary text-2xl mt-1">विश्वास के 4 नियम</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUSINESS.trustRules.map(r => (
            <div key={r.number} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border-l-4 border-secondary">
              <div className="font-headline font-extrabold text-3xl text-outline-variant mb-2">{r.number}</div>
              <div className="font-headline font-bold text-primary text-lg mb-1">{r.titleHindi}</div>
              <div className="text-on-surface-variant text-sm leading-relaxed">{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Villages coverage */}
      <section className="bg-surface-container-low py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">map</span>
                <h2 className="font-headline font-bold text-primary text-xl">इन 15+ गाँवों में हमारा काम देखा जा सकता है</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {villages.map(v => (
                  <span key={v} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-tertiary text-sm font-label font-semibold">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                    {v}
                  </span>
                ))}
              </div>
              <Link to="/village-map" className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>map</span>
                इंटरैक्टिव नक्शा देखें
              </Link>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm text-center">
              <div className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-3">संपर्क सूत्र</div>
              <div className="w-24 h-24 mx-auto bg-surface-container-high rounded-full flex items-center justify-center border-2 border-outline-variant mb-2">
                <span className="material-symbols-outlined text-5xl text-primary">phone_in_talk</span>
              </div>
              <div className="font-headline font-bold text-primary text-xl">+91 98765 43210</div>
              <div className="text-on-surface-variant text-xs mt-1">शर्मा जी बढ़ई एवं एल्युमिनियम वर्क्स</div>
              <a href="tel:+919876543210" className="mt-3 w-full flex items-center justify-center gap-2 bg-surface-container text-primary py-2.5 rounded-lg text-sm font-bold hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>contact_phone</span>
                संपर्क करने के लिए टैप करें
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA banner */}
      <section className="w-full py-10 bg-primary text-on-primary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary-container rounded-2xl p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">आज ही तय करें — No Obligation Free Consultation</span>
              <h2 className="font-headline font-bold text-on-primary text-2xl mt-2">मकान की चौखट, खिड़की या शादी के फर्नीचर की बात पक्की करें</h2>
              <p className="text-on-primary-container text-sm mt-2">शर्मा जी कल आपके गाँव की तरफ आ रहे हैं। अपना नाम, गाँव का नाम और फोन नंबर बताकर अपना समय बुक करें।</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-on-secondary bg-secondary shadow-md hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">call</span>
                फोन लगाएँ: 98765-43210
              </a>
              <a
                href={BUSINESS.whatsappMeasurement}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-on-tertiary bg-tertiary shadow-md hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">home_pin</span>
                घर पर नाप के लिए बुलाएँ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
