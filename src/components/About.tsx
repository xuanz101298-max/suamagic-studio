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

  // Sort by order
  const sortedAbout = [...about].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section
      className="py-20 md:py-32 px-6 md:px-12 max-w-5xl mx-auto bg-black text-white border-t border-white/10"
      id="about"
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-12 md:mb-16">
        <div className="w-8 h-px bg-[#F5A623]" />
        <span className="text-[#F5A623] font-mono text-[10px] tracking-[0.25em] uppercase">
          About
        </span>
      </div>

      <div className="flex flex-col gap-12 md:gap-16">
        {sortedAbout.map((info, index) => (
          <div
            key={info.id}
            className="group flex flex-col md:flex-row md:items-start gap-6 md:gap-12"
          >
            {/* Index number */}
            <div className="hidden md:flex flex-col items-center pt-1">
              <span className="font-mono text-white/15 text-xs tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="w-px flex-1 bg-white/10 mt-3 min-h-[40px]" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623] flex-shrink-0" />
                {isEditMode ? (
                  <EditableField
                    value={info.title}
                    onSave={(val) => handleUpdate(info.id, 'title', val)}
                    className="bg-transparent text-xl md:text-2xl font-display uppercase tracking-[0.15em] text-white focus:outline-none border-b border-transparent focus:border-[#F5A623] w-full"
                  />
                ) : (
                  <h4 className="text-xl md:text-2xl font-display uppercase tracking-[0.15em] text-white">
                    {info.title}
                  </h4>
                )}
              </div>

              {/* Chinese description */}
              <div className="pl-4 md:pl-5 border-l border-white/10">
                {isEditMode ? (
                  <EditableField
                    isTextArea
                    value={info.description}
                    onSave={(val) => handleUpdate(info.id, 'description', val)}
                    className="bg-transparent text-gray-300 text-base md:text-lg font-light leading-relaxed focus:outline-none w-full resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                    {info.description}
                  </p>
                )}
              </div>

              {/* English description */}
              <div className="pl-4 md:pl-5">
                {isEditMode ? (
                  <EditableField
                    isTextArea
                    value={info.descriptionEn || ''}
                    onSave={(val) => handleUpdate(info.id, 'descriptionEn', val)}
                    className="bg-transparent text-white/35 text-xs font-mono uppercase tracking-[0.2em] leading-relaxed focus:outline-none w-full resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-white/35 text-xs font-mono uppercase tracking-[0.2em] leading-relaxed max-w-3xl">
                    {info.descriptionEn}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
