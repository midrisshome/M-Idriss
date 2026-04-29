import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EventType = 'Wedding' | 'Party' | 'Church Event' | 'Corporate' | 'Outdoor Concert' | 'Other';

export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => string;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('disco_best_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('disco_best_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const dateStr = new Date().getFullYear();
    const count = bookings.length + 1;
    const orderId = `DB-${dateStr}-${count.toString().padStart(3, '0')}`;
    
    const newBooking: Booking = {
      ...bookingData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    setBookings(prev => [newBooking, ...prev]);
    return orderId;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, deleteBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}
