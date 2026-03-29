import React from 'react';
import { StudioInfo } from '../types';
import EditableField from './EditableField';
import { saveStudioInfo } from '../supabase';

interface AboutProps {
  about: StudioInfo[];
  isEditMode: boolean;
}

export default function About({ about, isEditMode }: AboutProps) {
  const handleUpdate = async (id: string, field: keyof StudioInfo, value: string) => {
    try {
      const infoToUpdate = about.find(i => i.id === id);
      if (!infoToUpdate) return;
      await saveStudioInfo({ ...infoToUpdate, [field]: value });
    } catch (error) {
      console.error("Error updating about info:", error);
    }
  };

  return (
    <section className="py-40 px-6 md:px-12 max-w-5xl mx-auto bg-black text-white border-t border-white/10" id="about">
      <div className="flex flex-col gap-32">
        {about.map((info) => (
          <div key={info.id} className="space-y-10 relative group">
            <div className="absolute -left-6 top-2 w-[2px] h-6 bg-[#F5A623] opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#F5A623]"></div>
              {isEditMode ? (
                <EditableField
                  value={info.title}
                  onSave={(val) => handleUpdate(info.id, 'title', val)}
                  className="bg-transparent text-2xl md:text-3xl font-display uppercase tracking-[0.2em] text-white focus:outline-none focus:border-[#F5A623] border-b border-transparent w-full"
                />
              ) : (
                <h4 className="text-2xl md:text-3xl font-display uppercase tracking-[0.2em] text-white">
                  {info.title}
                </h4>
              )}
            </div>
            <div className="space-y-8">
              {isEditMode ? (
                <EditableField
                  isTextArea
                  value={info.description}
                  onSave={(val) => handleUpdate(info.id, 'description', val)}
                  className="bg-transparent text-gray-300 text-lg md:text-xl font-light leading-relaxed tracking-wide border-l border-white/5 pl-6 focus:outline-none focus:border-[#F5A623] w-full resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed tracking-wide border-l border-white/5 pl-6">
                  {info.description}
                </p>
              )}
              <div className="relative">
                {isEditMode ? (
                  <EditableField
                    isTextArea
                    value={info.descriptionEn || ''}
                    onSave={(val) => handleUpdate(info.id, 'descriptionEn', val)}
                    className="bg-transparent text-white/30 text-xs md:text-sm font-mono uppercase tracking-[0.25em] leading-relaxed max-w-4xl pl-6 focus:outline-none focus:border-[#F5A623] w-full resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-white/30 text-xs md:text-sm font-mono uppercase tracking-[0.25em] leading-relaxed max-w-4xl pl-6">
                    {info.descriptionEn}
                  </p>
                )}
                <div className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-[#F5A623]/40 to-transparent"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
