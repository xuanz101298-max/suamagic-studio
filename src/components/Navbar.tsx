import React from 'react';
import { Edit3, X, Upload } from 'lucide-react';
import { saveSettings } from '../supabase';

interface NavbarProps {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  logoUrl: string | null;
  setLogoUrl: (val: string | null) => void;
  isAdmin: boolean;
}

export default function Navbar({ isEditMode, setIsEditMode, logoUrl, setLogoUrl, isAdmin }: NavbarProps) {
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    try {
      const { uploadFile } = await import('../supabase');
      const url = await uploadFile(file, `settings/logo_${Date.now()}`);
      await saveSettings({ logoUrl: url });
      setLogoUrl(url);
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      alert(`Failed to upload logo: ${error.message || 'Unknown error'}`);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await saveSettings({ logoUrl: '' });
      setLogoUrl(null);
    } catch (error) {
      console.error("Error removing logo:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-5 md:py-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <div className="relative group flex items-center">
            <img src={logoUrl} alt="SuaMagic Studio" className="h-9 md:h-11 object-contain" style={{ filter: 'invert(1)' }} />
            {isEditMode && (
              <>
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded">
                  <Upload size={16} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="relative group flex items-center">
            <img
              src="/logo.png"
              alt="SuaMagic Studio"
              className="h-9 md:h-11 object-contain"
              style={{ filter: 'invert(1)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Text fallback — flex-row, single line */}
            <div className="hidden items-center gap-2">
              <span className="font-bold text-lg tracking-tighter uppercase text-white leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                SuaMagic
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] text-white/40 uppercase hidden md:block">
                Studio
              </span>
            </div>
            {isEditMode && (
              <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded border border-dashed border-white/40">
                <Upload size={14} className="text-white mr-1.5" />
                <span className="text-[10px] text-white">Upload Logo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6 md:gap-8">
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">
          <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
          <a href="#showcase" className="hover:text-white transition-colors duration-200">Showcase</a>
          <a href="#artists" className="hover:text-white transition-colors duration-200">Artists</a>
        </div>

        {/* Admin edit toggle */}
        {isAdmin && (
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 text-[9px] font-mono px-3.5 py-1.5 rounded-full border transition-all duration-200 uppercase tracking-widest ${
              isEditMode
                ? 'bg-white text-black border-white'
                : 'border-white/25 text-white/60 hover:border-white/50 hover:text-white'
            }`}
          >
            {isEditMode ? (
              <><X size={12} /> Exit</>
            ) : (
              <><Edit3 size={11} /> Edit</>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
