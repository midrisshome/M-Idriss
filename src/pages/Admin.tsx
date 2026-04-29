import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { Settings, Trash2, Lock, KeyRound, AlertCircle, CalendarRange, PenBox, Image as ImageIcon, Mail, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';

const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        callback(dataUrl);
      } else {
        callback(event.target?.result as string);
      }
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(file);
};

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookings, updateBookingStatus, deleteBooking } = useBookings();
  const { content, updateContent } = useSiteContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | false>(false);
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings' | 'gallery' | 'news'>('bookings');
  
  // Auth & Reset States
  const [authView, setAuthView] = useState<'login' | 'forgot' | 'reset'>('login');
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('disco_admin_password') || '1Disco@Best2025');
  const [emailInput, setEmailInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulated Email States
  const [showMockEmail, setShowMockEmail] = useState(false);
  const [mockEmailLink, setMockEmailLink] = useState('');

  // Local state for editing content
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsImage, setNewNewsImage] = useState('');

  const [isAddingGalleryImage, setIsAddingGalleryImage] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('resetToken');
    
    if (tokenFromUrl) {
      const storedResetData = localStorage.getItem('disco_reset_token');
      if (storedResetData) {
        const { token, expiry } = JSON.parse(storedResetData);
        if (token === tokenFromUrl && Date.now() < expiry) {
          setAuthView('reset');
          return;
        }
      }
      setAuthView('login');
      setError('The password reset link is invalid or has expired.');
      
      // Clean up URL
      searchParams.delete('resetToken');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError(false);
      setSuccessMessage('');
    } else {
      setError('Incorrect password.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.toLowerCase() === content.contact.email.toLowerCase() || emailInput.toLowerCase() === 'midrisshome@gmail.com' || emailInput.toLowerCase() === 'midresshome@gmail.com') {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      
      localStorage.setItem('disco_reset_token', JSON.stringify({ token, expiry }));
      
      const baseHref = window.location.href.split('?')[0].split('#')[0];
      const resetLink = `${baseHref}#/admin?resetToken=${token}`;
      setMockEmailLink(resetLink);
      setShowMockEmail(true);
      setError(false);
    } else {
      setError('Unauthorized email address.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length >= 6) {
      setAdminPassword(newPasswordInput);
      localStorage.setItem('disco_admin_password', newPasswordInput);
      localStorage.removeItem('disco_reset_token');
      
      searchParams.delete('resetToken');
      setSearchParams(searchParams, { replace: true });
      
      setAuthView('login');
      setSuccessMessage('Password successfully updated. Please login with your new password.');
      setPassword('');
      setError(false);
      setNewPasswordInput('');
      setEmailInput('');
    } else {
      setError('Password must be at least 6 characters.');
    }
  };

  const saveContent = () => {
    updateContent(editedContent);
    alert('Content saved successfully!');
  };

  const handleAddGalleryImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGalleryImage) {
      setEditedContent(prev => {
        const updated = { ...prev, gallery: [newGalleryImage, ...prev.gallery] };
        updateContent(updated);
        return updated;
      });
      setNewGalleryImage('');
      setIsAddingGalleryImage(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    if (confirm('Are you sure you want to remove this image?')) {
      setEditedContent(prev => {
        const updated = { ...prev, gallery: prev.gallery.filter((_, i) => i !== index) };
        updateContent(updated);
        return updated;
      });
    }
  };

  const handleAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsContent) return;

    const newNews = {
      id: Date.now().toString(),
      title: newNewsTitle,
      date: new Date().toISOString().split('T')[0],
      content: newNewsContent,
      image: newNewsImage || undefined
    };

    setEditedContent(prev => {
      const updated = { ...prev, news: [newNews, ...prev.news] };
      updateContent(updated);
      return updated;
    });
    
    setIsAddingNews(false);
    setNewNewsTitle('');
    setNewNewsContent('');
    setNewNewsImage('');
  };

  const removeNews = (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      setEditedContent(prev => {
        const updated = { ...prev, news: prev.news.filter(n => n.id !== id) };
        updateContent(updated);
        return updated;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-950 min-h-screen pt-20 pb-24 flex items-center justify-center px-4 relative">
        {showMockEmail && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <div className="bg-white text-zinc-900 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="bg-zinc-100 px-4 py-3 border-b flex justify-between items-center">
                <div className="font-semibold text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-500" /> Simulated Email Inbox
                </div>
                <button onClick={() => setShowMockEmail(false)} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-zinc-500 mb-1"><strong>To:</strong> {emailInput}</p>
                <p className="text-sm text-zinc-500 mb-1"><strong>From:</strong> security@discobest.com</p>
                <p className="text-sm text-zinc-500 mb-6"><strong>Subject:</strong> Admin Password Reset</p>
                
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg text-sm shadow-inner">
                  <p className="mb-4 text-zinc-800">Hello,</p>
                  <p className="mb-4 text-zinc-800">We received a request to reset your admin password. Click the link below to set a new password. This link will expire in 15 minutes.</p>
                  <button 
                    onClick={() => {
                      setShowMockEmail(false);
                      window.location.href = mockEmailLink;
                    }}
                    className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-2 cursor-pointer"
                  >
                    Reset Password
                  </button>
                  <p className="text-xs text-zinc-400 mt-2 break-all">Or copy this link: {mockEmailLink}</p>
                  <p className="mt-6 text-xs text-zinc-500">If you didn't request this, you can safely ignore this email.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl"
        >
          {authView === 'login' && (
            <>
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-3xl font-display uppercase tracking-tight text-white mb-2 text-center">
                Admin <span className="text-purple-500">Login</span>
              </h1>
              <p className="text-zinc-400 text-center mb-8">Enter the master password to access the dashboard.</p>
              
              {successMessage && (
                <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl flex items-center justify-center gap-2 text-sm text-center">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 relative">
                  <label htmlFor="password" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-5 h-5 text-zinc-500" />
                    </div>
                    <input 
                      type="password" 
                      id="password" 
                      className={cn(
                        "w-full bg-zinc-950 border rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-1 transition-all",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500"
                      )}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 flex items-center gap-1 text-sm mt-2">
                       <AlertCircle className="w-4 h-4" /> {typeof error === 'string' ? error : "Incorrect password."}
                    </p>
                  )}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all glow-purple"
                >
                  Access Dashboard
                </button>
              </form>
              <div className="mt-8 text-center border-t border-zinc-800 pt-6">
                <button 
                  onClick={() => { setAuthView('forgot'); setError(false); setSuccessMessage(''); setEmailInput(''); }}
                  className="text-zinc-500 hover:text-cyan-400 text-xs transition-colors uppercase tracking-widest font-bold"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {authView === 'forgot' && (
            <>
              <button 
                onClick={() => { setAuthView('login'); setError(false); }} 
                className="text-zinc-500 hover:text-white mb-6 flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-display uppercase tracking-tight text-white mb-2 text-center">
                Reset <span className="text-cyan-400">Password</span>
              </h1>
              <p className="text-zinc-400 text-center mb-8 text-sm leading-relaxed">
                Enter your admin email address. We'll send you a 6-digit recovery code.
              </p>
              
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2 relative">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-zinc-400">Admin Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    className={cn(
                      "w-full bg-zinc-950 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 transition-all",
                      error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500"
                    )}
                    placeholder="admin@example.com"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setError(false); }}
                  />
                  {error && (
                    <p className="text-red-400 flex items-center gap-1 text-sm mt-2">
                       <AlertCircle className="w-4 h-4" /> {typeof error === 'string' ? error : "Unauthorized email address."}
                    </p>
                  )}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all glow-blue"
                >
                  Send Reset Code
                </button>
              </form>
            </>
          )}

          {authView === 'reset' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-display uppercase tracking-tight text-white mb-2 text-center">
                New <span className="text-green-400">Password</span>
              </h1>
              <p className="text-zinc-400 text-center mb-8 text-sm leading-relaxed">
                Create a new master password for the dashboard.
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2 relative">
                  <label htmlFor="newPassword" className="text-xs uppercase tracking-widest font-bold text-zinc-400">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    required
                    className={cn(
                      "w-full bg-zinc-950 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 transition-all",
                      error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-green-500 focus:ring-green-500"
                    )}
                    placeholder="Min 6 characters"
                    value={newPasswordInput}
                    onChange={(e) => { setNewPasswordInput(e.target.value); setError(false); }}
                  />
                  {error && (
                    <p className="text-red-400 flex items-center gap-1 text-sm mt-2">
                       <AlertCircle className="w-4 h-4" /> {typeof error === 'string' ? error : "Password must be at least 6 characters."}
                    </p>
                  )}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all glow-green"
                >
                  Update Password
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display uppercase tracking-tight text-white mb-2">
              Admin <span className="text-purple-500">Dashboard</span>
            </h1>
            <p className="text-zinc-400">Manage your bookings and site content.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('bookings')}
              className={cn(
                "px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all border",
                activeTab === 'bookings' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 glow-blue' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              <CalendarRange className="w-4 h-4" /> Bookings
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all border",
                activeTab === 'settings' ? 'bg-purple-500/10 border-purple-500 text-purple-400 glow-purple' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={cn(
                "px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all border",
                activeTab === 'gallery' ? 'bg-green-500/10 border-green-500 text-green-400 glow-green' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              <ImageIcon className="w-4 h-4" /> Gallery
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={cn(
                "px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all border",
                activeTab === 'news' ? 'bg-amber-500/10 border-amber-500 text-amber-400 glow-amber' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              <PenBox className="w-4 h-4" /> News
            </button>
          </div>
        </div>

        {activeTab === 'bookings' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 font-display uppercase tracking-wider text-xs text-zinc-400">
                    <th className="p-4 pl-6 whitespace-nowrap">Order ID</th>
                    <th className="p-4 whitespace-nowrap">Date / Event</th>
                    <th className="p-4 whitespace-nowrap">Client info</th>
                    <th className="p-4 whitespace-nowrap">Status</th>
                    <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-zinc-300">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4 pl-6 font-mono text-cyan-400 whitespace-nowrap">{booking.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white mb-1">{booking.eventType}</div>
                          <div className="text-zinc-500 text-xs">Date: {booking.eventDate}</div>
                          <div className="text-zinc-500 text-xs">Loc: {booking.location}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-white mb-1">{booking.fullName}</div>
                          <div className="text-zinc-500 text-xs">{booking.phone}</div>
                          <div className="text-zinc-500 text-xs">{booking.email}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                            className={cn(
                              "bg-zinc-950 border rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer",
                              booking.status === 'Pending' ? 'border-amber-500/50 text-amber-400' :
                              booking.status === 'Confirmed' ? 'border-cyan-500/50 text-cyan-400' :
                              booking.status === 'Completed' ? 'border-green-500/50 text-green-400' :
                              'border-red-500/50 text-red-400'
                            )}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-right whitespace-nowrap">
                          <button 
                            onClick={() => deleteBooking(booking.id)}
                            className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10">
            <h2 className="text-2xl font-display uppercase tracking-wider text-white mb-8 border-b border-white/10 pb-4">Edit Site Content</h2>
            
            <div className="space-y-12">
              
              {/* Home */}
              <div>
                <h3 className="text-xl text-cyan-400 mb-4 flex items-center gap-2"><Settings className="w-5 h-5"/> Home Page</h3>
                <div className="grid gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Hero Headline Line 1</label>
                    <input 
                      type="text" 
                      value={editedContent.home.heroHeadlinePart1}
                      onChange={e => setEditedContent(prev => ({...prev, home: {...prev.home, heroHeadlinePart1: e.target.value}}))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Hero Headline Line 2 (Highlighted)</label>
                    <input 
                      type="text" 
                      value={editedContent.home.heroHeadlinePart2}
                      onChange={e => setEditedContent(prev => ({...prev, home: {...prev.home, heroHeadlinePart2: e.target.value}}))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Hero Subtext</label>
                    <textarea 
                      value={editedContent.home.heroSubtext}
                      onChange={e => setEditedContent(prev => ({...prev, home: {...prev.home, heroSubtext: e.target.value}}))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 resize-none h-24"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xl text-green-400 mb-4 flex items-center gap-2"><Settings className="w-5 h-5"/> Contact Details</h3>
                <div className="grid md:grid-cols-2 gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Phone 1 (WhatsApp)</label>
                    <input 
                      type="text" 
                      value={editedContent.contact.phone1}
                      onChange={e => setEditedContent(prev => ({...prev, contact: {...prev.contact, phone1: e.target.value}}))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Phone 2</label>
                    <input 
                      type="text" 
                      value={editedContent.contact.phone2}
                      onChange={e => setEditedContent(prev => ({...prev, contact: {...prev.contact, phone2: e.target.value}}))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Email</label>
                    <input 
                      type="text" 
                      value={editedContent.contact.email}
                      onChange={e => setEditedContent(prev => ({...prev, contact: {...prev.contact, email: e.target.value}}))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 text-right">
                 <button
                   onClick={saveContent}
                   className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all"
                 >
                   Save All Changes
                 </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display uppercase tracking-wider text-white">Manage Gallery</h2>
              {!isAddingGalleryImage && (
                <button onClick={() => setIsAddingGalleryImage(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors">
                  Add Image
                </button>
              )}
            </div>

            {isAddingGalleryImage && (
              <form onSubmit={handleAddGalleryImageSubmit} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 mb-8 flex flex-col items-start gap-4">
                <div className="w-full">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Upload Image File</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        processImageFile(file, (dataUrl) => setNewGalleryImage(dataUrl));
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-green-500/10 file:text-green-400 hover:file:bg-green-500/20 cursor-pointer"
                  />
                  <div className="mt-2 text-xs text-zinc-500">Image will be automatically compressed for better performance.</div>
                </div>

                <div className="w-full text-center text-xs text-zinc-600 font-bold uppercase tracking-widest my-2">OR</div>

                <div className="w-full">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Image URL</label>
                  <input 
                    type="url" 
                    value={newGalleryImage.startsWith('data:') ? '' : newGalleryImage}
                    onChange={e => setNewGalleryImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {newGalleryImage && (
                    <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
                      <img src={newGalleryImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="flex gap-2 w-full sm:w-auto mt-4">
                    <button type="submit" disabled={!newGalleryImage} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors w-full sm:w-auto shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                        Add Image
                    </button>
                    <button type="button" onClick={() => { setIsAddingGalleryImage(false); setNewGalleryImage(''); }} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors w-full sm:w-auto shrink-0">
                        Cancel
                    </button>
                </div>
              </form>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {editedContent.gallery.map((src, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-zinc-800">
                  <img src={src} alt="Gallery item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => removeGalleryImage(index)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-zinc-800 text-right">
                <button
                  onClick={saveContent}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all"
                >
                  Save Gallery Changes
                </button>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-display uppercase tracking-wider text-white">Manage News & Updates</h2>
              {!isAddingNews && (
                <button onClick={() => setIsAddingNews(true)} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors">
                  Add News
                </button>
              )}
            </div>

            {isAddingNews && (
              <form onSubmit={handleAddNewsSubmit} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 mb-8 space-y-4">
                <h3 className="text-xl text-amber-400 mb-4 font-display uppercase">Create News Item</h3>
                
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Title</label>
                  <input 
                    type="text" 
                    value={newNewsTitle}
                    onChange={e => setNewNewsTitle(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Upload Image File (Optional)</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        processImageFile(file, (dataUrl) => setNewNewsImage(dataUrl));
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
                  />
                  <div className="mt-2 text-xs text-zinc-500 mb-4">Image will be automatically compressed for better performance.</div>

                  <div className="w-full text-center text-xs text-zinc-600 font-bold uppercase tracking-widest my-4">OR</div>

                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Image URL (Optional)</label>
                  <input 
                    type="url" 
                    value={newNewsImage.startsWith('data:') ? '' : newNewsImage}
                    onChange={e => setNewNewsImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />

                  {newNewsImage && (
                    <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
                      <img src={newNewsImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">Content</label>
                  <textarea 
                    value={newNewsContent}
                    onChange={e => setNewNewsContent(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 min-h-[120px] resize-y"
                  />
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-zinc-800">
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors">
                    Publish News
                  </button>
                  <button type="button" onClick={() => setIsAddingNews(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-6 mb-8">
              {editedContent.news.map((item) => (
                <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex gap-6 items-start">
                  {item.image && (
                    <img src={item.image} alt="" className="w-24 h-24 object-cover rounded-lg shrink-0 border border-zinc-800" />
                  )}
                  <div className="flex-grow">
                    <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">{item.date}</div>
                    <h4 className="text-lg font-display uppercase text-white mb-2">{item.title}</h4>
                    <p className="text-zinc-500 text-sm line-clamp-2">{item.content}</p>
                  </div>
                  <button onClick={() => removeNews(item.id)} className="shrink-0 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {editedContent.news.length === 0 && (
                <div className="text-center text-zinc-500 py-8">No news items found.</div>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-800 text-right">
                <button
                  onClick={saveContent}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all"
                >
                  Save News Changes
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
