import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const BeforeAfter = lazy(() => import('./pages/BeforeAfter'))
const Gallery = lazy(() => import('./pages/Gallery'))
const VillageMap = lazy(() => import('./pages/VillageMap'))
const Contact = lazy(() => import('./pages/Contact'))
const Admin = lazy(() => import('./pages/Admin'))

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-3 border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-label text-on-surface-variant font-bold">लोड हो रहा है...</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/before-after" element={<BeforeAfter />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/village-map" element={<VillageMap />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
