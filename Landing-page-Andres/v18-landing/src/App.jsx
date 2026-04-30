import SmoothScroll from './components/SmoothScroll';
import Hero from './components/Hero';
import Tension from './components/Tension';
import Services from './components/Services';
import Philosophy from './components/Philosophy';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Tension />
        <Services />
        <Philosophy />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
