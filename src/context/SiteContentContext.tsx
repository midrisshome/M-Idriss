import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ServiceItem {
  id: number;
  title: string;
  desc: string;
  iconName: string;
  image: string;
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  image?: string;
}

export interface SiteContent {
  home: {
    heroHeadlinePart1: string;
    heroHeadlinePart2: string;
    heroSubtext: string;
  };
  about: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    mission: string;
  };
  services: ServiceItem[];
  gallery: string[];
  news: NewsItem[];
  contact: {
    phone1: string;
    phone2: string;
    phone3: string;
    email: string;
    location1: string;
    location2: string;
  };
}

const defaultContent: SiteContent = {
  home: {
    heroHeadlinePart1: "Bring Your Event to",
    heroHeadlinePart2: "LIFE WITH DISCO BEST",
    heroSubtext: "Professional Sound System Rentals for Parties, Weddings, Church Events & More. High fidelity, unmatched energy."
  },
  about: {
    paragraph1: "DISCO BEST is Sierra Leone's premier sound system rental company, dedicated to transforming ordinary gatherings into unforgettable experiences through the power of pristine audio.",
    paragraph2: "Whether you're organizing a massive outdoor concert, an elegant wedding, an energetic party, or a vibrant church program, our extensive inventory of professional-grade equipment ensures your message is heard and the music is felt.",
    paragraph3: "From heavy-hitting PA systems to precise DJ equipment, wireless microphones, and atmospheric lighting, our technical team provides not just the gear, but the expertise to run it flawlessly.",
    mission: "To deliver high-quality sound and unparalleled service that elevates every event, ensuring our clients and their guests enjoy unforgettable aural experiences."
  },
  services: [
    {
      id: 1,
      title: "Sound System Rental",
      desc: "Complete PA systems including line arrays, subwoofers, monitors, and mixing consoles suited for any venue size.",
      iconName: "Volume2",
      image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80",
      color: "from-cyan-500/20"
    },
    {
      id: 2,
      title: "DJ Setup",
      desc: "Industry-standard Pioneer CDJs, turntables, battle mixers, and booth monitoring systems for professional DJs.",
      iconName: "Disc",
      image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80",
      color: "from-purple-500/20"
    },
    {
      id: 3,
      title: "Outdoor Event Sound",
      desc: "Weather-resistant, high-SPL systems designed to carry sound across large open fields, beaches, and street festivals.",
      iconName: "MapPinned",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
      color: "from-green-500/20"
    },
    {
      id: 4,
      title: "Church Programs",
      desc: "Clear, articulate vocal reproduction and full-band support for crusades, worship nights, and regular services.",
      iconName: "Church",
      image: "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?w=800&q=80",
      color: "from-amber-500/20"
    },
    {
      id: 5,
      title: "Wedding & Party Setup",
      desc: "Elegant, discreet speaker placements paired with intelligent lighting to set the perfect dance floor mood.",
      iconName: "PartyPopper",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      color: "from-pink-500/20"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c090be5c52c?w=800&q=80",
    "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    "https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80",
    "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?w=800&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    "https://images.unsplash.com/photo-1502136969935-818666504aed?w=800&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"
  ],
  news: [
    {
      id: "1",
      title: "New Line Array System Added to Inventory",
      date: "2026-04-15",
      content: "We are excited to announce our brand new line array system which is capable of serving outdoor events up to 5000 people. Book our outdoor services today!",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
    },
    {
      id: "2",
      title: "DISCO BEST chosen for Freetown Music Fest",
      date: "2026-03-20",
      content: "DISCO BEST provided crystal-clear audio to thousands at the annual Freetown Music Fest. Thanks to our technical team for pulling off an amazing event.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
    }
  ],
  contact: {
    phone1: "+232 79 061894",
    phone2: "+232 75 273995",
    phone3: "+232 76 613610",
    email: "midresshome@gmail.com",
    location1: "Idriss Drive, Devil Hold",
    location2: "Freetown, Sierra Leone"
  }
};

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const contentRef = doc(db, 'settings', 'siteContent');
    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const parsed = docSnap.data() as Partial<SiteContent>;
        setContent({
          ...defaultContent,
          ...parsed,
          home: { ...defaultContent.home, ...(parsed.home || {}) },
          about: { ...defaultContent.about, ...(parsed.about || {}) },
          contact: { ...defaultContent.contact, ...(parsed.contact || {}) },
          services: parsed.services || defaultContent.services,
          gallery: parsed.gallery || defaultContent.gallery,
          news: parsed.news || defaultContent.news,
        });
      } else {
        // Init if missing
        setDoc(contentRef, defaultContent).catch(console.error);
        setContent(defaultContent);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching site content from Firestore", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    setContent(newContent); // Optimistic update
    try {
      await setDoc(doc(db, 'settings', 'siteContent'), newContent);
    } catch (e) {
      console.error("Failed to update content:", e);
      alert("Failed to update site content on the server.");
    }
  };

  return (
    <SiteContentContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
