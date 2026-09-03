import Seo from './components/Seo'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Certifications from './components/Certifications'
import Gallery from './components/Gallery'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Music from './components/Music'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Portfolio() {
  return (
    <>
      <Seo />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Certifications />
        <Gallery />
        <Projects />
        <Experience />
        <Music />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
