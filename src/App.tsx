import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import Services from './pages/Services'
import BeforeAfter from './pages/BeforeAfter'
import Gallery from './pages/Gallery'
import VillageMap from './pages/VillageMap'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
