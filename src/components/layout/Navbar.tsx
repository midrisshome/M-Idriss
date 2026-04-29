import { NavLink } from 'react-router-dom';
import { Menu, X, Disc3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled ? "bg-zinc-950/80 backdrop-blur-md border-b border-white/10" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <NavLink to="/" className="flex items-center gap-2 group">
            <Disc3 className="w-8 h-8 text-cyan-400 group-hover:animate-spin" />
            <span className="font-display text-2xl tracking-wider text-white">
              DISCO <span className="text-purple-500">BEST</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => cn(
                  "text-sm font-medium uppercase tracking-wider transition-colors",
                  isActive ? "text-cyan-400" : "text-zinc-400 hover:text-white"
                )}
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink
              to="/booking"
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-medium uppercase tracking-wider text-sm transition-all glow-purple"
            >
              Book Now
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-64 bg-zinc-900 shadow-2xl z-50 md:hidden p-6 border-l border-white/10"
            >
              <div className="flex justify-end">
                <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "text-lg font-display uppercase tracking-widest",
                      isActive ? "text-cyan-400" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {link.name}
                  </NavLink>
                ))}
                <NavLink
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-full text-center font-bold uppercase tracking-wider mt-4"
                >
                  Book Now
                </NavLink>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
