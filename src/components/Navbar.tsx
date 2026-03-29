import React from 'react';
import { Edit3, X, Upload, LogIn, LogOut } from 'lucide-react';
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
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit. Please choose a smaller file.");
        return;
      }
      try {
        const url = await uploadFile(file, `settings/logo_${Date.now()}`);
        await saveSettings({ logoUrl: url });
        setLogoUrl(url);
      } catch (error: any) {
        console.error("Error uploading logo:", error);
        alert(`Failed to upload logo: ${error.message || 'Unknown error'}`);
      }
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

  // 暂时禁用登录功能（需要后续添加 Supabase Auth）
  const handleLogin = () => {
    alert("登录功能暂时不可用。当前默认为管理员模式。");
  };

  const handleLogout = () => {
    setIsEditMode(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-8 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <div className="relative group flex items-center">
            <img src={logoUrl} alt="SuaMagic Studio" className="h-10 md:h-14 object-contain" style={{ filter: 'invert(1)' }} />
            {isEditMode && (
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-md">
                <Upload size={20} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
            {isEditMode && (
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          <div className="relative group flex items-center">
            <img 
              src="/logo.png" 
              alt="SuaMagic Studio" 
              className="h-10 md:h-14 object-contain"
              style={{ filter: 'invert(1)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = e.currentTarget.nextElementSibling;
                if (textFallback) textFallback.classList.remove('hidden');
              }} 
            />
            <div className="hidden flex-col">
              <span className="font-bold text-xl tracking-tighter uppercase leading-none text-white">SuaMagic Studio</span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase mt-2">耍马未来艺术实验室</span>
            </div>
            {isEditMode && (
              <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-md border border-dashed border-white/50">
                <Upload size={16} className="text-white mr-2" /> <span className="text-xs text-white">Upload Logo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-8 text-[10px] font-mono tracking-[0.2em] uppercase text-white">
          <a href="#about" className="hover:text-gray-400 transition-colors">About</a>
          <a href="#showcase" className="hover:text-gray-400 transition-colors">Showcase</a>
          <a href="#artists" className="hover:text-gray-400 transition-colors">Artists</a>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 text-[10px] font-mono px-4 py-2 rounded-full border transition-colors uppercase tracking-widest ${
                isEditMode ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50 text-white'
              }`}
            >
              {isEditMode ? <><X size={14} /> Exit Edit</> : <><Edit3 size={14} /> Edit Mode</>}
            </button>
          )}

          <button
            onClick={handleLogin}
            className="flex items-center gap-2 text-[10px] font-mono text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
            title="Admin Login"
          >
            <LogIn size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}
