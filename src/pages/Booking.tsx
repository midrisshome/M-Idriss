import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBookings, EventType } from '../context/BookingContext';
import { CheckCircle2 } from 'lucide-react';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get('service') || '';
  
  const { addBooking } = useBookings();
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    eventType: defaultService || 'Party',
    eventDate: '',
    location: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addBooking(formData);
    setSubmittedId(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submittedId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-3xl max-w-lg w-full text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-display uppercase text-white mb-4">Request Received!</h2>
          <p className="text-zinc-400 mb-6">
            Thank you for booking with DISCO BEST. We will review your request and contact you shortly.
          </p>
          <div className="bg-zinc-800/50 rounded-xl p-4 mb-8">
            <span className="block text-sm text-zinc-500 uppercase tracking-widest mb-1">Order ID</span>
            <span className="text-2xl font-mono text-cyan-400">{submittedId}</span>
          </div>
          <button 
            onClick={() => {
               setSubmittedId(null);
               setFormData({fullName: '', phone: '', email: '', eventType: 'Party', eventDate: '', location: '', message: ''});
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors"
          >
            Make Another Booking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-40 left-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display uppercase tracking-tight text-white mb-4">
            Book <span className="text-gradient">With Us</span>
          </h1>
          <p className="text-zinc-400">Fill out the form below to rent sound systems or DJ setups.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-white/5 p-6 md:p-10 rounded-3xl space-y-8 backdrop-blur-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Full Name *</label>
              <input 
                required type="text" id="fullName" name="fullName"
                value={formData.fullName} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Phone Number *</label>
              <input 
                required type="tel" id="phone" name="phone"
                value={formData.phone} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="+232 79 XXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Email Address</label>
              <input 
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="eventType" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Event Type *</label>
              <select 
                required id="eventType" name="eventType"
                value={formData.eventType} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
              >
                <option value="Party">Party</option>
                <option value="Wedding">Wedding</option>
                <option value="Church Event">Church Event</option>
                <option value="Corporate">Corporate</option>
                <option value="Outdoor Concert">Outdoor Concert</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="eventDate" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Event Date *</label>
              <input 
                required type="date" id="eventDate" name="eventDate"
                value={formData.eventDate} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Location / Venue *</label>
              <input 
                required type="text" id="location" name="location"
                value={formData.location} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="E.g. Freetown Family Kingdom"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Special Requests / Message</label>
            <textarea 
              id="message" name="message" rows={4}
              value={formData.message} onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              placeholder="Tell us more about the setup you need..."
            />
          </div>

          <div className="pt-4 text-center">
             <button 
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 w-full sm:w-auto px-12 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all glow-blue inline-flex items-center justify-center gap-2"
              >
                Submit Booking
              </button>
          </div>

        </form>
      </div>
    </div>
  );
}
