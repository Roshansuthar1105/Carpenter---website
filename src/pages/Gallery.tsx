import { useState } from 'react'
import { GALLERY, GalleryCategory, GalleryItem } from '../data/gallery'

const CATEGORIES: { key: GalleryCategory | 'all'; labelH: string }[] = [
  { key: 'all', labelH: 'सभी फोटो' },
  { key: 'doors', labelH: 'दरवाजे' },
  { key: 'windows', labelH: 'खिड़कियाँ' },
  { key: 'almirahs', labelH: 'अलमारी' },
  { key: 'beds-mandirs', labelH: 'बेड और मंदिर' },
  { key: 'farm-shop', labelH: 'ट्रॉली और दुकान' },
  { key: 'repairs', labelH: 'मरम्मत' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const filtered = activeCategory === 'all' ? GALLERY : GALLERY.filter(g => g.category === activeCategory)

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="bg-primary text-on-primary py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">Work Gallery — असली काम की तस्वीरें</span>
          <h1 className="font-headline font-extrabold text-3xl mt-2">हमारा काम बोलता है</h1>
          <p className="text-on-primary-container text-sm mt-2">500+ घरों में किए गए असली काम की तस्वीरें। कोई भी डिजाइन पसंद हो, WhatsApp पर बताएँ।</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-2 py-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-label font-semibold whitespace-nowrap transition-colors border ${activeCategory === cat.key ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary'}`}
                type="button"
              >
                {cat.labelH}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="text-on-surface-variant text-sm mb-4">{filtered.length} काम की तस्वीरें उपलब्ध</div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="break-inside-avoid bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl">zoom_in</span>
                </div>
              </div>
              <div className="p-3">
                <div className="font-label font-bold text-on-surface text-sm leading-tight">{item.titleHindi}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="inline-flex items-center gap-0.5 text-xs text-tertiary">
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>location_on</span>
                    {item.village}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-primary bg-secondary-fixed/60 border border-secondary-fixed">
                    ₹{item.approxPrice.toLocaleString('en-IN')}+
                  </span>
                </div>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${item.material === 'wood' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                  {item.material === 'wood' ? 'Wood' : 'Aluminium'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-64 object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-headline font-bold text-primary text-lg">{selectedItem.titleHindi}</h3>
                  <p className="text-on-surface-variant text-sm">{selectedItem.title}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-on-surface-variant hover:text-on-surface shrink-0" type="button">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1 text-sm text-tertiary">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>location_on</span>
                  {selectedItem.village}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-bold text-primary bg-secondary-fixed/60 border border-secondary-fixed">
                  ₹{selectedItem.approxPrice.toLocaleString('en-IN')}+ approx
                </span>
              </div>
              <a
                href={`https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20mujhe%20${encodeURIComponent(selectedItem.titleHindi)}%20jaisa%20kaam%20karwana%20hai`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#15803d' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                इस डिजाइन के लिए WhatsApp पर पूछें
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
