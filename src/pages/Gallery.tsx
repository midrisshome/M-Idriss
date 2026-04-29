import { motion } from 'motion/react';

const IMAGES = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c090be5c52c?w=800&q=80",
  "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  "https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80",
  "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?w=800&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  "https://images.unsplash.com/photo-1502136969935-818666504aed?w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"
];

export default function Gallery() {
  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-display uppercase tracking-tight text-white mb-6">
            Event <span className="text-purple-500">Gallery</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            See our equipment in action at events across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {IMAGES.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-zinc-900 border border-white/5"
            >
              <img 
                src={src} 
                alt={`Event ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
