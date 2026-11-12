import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import StickyBar from './StickyBar'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="pt-36 pb-24">
        <Outlet />
      </main>
      <Footer />
      <StickyBar />
    </div>
  )
}

