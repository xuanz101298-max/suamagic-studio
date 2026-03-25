/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Showcase from './components/Showcase';
import Artists from './components/Artists';
import { initialWorks, initialArtists, initialAbout } from './data';
import { db, auth } from './firebase';
import { collection, onSnapshot, doc, getDocFromServer, setDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirestoreError, OperationType } from './utils/firebaseUtils';
import { Work, Artist, StudioInfo } from './types';

export default function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [about, setAbout] = useState<StudioInfo[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthReady(true);
      if (user) {
        // Check if user is admin
        try {
          const userDoc = await getDocFromServer(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          } else if (user.email === 'xuanz101298@gmail.com') {
            setIsAdmin(true);
            // Bootstrap admin
            await setDoc(doc(db, 'users', user.uid), { role: 'admin' }, { merge: true });
          } else {
            setIsAdmin(false);
            setIsEditMode(false);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setIsEditMode(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Data fetching
  useEffect(() => {
    if (!isAuthReady) return;

    const worksQuery = query(collection(db, 'works'), orderBy('order', 'desc'));
    const unsubWorks = onSnapshot(worksQuery, (snapshot) => {
      if (snapshot.empty && isAdmin) {
        // Populate initial data
        initialWorks.forEach(async (work) => {
          try {
            await setDoc(doc(db, 'works', work.id), work, { merge: true });
          } catch (e) {
            console.error("Failed to populate initial work", e);
          }
        });
      } else {
        const worksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Work));
        setWorks(worksData.length > 0 ? worksData : initialWorks);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'works');
    });

    const artistsQuery = query(collection(db, 'artists'), orderBy('order', 'desc'));
    const unsubArtists = onSnapshot(artistsQuery, (snapshot) => {
      if (snapshot.empty && isAdmin) {
        // Populate initial data
        initialArtists.forEach(async (artist) => {
          try {
            await setDoc(doc(db, 'artists', artist.id), artist, { merge: true });
          } catch (e) {
            console.error("Failed to populate initial artist", e);
          }
        });
      } else {
        const artistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artist));
        setArtists(artistsData.length > 0 ? artistsData : initialArtists);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'artists');
    });

    const aboutQuery = query(collection(db, 'about'), orderBy('order', 'desc'));
    const unsubAbout = onSnapshot(aboutQuery, (snapshot) => {
      if (snapshot.empty && isAdmin) {
        // Populate initial data
        initialAbout.forEach(async (info) => {
          try {
            await setDoc(doc(db, 'about', info.id), info, { merge: true });
          } catch (e) {
            console.error("Failed to populate initial about info", e);
          }
        });
      } else {
        const aboutData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudioInfo));
        setAbout(aboutData.length > 0 ? aboutData : initialAbout);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'about');
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setLogoUrl(docSnap.data().logoUrl);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
    });

    return () => {
      unsubWorks();
      unsubArtists();
      unsubAbout();
      unsubSettings();
    };
  }, [isAuthReady, isAdmin]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar isEditMode={isEditMode} setIsEditMode={setIsEditMode} logoUrl={logoUrl} setLogoUrl={setLogoUrl} isAdmin={isAdmin} />
      <main>
        <Hero />
        <About about={about} isEditMode={isEditMode} />
        <Showcase works={works} setWorks={setWorks} isEditMode={isEditMode} />
        <Artists artists={artists} setArtists={setArtists} isEditMode={isEditMode} />
      </main>
      <footer className="py-16 border-t border-white/10 text-center flex flex-col items-center justify-center gap-4 bg-black">
        {logoUrl ? (
          <img src={logoUrl} alt="SuaMagic Studio" className="h-12 object-contain opacity-50" style={{ filter: 'invert(1)' }} />
        ) : (
          <div className="flex flex-col items-center">
            <img 
              src="/logo.png" 
              alt="SuaMagic Studio" 
              className="h-12 object-contain opacity-50"
              style={{ filter: 'invert(1)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = e.currentTarget.nextElementSibling;
                if (textFallback) textFallback.classList.remove('hidden');
              }} 
            />
            <div className="hidden font-bold text-xl tracking-tighter uppercase text-white">SuaMagic Studio</div>
          </div>
        )}
        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-4">
          © {new Date().getFullYear()} Future Art Laboratory. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
