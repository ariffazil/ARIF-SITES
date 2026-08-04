import { useEffect } from 'react'
import { Outlet } from 'react-router'
import Lenis from 'lenis'
import Navbar from './Navbar'
import Footer from './Footer'
import Cursor from './Cursor'

export default function Layout() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-basalt-950 text-bone-100 flex flex-col">
      <Cursor />
      <Navbar />
      {/* Navbar is fixed at 64px — offset owned here. Full-bleed heroes opt out with -mt-16 inside the page. */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
