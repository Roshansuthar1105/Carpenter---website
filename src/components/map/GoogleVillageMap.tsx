import { useEffect, useRef, useState } from 'react'
import { VillagePin, WORKSHOP_LOCATION } from '../../data/villages'

interface GoogleVillageMapProps {
  pins: VillagePin[]
  selectedPin: VillagePin
  onSelectPin: (pin: VillagePin) => void
}

declare global {
  interface Window {
    google?: any
    __googleMapsCallback?: () => void
  }
}

export default function GoogleVillageMap({
  pins,
  selectedPin,
  onSelectPin,
}: GoogleVillageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap')
  const [loadStatus, setLoadStatus] = useState<'loading' | 'google' | 'fallback'>('loading')

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Load Google Maps if API key is present
  useEffect(() => {
    if (!apiKey) {
      setLoadStatus('fallback')
      return
    }

    if (window.google?.maps) {
      setLoadStatus('google')
      initGoogleMap()
      return
    }

    const scriptId = 'google-maps-js-sdk'
    if (!document.getElementById(scriptId)) {
      window.__googleMapsCallback = () => {
        setLoadStatus('google')
        initGoogleMap()
      }
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__googleMapsCallback`
      script.async = true
      script.defer = true
      script.onerror = () => {
        setLoadStatus('fallback')
      }
      document.head.appendChild(script)
    }
  }, [apiKey])

  // Initialize Google Maps instance
  const initGoogleMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return

    const center = { lat: selectedPin.lat || WORKSHOP_LOCATION.lat, lng: selectedPin.lng || WORKSHOP_LOCATION.lng }
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 11,
      mapTypeId: mapType,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
      ],
    })
    mapInstanceRef.current = map

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    // Workshop Marker
    new window.google.maps.Marker({
      position: { lat: WORKSHOP_LOCATION.lat, lng: WORKSHOP_LOCATION.lng },
      map,
      title: WORKSHOP_LOCATION.name,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#542809',
        fillOpacity: 1,
        strokeColor: '#ffdcc3',
        strokeWeight: 3,
      },
      label: {
        text: 'कारख़ाना',
        color: '#542809',
        fontWeight: 'bold',
        fontSize: '12px',
        className: 'map-marker-label bg-white px-1.5 py-0.5 rounded shadow text-xs',
      },
    })

    // Village Markers
    pins.forEach(pin => {
      const isSelected = pin.id === selectedPin.id
      const marker = new window.google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map,
        title: `${pin.nameHindi} (${pin.name})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 8 : 6,
          fillColor: isSelected ? '#904d00' : '#6f3e1e',
          fillOpacity: 1,
          strokeColor: isSelected ? '#ffffff' : '#ffdcc3',
          strokeWeight: isSelected ? 3 : 1.5,
        },
        label: {
          text: pin.name,
          color: '#1b1c1a',
          fontWeight: isSelected ? 'bold' : 'normal',
          fontSize: '11px',
        },
      })

      marker.addListener('click', () => {
        onSelectPin(pin)
      })

      markersRef.current.push(marker)
    })
  }

  // Pan map when selected pin changes
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps && selectedPin) {
      mapInstanceRef.current.panTo({ lat: selectedPin.lat, lng: selectedPin.lng })
      mapInstanceRef.current.setZoom(12)
    }
  }, [selectedPin])

  // Change Google map type
  const handleMapTypeChange = (type: 'roadmap' | 'satellite' | 'terrain') => {
    setMapType(type)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(type)
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-outline-variant shadow-md bg-surface-container-low" style={{ height: '460px' }}>
      {/* Google Maps Container */}
      <div ref={mapContainerRef} className={`w-full h-full ${loadStatus === 'google' ? 'block' : 'hidden'}`} />

      {/* Fallback Real Interactive Map (when API key is pending or loading) */}
      {loadStatus !== 'google' && (
        <div className="relative w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-[#f5f3ef] via-[#ede9e2] to-[#e4ded6]">
          {/* Real GPS coordinates interactive grid representation */}
          <div className="relative flex-1 w-full rounded-xl overflow-hidden border border-outline-variant/60 shadow-inner bg-white">
            <iframe
              title="Interactive Village GPS Regional Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=77.50%2C28.75%2C78.15%2C29.25&layer=mapnik&marker=${selectedPin.lat}%2C${selectedPin.lng}`}
              className="w-full h-full opacity-90"
            />

            {/* Floating Village Pins Bar */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-auto">
              {pins.map(pin => {
                const isSelected = pin.id === selectedPin.id
                return (
                  <button
                    key={pin.id}
                    onClick={() => onSelectPin(pin)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-label font-bold shadow-md transition-all ${
                      isSelected
                        ? 'bg-secondary text-on-secondary ring-2 ring-white scale-105'
                        : 'bg-white/95 text-on-surface hover:bg-surface-container'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xs" style={{ fontSize: '13px' }}>
                      {pin.id === 'rampur' ? 'home_pin' : 'location_on'}
                    </span>
                    <span>{pin.name}</span>
                    <span className="text-[10px] opacity-75">({pin.distanceKm}km)</span>
                  </button>
                )
              })}
            </div>

            {/* GPS Coordinates readout */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs shadow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-mono text-tertiary font-semibold">
                GPS: {selectedPin.lat.toFixed(4)}°N, {selectedPin.lng.toFixed(4)}°E ({selectedPin.name})
              </span>
            </div>
          </div>

          {/* Setup Pill */}
          <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant bg-surface-container/90 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>explore</span>
              <span><strong>वास्तविक भौगोलिक पिन:</strong> रामपुर वर्कशॉप एवं सभी 15+ गाँव लाइव मैप पर दर्शाए गए हैं।</span>
            </div>
            {!apiKey && (
              <span className="text-[11px] bg-secondary-fixed/70 text-on-secondary-fixed px-2 py-0.5 rounded font-mono">
                Google Satellite: Add VITE_GOOGLE_MAPS_API_KEY
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map Controls (when Google Maps is active) */}
      {loadStatus === 'google' && (
        <div className="absolute top-3 left-3 z-10 flex gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow border border-outline-variant">
          {(['roadmap', 'satellite', 'terrain'] as const).map(type => (
            <button
              key={type}
              onClick={() => handleMapTypeChange(type)}
              className={`px-3 py-1 rounded-lg text-xs font-label font-bold capitalize transition-colors ${
                mapType === type ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
            >
              {type === 'roadmap' ? 'Map' : type === 'satellite' ? 'Satellite' : 'Terrain'}
            </button>
          ))}
        </div>
      )}

      {/* Center Workshop Shortcut */}
      <button
        onClick={() => {
          const rampur = pins.find(p => p.id === 'rampur') || pins[0]
          onSelectPin(rampur)
        }}
        className="absolute bottom-4 right-4 z-10 bg-primary text-on-primary px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg hover:opacity-90 flex items-center gap-1.5 transition-all"
        type="button"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>home_pin</span>
        <span>वर्कशॉप पर जाएँ</span>
      </button>
    </div>
  )
}
