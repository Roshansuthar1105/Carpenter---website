import { useState } from 'react'
import { TRANSFORMATIONS } from '../data/transformations'

type FilterType = 'all' | 'wood' | 'aluminium'

export default function BeforeAfter() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(TRANSFORMATIONS.map(t => [t.id, 50]))
  )

  const filtered = TRANSFORMATIONS.filter(t =>
    activeFilter === 'all' || t.type === activeFilter
  )

  const updateSlider = (id: string, val: number) => {
    setSliderValues(prev => ({ ...prev, [id]: val }))
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="bg-primary text-on-primary py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">100% Original Village Inspection Gallery</span>
          <h1 className="font-headline font-extrabold text-3xl mt-2">काम से पहले और काम के बाद की असली तस्वीरें</h1>
          <p className="text-on-primary-container text-sm mt-2">'असली काम, असली तस्वीरें — इन्हें देखें और फिर तय करें।'</p>
          <div className="flex gap-6 mt-5">
            <div className="text-center">
              <div className="font-headline font-extrabold text-2xl text-secondary-fixed">500+</div>
              <div className="text-xs text-on-primary-container">Transformations</div>
            </div>
            <div className="text-center">
              <div className="font-headline font-extrabold text-2xl text-secondary-fixed">25+</div>
              <div className="text-xs text-on-primary-container">वर्ष अनुभव</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2">
          {(['all', 'wood', 'aluminium'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-label font-semibold transition-colors ${activeFilter === f ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              type="button"
            >
              {f === 'all' ? 'सभी काम' : f === 'wood' ? 'लकड़ी' : 'एल्युमिनियम'}
            </button>
          ))}
          <span className="ml-auto text-xs text-on-surface-variant self-center">Drag slider to inspect</span>
        </div>
      </div>

      {/* Transformations */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex flex-col gap-12">
        {filtered.map(t => {
          const sliderVal = sliderValues[t.id] ?? 50
          return (
            <div key={t.id} className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-outline-variant bg-surface-container-low">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-tertiary text-xs font-label font-semibold">
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                  {t.villageHindi} ({t.village})
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-label font-bold">
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>verified</span>
                  {t.warranty}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Before/After slider */}
                <div className="relative" style={{ height: '320px' }}>
                  <img
                    src={t.afterImage}
                    alt={`After - ${t.titleHindi}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-0 left-0 h-full overflow-hidden"
                    style={{ width: `${sliderVal}%` }}
                  >
                    <img
                      src={t.beforeImage}
                      alt={`Before - ${t.titleHindi}`}
                      className="h-full object-cover"
                      style={{ width: `${10000 / Math.max(sliderVal, 1)}%`, maxWidth: 'none' }}
                    />
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-bold">पहले (Before)</div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-primary/80 text-on-primary text-xs font-bold">बाद में (After)</div>
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                    style={{ left: `calc(${sliderVal}% - 2px)` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-secondary shadow-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary text-base">swap_horiz</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderVal}
                    onChange={e => updateSlider(t.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                    aria-label="Drag to compare before and after"
                  />
                </div>

                {/* Details panel */}
                <div className="p-6 flex flex-col gap-4 justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-primary text-xl">{t.titleHindi}</h3>
                    <p className="text-on-surface-variant text-sm mt-1">{t.title}</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { icon: 'texture', label: 'सामग्री', value: t.specs.material },
                      { icon: 'hardware', label: 'फिटिंग', value: t.specs.hardware },
                      { icon: 'schedule', label: 'डिलीवरी', value: t.specs.delivery },
                    ].map(spec => (
                      <div key={spec.label} className="flex items-start gap-2 text-sm">
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>{spec.icon}</span>
                        <span className="text-on-surface-variant font-label font-semibold w-20 shrink-0">{spec.label}:</span>
                        <span className="text-on-surface">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <blockquote className="bg-surface-container-low rounded-xl p-4 border-l-4 border-secondary">
                    <p className="text-on-surface-variant text-sm italic leading-relaxed">{t.quote}</p>
                    <footer className="mt-2 text-xs font-label font-bold text-primary">— {t.quoteAuthorHindi}</footer>
                  </blockquote>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a href="tel:+919876543210" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-on-error bg-error hover:opacity-90 transition-opacity">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                      ऐसा काम करवाएँ
                    </a>
                    <a
                      href={`https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20${encodeURIComponent(t.village)}%20jaisa%20kaam%20karwana%20hai`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#15803d' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                      WhatsApp Estimate
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary text-on-primary py-10 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-headline font-bold text-2xl">क्या आपके घर में भी ऐसा कोई काम है?</h2>
          <p className="text-on-primary-container text-sm mt-2 max-w-xl mx-auto">
            टूटे दरवाजे, दीमक लगी खिड़की, कच्ची अलमारी की जगह नई एल्युमिनियम खिड़की लगवानी हो—बस अपने घर/दुकान की फोटो व्हाट्सएप पर भेजें।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 py-4 px-8 rounded-xl bg-secondary text-on-secondary font-bold text-base hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">call</span>
              सीधा फोन लगाएं: 98765 43210
            </a>
            <a
              href="https://wa.me/919876543210?text=Mujhe%20bhi%20ghar%20ka%20kaam%20karwana%20hai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 px-8 rounded-xl text-white font-bold text-base hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#15803d' }}
            >
              <span className="material-symbols-outlined">photo_camera</span>
              फोटो भेजें WhatsApp पर
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
