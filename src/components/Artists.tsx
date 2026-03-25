import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Artist } from '../types';
import { Plus, Trash2, Upload, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { uploadFileToStorage } from '../utils/firebaseUtils';
import EditableField from './EditableField';

interface ArtistsProps {
  artists: Artist[];
  setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  isEditMode: boolean;
}

export default function Artists({ artists, setArtists, isEditMode }: ArtistsProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(artists.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = offset.x;
    if (swipe < -50 && currentIndex < artists.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (swipe > 50 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleUpdate = async (id: string, field: keyof Artist, value: string) => {
    try {
      const artistToUpdate = artists.find(a => a.id === id);
      if (!artistToUpdate) return;
      await setDoc(doc(db, 'artists', id), { ...artistToUpdate, [field]: value }, { merge: true });
    } catch (error) {
      console.error("Error updating artist:", error);
    }
  };

  const handleAvatarUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit. Please choose a smaller file.");
        return;
      }
      setIsUploading(id);
      try {
        const url = await uploadFileToStorage(file, `artists/${id}_${Date.now()}`);
        const artistToUpdate = artists.find(a => a.id === id);
        if (artistToUpdate) {
          await setDoc(doc(db, 'artists', id), { ...artistToUpdate, avatarUrl: url }, { merge: true });
        }
      } catch (error: any) {
        console.error("Error uploading avatar:", error);
        alert(`Failed to upload avatar: ${error.message || 'Unknown error'}`);
      } finally {
        setIsUploading(null);
      }
    }
  };

  const handleAddArtist = async () => {
    const newId = Date.now().toString();
    const newArtist: Artist = {
      id: newId,
      name: 'NEW ARTIST',
      description: 'Artist description...',
      avatarUrl: `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`,
      createdAt: new Date().toISOString(),
      order: artists.length > 0 ? Math.max(...artists.map(a => a.order || 0)) + 1 : 1
    };
    try {
      await setDoc(doc(db, 'artists', newId), newArtist);
      setCurrentIndex(artists.length);
    } catch (error) {
      console.error("Error adding artist:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'artists', id));
      if (currentIndex >= artists.length - 1) {
        setCurrentIndex(Math.max(0, artists.length - 2));
      }
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const activeArtist = artists[currentIndex];

  return (
    <section className="py-32 overflow-hidden relative bg-black" id="artists">
      {/* Background Blur Effect */}
      {activeArtist && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.img 
            key={activeArtist.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
            src={activeArtist.avatarUrl} 
            className="w-full h-full object-cover filter blur-[100px] scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex justify-between items-end relative z-10">
        <div>
          <h2 className="text-[#F5A623] font-mono text-[10px] tracking-[0.2em] uppercase mb-4 font-bold">The ideal state of future art</h2>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase text-white">Signed Artists</h3>
        </div>
        {isEditMode && (
          <button onClick={handleAddArtist} className="flex items-center gap-2 text-xs font-mono bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-full transition-colors uppercase tracking-widest">
            <Plus size={14} /> Add Artist
          </button>
        )}
      </div>

      <div 
        className="relative h-[450px] flex items-center justify-center w-full z-10" 
        style={{ perspective: 1000 }}
        ref={containerRef}
      >
        {artists.length === 0 && <p className="text-gray-500 font-mono">No artists found.</p>}
        
        {artists.map((artist, index) => {
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;

          // Cover Flow calculations matching the reference
          const scale = isActive ? 1.3 : Math.max(0.7, 1 - absOffset * 0.15);
          const rotateY = offset * -15; // Left faces right, right faces left
          const rotateZ = offset * 8;   // Left tilts counter-clockwise, right tilts clockwise
          const x = offset * 140;       // Reduced distance between cards
          const zIndex = 100 - absOffset;
          const opacity = isActive ? 1 : Math.max(0.3, 1 - absOffset * 0.4);

          return (
            <motion.div
              key={artist.id}
              className={`absolute w-[180px] h-[220px] md:w-[220px] md:h-[260px] rounded-2xl bg-[#111] shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden border ${isActive ? 'border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'border-white/5'}`}
              style={{ zIndex }}
              initial={false}
              animate={{
                x,
                scale,
                rotateY,
                rotateZ,
                opacity,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => !isActive && setCurrentIndex(index)}
            >
              <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
              
              {isEditMode && isActive && (
                <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                  <label className="cursor-pointer p-4 bg-white/10 text-white rounded-full hover:bg-[#F5A623] hover:text-black transition-colors">
                    {isUploading === artist.id ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={24} />}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(artist.id, e)} disabled={isUploading === artist.id} />
                  </label>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(artist.id); }} className="p-4 bg-white/10 text-white rounded-full hover:bg-red-500 transition-colors">
                    <Trash2 size={24} />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Active Artist Info Below Carousel */}
      {activeArtist && (
        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 px-6">
          {isEditMode ? (
            <div className="flex flex-col items-center gap-4">
              <EditableField
                value={activeArtist.name}
                onSave={(val) => handleUpdate(activeArtist.id, 'name', val)}
                className="bg-transparent border-b border-white/20 text-center text-3xl md:text-4xl font-bold focus:outline-none focus:border-[#F5A623] tracking-tight uppercase w-full text-white"
              />
              <EditableField
                isTextArea
                value={activeArtist.description}
                onSave={(val) => handleUpdate(activeArtist.id, 'description', val)}
                className="bg-transparent border-b border-white/20 text-center text-sm text-gray-400 focus:outline-none focus:border-[#F5A623] resize-none h-32 font-light leading-relaxed w-full"
              />
            </div>
          ) : (
            <motion.div
              key={activeArtist.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 uppercase">{activeArtist.name}</h3>
              <div className="w-12 h-1 bg-[#F5A623] mx-auto mb-8" />
              <p className="text-gray-400 font-light text-sm md:text-base max-w-3xl mx-auto leading-loose">
                {activeArtist.description}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
