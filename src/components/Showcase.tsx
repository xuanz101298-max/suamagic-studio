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
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['film', 'commercial', 'concept'];

  // 检测是否为移动端
  const [isMobile, setIsMobile] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState<string | null>(null);

  const itemsPerPage = isMobile ? 3 : 6;

  const filteredWorks = filter === 'ALL' 
    ? works 
    : works.filter(w => w.category === filter);

  // 分页
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 切换筛选时重置页码
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
      alert("Failed to add project. Please check your permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // 标记删除（需要后端支持真正的删除）
      const workToDelete = works.find(w => w.id === id);
      if (workToDelete) {
        await saveWork({ ...workToDelete, order: -1 } as any); // 简单标记
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

  const handleMediaUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit. Please choose a smaller file.");
        return;
      }
      setIsUploading(id);
      try {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        const url = await uploadFile(file, `works/${id}_${Date.now()}`);
        const workToUpdate = works.find(w => w.id === id);
        if (workToUpdate) {
          await saveWork({ ...workToUpdate, mediaUrl: url, mediaType: type });
        }
      } catch (error: any) {
        console.error("Error uploading media:", error);
        alert(`Failed to upload media: ${error.message || 'Unknown error'}`);
      } finally {
        setIsUploading(null);
      }
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-black" id="showcase">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <h2 className="text-[#F5A623] font-mono text-[10px] tracking-[0.2em] uppercase mb-4 font-bold">Selected Works</h2>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase text-white">Showcase</h3>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => handleFilterChange('ALL')}
              className={`text-[10px] font-mono uppercase tracking-widest px-4 py-1 border transition-all ${filter === 'ALL' ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'border-white/20 text-white/50 hover:border-white/50'}`}
            >
              ALL
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`text-[10px] font-mono uppercase tracking-widest px-4 py-1 border transition-all ${filter === cat ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'border-white/20 text-white/50 hover:border-white/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {isEditMode && (
          <button onClick={handleAddWork} className="flex items-center gap-2 text-xs font-mono bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-full transition-colors uppercase tracking-widest">
            <Plus size={14} /> Add Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 border-t border-dotted border-white/30 pt-12">
        {paginatedWorks.map((work) => (
          <div 
            key={work.id} 
            className="group relative flex flex-col cursor-pointer" 
            onClick={() => {
              if (isEditMode) return;
              setActiveWork(work);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (isEditMode) return;
              setActiveWork(work);
            }}
          >
            <div className="aspect-[16/9] bg-[#111] overflow-hidden relative mb-6 rounded-lg">
              {work.mediaType === 'video' ? (
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${work.coverImageUrl || work.mediaUrl})` }} />
              ) : (
                <img src={work.mediaUrl} alt={work.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
              )}

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/50 bg-black/50 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                <Play size={24} className="ml-1" />
              </div>

              {isEditMode && (
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 z-20">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(work.id); }} className="p-4 bg-white/10 text-white rounded-full hover:bg-red-500 transition-colors">
                    <Trash2 size={24} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              {isEditMode ? (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center border-b border-dotted border-white/20 pb-2">
                    <EditableField
                      value={work.category || 'FILM'}
                      onSave={(val) => handleUpdate(work.id, 'category', val)}
                      className="bg-transparent text-[10px] font-mono text-[#F5A623] focus:outline-none uppercase tracking-widest w-1/4"
                    />
                    <EditableField
                      value={work.title}
                      onSave={(val) => handleUpdate(work.id, 'title', val)}
                      className="bg-transparent text-[10px] font-mono text-white text-center focus:outline-none uppercase tracking-widest w-1/2"
                    />
                    <EditableField
                      value={work.year || '2024'}
                      onSave={(val) => handleUpdate(work.id, 'year', val)}
                      className="bg-transparent text-[10px] font-mono text-white text-right focus:outline-none uppercase tracking-widest w-1/4"
                    />
                  </div>
                  <EditableField
                    isTextArea
                    value={work.description}
                    onSave={(val) => handleUpdate(work.id, 'description', val)}
                    className="bg-transparent border-b border-white/20 w-full text-[10px] text-gray-500 focus:outline-none focus:border-[#F5A623] resize-none font-light mt-2"
                    rows={2}
                  />
                </div>
              ) : (
                <div className="flex justify-between items-center border-b border-dotted border-white/30 pb-4 group-hover:border-white/50 transition-colors">
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest w-1/4">{work.category || 'FILM'}</span>
                  <h3 className="text-xs md:text-sm font-mono text-white text-center uppercase tracking-widest w-1/2 line-clamp-1 group-hover:text-[#F5A623] transition-colors">{work.title}</h3>
                  <span className="text-[10px] font-mono text-white/50 text-right uppercase tracking-widest w-1/4">{work.year || '2024'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 border border-white/20 text-white/50 hover:border-white hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-[10px] font-mono text-white/50">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 border border-white/20 text-white/50 hover:border-white hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      <div className="mt-24 pt-12 border-t border-dotted border-white/30 text-center">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} SUAMAGIC STUDIO PRODUCTIONS
        </p>
      </div>

      <AnimatePresence>
        {activeWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-md"
            onClick={() => setActiveWork(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-[#F5A623] transition-colors z-[110]"
              onClick={() => setActiveWork(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl max-h-full flex flex-col items-center justify-center bg-black border border-white/10 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {activeWork.mediaType === 'video' ? (
                <video
                  src={activeWork.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  webkit-playsInline
                  className="w-full max-h-[75vh] object-contain bg-[#111]"
                />
              ) : (
                <img
                  src={activeWork.mediaUrl}
                  alt={activeWork.title}
                  className="w-full max-h-[75vh] object-contain bg-[#111]"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
