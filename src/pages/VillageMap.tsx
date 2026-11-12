import { useEffect, useState } from 'react'
import { VILLAGE_PINS, VILLAGE_DIRECTORY, VIDEO_REVIEWS, VillagePin } from '../data/villages'
import GoogleVillageMap from '../components/map/GoogleVillageMap'
import { DataService } from '../services/dataService'

export default function VillageMap() {
  const [pins, setPins] = useState<VillagePin[]>(VILLAGE_PINS)
  const [selectedPin, setSelectedPin] = useState<VillagePin>(VILLAGE_PINS[0])
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)

  // Fetch live pins from Supabase on mount
  useEffect(() => {
    DataService.fetchVillagePins().then(loadedPins => {
      if (loadedPins && loadedPins.length > 0) {
        setPins(loadedPins)
        setSelectedPin(loadedPins[0])
      }
    })
  }, [])

  // Reset video play state when pin changes
  useEffect(() => {
    setIsPlayingVideo(false)
  }, [selectedPin])

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
              { value: `${pins.length}+`, label: 'गाँव सेवित' },
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

      {/* Real Map + Selected Detail Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Google Village Map */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-primary text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">map</span>
                गाँव का वास्तविक गूगल मैप व पिन
              </h2>
              <span className="text-xs text-on-surface-variant font-label">किसी भी गाँव के पिन पर टैप करें</span>
            </div>

            <GoogleVillageMap
              pins={pins}
              selectedPin={selectedPin}
              onSelectPin={setSelectedPin}
            />

            {/* Privacy notice banner */}
            <div className="bg-surface-container rounded-xl p-3 text-xs text-on-surface-variant flex items-start gap-2 border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '18px' }}>privacy_tip</span>
              <span>
                <strong className="text-on-surface">गोपनीयता और ग्राहक सम्मान (Privacy Policy):</strong> सभी ग्राहकों की सहमति से केवल गाँव या निकटतम चौराहे के स्तर पर पिन दर्शाया गया है। किसी भी ग्राहक का निजी मकान नंबर या मोबाइल नंबर सार्वजनिक नहीं किया जाता।
              </span>
            </div>
          </div>

          {/* Right: Selected village inspection sheet & video player */}
          <div className="lg:col-span-5">
            <h2 className="font-headline font-bold text-primary text-lg mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span>
              {selectedPin.nameHindi} का वास्तविक कार्य व समीक्षा
            </h2>

            <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden border border-outline-variant/60">
              {/* Photo or Live Video */}
              <div className="relative bg-surface-container-high" style={{ minHeight: '220px' }}>
                {isPlayingVideo && selectedPin.videoUrl ? (
                  <video
                    src={selectedPin.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-56 object-cover bg-black"
                  />
                ) : (
                  <div className="relative w-full h-56">
                    <img
                      src={selectedPin.image}
                      alt={selectedPin.featuredWorkTitle}
                      className="w-full h-full object-cover"
                    />
                    {/* Play Video Trigger */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <button
                        onClick={() => setIsPlayingVideo(true)}
                        className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        type="button"
                        aria-label="Play Customer Video"
                      >
                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                      </button>
                      <span className="mt-2 text-white text-xs bg-black/70 px-2.5 py-1 rounded-full font-mono">
                        30-60 सेकंड ग्राहक वीडियो देखें
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                      {selectedPin.nameHindi} विवरण
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">{selectedPin.distanceKm} km दूरी</span>
                  </div>
                  <h3 className="font-headline font-bold text-primary text-lg mt-1">{selectedPin.featuredWorkTitleHindi}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-secondary text-sm">{s}</span>
                    ))}
                    <span className="text-on-surface-variant text-xs ml-1 font-bold">{selectedPin.rating} स्टार रेटिंग</span>
                  </div>
                </div>

                <blockquote className="bg-surface-container-low rounded-xl p-3 border-l-4 border-secondary">
                  <p className="text-on-surface-variant text-sm italic leading-relaxed">{selectedPin.quote}</p>
                  <footer className="mt-2 text-xs font-bold text-primary">— {selectedPin.quoteAuthor}</footer>
                </blockquote>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { icon: 'build', label: 'काम का प्रकार', value: selectedPin.workType },
                    { icon: 'schedule', label: 'समय पर डिलीवरी', value: selectedPin.deliveryTime },
                    { icon: 'texture', label: 'प्रयुक्त सामग्री', value: selectedPin.materials },
                    { icon: 'verified', label: 'वारंटी स्थिति', value: selectedPin.warranty },
                  ].map(s => (
                    <div key={s.label} className="bg-surface-container rounded-lg p-2.5">
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-0.5 font-label">
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>{s.icon}</span>
                        {s.label}
                      </div>
                      <div className="text-xs font-label font-bold text-on-surface">{s.value}</div>
                    </div>
                  ))}
                </div>

                <a
                  href="tel:+919876543210"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-on-error bg-error hover:opacity-90 transition-opacity shadow"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                  {selectedPin.name} जैसा काम करवाने के लिए कॉल करें
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Village Directory & Weekly Visit Schedule Matrix */}
      <div className="bg-surface-container-low py-10 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">गाँव सूची व नाप-तौल रूट (Village Directory)</span>
              <h2 className="font-headline font-bold text-primary text-2xl mt-1">आपके गाँव में शर्मा जी का नाप-तौल वाहन कब आता है?</h2>
            </div>
            <div className="bg-white px-3 py-2 rounded-xl text-xs text-on-surface-variant border border-outline-variant shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>calendar_month</span>
              <span><strong>नियमित रूट दिन:</strong> रामपुर व बिलासपुर: मंगलवार व शुक्रवार • किठौर: बुधवार व शनिवार</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VILLAGE_DIRECTORY.slice(0, 6).map(v => (
              <div key={v.name} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-headline font-bold text-primary">{v.name} ({v.nameHindi})</div>
                    <div className="text-on-surface-variant text-xs">{v.workCount}+ घरों में चौखट, अलमारी व खिड़कियाँ स्थापित</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-tertiary font-label font-bold">{v.distanceKm} km दूरी</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container/60 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '16px' }}>event</span>
                  <span>{v.visitDays} — {v.visitTime} उपलब्ध</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const matched = pins.find(p => p.id.toLowerCase() === v.name.toLowerCase())
                      if (matched) setSelectedPin(matched)
                    }}
                    className="flex-1 py-2 text-center bg-surface-container text-primary rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors"
                    type="button"
                  >
                    काम देखें
                  </button>
                  <a
                    href={v.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#15803d' }}
                  >
                    नाप बुलाएँ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video reviews reels */}
      <div className="max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="mb-6 text-center">
          <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">गाँव के बुजुर्गों व दुकानदारों के बोल (Voice of Experience)</span>
          <h2 className="font-headline font-bold text-primary text-2xl mt-1">सीधे ग्राहकों की जुबानी सुनिए: क्या शर्मा जी का काम वादे के मुताबिक टिका?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VIDEO_REVIEWS.map(v => (
            <div key={v.id} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/40">
              <div className="relative" style={{ height: '170px' }}>
                <img src={v.thumbnail} alt={`${v.customer} review`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl">play_arrow</span>
                  </div>
                </div>
                <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">{v.duration} • 360p</span>
                {v.verified && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed text-xs px-2 py-0.5 rounded font-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>verified</span>
                    100% सत्यापित ग्राहक
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

      {/* Booking CTA banner */}
      <div className="bg-primary text-on-primary py-10 w-full">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">निःशुल्क गाँव विजिट • कोई छिपा खर्च नहीं</span>
            <h2 className="font-headline font-bold text-2xl mt-2">क्या आपके गाँव में नाप-तौल करवाना है?</h2>
            <p className="text-on-primary-container text-sm mt-2">आपको दुकान तक आने की आवश्यकता नहीं है। बस एक फोन कॉल करें या अपने घर/दुकान की फोटो व्हाट्सएप पर भेजें। शर्मा जी का सहायक आपके गाँव आकर पूरा नाप लेकर सही बजट बताएंगे।</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-secondary text-on-secondary font-bold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">call</span>
              कॉल करके गाँव बताएं
            </a>
            <a href="https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20naap%20ke%20liye%20bulana%20hai" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#15803d' }}>
              <span className="material-symbols-outlined">chat</span>
              व्हाट्सएप पर लोकेशन भेजें
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
