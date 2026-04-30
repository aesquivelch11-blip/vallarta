import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Entrance from './components/Entrance'
import About from './components/About'
import Services from './components/Services'
import Proof from './components/Proof'
import Process from './components/Process'
import CTA from './components/CTA'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => { lenis.destroy() }
  }, [])

  return (
    <main>
      <Entrance />
      <About />
      <Services />
      <Proof />
      <Process />
      <CTA />
    </main>
  )
}
