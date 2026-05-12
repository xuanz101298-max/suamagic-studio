import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      id="home"
    >
      {/* ── Background ───────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Base image */}
        <img
          src="/her-bg.png"
          alt="SuaMagic Collage Art"
          className="w-full h-full object-cover opacity-50 contrast-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1920";
          }}
        />
        {/* Bottom-heavy gradient so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/95" />
      </div>

      {/* ── Content ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-between min-h-screen py-24"
      >
        {/* Center: Logo */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="w-full max-w-[70vw] md:max-w-2xl"
          >
            <img
              src="/logo.png"
              alt="SuaMagic Studio"
              className="w-full h-auto object-contain"
              style={{ filter: 'invert(1)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div
              className="hidden text-[11vw] md:text-[8vw] font-black leading-none tracking-tighter uppercase text-white text-center"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              SuaMagic
            </div>
          </motion.div>
        </div>

        {/* Bottom: Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
            <div className="max-w-xl">
              <p className="text-white/90 text-xl md:text-3xl font-serif italic leading-snug">
                <span className="block mb-1">AI景观堆积的时代，</span>
                <span className="relative inline-block">
                  耍马尽量不制造垃圾。
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2.2, duration: 0.8, ease: 'easeInOut' }}
                    className="absolute left-[-4px] right-[-4px] top-1/2 h-[3px] bg-[#F5A623] -translate-y-1/2 rotate-[-1deg] origin-left"
                    style={{ display: 'block' }}
                  />
                </span>
              </p>
              <p className="text-white/30 font-mono text-[10px] md:text-xs tracking-[0.15em] uppercase mt-3">
                Amidst the AI glut — SuaMagic brings magic, not mess.
              </p>
            </div>

            <div className="flex items-center gap-6 md:self-end pb-1">
              <span className="text-white/20 font-mono text-[9px] tracking-[0.3em] uppercase hidden md:block">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent hidden md:block" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
