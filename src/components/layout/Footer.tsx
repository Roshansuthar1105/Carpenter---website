export default function Footer() {
  const guarantees = [
    { icon: 'verified', label: '100% Genuine Teak & Sagwan', labelHindi: 'दीमक मुक्त लकड़ी', color: 'text-secondary' },
    { icon: 'shield', label: 'Jindal Grade-A Aluminium', labelHindi: 'भारी गेज सेक्शन', color: 'text-tertiary' },
    { icon: 'straighten', label: 'Free Home Measurement', labelHindi: 'घर आकर नाप मुफ़्त', color: 'text-primary' },
    { icon: 'handshake', label: '5-Year Repair Warranty', labelHindi: 'कारीगरी की पक्की वारंटी', color: 'text-secondary' },
    { icon: 'cottage', label: '500+ Village Homes Furnished', labelHindi: 'गाँव-गाँव में भरोसा', color: 'text-primary' },
  ]

  return (
    <footer className="bg-surface-container-high py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust guarantee cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-6">
          {guarantees.map((g) => (
            <div key={g.icon} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col items-center text-center gap-2">
              <span className={`material-symbols-outlined text-3xl ${g.color}`}>{g.icon}</span>
              <span className="font-label font-semibold text-on-surface text-sm leading-tight">{g.label}</span>
              <span className="text-on-surface-variant text-xs">{g.labelHindi}</span>
            </div>
          ))}
        </div>

        {/* Address & copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-outline-variant">
          <div className="flex flex-col text-center md:text-left">
            <span className="font-headline font-bold text-primary text-sm">Sharma Ji Woodcraft &amp; Aluminium Fabricators</span>
            <span className="text-on-surface-variant text-xs mt-1">
              Workshop: Main Bilaspur Road, Near Old Grain Market, Rampur &bull; Master Artisan: Shri Rameshwar Sharma
            </span>
          </div>
          <div className="text-center md:text-right text-on-surface-variant text-xs">
            <p>&copy; 2024 Sharma Ji Woodcraft &amp; Aluminium Works. All rights reserved.</p>
            <p>Crafted with Honesty &amp; Generational Skill</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

