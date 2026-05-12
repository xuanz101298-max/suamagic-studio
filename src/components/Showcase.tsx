import React, { useState, useEffect } from 'react';
import { Work } from '../types';
import { Plus, Trash2, Upload, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveWork } from '../supabase';
import EditableField from './EditableField';

interface ShowcaseProps {
  works: Work[];
  setWorks: React.Dispatch<React.SetStateAction<Work[]>>;
  isEditMode: boolean;
}

export default function Showcase({ works, setWorks, isEditMode }: ShowcaseProps) {
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = ['film', 'commercial', 'concept'];
  const itemsPerPage = isMobile ? 3 : 6;

  const filteredWorks = filter === 'ALL'
    ? works
    : works.filter(w => w.category === filter);

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleAddWork = async () => {
    const newId = Date.now().toString();
    const newWork: Work = {
      id: newId,
      title: 'NEW PROJECT',
      description: 'Description here...',
      category: 'FILM',
      year: new Date().getFullYear().toString(),
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      mediaType: 'image',
      createdAt: new Date().toISOString(),
      order: works.length > 0 ? Math.max(...works.map(w => w.order || 0)) + 1 : 1
    };
    try {
      await saveWork(newWork);
    } catch (error) {
      console.error("Error adding work:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const workToDelete = works.find(w => w.id === id);
      if (workToDelete) {
        await saveWork({ ...workToDelete, order: -1 } as any);
      }
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };

  const handleUpdate = async (id: string, field: keyof Work, value: string) => {
    try {
      const workToUpdate = works.find(w => w.id === id);
      if (!workToUpdate) return;
      await saveWork({ ...workToUpdate, [field]: value });
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto bg-black" id="showcase">

      {/* Section header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#F5A623]" />
            <span className="text-[#F5A623] font-mono text-[10px] tracking-[0.25em] uppercase">
              Selected Works
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tighter uppercase text-white">
            Showcase
          </h3>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['ALL', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 border transition-all duration-200 ${
                  filter === cat
                    ? 'bg-[#F5A623] border-[#F5A623] text-black font-bold'
                    : 'border-white/20 text-white/40 hover:border-white/50 hover:text-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isEditMode && (
          <button
            onClick={handleAddWork}
            className="flex items-center gap-2 text-xs font-mono bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-full transition-colors uppercase tracking-widest"
          >
            <Plus size={14} /> Add Project
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
        {paginatedWorks.map((work) => (
          <div
            key={work.id}
            className="group flex flex-col cursor-pointer"
            onClick={() => {
              if (isEditMode) return;
              setActiveWork(work);
            }}
          >
            {/* Media */}
            <div className="aspect-video bg-[#0d0d0d] overflow-hidden relative mb-4 rounded-md">
              {work.mediaType === 'video' ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: work.coverImageUrl ? `url(${work.coverImageUrl})` : 'none' }}
                >
                  {!work.coverImageUrl && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={28} className="text-white/30" />
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={work.mediaUrl}
                  alt={work.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/60 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                  <Play size={20} className="ml-0.5 text-white" />
                </div>
              </div>

              {/* Edit controls */}
              {isEditMode && (
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(work.id); }}
                    className="p-3 bg-white/10 text-white rounded-full hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Meta info */}
            {isEditMode ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-dotted border-white/15 pb-2">
                  <EditableField
                    value={work.category || 'FILM'}
                    onSave={(val) => handleUpdate(work.id, 'category', val)}
                    className="bg-transparent text-[9px] font-mono text-[#F5A623] focus:outline-none uppercase tracking-widest"
                  />
                  <EditableField
                    value={work.title}
                    onSave={(val) => handleUpdate(work.id, 'title', val)}
                    className="bg-transparent text-[9px] font-mono text-white text-center focus:outline-none uppercase tracking-widest"
                  />
                  <EditableField
                    value={work.year || '2024'}
                    onSave={(val) => handleUpdate(work.id, 'year', val)}
                    className="bg-transparent text-[9px] font-mono text-white/50 text-right focus:outline-none uppercase tracking-widest"
                  />
                </div>
                <EditableField
                  isTextArea
                  value={work.description}
                  onSave={(val) => handleUpdate(work.id, 'description', val)}
                  className="bg-transparent text-[10px] text-gray-500 focus:outline-none resize-none font-light"
                  rows={2}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                    {work.category || 'FILM'}
                  </span>
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                    {work.year || '2024'}
                  </span>
                </div>
                <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider group-hover:text-[#F5A623] transition-colors duration-200 truncate">
                  {work.title}
                </h3>
                <p className="text-xs text-white/40 font-light leading-relaxed line-clamp-2">
                  {work.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-14">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-[9px] font-mono uppercase tracking-widest px-4 py-2 border border-white/15 text-white/40 hover:border-white/40 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-[9px] font-mono text-white/30 tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-[9px] font-mono uppercase tracking-widest px-4 py-2 border border-white/15 text-white/40 hover:border-white/40 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Bottom rule */}
      <div className="mt-20 pt-8 border-t border-white/8 text-center">
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} SUAMAGIC STUDIO PRODUCTIONS
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/96 p-4 md:p-12"
            onClick={() => setActiveWork(null)}
          >
            <button
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-[110]"
              onClick={() => setActiveWork(null)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeWork.mediaType === 'video' ? (
                <video
                  src={activeWork.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  muted
                  preload="auto"
                  className="w-full max-h-[80vh] object-contain bg-[#0d0d0d] rounded"
                />
              ) : (
                <img
                  src={activeWork.mediaUrl}
                  alt={activeWork.title}
                  className="w-full max-h-[80vh] object-contain bg-[#0d0d0d] rounded"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="mt-4 text-center">
                <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
                  {activeWork.title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
