import { motion } from 'motion/react';
import { Volume2, Disc, MapPinned, Church, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    id: 1,
    title: "Sound System Rental",
    desc: "Complete PA systems including line arrays, subwoofers, monitors, and mixing consoles suited for any venue size.",
    icon: Volume2,
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80",
    color: "from-cyan-500/20"
  },
  {
    id: 2,
    title: "DJ Setup",
    desc: "Industry-standard Pioneer CDJs, turntables, battle mixers, and booth monitoring systems for professional DJs.",
    icon: Disc,
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80",
    color: "from-purple-500/20"
  },
  {
    id: 3,
    title: "Outdoor Event Sound",
    desc: "Weather-resistant, high-SPL systems designed to carry sound across large open fields, beaches, and street festivals.",
    icon: MapPinned,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    color: "from-green-500/20"
  },
  {
    id: 4,
    title: "Church Programs",
    desc: "Clear, articulate vocal reproduction and full-band support for crusades, worship nights, and regular services.",
    icon: Church,
    image: "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?w=800&q=80",
    color: "from-amber-500/20"
  },
  {
    id: 5,
    title: "Wedding & Party Setup",
    desc: "Elegant, discreet speaker placements paired with intelligent lighting to set the perfect dance floor mood.",
    icon: PartyPopper,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    color: "from-pink-500/20"
  }
];

export default function Services() {
  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display uppercase tracking-tight text-white mb-6"
          >
            Our <span className="text-gradient-green">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg"
          >
            We provide comprehensive audio and visual equipment rentals tailored to the specific needs of your event. View our packages beneath.
          </motion.p>
        </div>

        <div className="space-y-16">
          {SERVICES.map((srv, idx) => (
            <motion.div 
              key={srv.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-zinc-900/30 rounded-3xl p-6 md:p-10 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className={`order-2 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="w-full aspect-video rounded-2xl overflow-hidden relative border border-white/10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${srv.color} to-transparent mix-blend-overlay z-10`} />
                  <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className={`order-1 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'} space-y-6`}>
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5">
                  <srv.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-display tracking-wider text-white">{srv.title}</h2>
                <p className="text-zinc-400 text-lg font-light">{srv.desc}</p>
                <div className="pt-4">
                  <Link 
                    to={`/booking?service=${srv.title}`}
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
