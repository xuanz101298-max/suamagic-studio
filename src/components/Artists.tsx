import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Artist } from '../types';
import { Plus, Trash2, Upload } from 'lucide-react';
import { saveArtist } from '../supabase';
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

  const handleDragEnd = (e: any, { offset }: PanInfo) => {
    const swipe = offset.x;
    if (swipe < -60 && currentIndex < artists.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (swipe > 60 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleUpdate = async (id: string, field: keyof Artist, value: string) => {
    try {
      const artistToUpdate = artists.find(a => a.id === id);
      if (!artistToUpdate) return;
      await saveArtist({ ...artistToUpdate, [field]: value });
    } catch (error) {
      console.error("Error updating artist:", error);
    }
  };

  const handleAvatarUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit.");
      return;
    }
    setIsUploading(id);
    try {
      const { uploadFile } = await import('../supabase');
      const url = await uploadFile(file, `artists/${id}_${Date.now()}`);
      const artistToUpdate = artists.find(a => a.id === id);
      if (artistToUpdate) {
        await saveArtist({ ...artistToUpdate, avatarUrl: url });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      alert(`Failed to upload avatar: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(null);
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
      await saveArtist(newArtist);
      setCurrentIndex(artists.length);
    } catch (error) {
      console.error("Error adding artist:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const artistToDelete = artists.find(a => a.id === id);
      if (artistToDelete) {
        await saveArtist({ ...artistToDelete, order: -1 } as any);
      }
      if (currentIndex >= artists.length - 1) {
        setCurrentIndex(Math.max(0, artists.length - 2));
      }
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const activeArtist = artists[currentIndex];

  return (
    <section className="py-20 md:py-28 overflow-hidden relative bg-black" id="artists">

      {/* Blurred background */}
      {activeArtist && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.img
            key={activeArtist.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ duration: 0.8 }}
            src={activeArtist.avatarUrl}
            className="w-full h-full object-cover blur-[90px] scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-px bg-[#F5A623]" />
          <span className="text-[#F5A623] font-mono text-[10px] tracking-[0.25em] uppercase">
            The Ideal State of Future Art
          </span>
        </div>
        <div className="flex justify-between items-end">
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tighter uppercase text-white">
            Signed Artists
          </h3>
          {isEditMode && (
            <button
              onClick={handleAddArtist}
              className="flex items-center gap-2 text-xs font-mono bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-full transition-colors uppercase tracking-widest"
            >
              <Plus size={14} /> Add Artist
            </button>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative h-[380px] md:h-[420px] flex items-center justify-center w-full z-10"
        style={{ perspective: 1200 }}
        ref={containerRef}
      >
        {artists.length === 0 && (
          <p className="text-gray-600 font-mono text-sm">No artists found.</p>
        )}

        {artists.map((artist, index) => {
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;

          const scale = isActive ? 1.25 : Math.max(0.72, 1 - absOffset * 0.18);
          const rotateY = offset * -12;
          const rotateZ = offset * 6;
          const x = offset * 150;
          const zIndex = 100 - absOffset;
          const opacity = isActive ? 1 : Math.max(0.25, 1 - absOffset * 0.4);

          return (
            <motion.div
              key={artist.id}
              className={`absolute rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col items-center justify-end shadow-2xl border transition-colors ${
                isActive
                  ? 'border-white/15'
                  : 'border-white/5'
              }`}
              style={{
                zIndex,
                width: '160px',
                height: '200px',
                x,
                scale,
                rotateY,
                rotateZ,
                opacity,
              }}
              initial={false}
              animate={{ x, scale, rotateY, rotateZ, opacity }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              onClick={() => !isActive && setCurrentIndex(index)}
            >
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Edit overlay */}
              {isEditMode && isActive && (
                <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                  <label className="cursor-pointer p-3 bg-white/10 text-white rounded-full hover:bg-[#F5A623] hover:text-black transition-colors">
                    {isUploading === artist.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={18} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarUpload(artist.id, e)}
                      disabled={isUploading === artist.id}
                    />
                  </label>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(artist.id); }}
                    className="p-3 bg-white/10 text-white rounded-full hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Active artist info */}
      {activeArtist && (
        <div className="relative z-10 max-w-3xl mx-auto text-center mt-6 px-6">
          <motion.div
            key={activeArtist.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isEditMode ? (
              <div className="flex flex-col items-center gap-3">
                <EditableField
                  value={activeArtist.name}
                  onSave={(val) => handleUpdate(activeArtist.id, 'name', val)}
                  className="bg-transparent border-b border-white/20 text-center text-2xl md:text-3xl font-bold focus:outline-none focus:border-[#F5A623] tracking-tight uppercase w-full text-white"
                />
                <EditableField
                  isTextArea
                  value={activeArtist.description}
                  onSave={(val) => handleUpdate(activeArtist.id, 'description', val)}
                  className="bg-transparent border-b border-white/20 text-center text-sm text-gray-400 focus:outline-none focus:border-[#F5A623] resize-none h-20 font-light leading-relaxed w-full"
                />
              </div>
            ) : (
              <>
                <h3 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-white mb-2 uppercase">
                  {activeArtist.name}
                </h3>
                <div className="w-10 h-0.5 bg-[#F5A623] mx-auto mb-5" />
                <p className="text-gray-400 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                  {activeArtist.description}
                </p>
              </>
            )}
          </motion.div>

          {/* Dot indicators */}
          {artists.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {artists.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 h-1.5 bg-[#F5A623]'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
