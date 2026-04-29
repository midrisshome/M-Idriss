import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  loading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const dateStr = new Date().getFullYear();
    const count = bookings.length + 1;
    const orderId = `DB-${dateStr}-${count.toString().padStart(3, '0')}`;
    
    const newBooking: Booking = {
      ...bookingData,
      id: orderId, // using orderId as document id might be ok, or we can use auto ID
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      const sanitizedBooking = JSON.parse(JSON.stringify(newBooking));
      await setDoc(doc(db, 'bookings', orderId), sanitizedBooking);
      return orderId;
    } catch (e) {
      console.error("Error adding booking:", e);
      throw e;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (e) {
      console.error("Error updating booking status:", e);
      throw e;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (e) {
      console.error("Error deleting booking:", e);
      throw e;
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, deleteBooking, loading }}>
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
