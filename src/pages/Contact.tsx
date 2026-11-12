import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { BUSINESS } from '../data/business'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    village: '',
    phone: '',
    workType: '',
    preferredDay: '',
  })

  const workTypes = [
    'दरवाजा / Door',
    'खिड़की / Window',
    'अलमारी / Wardrobe',
    'बेड / Bed',
    'पूजा मंदिर / Mandir',
    'ट्रॉली / Trolley',
    'दुकान शटर / Shop Shutter',
    'मरम्मत / Repair',
    'अन्य / Other',
  ]

  const days = ['सोमवार / Monday', 'मंगलवार / Tuesday', 'बुधवार / Wednesday', 'गुरुवार / Thursday', 'शुक्रवार / Friday', 'शनिवार / Saturday', 'कभी भी / Any Day']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Namaste Sharma Ji, Mera naam ${form.name} hai. Main ${form.village} se hoon. Phone: ${form.phone}. Mujhe ${form.workType} ka kaam karwana hai. Preferred day: ${form.preferredDay}. Ghar par naap ke liye aa jaaiye.`
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <div className="bg-primary text-on-primary py-10 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-secondary-fixed text-xs font-label uppercase tracking-widest font-bold">घर पर नाप का बंदोबस्त — बिल्कुल मुफ़्त</span>
          <h1 className="font-headline font-extrabold text-3xl mt-2">Free Home Measurement — घर पर नाप</h1>
          <p className="text-on-primary-container text-sm mt-2 max-w-xl">
            आपको दुकान तक आने की कोई जरूरत नहीं। शर्मा जी खुद आपके घर आकर नाप लेते हैं और सैंपल दिखाते हैं। सेवा बिल्कुल निःशुल्क।
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="tel:+919876543210" className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">call</span>
              Call: 98765-43210
            </a>
            <a href={BUSINESS.whatsappMeasurement} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: '#15803d' }}>
              <span className="material-symbols-outlined">chat</span>
              WhatsApp for Measurement
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking form */}
          <div>
            <h2 className="font-headline font-bold text-primary text-xl mb-5">नाप बुक करें — नाम और गाँव बताएँ</h2>
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl p-6 shadow-md space-y-4">
              <div>
                <label className="block font-label font-semibold text-primary text-sm mb-1">आपका नाम *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="जैसे: रमेश शर्मा"
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-label font-semibold text-primary text-sm mb-1">गाँव / कस्बे का नाम *</label>
                <input
                  type="text"
                  required
                  value={form.village}
                  onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                  placeholder="जैसे: रामपुर, बिलासपुर"
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-label font-semibold text-primary text-sm mb-1">मोबाइल नंबर *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-label font-semibold text-primary text-sm mb-1">किस काम के लिए नाप चाहिए? *</label>
                <select
                  required
                  value={form.workType}
                  onChange={e => setForm(f => ({ ...f, workType: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">— काम चुनें —</option>
                  {workTypes.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-label font-semibold text-primary text-sm mb-1">नाप के लिए कौनसा दिन सुविधाजनक है?</label>
                <select
                  value={form.preferredDay}
                  onChange={e => setForm(f => ({ ...f, preferredDay: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">— दिन चुनें —</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-base hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#15803d' }}
              >
                <span className="material-symbols-outlined">send</span>
                WhatsApp पर नाप बुक करें
              </button>
              <p className="text-on-surface-variant text-xs text-center">बटन दबाने पर WhatsApp खुलेगा — आपका संदेश पहले से भरा होगा</p>
            </form>
          </div>

          {/* Workshop info + QR */}
          <div className="flex flex-col gap-5">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
              <h3 className="font-headline font-bold text-primary text-lg mb-4">वर्कशॉप की जानकारी</h3>
              <div className="space-y-3">
                {[
                  { icon: 'location_on', label: 'पता', value: BUSINESS.address },
                  { icon: 'schedule', label: 'समय', value: BUSINESS.workshopHours },
                  { icon: 'call', label: 'फोन', value: BUSINESS.phoneFormatted },
                  { icon: 'person', label: 'मास्टर कारीगर', value: BUSINESS.artisanName },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <div className="text-xs text-on-surface-variant font-label font-semibold">{item.label}</div>
                      <div className="text-on-surface text-sm font-label font-semibold">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://maps.google.com/?q=Rampur+Bilaspur+Road+Carpenter"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container text-primary font-bold text-sm hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>map</span>
                Google Maps पर देखें
              </a>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md text-center">
              <div className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold mb-4">Scan to Contact — QR Code</div>
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value="https://wa.me/919876543210"
                  size={160}
                  fgColor="#542809"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>
              <div className="font-headline font-bold text-primary text-lg">+91 98765 43210</div>
              <div className="text-on-surface-variant text-xs mt-1">व्हाट्सएप QR — Scan करें और chat शुरू करें</div>
              <div className="mt-4 flex gap-2">
                <a href="tel:+919876543210" className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-surface-container text-primary font-bold text-sm hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>
                  Call
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-surface-container text-primary font-bold text-sm hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>print</span>
                  Print QR
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-secondary-fixed to-primary-fixed rounded-2xl p-5 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-2xl">card_giftcard</span>
                <div className="font-headline font-bold text-primary text-lg">दोस्त को रेफर करें, छूट पाएँ!</div>
              </div>
              <p className="text-on-surface-variant text-sm mb-3">किसी भाई या पड़ोसी को शर्मा जी के बारे में बताएँ। उनका काम होने पर आपको विशेष छूट मिलेगी।</p>
              <a
                href="https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20maine%20apne%20dost%20ko%20aapke%20baare%20mein%20bataya%20hai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#15803d' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>share</span>
                रेफरल WhatsApp पर भेजें
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

