import React, { useState, useEffect } from 'react'
import { GALLERY, GalleryItem } from '../data/gallery'
import { TRANSFORMATIONS, Transformation } from '../data/transformations'
import { SERVICES } from '../data/services'
import { VILLAGE_PINS, VillagePin, WORKSHOP_LOCATION, calculateDistanceKm } from '../data/villages'
import { uploadToCloudinary } from '../services/cloudinary'
import { DataService } from '../services/dataService'
import VoiceInput from '../components/common/VoiceInput'

export interface GallerySelectedFile {
  id: string
  file: File
  preview: string
  name: string
  size: string
}

type TabType = 'gallery' | 'beforeafter' | 'services' | 'villages' | 'settings' | 'sql'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('gallery')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Live state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY)
  const [transformations, setTransformations] = useState<Transformation[]>(TRANSFORMATIONS)
  const [villagePins, setVillagePins] = useState<VillagePin[]>(VILLAGE_PINS)

  // Upload states & progress
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = useState(false)

  // 1. Gallery Form
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    titleHindi: '',
    village: 'Rampur',
    category: 'doors',
    material: 'wood',
    approxPrice: '8500',
  })
  const [galleryFiles, setGalleryFiles] = useState<GallerySelectedFile[]>([])
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null)

  // 2. Before & After Form
  const [baForm, setBaForm] = useState({
    village: 'Rampur',
    villageHindi: 'रामपुर',
    title: '',
    titleHindi: '',
    type: 'wood' as 'wood' | 'aluminium',
    material: 'Grade-A CP Teak (Sagwan)',
    hardware: 'Heavy Brass Handles & Bolts',
    delivery: '7 Days',
    warranty: '10-Year Termite Guarantee',
    quote: '',
    quoteAuthor: '',
    quoteAuthorHindi: '',
  })
  const [baBeforeFile, setBaBeforeFile] = useState<File | null>(null)
  const [baBeforePreview, setBaBeforePreview] = useState<string>('')
  const [baAfterFile, setBaAfterFile] = useState<File | null>(null)
  const [baAfterPreview, setBaAfterPreview] = useState<string>('')

  // 3. Village Pin Form
  const [villageForm, setVillageForm] = useState({
    name: '',
    nameHindi: '',
    distanceKm: '10',
    lat: '29.0200',
    lng: '77.8200',
    workCount: '50',
    rating: '5.0',
    featuredWorkTitle: '',
    featuredWorkTitleHindi: '',
    quote: '',
    quoteAuthor: '',
    workType: 'Main Door & Windows',
    deliveryTime: '7 Days',
    materials: 'Grade-A Sagwan + Jindal Aluminium',
    warranty: '5-Year Warranty',
  })
  const [villagePhotoFile, setVillagePhotoFile] = useState<File | null>(null)
  const [villagePhotoPreview, setVillagePhotoPreview] = useState<string>('')
  const [villageMediaType, setVillageMediaType] = useState<'video' | 'audio'>('video')
  const [villageVideoFile, setVillageVideoFile] = useState<File | null>(null)
  const [villageVideoName, setVillageVideoName] = useState<string>('')
  const [villageAudioFile, setVillageAudioFile] = useState<File | null>(null)
  const [villageAudioName, setVillageAudioName] = useState<string>('')
  const [villageAudioPreview, setVillageAudioPreview] = useState<string>('')
  const [isFetchingGps, setIsFetchingGps] = useState(false)

  const handleFetchGpsLocation = () => {
    if (!navigator.geolocation) {
      notify('ब्राउज़र में Geolocation समर्थित नहीं है।', 'error')
      return
    }
    setIsFetchingGps(true)
    notify('वर्तमान GPS निर्देशांक प्राप्त किए जा रहे हैं...', 'info')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsFetchingGps(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const dist = calculateDistanceKm(WORKSHOP_LOCATION.lat, WORKSHOP_LOCATION.lng, lat, lng)
        setVillageForm(prev => ({
          ...prev,
          lat: lat.toFixed(4),
          lng: lng.toFixed(4),
          distanceKm: String(dist),
        }))
        notify(`GPS निर्देशांक प्राप्त: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (वर्कशॉप से ${dist} km)`, 'success')
      },
      (err) => {
        setIsFetchingGps(false)
        notify(`GPS त्रुटि: ${err.message}`, 'error')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // 4. Settings Form
  const [settings, setSettings] = useState({
    phone: '+919876543210',
    whatsapp: '+919876543210',
    address: 'Main Bilaspur Road, Near Old Grain Market, Rampur',
    hours: '8:00 AM - 7:00 PM',
  })

  // Show temporary toast notification
  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  // Load live data from Supabase
  useEffect(() => {
    if (isLoggedIn) {
      DataService.fetchGallery().then(setGalleryItems)
      DataService.fetchTransformations().then(setTransformations)
      DataService.fetchVillagePins().then(setVillagePins)
    }
  }, [isLoggedIn])

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

  // Handle Gallery Submit (Multi-Image Batch Upload)
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (galleryFiles.length === 0) {
      notify('कृपया कम से कम एक फोटो चुनें (Please select at least one image file)', 'error')
      return
    }

    try {
      setIsUploading(true)
      const uploadedItems: Array<{
        title: string
        titleHindi: string
        village: string
        category: string
        material: string
        imageUrl: string
        approxPrice: number
      }> = []

      for (let i = 0; i < galleryFiles.length; i++) {
        const item = galleryFiles[i]
        notify(`फोटो अपलोड हो रही है ${i + 1}/${galleryFiles.length}: ${item.name}...`, 'info')

        const uploadRes = await uploadToCloudinary(item.file, {
          onProgress: (p) => {
            const overall = Math.round(((i + p / 100) / galleryFiles.length) * 100)
            setUploadProgress(prev => ({ ...prev, gallery: overall }))
          },
          folder: 'carpenter_gallery',
        })

        const titleHindi = galleryFiles.length > 1 && galleryForm.titleHindi
          ? `${galleryForm.titleHindi} (${i + 1})`
          : galleryForm.titleHindi || 'कारीगरी का कार्य'

        const titleEn = galleryFiles.length > 1 && galleryForm.title
          ? `${galleryForm.title} (${i + 1})`
          : galleryForm.title || 'Finished Work'

        uploadedItems.push({
          title: titleEn,
          titleHindi,
          village: galleryForm.village || 'Rampur',
          category: galleryForm.category,
          material: galleryForm.material,
          imageUrl: uploadRes.secure_url,
          approxPrice: Number(galleryForm.approxPrice) || 0,
        })
      }

      notify('डेटाबेस में सुरक्षित किया जा रहा है...', 'info')
      const res = await DataService.addGalleryItemsBatch(uploadedItems)

      if (res.success) {
        notify(`${uploadedItems.length} तस्वीरें सफलतापूर्वक Cloudinary और Supabase में सहेजी गईं!`, 'success')
        galleryFiles.forEach(f => URL.revokeObjectURL(f.preview))
        setGalleryFiles([])
        setGalleryForm({ title: '', titleHindi: '', village: 'Rampur', category: 'doors', material: 'wood', approxPrice: '8500' })
        DataService.fetchGallery().then(setGalleryItems)
      } else {
        notify(`Supabase error: ${res.error}. Make sure you ran the SQL setup script.`, 'error')
      }
    } catch (err: any) {
      notify(`Upload failed: ${err.message}`, 'error')
    } finally {
      setIsUploading(false)
      setUploadProgress(prev => ({ ...prev, gallery: 0 }))
    }
  }

  // Handle Before & After Submit
  const handleBaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baBeforeFile || !baAfterFile) {
      notify('कृपया काम से पहले और काम के बाद की दोनों फोटो चुनें (Select both before and after images)', 'error')
      return
    }

    try {
      setIsUploading(true)
      notify('Uploading Before photo to Cloudinary...', 'info')
      const beforeRes = await uploadToCloudinary(baBeforeFile, {
        onProgress: (p) => setUploadProgress(prev => ({ ...prev, baBefore: p })),
        folder: 'carpenter_transformations',
      })

      notify('Uploading After photo to Cloudinary...', 'info')
      const afterRes = await uploadToCloudinary(baAfterFile, {
        onProgress: (p) => setUploadProgress(prev => ({ ...prev, baAfter: p })),
        folder: 'carpenter_transformations',
      })

      notify('Saving transformation to Supabase...', 'info')
      const res = await DataService.addTransformation({
        village: baForm.village,
        villageHindi: baForm.villageHindi,
        title: baForm.title || `${baForm.village} Transformation`,
        titleHindi: baForm.titleHindi || `${baForm.villageHindi} बदलाव`,
        type: baForm.type,
        beforeImageUrl: beforeRes.secure_url,
        afterImageUrl: afterRes.secure_url,
        material: baForm.material,
        hardware: baForm.hardware,
        delivery: baForm.delivery,
        warranty: baForm.warranty,
        quote: baForm.quote || 'शानदार काम किया शर्मा जी ने।',
        quoteAuthor: baForm.quoteAuthor || 'Customer',
        quoteAuthorHindi: baForm.quoteAuthorHindi || 'संतुष्ट ग्राहक',
      })

      if (res.success) {
        notify('Before & After कार्य सफलतापूर्वक सहेजा गया!', 'success')
        setBaBeforeFile(null)
        setBaAfterFile(null)
        setBaBeforePreview('')
        setBaAfterPreview('')
        DataService.fetchTransformations().then(setTransformations)
      } else {
        notify(`Supabase error: ${res.error}`, 'error')
      }
    } catch (err: any) {
      notify(`Upload error: ${err.message}`, 'error')
    } finally {
      setIsUploading(false)
      setUploadProgress(prev => ({ ...prev, baBefore: 0, baAfter: 0 }))
    }
  }

  // Handle Village Pin & Video / Audio Submit
  const handleVillageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!villagePhotoFile) {
      notify('कृपया गाँव के कार्य की 1:1 चौकोर फोटो चुनें (Please select 1:1 work photo)', 'error')
      return
    }

    try {
      setIsUploading(true)
      notify('1:1 कार्य की फोटो Cloudinary पर अपलोड हो रही है...', 'info')
      const photoRes = await uploadToCloudinary(villagePhotoFile, {
        onProgress: (p) => setUploadProgress(prev => ({ ...prev, vPhoto: p })),
        folder: 'carpenter_villages',
      })

      let videoUrl = ''
      let audioUrl = ''

      if (villageMediaType === 'video' && villageVideoFile) {
        notify('9:16 वीडियो Cloudinary पर अपलोड हो रहा है...', 'info')
        const videoRes = await uploadToCloudinary(villageVideoFile, {
          onProgress: (p) => setUploadProgress(prev => ({ ...prev, vVideo: p })),
          folder: 'carpenter_videos',
        })
        videoUrl = videoRes.secure_url
      } else if (villageMediaType === 'audio' && villageAudioFile) {
        notify('MP3 ग्राहक ऑडियो Cloudinary पर अपलोड हो रहा है...', 'info')
        const audioRes = await uploadToCloudinary(villageAudioFile, {
          onProgress: (p) => setUploadProgress(prev => ({ ...prev, vAudio: p })),
          folder: 'carpenter_audios',
        })
        audioUrl = audioRes.secure_url
      }

      notify('गाँव का पिन Supabase में सहेजा जा रहा है...', 'info')
      const res = await DataService.addVillagePin({
        name: villageForm.name,
        nameHindi: villageForm.nameHindi || villageForm.name,
        distanceKm: Number(villageForm.distanceKm) || 0,
        lat: Number(villageForm.lat) || 29.02,
        lng: Number(villageForm.lng) || 77.82,
        workCount: Number(villageForm.workCount) || 1,
        rating: Number(villageForm.rating) || 5.0,
        featuredWorkTitle: villageForm.featuredWorkTitle || `${villageForm.name} Work`,
        featuredWorkTitleHindi: villageForm.featuredWorkTitleHindi || `${villageForm.nameHindi} कार्य`,
        imageUrl: photoRes.secure_url,
        videoUrl,
        audioUrl,
        quote: villageForm.quote || 'शर्मा जी का काम बहुत मजबूत और समय पर हुआ।',
        quoteAuthor: villageForm.quoteAuthor || `${villageForm.name} Customer`,
        workType: villageForm.workType,
        deliveryTime: villageForm.deliveryTime,
        materials: villageForm.materials,
        warranty: villageForm.warranty,
      })

      if (res.success) {
        notify('गाँव का 1:1 पिन और मीडिया सफलतापूर्वक लाइव मैप पर जुड़ गया!', 'success')
        setVillagePhotoFile(null)
        setVillageVideoFile(null)
        setVillageAudioFile(null)
        setVillagePhotoPreview('')
        setVillageVideoName('')
        setVillageAudioName('')
        setVillageAudioPreview('')
        DataService.fetchVillagePins().then(setVillagePins)
      } else {
        notify(`Supabase error: ${res.error}`, 'error')
      }
    } catch (err: any) {
      notify(`Village upload failed: ${err.message}`, 'error')
    } finally {
      setIsUploading(false)
      setUploadProgress(prev => ({ ...prev, vPhoto: 0, vVideo: 0, vAudio: 0 }))
    }
  }

  // Copy Supabase SQL helper
  const copySqlSchema = () => {
    const sql = `-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('doors', 'windows', 'almirahs', 'beds-mandirs', 'farm-shop', 'repairs')),
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    village TEXT NOT NULL,
    material TEXT NOT NULL CHECK (material IN ('wood', 'aluminium')),
    image_url TEXT NOT NULL,
    approx_price NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transformations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village TEXT NOT NULL,
    village_hindi TEXT NOT NULL,
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('wood', 'aluminium')),
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    material_spec TEXT NOT NULL DEFAULT '',
    hardware_spec TEXT NOT NULL DEFAULT '',
    delivery_spec TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    quote_author TEXT NOT NULL DEFAULT '',
    quote_author_hindi TEXT NOT NULL DEFAULT '',
    warranty TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.village_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hindi TEXT NOT NULL,
    distance_km NUMERIC DEFAULT 0,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    work_count NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    featured_work_title TEXT NOT NULL,
    featured_work_title_hindi TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    quote_author TEXT NOT NULL DEFAULT '',
    work_type TEXT NOT NULL DEFAULT '',
    delivery_time TEXT NOT NULL DEFAULT '',
    materials TEXT NOT NULL DEFAULT '',
    warranty TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Anon insert gallery" ON public.gallery FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read transformations" ON public.transformations FOR SELECT USING (true);
CREATE POLICY "Anon insert transformations" ON public.transformations FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read village_pins" ON public.village_pins FOR SELECT USING (true);
CREATE POLICY "Anon insert village_pins" ON public.village_pins FOR INSERT WITH CHECK (true);`

    navigator.clipboard.writeText(sql)
    notify('SQL schema copied to clipboard! Paste it into Supabase SQL Editor.', 'success')
  }

  const TABS: { key: TabType; label: string; icon: string }[] = [
    { key: 'gallery', label: 'Work Gallery', icon: 'photo_library' },
    { key: 'beforeafter', label: 'Before & After', icon: 'compare' },
    { key: 'villages', label: 'Village Pins & Videos', icon: 'pin_drop' },
    { key: 'services', label: 'Prices & Services', icon: 'list_alt' },
    { key: 'settings', label: 'Shop Settings', icon: 'settings' },
    { key: 'sql', label: 'Supabase SQL Setup', icon: 'database' },
  ]

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-bold text-2xl font-headline mx-auto mb-3">SJ</div>
            <h1 className="font-headline font-bold text-primary text-xl">Admin Panel</h1>
            <p className="text-on-surface-variant text-sm mt-1">Direct Upload to Cloudinary &amp; Supabase</p>
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
    <div className="min-h-screen bg-surface-container-low pb-20">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
            toast.type === 'success'
              ? 'bg-[#15803d] text-white'
              : toast.type === 'error'
              ? 'bg-[#ba1a1a] text-white'
              : 'bg-[#263447] text-white'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-primary text-on-primary px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center font-bold text-sm">SJ</div>
          <div>
            <div className="font-headline font-bold text-sm">Admin Portal — Sharma Ji Works</div>
            <div className="text-secondary-fixed text-xs">Direct Cloudinary Upload &amp; Supabase Live Sync</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs bg-primary-container px-3 py-1.5 rounded-lg text-on-primary hover:bg-surface-tint transition-colors"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            View Website
          </a>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-1 text-xs text-on-primary-container hover:text-on-primary transition-colors bg-white/10 px-3 py-1.5 rounded-lg"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-outline-variant px-4 overflow-x-auto shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-1 py-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-label font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Cloud Status Ribbon */}
        <div className="bg-white rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 border border-outline-variant/60 shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
            <span><strong>Cloudinary:</strong> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME} (Preset: {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span><strong>Supabase:</strong> Connected to live project</span>
          </div>
          <button
            onClick={copySqlSchema}
            className="ml-auto inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-lg text-primary font-bold hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy Supabase SQL Schema
          </button>
        </div>

        {/* 1. WORK GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/60">
              <h3 className="font-headline font-bold text-primary text-lg mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">add_photo_alternate</span>
                गैलरी में नई फोटो अपलोड करें (Direct Image Upload)
              </h3>
              <p className="text-on-surface-variant text-xs mb-5">
                फोन या कंप्यूटर से फोटो सीधे अपलोड करें — यह Cloudinary पर स्टोर होगी और Supabase डेटाबेस में तुरंत जुड़ जाएगी।
              </p>

              <form onSubmit={handleGallerySubmit} className="space-y-4">
                {/* Multi-Image File Upload Dropzone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-label font-bold text-on-surface text-sm">
                      कार्य की तस्वीरें चुनें (Select Single or Multiple Work Photos) *
                    </label>
                    {galleryFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          galleryFiles.forEach(f => URL.revokeObjectURL(f.preview))
                          setGalleryFiles([])
                        }}
                        className="text-xs text-error font-semibold hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">delete_sweep</span>
                        सभी हटाएं (Clear All {galleryFiles.length})
                      </button>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-outline-variant rounded-2xl p-4 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative bg-surface-container-lowest">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      required={galleryFiles.length === 0}
                      onChange={e => {
                        if (e.target.files) {
                          const newItems = Array.from(e.target.files).map(file => ({
                            id: `${file.name}-${Date.now()}-${Math.random()}`,
                            file,
                            preview: URL.createObjectURL(file),
                            name: file.name,
                            size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
                          }))
                          setGalleryFiles(prev => [...prev, ...newItems])
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="py-4 flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
                      <span className="font-label font-bold text-sm text-primary">
                        {galleryFiles.length === 0
                          ? 'एक या एक से अधिक फोटो चुनने के लिए यहाँ टैप करें'
                          : `+ और फोटो जोड़ें (${galleryFiles.length} चुनी जा चुकी हैं)`}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        JPG, PNG, WebP • एक साथ कई फोटो सेलेक्ट कर सकते हैं (Multiple Selection Allowed)
                      </span>
                    </div>
                  </div>

                  {/* Previews for Each Given Image */}
                  {galleryFiles.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-label font-bold text-on-surface-variant mb-2 flex items-center justify-between">
                        <span>फोटो पूर्वावलोकन ({galleryFiles.length} तस्वीरें तैयार)</span>
                        <span className="text-[11px] text-tertiary">किसी भी फोटो पर क्लिक करके बड़ा देखें</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {galleryFiles.map((item, idx) => (
                          <div
                            key={item.id}
                            className="group relative bg-surface-container rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm flex flex-col"
                          >
                            <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                              <img
                                src={item.preview}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                #{idx + 1}
                              </span>
                              {/* Hover Overlay with View and Remove buttons */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveModalImage(item.preview)
                                  }}
                                  title="बड़ा पूर्वावलोकन देखें"
                                  className="w-7 h-7 rounded-full bg-white/90 text-primary flex items-center justify-center hover:bg-white shadow"
                                >
                                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    URL.revokeObjectURL(item.preview)
                                    setGalleryFiles(prev => prev.filter(f => f.id !== item.id))
                                  }}
                                  title="हटाएं"
                                  className="w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center hover:opacity-90 shadow"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </div>
                            <div className="p-2 text-[10px] bg-white">
                              <div className="font-semibold truncate text-on-surface" title={item.name}>{item.name}</div>
                              <div className="text-on-surface-variant font-mono">{item.size}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-on-surface text-xs">शीर्षक (Hindi Title) *</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={galleryForm.titleHindi}
                        onResult={(val) => setGalleryForm(f => ({ ...f, titleHindi: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="उदा: नक्काशीदार सागवान मेन दरवाजा"
                      value={galleryForm.titleHindi}
                      onChange={e => setGalleryForm(f => ({ ...f, titleHindi: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-on-surface text-xs">English Title</label>
                      <VoiceInput
                        defaultLanguage="en-IN"
                        currentValue={galleryForm.title}
                        onResult={(val) => setGalleryForm(f => ({ ...f, title: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Carved Sagwan Main Door"
                      value={galleryForm.title}
                      onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-on-surface text-xs">गाँव / स्थान (Village)</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={galleryForm.village}
                        onResult={(val) => setGalleryForm(f => ({ ...f, village: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Rampur"
                      value={galleryForm.village}
                      onChange={e => setGalleryForm(f => ({ ...f, village: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-on-surface text-xs mb-1">अनुमानित लागत (Approx Price in ₹)</label>
                    <input
                      type="number"
                      placeholder="8500"
                      value={galleryForm.approxPrice}
                      onChange={e => setGalleryForm(f => ({ ...f, approxPrice: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-on-surface text-xs mb-1">वर्ग (Category)</label>
                    <select
                      value={galleryForm.category}
                      onChange={e => setGalleryForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="doors">दरवाजे (Doors)</option>
                      <option value="windows">खिड़कियाँ (Windows)</option>
                      <option value="almirahs">अलमारी (Almirahs)</option>
                      <option value="beds-mandirs">बेड और मंदिर (Beds &amp; Mandirs)</option>
                      <option value="farm-shop">खेती, ट्रॉली और दुकान (Farm &amp; Shop)</option>
                      <option value="repairs">मरम्मत व पॉलिश (Repairs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-on-surface text-xs mb-1">सामग्री (Material)</label>
                    <select
                      value={galleryForm.material}
                      onChange={e => setGalleryForm(f => ({ ...f, material: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="wood">लकड़ी (Wood)</option>
                      <option value="aluminium">एल्युमिनियम (Aluminium)</option>
                    </select>
                  </div>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (uploadProgress.gallery || 0) > 0 && (
                  <div>
                    <div className="flex justify-between text-xs font-bold text-primary mb-1">
                      <span>Cloudinary Uploading...</span>
                      <span>{uploadProgress.gallery}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${uploadProgress.gallery}%` }} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="py-3 px-6 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity flex items-center gap-2 shadow disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">cloud_upload</span>
                  {isUploading ? 'अपलोड जारी है...' : 'गैलरी में अपलोड व सुरक्षित करें (Save to Supabase)'}
                </button>
              </form>
            </div>

            {/* Current Gallery List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-outline-variant/60">
              <div className="p-4 border-b border-outline-variant font-label font-bold text-primary flex items-center justify-between">
                <span>वर्तमान गैलरी कार्य ({galleryItems.length} तस्वीरें)</span>
                <span className="text-xs text-on-surface-variant font-normal">लाइव डेटाबेस से</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low text-xs font-label font-bold text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-2.5 text-left">फोटो</th>
                      <th className="px-4 py-2.5 text-left">नाम</th>
                      <th className="px-4 py-2.5 text-left">गाँव</th>
                      <th className="px-4 py-2.5 text-left">श्रेणी</th>
                      <th className="px-4 py-2.5 text-left">सामग्री</th>
                      <th className="px-4 py-2.5 text-left">लागत</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryItems.map(item => (
                      <tr key={item.id} className="border-t border-outline-variant hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-2">
                          <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                        </td>
                        <td className="px-4 py-2 font-semibold text-on-surface">{item.titleHindi}</td>
                        <td className="px-4 py-2 text-on-surface-variant">{item.village}</td>
                        <td className="px-4 py-2 text-on-surface-variant capitalize">{item.category}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.material === 'wood' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                            {item.material}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-bold text-secondary">₹{item.approxPrice.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. BEFORE & AFTER TAB */}
        {activeTab === 'beforeafter' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/60">
              <h3 className="font-headline font-bold text-primary text-lg mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">compare</span>
                काम से पहले और बाद का कार्य जोड़ें (Dual Photo Upload)
              </h3>
              <p className="text-on-surface-variant text-xs mb-5">
                दोनों फोटो अपलोड करें — दोनों का कोण समान रखें ताकि स्लाइडर में बदलाव स्पष्ट दिखाई दे।
              </p>

              <form onSubmit={handleBaSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Photo Upload */}
                  <div>
                    <label className="block font-label font-bold text-on-surface text-xs mb-1">
                      1. काम से पहले की फोटो (Before Image) *
                    </label>
                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setBaBeforeFile(file)
                            setBaBeforePreview(URL.createObjectURL(file))
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {baBeforePreview ? (
                        <img src={baBeforePreview} alt="Before" className="h-36 mx-auto rounded-lg object-cover shadow" />
                      ) : (
                        <div className="py-4 flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-3xl text-primary">add_a_photo</span>
                          <span className="text-xs font-bold text-primary">पुरानी फोटो चुनें (Before)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* After Photo Upload */}
                  <div>
                    <label className="block font-label font-bold text-on-surface text-xs mb-1">
                      2. काम के बाद की फोटो (After Image) *
                    </label>
                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setBaAfterFile(file)
                            setBaAfterPreview(URL.createObjectURL(file))
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {baAfterPreview ? (
                        <img src={baAfterPreview} alt="After" className="h-36 mx-auto rounded-lg object-cover shadow" />
                      ) : (
                        <div className="py-4 flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-3xl text-secondary">add_photo_alternate</span>
                          <span className="text-xs font-bold text-secondary">नई फोटो चुनें (After)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">शीर्षक (Hindi Title) *</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={baForm.titleHindi}
                        onResult={(val) => setBaForm(f => ({ ...f, titleHindi: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="उदा: दीमक लगा पुराना दरवाजा - नया नक्काशीदार सागवान"
                      value={baForm.titleHindi}
                      onChange={e => setBaForm(f => ({ ...f, titleHindi: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">गाँव (Village Hindi) *</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={baForm.villageHindi}
                        onResult={(val) => setBaForm(f => ({ ...f, villageHindi: val, village: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="रामपुर"
                      value={baForm.villageHindi}
                      onChange={e => setBaForm(f => ({ ...f, villageHindi: e.target.value, village: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-xs mb-1">सामग्री विवरण (Material Specs)</label>
                    <input
                      type="text"
                      placeholder="Grade-A CP Teak (Sagwan)"
                      value={baForm.material}
                      onChange={e => setBaForm(f => ({ ...f, material: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-xs mb-1">वारंटी (Warranty)</label>
                    <input
                      type="text"
                      placeholder="10-Year Termite Guarantee"
                      value={baForm.warranty}
                      onChange={e => setBaForm(f => ({ ...f, warranty: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">ग्राहक की समीक्षा / प्रशंसा पत्र (Customer Quote)</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={baForm.quote}
                        onResult={(val) => setBaForm(f => ({ ...f, quote: val }))}
                        size="sm"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="उदा: शर्मा जी ने 7 दिन में बिल्कुल वैसा दरवाजा बनाया जैसा सोचा था।"
                      value={baForm.quote}
                      onChange={e => setBaForm(f => ({ ...f, quote: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="py-3 px-6 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity flex items-center gap-2 shadow disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">cloud_upload</span>
                  {isUploading ? 'दोनों फोटो अपलोड हो रही हैं...' : 'Before & After सहेजें (Upload & Save)'}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-outline-variant/60">
              <h4 className="font-label font-bold text-primary mb-3">वर्तमान बदलाव कार्य ({transformations.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transformations.map(t => (
                  <div key={t.id} className="border border-outline-variant rounded-xl p-3 flex gap-3 items-center">
                    <img src={t.afterImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 shadow-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-on-surface truncate">{t.titleHindi}</div>
                      <div className="text-xs text-on-surface-variant">{t.villageHindi} • {t.warranty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. VILLAGE PINS & VIDEO / AUDIO REVIEWS TAB */}
        {activeTab === 'villages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <h3 className="font-headline font-bold text-primary text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">pin_drop</span>
                  नया गाँव पिन, 1:1 फोटो व 9:16 वीडियो / ऑडियो रिव्यू जोड़ें
                </h3>

                {/* GPS Location Auto-Fetch Button */}
                <button
                  type="button"
                  onClick={handleFetchGpsLocation}
                  disabled={isFetchingGps}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                >
                  <span className={`material-symbols-outlined text-base ${isFetchingGps ? 'animate-spin' : ''}`}>
                    {isFetchingGps ? 'sync' : 'my_location'}
                  </span>
                  <span>{isFetchingGps ? 'लोकेशन खोजी जा रही है...' : '📍 वर्तमान GPS लोकेशन भरें (Fetch GPS)'}</span>
                </button>
              </div>

              <p className="text-on-surface-variant text-xs mb-5">
                फील्ड पर रहते हुए तुरंत लोकेशन डिटेक्ट करें। 1:1 अनुपात की चौकोर फोटो और 9:16 वर्टिकल वीडियो या MP3 वॉयस रिव्यू जोड़ें।
              </p>

              <form onSubmit={handleVillageSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 1:1 Work Photo Upload with Square Guide */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-bold text-on-surface text-xs">
                        मैप पिन के लिए 1:1 चौकोर फोटो (1:1 Toolpin Photo) *
                      </label>
                      <span className="text-[10px] text-secondary font-mono font-bold">1:1 Square</span>
                    </div>

                    <div className="border-2 border-dashed border-outline-variant rounded-2xl p-3 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative bg-surface-container-lowest">
                      <input
                        type="file"
                        accept="image/*"
                        required={!villagePhotoFile}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setVillagePhotoFile(file)
                            setVillagePhotoPreview(URL.createObjectURL(file))
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {villagePhotoPreview ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="aspect-square w-36 rounded-xl overflow-hidden shadow-md ring-2 ring-secondary/50 relative">
                            <img src={villagePhotoPreview} alt="1:1 Toolpin Work" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                              1:1 Toolpin
                            </span>
                          </div>
                          <span className="text-[11px] text-secondary font-bold">फोटो बदली जा सकती है (Click to change)</span>
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center gap-1.5">
                          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">crop_square</span>
                          </div>
                          <span className="text-xs font-bold text-primary">1:1 कार्य की फोटो चुनें या कैमरा खोलें</span>
                          <span className="text-[10px] text-on-surface-variant">मैप पिन पर 1:1 चौकोर अनुपात में दिखेगी</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Review Media: 9:16 Video OR MP3 Audio */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-label font-bold text-on-surface text-xs">
                        ग्राहक समीक्षा मीडिया (Review Media)
                      </label>
                      {/* Media Mode Selector */}
                      <div className="flex bg-surface-container p-0.5 rounded-lg border border-outline-variant">
                        <button
                          type="button"
                          onClick={() => setVillageMediaType('video')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${
                            villageMediaType === 'video'
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">videocam</span>
                          9:16 वीडियो
                        </button>
                        <button
                          type="button"
                          onClick={() => setVillageMediaType('audio')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-colors ${
                            villageMediaType === 'audio'
                              ? 'bg-secondary text-on-secondary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">mic</span>
                          MP3 ऑडियो
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: 9:16 Video Upload / Capture */}
                    {villageMediaType === 'video' ? (
                      <div className="border-2 border-dashed border-outline-variant rounded-2xl p-3 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative bg-surface-container-lowest">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setVillageVideoFile(file)
                              setVillageVideoName(file.name)
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {villageVideoName ? (
                          <div className="py-4 flex flex-col items-center gap-1.5 text-secondary font-bold text-xs">
                            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                              <span className="material-symbols-outlined text-2xl">videocam</span>
                            </div>
                            <span>{villageVideoName}</span>
                            <span className="text-[10px] text-on-surface-variant font-normal">9:16 वर्टिकल वीडियो चुना गया (Click to change)</span>
                          </div>
                        ) : (
                          <div className="py-4 flex flex-col items-center gap-1.5">
                            <span className="material-symbols-outlined text-3xl text-secondary">video_camera_front</span>
                            <span className="text-xs font-bold text-secondary">9:16 वीडियो चुनें या रिकॉर्ड करें</span>
                            <span className="text-[10px] text-on-surface-variant">MP4, MOV (स्मार्टफोन 9:16 रील वीडियो)</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Mode 2: MP3 Voice Audio Review Upload */
                      <div className="border-2 border-dashed border-outline-variant rounded-2xl p-3 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative bg-surface-container-lowest">
                        <input
                          type="file"
                          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setVillageAudioFile(file)
                              setVillageAudioName(file.name)
                              setVillageAudioPreview(URL.createObjectURL(file))
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {villageAudioName ? (
                          <div className="py-2 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 text-secondary font-bold text-xs">
                              <span className="material-symbols-outlined text-2xl">mic</span>
                              <span>{villageAudioName}</span>
                            </div>
                            {villageAudioPreview && (
                              <audio
                                src={villageAudioPreview}
                                controls
                                className="w-full max-w-xs h-9 mt-1 relative z-20"
                                onClick={e => e.stopPropagation()}
                              />
                            )}
                            <span className="text-[10px] text-on-surface-variant">क्लिक करके बदलें (MP3/WAV/M4A)</span>
                          </div>
                        ) : (
                          <div className="py-4 flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                              <span className="material-symbols-outlined text-2xl">mic</span>
                            </div>
                            <span className="text-xs font-bold text-secondary">MP3 ग्राहक वॉयस रिकॉर्डिंग चुनें</span>
                            <span className="text-[10px] text-on-surface-variant">Cloudinary पर सीधे स्टोर होगी • MP3, M4A, WAV</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">गाँव का नाम (English) *</label>
                      <VoiceInput
                        defaultLanguage="en-IN"
                        currentValue={villageForm.name}
                        onResult={(val) => setVillageForm(f => ({ ...f, name: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sardhana"
                      value={villageForm.name}
                      onChange={e => setVillageForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">गाँव का नाम (Hindi) *</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={villageForm.nameHindi}
                        onResult={(val) => setVillageForm(f => ({ ...f, nameHindi: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="उदा: सरधना"
                      value={villageForm.nameHindi}
                      onChange={e => setVillageForm(f => ({ ...f, nameHindi: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-xs mb-1">दूरी किमी (Distance in KM)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="18"
                      value={villageForm.distanceKm}
                      onChange={e => setVillageForm(f => ({ ...f, distanceKm: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-xs mb-1">GPS Latitude (अक्षांश N)</label>
                    <input
                      type="text"
                      placeholder="29.1500"
                      value={villageForm.lat}
                      onChange={e => setVillageForm(f => ({ ...f, lat: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-xs mb-1">GPS Longitude (देशांतर E)</label>
                    <input
                      type="text"
                      placeholder="77.6167"
                      value={villageForm.lng}
                      onChange={e => setVillageForm(f => ({ ...f, lng: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-label font-semibold text-xs mb-1">घरों की संख्या (Homes count)</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={villageForm.workCount}
                      onChange={e => setVillageForm(f => ({ ...f, workCount: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">प्रमुख कार्य शीर्षक (Featured Work Hindi) *</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={villageForm.featuredWorkTitleHindi}
                        onResult={(val) => setVillageForm(f => ({ ...f, featuredWorkTitleHindi: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="उदा: पुरातन हवेली का सागवान चौखट व नक्काशी रीस्टोरेशन"
                      value={villageForm.featuredWorkTitleHindi}
                      onChange={e => setVillageForm(f => ({ ...f, featuredWorkTitleHindi: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">ग्राहक की समीक्षा / प्रशंसा पत्र (Customer Quote)</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={villageForm.quote}
                        onResult={(val) => setVillageForm(f => ({ ...f, quote: val }))}
                        size="sm"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="उदा: शर्मा जी का काम बहुत मजबूत और समय पर हुआ।"
                      value={villageForm.quote}
                      onChange={e => setVillageForm(f => ({ ...f, quote: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label font-semibold text-xs">ग्राहक का नाम (Customer Author)</label>
                      <VoiceInput
                        defaultLanguage="hi-IN"
                        currentValue={villageForm.quoteAuthor}
                        onResult={(val) => setVillageForm(f => ({ ...f, quoteAuthor: val }))}
                        size="sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="उदा: सुखबीर जी (रामपुर)"
                      value={villageForm.quoteAuthor}
                      onChange={e => setVillageForm(f => ({ ...f, quoteAuthor: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Progress Indicators */}
                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-primary">
                      <span>Cloudinary Uploading...</span>
                      <span>
                        {uploadProgress.vPhoto || uploadProgress.vVideo || uploadProgress.vAudio || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            uploadProgress.vPhoto || 0,
                            uploadProgress.vVideo || 0,
                            uploadProgress.vAudio || 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="py-3 px-6 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity flex items-center gap-2 shadow disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">add_location_alt</span>
                  {isUploading ? 'अपलोड जारी है...' : 'गाँव का 1:1 पिन व मीडिया सहेजें (Save Village Pin)'}
                </button>
              </form>
            </div>

            {/* Pins Table */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-outline-variant/60 overflow-x-auto">
              <h4 className="font-label font-bold text-primary mb-3">वर्तमान मैप पिन ({villagePins.length})</h4>
              <table className="w-full text-xs">
                <thead className="bg-surface-container-low font-bold text-on-surface-variant">
                  <tr>
                    <th className="px-3 py-2 text-left">1:1 फोटो</th>
                    <th className="px-3 py-2 text-left">गाँव</th>
                    <th className="px-3 py-2 text-left">GPS (Lat, Lng)</th>
                    <th className="px-3 py-2 text-left">दूरी</th>
                    <th className="px-3 py-2 text-left">कार्य संख्या</th>
                    <th className="px-3 py-2 text-left">मीडिया प्रकार</th>
                  </tr>
                </thead>
                <tbody>
                  {villagePins.map(p => (
                    <tr key={p.id} className="border-t border-outline-variant hover:bg-surface-container-low">
                      <td className="px-3 py-2">
                        <img src={p.image} alt={p.name} className="w-10 h-10 aspect-square object-cover rounded-lg shadow-sm" />
                      </td>
                      <td className="px-3 py-2 font-bold text-on-surface">{p.nameHindi} ({p.name})</td>
                      <td className="px-3 py-2 font-mono text-tertiary">{Number(p.lat).toFixed(4)}, {Number(p.lng).toFixed(4)}</td>
                      <td className="px-3 py-2">{p.distanceKm} km</td>
                      <td className="px-3 py-2 font-bold text-secondary">{p.workCount}+ घर</td>
                      <td className="px-3 py-2">
                        {p.videoUrl ? (
                          <span className="text-[#15803d] font-bold inline-flex items-center gap-1 bg-[#15803d]/10 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-xs">videocam</span> 9:16 Video
                          </span>
                        ) : p.audioUrl ? (
                          <span className="text-secondary font-bold inline-flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-xs">mic</span> MP3 Audio
                          </span>
                        ) : (
                          <span className="text-on-surface-variant">1:1 Image</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-primary text-xl">Services &amp; Rates</h2>
            {SERVICES.map(cat => (
              <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant/60">
                <div className="p-4 border-b border-outline-variant flex items-center gap-2 bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary">{cat.icon}</span>
                  <span className="font-label font-bold text-on-surface">{cat.titleHindi}</span>
                  <span className="text-on-surface-variant text-xs ml-1">({cat.titleEn})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {cat.items.map(item => (
                        <tr key={item.id} className="border-t border-outline-variant">
                          <td className="px-4 py-2.5 text-on-surface font-semibold">{item.nameHindi}</td>
                          <td className="px-4 py-2.5 font-bold text-secondary">₹{item.startingPrice.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-2.5 text-on-surface-variant text-xs">/ {item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. SHOP SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/60 space-y-4">
            <h2 className="font-headline font-bold text-primary text-xl mb-4">दुकान व संपर्क सेटिंग्स</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'phone', label: 'फोन नंबर (Call Number)', icon: 'call' },
                { key: 'whatsapp', label: 'व्हाट्सएप नंबर (WhatsApp)', icon: 'chat' },
                { key: 'address', label: 'वर्कशॉप का पता (Workshop Address)', icon: 'location_on' },
                { key: 'hours', label: 'दुकान का समय (Working Hours)', icon: 'schedule' },
              ].map(f => (
                <div key={f.key}>
                  <label className="flex items-center gap-1 font-label font-semibold text-xs mb-1">
                    <span className="material-symbols-outlined text-primary text-sm">{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={(settings as Record<string, string>)[f.key]}
                    onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => notify('Settings updated successfully in state!', 'success')}
              className="py-2.5 px-6 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity"
              type="button"
            >
              सेटिंग्स सहेजें
            </button>
          </div>
        )}

        {/* 6. SUPABASE SQL SETUP TAB */}
        {activeTab === 'sql' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-outline-variant/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-primary text-xl">Supabase SQL Database Setup</h2>
                <p className="text-on-surface-variant text-xs mt-1">
                  नीचे दिए गए SQL कोड को Supabase के SQL Editor में चलाएं ताकि गैलरी, Before/After और मैप टेबल्स तुरंत सक्रिय हो जाएं।
                </p>
              </div>
              <button
                onClick={copySqlSchema}
                className="py-2.5 px-5 bg-secondary text-on-secondary rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                SQL कॉपी करें (Copy SQL)
              </button>
            </div>

            <div className="bg-surface-container-high rounded-xl p-4 font-mono text-xs text-on-surface overflow-x-auto max-h-96 leading-relaxed">
              <pre>{`-- Supabase SQL Schema for Sharma Ji Works
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('doors', 'windows', 'almirahs', 'beds-mandirs', 'farm-shop', 'repairs')),
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    village TEXT NOT NULL,
    material TEXT NOT NULL CHECK (material IN ('wood', 'aluminium')),
    image_url TEXT NOT NULL,
    approx_price NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transformations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village TEXT NOT NULL,
    village_hindi TEXT NOT NULL,
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('wood', 'aluminium')),
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    material_spec TEXT NOT NULL DEFAULT '',
    hardware_spec TEXT NOT NULL DEFAULT '',
    delivery_spec TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    quote_author TEXT NOT NULL DEFAULT '',
    quote_author_hindi TEXT NOT NULL DEFAULT '',
    warranty TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.village_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hindi TEXT NOT NULL,
    distance_km NUMERIC DEFAULT 0,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    work_count NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    featured_work_title TEXT NOT NULL,
    featured_work_title_hindi TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    quote_author TEXT NOT NULL DEFAULT '',
    work_type TEXT NOT NULL DEFAULT '',
    delivery_time TEXT NOT NULL DEFAULT '',
    materials TEXT NOT NULL DEFAULT '',
    warranty TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Anon insert gallery" ON public.gallery FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read transformations" ON public.transformations FOR SELECT USING (true);
CREATE POLICY "Anon insert transformations" ON public.transformations FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read village_pins" ON public.village_pins FOR SELECT USING (true);
CREATE POLICY "Anon insert village_pins" ON public.village_pins FOR INSERT WITH CHECK (true);`}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Lightbox Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 bg-surface-container border-b border-outline-variant">
              <span className="text-xs font-bold text-primary font-label flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-secondary">image</span>
                पूर्वावलोकन (Image Preview)
              </span>
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-2 flex items-center justify-center overflow-auto max-h-[80vh]">
              <img
                src={activeModalImage}
                alt="Enlarged Preview"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
