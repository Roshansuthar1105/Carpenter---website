import { NavLink } from 'react-router-dom'

export default function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-primary text-on-primary font-bold rounded-lg shadow-sm px-4 py-2 text-sm whitespace-nowrap transition-colors'
      : 'text-on-surface-variant px-4 py-2 text-sm whitespace-nowrap rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top utility strip */}
      <div className="bg-primary text-on-primary py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-secondary-fixed" style={{ fontSize: '15px' }}>location_on</span>
            <span>Serving Rampur, Bilaspur, Kithore &amp; 15 Nearby Villages</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-xs hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>volume_up</span>
              <span className="hidden sm:inline">सुनिए शर्मा जी का संदेश</span>
              <span className="sm:hidden">Voice Note</span>
            </button>
            <a href="tel:+919876543210" className="hidden sm:flex items-center gap-1 text-secondary-fixed hover:text-on-primary font-semibold transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center font-bold text-sm font-headline shrink-0">
            SJ
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-headline font-bold text-primary text-sm leading-tight">Sharma Ji Woodcraft &amp; Aluminium</span>
            <span className="text-on-surface-variant text-xs">शर्मा जी बढ़ई एवं एल्युमिनियम • 25+ Years Trust</span>
          </div>
        </div>
        <a
          href="tel:+919876543210"
          className="hidden lg:flex items-center gap-2 bg-error text-on-error px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
          Direct Call Sharma Ji
        </a>
      </div>

      {/* Navigation tabs */}
      <div className="bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            <NavLink to="/" end className={navLinkClass}>Home &amp; Introduction</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services &amp; Prices</NavLink>
            <NavLink to="/before-after" className={navLinkClass}>Before &amp; After</NavLink>
            <NavLink to="/gallery" className={navLinkClass}>Work Gallery</NavLink>
            <NavLink to="/village-map" className={navLinkClass}>Village Customer Map</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Free Measurement &amp; Contact</NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

