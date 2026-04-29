import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Volume2, Mic2, Disc3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex border-b border-zinc-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80" 
            alt="Concert Crowd" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,rgba(0,0,0,0)_60%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-20 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-cyan-400"></span>
              <span className="text-cyan-400 font-display tracking-widest uppercase text-sm">Sierra Leone's Premium Sound</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display uppercase tracking-tight text-white leading-[0.9] mb-8">
              Bring Your Event to <br/>
              <span className="text-gradient">LIFE WITH DISCO BEST</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-2xl mb-12">
              Professional Sound System Rentals for Parties, Weddings, Church Events & More. High fidelity, unmatched energy.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                to="/booking"
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all glow-purple flex justify-center items-center gap-2"
              >
                Book Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact"
                className="border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all flex justify-center items-center backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Snippet */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-display uppercase tracking-wider text-white mb-4">Core <span className="text-purple-500">Services</span></h2>
              <p className="text-zinc-400 max-w-md">Everything you need for a spectacular auditory experience.</p>
            </div>
            <Link to="/services" className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 uppercase tracking-widest text-sm font-bold">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Sound System Rental', icon: Volume2, desc: 'High-wattage active and passive speakers for any venue size.' },
              { title: 'DJ Setup', icon: Disc3, desc: 'Professional decks, mixers, and controllers for your DJs.' },
              { title: 'Church Programs', icon: Mic2, desc: 'Crystal clear PA systems tailored for spoken word and live worship bands.' }
            ].map((srv, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:border-cyan-400/50 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-cyan-900/30 group-hover:text-cyan-400 transition-colors">
                  <srv.icon className="w-8 h-8 text-zinc-400 group-hover:text-cyan-400 pb-1" />
                </div>
                <h3 className="text-2xl font-display tracking-wide mb-3">{srv.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed">{srv.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link to="/services" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 uppercase tracking-widest text-sm font-bold">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
