import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center" id="home">
      {/* Background: User-provided Collage Art with Advanced Adaptation */}
      <div className="absolute inset-0 z-0">
        {/* Layer 1: Base Darkening & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/95 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-10"></div>
        
        {/* Layer 2: Color & Blend Mode Adaptation */}
        <div className="absolute inset-0 bg-[#F5A623]/5 z-10 mix-blend-color"></div>
        <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply"></div>
        
        <motion.img 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="/her-bg.png" 
          alt="SuaMagic Collage Art" 
          className="w-full h-full object-cover contrast-125 saturate-150 brightness-[0.6]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1920";
          }}
        />
        
        {/* Layer 3: Digital Texture (Scanlines & Noise) */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
        </div>
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="z-10 w-full max-w-7xl mx-auto px-6 md:px-12 relative pointer-events-auto flex flex-col justify-between h-full py-20 min-h-screen"
      >
        {/* Center Content: Large Logo */}
        <div className="flex flex-col items-center justify-center my-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            {/* Logo Image */}
            <img 
              src="/logo.png" 
              alt="SuaMagic Studio" 
              className="w-full max-w-[80vw] md:max-w-3xl h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              style={{ filter: 'invert(1)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = e.currentTarget.nextElementSibling;
                if (textFallback) textFallback.classList.remove('hidden');
              }} 
            />
            {/* Text Fallback if Logo Missing */}
            <h1 className="hidden text-[12vw] font-black leading-none tracking-tighter uppercase text-white mix-blend-difference">
              SuaMagic
            </h1>
          </motion.div>
        </div>

        {/* Bottom Content: Basquiat Style Quote */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-2xl">
            <div className="text-white/90 text-2xl md:text-4xl font-serif italic leading-snug mb-4">
              <span className="block mb-2">AI景观堆积的时代，</span>
              <span className="relative inline-block">
                耍马尽量不制造垃圾。
                {/* Basquiat Style Strike-through Line */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "110%" }}
                  transition={{ delay: 2, duration: 0.8, ease: "easeInOut" }}
                  className="absolute left-[-5%] top-1/2 h-[4px] md:h-[8px] bg-[#F5A623] -translate-y-1/2 rotate-[-1.5deg] origin-left"
                  style={{
                    clipPath: "polygon(0% 20%, 100% 0%, 98% 80%, 2% 100%)", // Rough edges
                    boxShadow: "0 0 20px rgba(245, 166, 35, 0.4)"
                  }}
                />
              </span>
            </div>
            <p className="text-white/30 font-mono text-[10px] md:text-xs tracking-[0.1em] uppercase leading-relaxed">
              Amidst the AI glut, SuaMagic brings magic, not mess.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
