import { useState } from 'react'
import { VILLAGE_PINS, VILLAGE_DIRECTORY, VIDEO_REVIEWS, VillagePin } from '../data/villages'

export default function VillageMap() {
  const [selectedPin, setSelectedPin] = useState<VillagePin>(VILLAGE_PINS[0])

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="bg-primary text-on-primary py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">प्रमाणित सेवित बस्तियाँ — 25+ वर्षों का विश्वास</span>
          <h1 className="font-headline font-extrabold text-3xl mt-2">हमारे आस-पास के 15+ गाँव जहाँ शर्मा जी के हाथ का काम देखा जा सकता है</h1>
          <div className="flex gap-8 mt-5">
            {[
              { value: '570+', label: 'संतुष्ट परिवार' },
              { value: '15+', label: 'गाँव सेवित' },
              { value: '0', label: 'मुफ़्त नाप-तौल' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-headline font-extrabold text-2xl text-secondary-fixed">{s.value}</div>
                <div className="text-xs text-on-primary-container">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Detail split */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive SVG map */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline font-bold text-primary text-lg">गाँव का नक्शा चुनें</h2>
              <span className="text-xs text-on-surface-variant">किसी भी pin पर tap करें</span>
            </div>
            <div className="relative bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden" style={{ height: '420px' }}>
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect width="100" height="100" fill="#f5f3ef" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="#d7c2b8" strokeWidth="0.8" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="#d7c2b8" strokeWidth="0.8" />
                <line x1="20" y1="25" x2="80" y2="75" stroke="#e4e2de" strokeWidth="0.5" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="2.5" fill="#542809" />
                <text x="50" y="47" textAnchor="middle" fontSize="2.5" fill="#542809" fontWeight="bold">Workshop</text>

                {VILLAGE_PINS.map(pin => {
                  const isSelected = pin.id === selectedPin.id
                  return (
                    <g key={pin.id} onClick={() => setSelectedPin(pin)} style={{ cursor: 'pointer' }}>
                      <circle
                        cx={pin.positionX}
                        cy={pin.positionY}
                        r={isSelected ? 4.5 : 3}
                        fill={isSelected ? '#904d00' : '#6f3e1e'}
                        stroke={isSelected ? '#ffdcc3' : 'transparent'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={pin.positionX}
                        y={pin.positionY + 6.5}
                        textAnchor="middle"
                        fontSize="2.2"
                        fill="#1b1c1a"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {pin.name}
                      </text>
                      {pin.distanceKm > 0 && (
                        <text
                          x={pin.positionX}
                          y={pin.positionY + 9}
                          textAnchor="middle"
                          fontSize="1.8"
                          fill="#52443c"
                        >
                          {pin.distanceKm} km
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg p-2 text-xs flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-on-surface">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary-container" />
                  <span className="text-on-surface">Village served</span>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-surface-container rounded-lg p-3 text-xs text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined shrink-0" style={{ fontSize: '16px' }}>privacy_tip</span>
              <span><strong className="text-on-surface">गोपनीयता और साझेदार सम्मान:</strong> सभी ग्राहकों की स्वीकृति से pins केवल गाँव के approximate स्तर पर दिखाई जाती हैं। कोई सटीक घर या व्यक्तिगत पता नहीं दिखाया जाता।</span>
            </div>
          </div>

          {/* Selected village detail */}
          <div>
            <h2 className="font-headline font-bold text-primary text-lg mb-3">गाँव का वास्तविक कार्य व समीक्षा</h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
              <img
                src={selectedPin.image}
                alt={selectedPin.featuredWorkTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-xs font-bold mb-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                    {selectedPin.nameHindi}
                  </span>
                  <h3 className="font-headline font-bold text-primary text-lg">{selectedPin.featuredWorkTitleHindi}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-secondary text-sm">{s}</span>
                    ))}
                    <span className="text-on-surface-variant text-xs ml-1">{selectedPin.rating} Rating</span>
                  </div>
                </div>

                <div className="relative bg-surface-container rounded-xl overflow-hidden" style={{ height: '160px' }}>
                  <img src={selectedPin.image} alt="Video thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-xl">
                      <span className="material-symbols-outlined text-on-secondary text-3xl">play_arrow</span>
                    </div>
                    <span className="mt-2 text-white text-xs bg-black/60 px-2 py-1 rounded">Low Data 360p</span>
                  </div>
                </div>

                <blockquote className="bg-surface-container-low rounded-xl p-3 border-l-4 border-secondary">
                  <p className="text-on-surface-variant text-sm italic">{selectedPin.quote}</p>
                  <footer className="mt-2 text-xs font-bold text-primary">— {selectedPin.quoteAuthor}</footer>
                </blockquote>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { icon: 'build', label: 'काम का प्रकार', value: selectedPin.workType },
                    { icon: 'schedule', label: 'डिलीवरी समय', value: selectedPin.deliveryTime },
                    { icon: 'texture', label: 'सामग्री', value: selectedPin.materials },
                    { icon: 'verified', label: 'वारंटी', value: selectedPin.warranty },
                  ].map(s => (
                    <div key={s.label} className="bg-surface-container rounded-lg p-2">
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-0.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{s.icon}</span>
                        {s.label}
                      </div>
                      <div className="text-xs font-label font-semibold text-on-surface">{s.value}</div>
                    </div>
                  ))}
                </div>

                <a
                  href="tel:+919876543210"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-on-error bg-error hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                  {selectedPin.name} जैसा काम करवाने के लिए कॉल करें
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Village directory grid */}
      <div className="bg-surface-container-low py-10 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">गाँव से गाँव तक</span>
            <h2 className="font-headline font-bold text-primary text-2xl mt-1">आपके गाँव में शर्मा जी का नाप-तौल वाहन कब आता है?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VILLAGE_DIRECTORY.slice(0, 6).map(v => (
              <div key={v.name} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-headline font-bold text-primary">{v.name}</div>
                    <div className="text-on-surface-variant text-xs">{v.nameHindi}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-container text-tertiary font-label font-semibold">{v.distanceKm} km</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '16px' }}>event</span>
                  <span>{v.visitDays} — {v.visitTime}</span>
                </div>
                <div className="text-xs text-on-surface-variant">{v.workCount}+ काम पूरे किए</div>
                <div className="flex gap-2">
                  <a href="tel:+919876543210" className="flex-1 py-2 text-center bg-surface-container text-primary rounded-lg text-sm font-bold hover:bg-surface-container-high transition-colors">
                    नाम दर्ज करें
                  </a>
                  <a href={v.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 text-center text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#15803d' }}>
                    नाप बुलाएँ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video reviews */}
      <div className="max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="mb-6 text-center">
          <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">Voice of Experience</span>
          <h2 className="font-headline font-bold text-primary text-2xl mt-1">सीधे ग्राहकों की जुबानी सुनिए</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VIDEO_REVIEWS.map(v => (
            <div key={v.id} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="relative" style={{ height: '160px' }}>
                <img src={v.thumbnail} alt={`${v.customer} review`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-on-secondary text-2xl">play_arrow</span>
                  </div>
                </div>
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">{v.duration} • 360p</span>
                {v.verified && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-secondary-fixed/90 text-on-secondary-fixed text-xs px-2 py-0.5 rounded font-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                    Verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="font-label font-bold text-on-surface text-sm">{v.customer}</div>
                <div className="flex items-center gap-1 text-xs text-tertiary mb-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                  {v.villageHindi} ({v.village})
                </div>
                <p className="text-on-surface-variant text-xs italic leading-relaxed">{v.quote}</p>
                <a
                  href="https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20naap%20ke%20liye%20bulana%20hai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-1 py-2 rounded-lg text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#15803d' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chat</span>
                  WhatsApp पर संपर्क करें
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Village visit booking CTA */}
      <div className="bg-primary text-on-primary py-10 w-full">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">मुफ़्त घर पर नाप — यहाँ बुक करें</span>
            <h2 className="font-headline font-bold text-2xl mt-2">क्या आपके गाँव में नाप-तौल करवाना है?</h2>
            <p className="text-on-primary-container text-sm mt-2">आपको दुकान तक आने की जरूरत नहीं है। बस एक फोन करें या अपने घर/दुकान की फोटो व्हाट्सएप पर भेजें।</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-secondary text-on-secondary font-bold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">call</span>
              कॉल करके गाँव बताएँ
            </a>
            <a href="https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20naap%20ke%20liye%20bulana%20hai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#15803d' }}>
              <span className="material-symbols-outlined">chat</span>
              व्हाट्सएप पर संदेश भेजें
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

