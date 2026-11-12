export default function StickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-outline-variant shadow-[0_-4px_20px_rgba(71,85,105,0.15)]">
      <div className="max-w-7xl mx-auto flex gap-2 p-2">
        <a
          href="tel:+919876543210"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#dc2626', boxShadow: '0 2px 0 #991b1b' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>call</span>
          <span className="text-center leading-tight">
            Direct Call: 98765-43210<br />
            <span className="font-normal text-xs opacity-90">(शर्मा जी से बात करें)</span>
          </span>
        </a>
        <a
          href="https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20mujhe%20apne%20kaam%20ka%20rate%20puchhna%20hai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#15803d', boxShadow: '0 2px 0 #166534' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>photo_camera</span>
          <span className="text-center leading-tight">
            WhatsApp for Estimate<br />
            <span className="font-normal text-xs opacity-90">(फोटो भेजें)</span>
          </span>
        </a>
      </div>
    </div>
  )
}

