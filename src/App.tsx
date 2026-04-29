import { HashRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';

// Page placeholders
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <SiteContentProvider>
      <BookingProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/news" element={<News />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <FloatingWhatsApp />
          </div>
        </HashRouter>
      </BookingProvider>
    </SiteContentProvider>
  );
}
