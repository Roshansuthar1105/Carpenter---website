import { useEffect, useState, useRef } from 'react'
import {
  VILLAGE_PINS,
  VILLAGE_DIRECTORY,
  VIDEO_REVIEWS,
  VillagePin,
  WORKSHOP_LOCATION,
  calculateDistanceKm,
} from '../data/villages'
import GoogleVillageMap from '../components/map/GoogleVillageMap'
import { DataService } from '../services/dataService'
import { uploadToCloudinary } from '../services/cloudinary'
import AudioPlayer from '../components/common/AudioPlayer'
import VoiceInput from '../components/common/VoiceInput'

export default function VillageMap() {
  const [pins, setPins] = useState<VillagePin[]>(VILLAGE_PINS)
  const [selectedPin, setSelectedPin] = useState<VillagePin>(VILLAGE_PINS[0])
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Quick Add Work Modal State (Requirement 4)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingGps, setIsFetchingGps] = useState(false)
  const [quickNotice, setQuickNotice] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [quickForm, setQuickForm] = useState({
    name: '',
    nameHindi: '',
    distanceKm: '0',
    lat: '28.9800',
    lng: '77.7800',
    featuredWorkTitleHindi: '',
    featuredWorkTitle: '',
    quote: '',
    quoteAuthor: '',
    workType: 'Main Door & Windows',
    deliveryTime: '7 Days',
    materials: 'Grade-A Sagwan + Jindal Aluminium',
    warranty: '5-Year Guarantee',
    mediaType: 'video' as 'video' | 'audio',
  })
  const [quickPhotoFile, setQuickPhotoFile] = useState<File | null>(null)
  const [quickPhotoPreview, setQuickPhotoPreview] = useState<string>('')
  const [quickMediaFile, setQuickMediaFile] = useState<File | null>(null)
  const [quickMediaPreview, setQuickMediaPreview] = useState<string>('')
  const [quickMediaName, setQuickMediaName] = useState<string>('')

  // Fetch live pins from Supabase on mount
  useEffect(() => {
    DataService.fetchVillagePins().then(loadedPins => {
      if (loadedPins && loadedPins.length > 0) {
        setPins(loadedPins)
        setSelectedPin(loadedPins[0])
      }
    })
  }, [])

  // Auto-play 9:16 video or audio when selecting a pin
  const handleSelectPin = (pin: VillagePin) => {
    setSelectedPin(pin)
    setAutoplayBlocked(false)

    if (pin.videoUrl) {
      setIsPlayingVideo(true)
      // Slight tick for video element to mount if needed
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0
          const playPromise = videoRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // If browser restricts unmuted autoplay, mute and continue playing
              if (videoRef.current) {
                videoRef.current.muted = true
                setIsMuted(true)
                videoRef.current.play().catch(() => setAutoplayBlocked(true))
              }
              setAutoplayBlocked(true)
            })
          }
        }
      }, 80)
    } else {
      setIsPlayingVideo(false)
    }
  }

  // Handle GPS location fetch for quick add
  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setQuickNotice({ message: 'ब्राउज़र में GPS Geolocation समर्थित नहीं है।', type: 'error' })
      return
    }

    setIsFetchingGps(true)
    setQuickNotice({ message: 'वर्तमान GPS निर्देशांक प्राप्त किए जा रहे हैं...', type: 'info' })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsFetchingGps(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const dist = calculateDistanceKm(WORKSHOP_LOCATION.lat, WORKSHOP_LOCATION.lng, lat, lng)

        // Try to match nearest village from directory
        let nearestVillage = ''
        let nearestVillageHindi = ''
        let minD = 999
        VILLAGE_DIRECTORY.forEach(v => {
          if (Math.abs(v.distanceKm - dist) < minD) {
            minD = Math.abs(v.distanceKm - dist)
            nearestVillage = v.name
            nearestVillageHindi = v.nameHindi
          }
        })

        setQuickForm(prev => ({
          ...prev,
          lat: lat.toFixed(4),
          lng: lng.toFixed(4),
          distanceKm: String(dist),
          name: prev.name || nearestVillage || 'Village',
          nameHindi: prev.nameHindi || nearestVillageHindi || 'गाँव',
        }))

        setQuickNotice({
          message: `GPS प्राप्त: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (दूरी: ${dist} km)`,
          type: 'success',
        })
      },
      (err) => {
        setIsFetchingGps(false)
        setQuickNotice({ message: `GPS त्रुटि: ${err.message}`, type: 'error' })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Handle Quick Add Work Submit
  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickPhotoFile) {
      setQuickNotice({ message: 'कृपया 1:1 चौकोर कार्य की फोटो चुनें (Please select work photo)', type: 'error' })
      return
    }

    try {
      setIsSubmitting(true)
      setQuickNotice({ message: 'फोटो Cloudinary पर अपलोड हो रही है...', type: 'info' })

      const photoRes = await uploadToCloudinary(quickPhotoFile, { folder: 'carpenter_villages' })

      let videoUrl = ''
      let audioUrl = ''

      if (quickForm.mediaType === 'video' && quickMediaFile) {
        setQuickNotice({ message: '9:16 वीडियो Cloudinary पर अपलोड हो रहा है...', type: 'info' })
        const videoRes = await uploadToCloudinary(quickMediaFile, { folder: 'carpenter_videos' })
        videoUrl = videoRes.secure_url
      } else if (quickForm.mediaType === 'audio' && quickMediaFile) {
        setQuickNotice({ message: 'MP3 वॉयस रिकॉर्डिंग Cloudinary पर अपलोड हो रही है...', type: 'info' })
        const audioRes = await uploadToCloudinary(quickMediaFile, { folder: 'carpenter_audios' })
        audioUrl = audioRes.secure_url
      }

      setQuickNotice({ message: 'डेटाबेस में सहेजा जा रहा है...', type: 'info' })
      const newPinData = {
        name: quickForm.name || 'Site Work',
        nameHindi: quickForm.nameHindi || 'कार्य स्थल',
        distanceKm: Number(quickForm.distanceKm) || 0,
        lat: Number(quickForm.lat) || 28.98,
        lng: Number(quickForm.lng) || 77.78,
        workCount: 1,
        rating: 5.0,
        featuredWorkTitle: quickForm.featuredWorkTitle || `${quickForm.name} Work`,
        featuredWorkTitleHindi: quickForm.featuredWorkTitleHindi || `${quickForm.nameHindi} में कार्य`,
        imageUrl: photoRes.secure_url,
        videoUrl,
        audioUrl,
        quote: quickForm.quote || 'शर्मा जी का काम बहुत पक्का और समय पर हुआ।',
        quoteAuthor: quickForm.quoteAuthor || `${quickForm.nameHindi} ग्राहक`,
        workType: quickForm.workType,
        deliveryTime: quickForm.deliveryTime,
        materials: quickForm.materials,
        warranty: quickForm.warranty,
      }

      const res = await DataService.addVillagePin(newPinData)

      if (res.success) {
        setQuickNotice({ message: 'गाँव का पिन और मीडिया सफलतापूर्वक मैप पर जुड़ गया!', type: 'success' })
        setTimeout(() => {
          setShowAddModal(false)
          DataService.fetchVillagePins().then(loaded => {
            if (loaded) {
              setPins(loaded)
              const added = loaded.find(p => p.image === photoRes.secure_url) || loaded[0]
              handleSelectPin(added)
            }
          })
        }, 1200)
      } else {
        setQuickNotice({ message: `त्रुटि: ${res.error}`, type: 'error' })
      }
    } catch (err: any) {
      setQuickNotice({ message: `अपलोड विफल: ${err.message}`, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="bg-primary text-on-primary py-8 w-full">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">
              प्रमाणित सेवित बस्तियाँ — 25+ वर्षों का विश्वास
            </span>
            <h1 className="font-headline font-extrabold text-3xl mt-2">
              हमारे आस-पास के 15+ गाँव जहाँ शर्मा जी के हाथ का काम देखा जा सकता है
            </h1>
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

          {/* Quick Add Work on Map Action Button (Requirement 4) */}
          <div className="shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3.5 bg-secondary text-on-secondary rounded-2xl font-headline font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all ring-2 ring-white/20"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">add_location_alt</span>
              <span>+ इस गाँव में नया कार्य जोड़ें</span>
            </button>
            <div className="text-right text-[11px] text-secondary-fixed mt-1.5 font-label">
              GPS लोकेशन व 9:16 वीडियो / MP3 ऑडियो तुरंत अपलोड करें
            </div>
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
              <span className="text-xs text-on-surface-variant font-label">
                किसी भी गाँव के पिन पर टैप करें (ऑटो-प्ले शुरू होगा)
              </span>
            </div>

            <GoogleVillageMap
              pins={pins}
              selectedPin={selectedPin}
              onSelectPin={handleSelectPin}
            />

            {/* Privacy notice banner */}
            <div className="bg-surface-container rounded-xl p-3 text-xs text-on-surface-variant flex items-start gap-2 border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '18px' }}>privacy_tip</span>
              <span>
                <strong className="text-on-surface">गोपनीयता और ग्राहक सम्मान (Privacy Policy):</strong> सभी ग्राहकों की सहमति से केवल गाँव या निकटतम चौराहे के स्तर पर पिन दर्शाया गया है। किसी भी ग्राहक का निजी मकान नंबर या मोबाइल नंबर सार्वजनिक नहीं किया जाता।
              </span>
            </div>
          </div>

          {/* Right: Selected village inspection sheet & 9:16 Reel Player or Audio Player */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline font-bold text-primary text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified</span>
                {selectedPin.nameHindi} का वास्तविक कार्य व समीक्षा
              </h2>
              {selectedPin.videoUrl ? (
                <span className="text-[11px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">play_arrow</span>
                  9:16 रील
                </span>
              ) : selectedPin.audioUrl ? (
                <span className="text-[11px] bg-secondary-container text-on-secondary-container font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">mic</span>
                  MP3 समीक्षा
                </span>
              ) : (
                <span className="text-[11px] bg-surface-container text-on-surface-variant font-bold px-2 py-0.5 rounded-full">
                  1:1 फोटो
                </span>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden border border-outline-variant/60 flex flex-col">
              {/* Media Container: 9:16 Video Player OR 1:1 Photo with Audio */}
              <div className="p-4 bg-surface-container-low flex flex-col items-center justify-center">
                {/* 1. 9:16 Reel Video Player with Autoplay (Requirement 3) */}
                {selectedPin.videoUrl ? (
                  <div className="relative aspect-[9/16] w-full max-w-[320px] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
                    <video
                      ref={videoRef}
                      src={selectedPin.videoUrl}
                      autoPlay
                      playsInline
                      muted={isMuted}
                      loop
                      controls
                      className="w-full h-full object-cover"
                      onPlay={() => {
                        setIsPlayingVideo(true)
                        setAutoplayBlocked(false)
                      }}
                      onEnded={() => setIsPlayingVideo(false)}
                    />

                    {/* Autoplay blocked sound prompt */}
                    {autoplayBlocked && (
                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.muted = false
                            setIsMuted(false)
                            videoRef.current.play()
                            setAutoplayBlocked(false)
                          }
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-secondary text-on-secondary px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-1.5 animate-bounce"
                      >
                        <span className="material-symbols-outlined text-base">volume_up</span>
                        <span>आवाज़ चालू करें (Tap to Unmute)</span>
                      </button>
                    )}

                    {/* Top overlay strip */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        {selectedPin.nameHindi} • 9:16 रील
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted
                            setIsMuted(!isMuted)
                          }
                        }}
                        className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        <span className="material-symbols-outlined text-base">
                          {isMuted ? 'volume_off' : 'volume_up'}
                        </span>
                      </button>
                    </div>

                    {/* Bottom overlay with customer quote */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white z-20 pointer-events-none">
                      <div className="text-xs font-bold text-secondary-fixed">{selectedPin.nameHindi} ({selectedPin.name})</div>
                      <div className="text-sm font-bold line-clamp-1">{selectedPin.featuredWorkTitleHindi}</div>
                      <p className="text-[11px] text-white/90 italic mt-1 line-clamp-2 leading-tight">
                        {selectedPin.quote}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 2. 1:1 Toolpin Photo (Requirement 2) */
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="relative aspect-square w-full max-w-[300px] rounded-2xl overflow-hidden shadow-lg border border-outline-variant/60">
                      <img
                        src={selectedPin.image}
                        alt={selectedPin.featuredWorkTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                        <span className="material-symbols-outlined text-xs text-secondary-fixed">crop_square</span>
                        1:1 Toolpin Photo
                      </div>
                    </div>

                    {/* MP3 Voice Review Player (Requirement 6) */}
                    {selectedPin.audioUrl && (
                      <div className="w-full max-w-[300px]">
                        <AudioPlayer
                          src={selectedPin.audioUrl}
                          title={`${selectedPin.nameHindi} ग्राहक समीक्षा`}
                          author={selectedPin.quoteAuthor}
                          autoPlay={true}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Work Details & Specifications */}
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

      {/* Quick Add Work at Current Location Modal (Requirement 4 & 5) */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-xl">add_location_alt</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-primary text-base">गाँव में कार्य व 9:16 वीडियो / MP3 जोड़ें</h3>
                  <p className="text-xs text-on-surface-variant">GPS ऑटो-डिटेक्ट करें या बोलकर भरें</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {quickNotice && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  quickNotice.type === 'success'
                    ? 'bg-[#15803d]/15 text-[#15803d] border border-[#15803d]/30'
                    : quickNotice.type === 'error'
                    ? 'bg-error/15 text-error border border-error/30'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {quickNotice.type === 'success' ? 'check_circle' : quickNotice.type === 'error' ? 'error' : 'info'}
                </span>
                <span>{quickNotice.message}</span>
              </div>
            )}

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              {/* GPS Auto-Fetch Bar */}
              <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/60 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-sm">my_location</span>
                    <span>GPS निर्देशांक: {Number(quickForm.lat).toFixed(4)}°N, {Number(quickForm.lng).toFixed(4)}°E</span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant">वर्कशॉप से दूरी: {quickForm.distanceKm} km</div>
                </div>
                <button
                  type="button"
                  onClick={handleFetchCurrentLocation}
                  disabled={isFetchingGps}
                  className="px-3 py-1.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0 disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm ${isFetchingGps ? 'animate-spin' : ''}`}>
                    {isFetchingGps ? 'sync' : 'near_me'}
                  </span>
                  <span>{isFetchingGps ? 'खोज रहे हैं...' : 'वर्तमान GPS लें'}</span>
                </button>
              </div>

              {/* 1:1 Photo & Media Upload Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1:1 Photo Upload */}
                <div>
                  <label className="block font-label font-bold text-xs mb-1">
                    1:1 चौकोर कार्य की फोटो *
                  </label>
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-3 text-center relative hover:bg-surface-container-low transition-colors cursor-pointer bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      required={!quickPhotoFile}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setQuickPhotoFile(file)
                          setQuickPhotoPreview(URL.createObjectURL(file))
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {quickPhotoPreview ? (
                      <div className="aspect-square w-24 mx-auto rounded-lg overflow-hidden shadow">
                        <img src={quickPhotoPreview} alt="1:1 Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-2xl">photo_camera</span>
                        <span className="text-[11px] font-bold">1:1 फोटो खींचे या चुनें</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video or Audio Selector & Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-label font-bold text-xs">समीक्षा मीडिया</label>
                    <div className="flex gap-1 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setQuickForm(f => ({ ...f, mediaType: 'video' }))}
                        className={`px-1.5 py-0.5 rounded ${quickForm.mediaType === 'video' ? 'bg-primary text-on-primary' : 'bg-surface-container'}`}
                      >
                        9:16 वीडियो
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickForm(f => ({ ...f, mediaType: 'audio' }))}
                        className={`px-1.5 py-0.5 rounded ${quickForm.mediaType === 'audio' ? 'bg-secondary text-on-secondary' : 'bg-surface-container'}`}
                      >
                        MP3
                      </button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-3 text-center relative hover:bg-surface-container-low transition-colors cursor-pointer bg-white">
                    <input
                      type="file"
                      accept={quickForm.mediaType === 'video' ? 'video/*' : 'audio/*,.mp3,.wav,.m4a'}
                      capture="environment"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setQuickMediaFile(file)
                          setQuickMediaName(file.name)
                          setQuickMediaPreview(URL.createObjectURL(file))
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {quickMediaName ? (
                      <div className="py-2 flex flex-col items-center gap-1 text-secondary font-bold text-xs">
                        <span className="material-symbols-outlined text-2xl">
                          {quickForm.mediaType === 'video' ? 'videocam' : 'mic'}
                        </span>
                        <span className="truncate max-w-[150px]">{quickMediaName}</span>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-2xl">
                          {quickForm.mediaType === 'video' ? 'video_camera_front' : 'mic'}
                        </span>
                        <span className="text-[11px] font-bold">
                          {quickForm.mediaType === 'video' ? '9:16 वीडियो रिकॉर्ड करें' : 'MP3 ऑडियो रिकॉर्ड करें'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Village Name & Work Title with Voice Input (Requirement 5) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-label font-semibold text-xs">गाँव का नाम (Hindi) *</label>
                    <VoiceInput
                      defaultLanguage="hi-IN"
                      currentValue={quickForm.nameHindi}
                      onResult={(val) => setQuickForm(f => ({ ...f, nameHindi: val, name: f.name || val }))}
                      size="sm"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="उदा: रामपुर"
                    value={quickForm.nameHindi}
                    onChange={e => setQuickForm(f => ({ ...f, nameHindi: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-label font-semibold text-xs">Village (English)</label>
                    <VoiceInput
                      defaultLanguage="en-IN"
                      currentValue={quickForm.name}
                      onResult={(val) => setQuickForm(f => ({ ...f, name: val }))}
                      size="sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Rampur"
                    value={quickForm.name}
                    onChange={e => setQuickForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label font-semibold text-xs">कार्य शीर्षक (Featured Work Hindi) *</label>
                  <VoiceInput
                    defaultLanguage="hi-IN"
                    currentValue={quickForm.featuredWorkTitleHindi}
                    onResult={(val) => setQuickForm(f => ({ ...f, featuredWorkTitleHindi: val }))}
                    size="sm"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="उदा: सागवान नक्काशीदार मुख्य द्वार"
                  value={quickForm.featuredWorkTitleHindi}
                  onChange={e => setQuickForm(f => ({ ...f, featuredWorkTitleHindi: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label font-semibold text-xs">ग्राहक की समीक्षा (Customer Quote)</label>
                  <VoiceInput
                    defaultLanguage="hi-IN"
                    currentValue={quickForm.quote}
                    onResult={(val) => setQuickForm(f => ({ ...f, quote: val }))}
                    size="sm"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="उदा: शर्मा जी का काम बहुत मजबूत और समय पर हुआ।"
                  value={quickForm.quote}
                  onChange={e => setQuickForm(f => ({ ...f, quote: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-secondary text-on-secondary rounded-xl font-bold text-sm shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">cloud_upload</span>
                {isSubmitting ? 'मैप पर अपलोड हो रहा है...' : 'मैप पर सुरक्षित व लाइव करें (Upload & Save)'}
              </button>
            </form>
          </div>
        </div>
      )}

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
                      if (matched) handleSelectPin(matched)
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
