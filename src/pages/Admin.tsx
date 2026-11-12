import React, { useState } from 'react'
import { GALLERY } from '../data/gallery'
import { TRANSFORMATIONS } from '../data/transformations'
import { SERVICES } from '../data/services'
import { VILLAGE_PINS } from '../data/villages'

type TabType = 'gallery' | 'beforeafter' | 'services' | 'villages' | 'settings'

function showSaved(msg: string = 'Saved! Connect Supabase + Cloudinary to store permanently.') {
  alert(msg)
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('gallery')

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    titleHindi: '',
    village: '',
    category: 'doors',
    material: 'wood',
    approxPrice: '',
    imageUrl: '',
  })

  const [baForm, setBaForm] = useState({
    village: '',
    title: '',
    titleHindi: '',
    type: 'wood',
    beforeImageUrl: '',
    afterImageUrl: '',
    material: '',
    delivery: '',
    warranty: '',
    quote: '',
    quoteAuthor: '',
  })

  const [settings, setSettings] = useState({
    phone: '+919876543210',
    whatsapp: '+919876543210',
    address: 'Main Bilaspur Road, Near Old Grain Market, Rampur',
    hours: '8:00 AM - 7:00 PM',
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const validUser = import.meta.env.VITE_ADMIN_USER || 'admin'
    const validPass = import.meta.env.VITE_ADMIN_PASS || 'admin'
    if (username === validUser && password === validPass) {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const TABS: { key: TabType; label: string; icon: string }[] = [
    { key: 'gallery', label: 'Gallery', icon: 'photo_library' },
    { key: 'beforeafter', label: 'Before & After', icon: 'compare' },
    { key: 'services', label: 'Services', icon: 'list_alt' },
    { key: 'villages', label: 'Villages', icon: 'location_on' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ]

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-bold text-2xl font-headline mx-auto mb-3">SJ</div>
            <h1 className="font-headline font-bold text-primary text-xl">Admin Panel</h1>
            <p className="text-on-surface-variant text-sm mt-1">Sharma Ji Woodcraft &amp; Aluminium</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-label font-semibold text-on-surface text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full p-3 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block font-label font-semibold text-on-surface text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            {loginError && <p className="text-error text-sm font-semibold">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Admin header */}
      <div className="bg-primary text-on-primary px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center font-bold text-sm">SJ</div>
          <div>
            <div className="font-headline font-bold text-sm">Admin Panel — Sharma Ji</div>
            <div className="text-secondary-fixed text-xs">Sharma Ji Woodcraft &amp; Aluminium Fabricators</div>
          </div>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-1 text-sm text-on-primary-container hover:text-on-primary transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-outline-variant px-4 overflow-x-auto">
        <div className="flex gap-1 py-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-label font-semibold whitespace-nowrap transition-colors ${activeTab === tab.key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Cloud sync status notice */}
        <div className="bg-secondary-fixed/40 border border-secondary-fixed rounded-xl p-3 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary shrink-0" style={{ fontSize: '20px' }}>info</span>
          <span className="text-sm text-on-surface">
            <strong>Live Sync Ready:</strong> Supabase URL (<code className="bg-surface-container px-1 rounded">{import.meta.env.VITE_SUPABASE_URL ? 'Connected' : 'Not configured'}</code>) and Cloudinary (<code className="bg-surface-container px-1 rounded">{import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not configured'}</code>) are detected from <code>.env</code>.
          </span>
        </div>

        {/* Gallery tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-primary text-xl">Gallery Management</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-outline-variant font-label font-semibold text-on-surface">Current Gallery Items ({GALLERY.length})</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Title', 'Village', 'Category', 'Material', 'Price'].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-label font-bold text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GALLERY.slice(0, 10).map(item => (
                      <tr key={item.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                        <td className="px-4 py-2 text-on-surface">{item.titleHindi}</td>
                        <td className="px-4 py-2 text-on-surface-variant">{item.village}</td>
                        <td className="px-4 py-2 text-on-surface-variant capitalize">{item.category}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.material === 'wood' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                            {item.material}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-label font-semibold text-secondary">₹{item.approxPrice.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-headline font-bold text-primary text-lg mb-4">Add New Photo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'title', label: 'Title (English)', placeholder: 'Carved Sagwan Door' },
                  { key: 'titleHindi', label: 'Title (Hindi)', placeholder: 'नक्काशीदार दरवाजा' },
                  { key: 'village', label: 'Village', placeholder: 'Rampur' },
                  { key: 'approxPrice', label: 'Approx Price (₹)', placeholder: '8500' },
                  { key: 'imageUrl', label: 'Image URL / Cloudinary URL', placeholder: 'https://...' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block font-label font-semibold text-on-surface text-sm mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={(galleryForm as Record<string, string>)[f.key]}
                      onChange={e => setGalleryForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-label font-semibold text-on-surface text-sm mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={e => setGalleryForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {['doors', 'windows', 'almirahs', 'beds-mandirs', 'farm-shop', 'repairs'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-label font-semibold text-on-surface text-sm mb-1">Material</label>
                  <select
                    value={galleryForm.material}
                    onChange={e => setGalleryForm(f => ({ ...f, material: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="wood">Wood</option>
                    <option value="aluminium">Aluminium</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { console.log('New gallery item:', galleryForm); showSaved() }}
                className="mt-4 flex items-center gap-2 py-2.5 px-6 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                Save to Gallery
              </button>
            </div>
          </div>
        )}

        {/* Before/After tab */}
        {activeTab === 'beforeafter' && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-primary text-xl">Before &amp; After Management</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-outline-variant font-label font-semibold text-on-surface">Current Transformations ({TRANSFORMATIONS.length})</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Village', 'Title', 'Type', 'Warranty'].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-label font-bold text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSFORMATIONS.map(t => (
                      <tr key={t.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                        <td className="px-4 py-2 text-on-surface">{t.villageHindi}</td>
                        <td className="px-4 py-2 text-on-surface-variant text-xs">{t.titleHindi}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.type === 'wood' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-on-surface-variant">{t.warranty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-headline font-bold text-primary text-lg mb-4">Add New Transformation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'village', label: 'Village', placeholder: 'Rampur' },
                  { key: 'title', label: 'Title (English)', placeholder: 'Old door to new sagwan door' },
                  { key: 'titleHindi', label: 'Title (Hindi)', placeholder: 'पुराना दरवाजा - नया सागवान' },
                  { key: 'beforeImageUrl', label: 'Before Image URL', placeholder: 'https://...' },
                  { key: 'afterImageUrl', label: 'After Image URL (Cloudinary)', placeholder: 'https://...' },
                  { key: 'material', label: 'Material used', placeholder: 'Grade-A Sagwan' },
                  { key: 'delivery', label: 'Delivery Time', placeholder: '7 Days' },
                  { key: 'warranty', label: 'Warranty', placeholder: '10-Year Termite Guarantee' },
                  { key: 'quote', label: 'Customer Quote', placeholder: '"Sharma Ji ne achha kaam kiya..."' },
                  { key: 'quoteAuthor', label: 'Customer Name', placeholder: 'Ramesh Ji, Rampur' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block font-label font-semibold text-on-surface text-sm mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={(baForm as Record<string, string>)[f.key]}
                      onChange={e => setBaForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-label font-semibold text-on-surface text-sm mb-1">Type</label>
                  <select
                    value={baForm.type}
                    onChange={e => setBaForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="wood">Wood</option>
                    <option value="aluminium">Aluminium</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { console.log('New transformation:', baForm); showSaved() }}
                className="mt-4 flex items-center gap-2 py-2.5 px-6 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                Save Transformation
              </button>
            </div>
          </div>
        )}

        {/* Services tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-primary text-xl">Services &amp; Prices Management</h2>
            {SERVICES.map(cat => (
              <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">{cat.icon}</span>
                  <span className="font-label font-bold text-on-surface">{cat.titleHindi}</span>
                  <span className="text-on-surface-variant text-sm ml-1">({cat.titleEn})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-container-low">
                      <tr>
                        {['Item', 'Starting Price', 'Unit', 'Action'].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-label font-bold text-on-surface-variant">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map(item => (
                        <tr key={item.id} className="border-t border-outline-variant">
                          <td className="px-4 py-2 text-on-surface">{item.nameHindi}</td>
                          <td className="px-4 py-2">
                            <span className="font-label font-bold text-secondary">₹{item.startingPrice.toLocaleString('en-IN')}</span>
                          </td>
                          <td className="px-4 py-2 text-on-surface-variant">{item.unit}</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => showSaved('Price update noted. Ready for Supabase.')}
                              className="text-xs px-3 py-1 bg-surface-container text-primary rounded-lg hover:bg-surface-container-high transition-colors font-bold"
                            >
                              Edit Price
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Villages tab */}
        {activeTab === 'villages' && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-primary text-xl">Villages &amp; Map Pins Management</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-outline-variant font-label font-semibold text-on-surface">Current Village Pins ({VILLAGE_PINS.length})</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Village', 'Distance', 'Works Done', 'Rating', 'Position X', 'Position Y'].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-label font-bold text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {VILLAGE_PINS.map(pin => (
                      <tr key={pin.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                        <td className="px-4 py-2 text-on-surface font-label font-semibold">{pin.name}</td>
                        <td className="px-4 py-2 text-on-surface-variant">{pin.distanceKm} km</td>
                        <td className="px-4 py-2 text-secondary font-bold">{pin.workCount}+</td>
                        <td className="px-4 py-2 text-on-surface">{pin.rating}</td>
                        <td className="px-4 py-2 text-on-surface-variant">{pin.positionX}%</td>
                        <td className="px-4 py-2 text-on-surface-variant">{pin.positionY}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-headline font-bold text-primary text-lg mb-4">Add New Village Pin</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Village Name', 'Hindi Name', 'Distance (km)', 'Position X (%)', 'Position Y (%)', 'Visit Days', 'Visit Time', 'Work Count'].map(label => (
                  <div key={label}>
                    <label className="block font-label font-semibold text-on-surface text-sm mb-1">{label}</label>
                    <input type="text" placeholder={label} className="w-full p-2.5 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => showSaved('Village pin saved! Connect Supabase to store map data permanently.')}
                className="mt-4 flex items-center gap-2 py-2.5 px-6 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_location</span>
                Add Village Pin
              </button>
            </div>
          </div>
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-primary text-xl">Business Settings</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: 'phone', label: 'Phone Number', icon: 'call' },
                  { key: 'whatsapp', label: 'WhatsApp Number', icon: 'chat' },
                  { key: 'address', label: 'Workshop Address', icon: 'location_on' },
                  { key: 'hours', label: 'Working Hours', icon: 'schedule' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="flex items-center gap-1 font-label font-semibold text-on-surface text-sm mb-1">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>{f.icon}</span>
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={(settings as Record<string, string>)[f.key]}
                      onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full p-3 rounded-lg border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: '16px' }}>info</span>
                Changes here will be live across the site when Supabase sync is configured.
              </div>
              <button
                type="button"
                onClick={() => { console.log('Settings update:', settings); showSaved('Settings saved!') }}
                className="mt-4 flex items-center gap-2 py-3 px-6 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cloud_sync</span>
                Save &amp; Update Live
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

