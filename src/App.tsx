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
import { getWorks, getArtists, getStudioInfo, getSettings } from './supabase';
import { Work, Artist, StudioInfo } from './types';

export default function App() {
  // 编辑模式已禁用，所有内容从后端修改
  const isEditMode = false;
  const setIsEditMode = () => {};
  const isAdmin = false;
  
  const [works, setWorks] = useState<Work[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [about, setAbout] = useState<StudioInfo[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 数据获取 - 直接获取，不用订阅
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取作品
        const worksData = await getWorks();
        setWorks(worksData.length > 0 ? worksData : initialWorks);
        
        // 获取艺术家
        const artistsData = await getArtists();
        setArtists(artistsData.length > 0 ? artistsData : initialArtists);
        
        // 获取工作室信息
        const aboutData = await getStudioInfo();
        setAbout(aboutData.length > 0 ? aboutData : initialAbout);
        
        // 获取设置
        const settings = await getSettings();
        if (settings?.logo_url) {
          setLogoUrl(settings.logo_url);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // 使用默认数据
        setWorks(initialWorks);
        setArtists(initialArtists);
        setAbout(initialAbout);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 填充初始数据（如果为空且是管理员）
  useEffect(() => {
    if (!loading && isAdmin && works.length === 0) {
      initialWorks.forEach(async (work) => {
        try {
          const { saveWork } = await import('./supabase');
          await saveWork(work);
        } catch (e) {
          console.error("Failed to populate initial work", e);
        }
      });
    }
  }, [loading, isAdmin, works.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 font-mono text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar isEditMode={isEditMode} logoUrl={logoUrl} />
      <main>
        <Hero />
        <About about={about} isEditMode={isEditMode} />
        <Showcase works={works} setWorks={setWorks} isEditMode={isEditMode} />
        <Artists artists={artists} setArtists={setArtists} isEditMode={isEditMode} />
      </main>
      <footer className="py-12 border-t border-white/8 text-center flex flex-col items-center justify-center gap-3 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-[#F5A623]/40" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-white/25 uppercase">
            SuaMagic Studio
          </span>
          <div className="w-6 h-px bg-[#F5A623]/40" />
        </div>
        <p className="text-[9px] font-mono text-white/15 tracking-widest uppercase">
          © {new Date().getFullYear()} Future Art Laboratory — All rights reserved.
        </p>
      </footer>
    </div>
  );
}
