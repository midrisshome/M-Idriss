import { NavLink } from 'react-router-dom';
import { Disc3, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1 border-r-0 md:border-r border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Disc3 className="w-8 h-8 text-cyan-400" />
              <span className="font-display text-2xl tracking-wider text-white">
                DISCO <span className="text-purple-500">BEST</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-6 max-w-xs">
              Professional sound system rentals bringing your events to life across Sierra Leone.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="#" className="hover:text-cyan-400 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-purple-400 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-green-400 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-wider mb-6 text-white">Links</h3>
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li><NavLink to="/" className="hover:text-cyan-400 transition-colors">Home</NavLink></li>
              <li><NavLink to="/about" className="hover:text-cyan-400 transition-colors">About Us</NavLink></li>
              <li><NavLink to="/services" className="hover:text-cyan-400 transition-colors">Services</NavLink></li>
              <li><NavLink to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</NavLink></li>
              <li><NavLink to="/admin" className="hover:text-purple-400 transition-colors flex items-center gap-2">Admin Dashboard</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-wider mb-6 text-white">Services</h3>
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li>Sound System Rental</li>
              <li>DJ Setup & Equipment</li>
              <li>Outdoor Event Sound</li>
              <li>Church Programs</li>
              <li>Wedding & Party Setup</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-wider mb-6 text-white">Contact Info</h3>
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Idriss Drive, Devil Hold,<br />Freetown, Sierra Leone</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-purple-400 shrink-0" />
                <span>+232 79 061894</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-purple-400 shrink-0" />
                <span>+232 75 273995</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-green-400 shrink-0" />
                <span>midresshome@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} DISCO BEST. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
