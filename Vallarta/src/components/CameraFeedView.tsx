import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu, Mic, MicOff, Maximize, Play, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { ScreenType } from '../types';

interface CameraFeedViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'push_back') => void;
  onNotify?: (message: string) => void;
}

export default function CameraFeedView({ onNavigate, onNotify }: CameraFeedViewProps) {
  const [activeCam, setActiveCam] = useState<'cam01' | 'cam02'>('cam02');
  const [muted, setMuted] = useState(true);
  const [zoomed, setZoomed] = useState(false);

  // High-end luxurious photo assets representing different surveillance cameras
  const feeds = {
    cam01: {
      location: 'EXTERIOR : MAIN ENTRANCE',
      code: 'CAM 019',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    cam02: {
      location: 'EXTERIOR : POOL TERRACE',
      code: 'CAM 020',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    }
  };

  return (
    <div className="min-h-screen bg-[#242424] text-[#FAF8F5] flex flex-col justify-between font-sans relative overflow-hidden" id="camera-feed-fullscreen-view">
      
      {/* Decorative scanline or dark luxury noise */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#242424]/80 pointer-events-none z-10" />

      {/* Top bar with Live indicator, Menu and Close */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-[#FAF8F5]/10 bg-[#242424]/60 backdrop-blur-xl z-20" id="camera-feed-header">
        <div className="flex items-center gap-3" id="camera-header-live-group">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] font-semibold text-[#FAF8F5] uppercase font-sans">
            LIVE
          </span>
           <span className="text-[10px] text-[#FAF8F5]/50 font-sans tracking-wider hidden sm:inline px-3 py-1 border border-[#FAF8F5]/10 rounded-full">
            SYSTEMS STABLE
          </span>
        </div>

        <div className="flex items-center gap-2" id="camera-header-actions-group">
          {/* Zoom layout toggle */}
          <button 
            onClick={() => setZoomed(!zoomed)}
            className="p-3 border border-[#FAF8F5]/15 hover:bg-[#FAF8F5]/10 transition rounded-full cursor-pointer text-[#FAF8F5]/80 magnetic-btn"
            title="Toggle fullscreen view"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Menu button explicitly required by navigation spec */}
          <button 
            aria-label="Menu"
            id="camera-menu-nav-btn"
            onClick={() => onNavigate('nav_menu', 'slide_up')}
            className="p-3 border border-[#FAF8F5]/15 hover:bg-[#FAF8F5]/10 transition duration-200 cursor-pointer text-[#FAF8F5] rounded-full magnetic-btn"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Close button explicitly required by navigation spec */}
          <button 
            aria-label="Close View"
            id="camera-close-view-btn"
            onClick={() => onNavigate('reporting', 'push_back')}
            className="p-3 border border-[#FAF8F5]/15 hover:bg-[#FAF8F5]/10 transition duration-300 cursor-pointer text-[#FAF8F5]/80 hover:text-[#FAF8F5] rounded-full magnetic-btn"
            title="Back to Reporting overview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Central Screen Monitor */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-4 z-10" id="camera-monitor-view">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          
          {/* Titles */}
          <div className="text-left" id="camera-title-group">
            <h3 className="text-4xl md:text-5xl font-serif italic text-[#FAF8F5] tracking-wide">
              Casa Obsidiana
            </h3>
            <p className="text-[11px] font-sans tracking-widest text-[#FAF8F5]/60 uppercase mt-2">
              {feeds[activeCam].location} : {feeds[activeCam].code}
            </p>
          </div>

          {/* Screen projection container */}
          <div className="relative border border-[#7E7A74]/30 bg-[#242424] group overflow-hidden rounded-[3rem] shadow-2xl" id="camera-screen-projection">
            {/* Monitor aspect ratio image container */}
            <div className={`transition-all duration-500 ease-in-out ${zoomed ? 'aspect-video object-contain h-[350px] md:h-[480px] w-full' : 'relative aspect-video'}`}>
              <img 
                src={feeds[activeCam].image}
                alt="Active camera viewport"
                className="w-full h-full object-cover grayscale brightness-95 opacity-90 transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Simulated telemetry HUD display overlays */}
            <div className="absolute inset-x-0 bottom-6 left-6 right-6 text-[#FAF8F5]/60 font-sans text-[8px] sm:text-[9px] flex justify-between pointer-events-none z-20 uppercase tracking-widest">
              <div>
                <span>ISO 400 • F2.8 • 1/60s</span>
              </div>
              <div className="text-right">
                <span>BITRATE: 4.8 MBPS • SECURE TLS</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 pointer-events-none text-[#FAF8F5]/80 font-sans text-[10px] px-3 py-1 bg-[#242424]/60 backdrop-blur-md rounded-full tracking-wider">
              1080P UHD @ 30FPS
            </div>

            {/* Scanline pattern overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />
          </div>

          {/* Camera Feed Toggle Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4" id="camera-selection-toggles">
            <button
              onClick={() => setActiveCam('cam01')}
              id="cam-01-select-btn"
              className={`py-4 px-4 text-center text-xs font-semibold tracking-[0.2em] transition duration-300 border uppercase cursor-pointer rounded-full magnetic-btn ${
                activeCam === 'cam01' 
                  ? 'bg-[#FAF8F5] text-[#242424] border-[#FAF8F5]' 
                  : 'bg-transparent text-[#FAF8F5]/60 border-[#7E7A74]/30 hover:border-[#FAF8F5]/50 hover:text-[#FAF8F5]'
              }`}
            >
              CAM 01 : ENTRANCE
            </button>

            <button
              onClick={() => setActiveCam('cam02')}
              id="cam-02-select-btn"
              className={`py-4 px-4 text-center text-xs font-semibold tracking-[0.2em] transition duration-300 border uppercase cursor-pointer rounded-full magnetic-btn ${
                activeCam === 'cam02' 
                  ? 'bg-[#FAF8F5] text-[#242424] border-[#FAF8F5]' 
                  : 'bg-transparent text-[#FAF8F5]/60 border-[#7E7A74]/30 hover:border-[#FAF8F5]/50 hover:text-[#FAF8F5]'
              }`}
            >
              CAM 02 : POOL
            </button>
          </div>

        </div>
      </main>

      {/* Footer controls */}
      <footer className="border-t border-[#FAF8F5]/10 py-6 px-6 bg-[#242424] text-[#FAF8F5]/50 text-center flex flex-col sm:flex-row justify-between items-center gap-4 z-20" id="camera-footer">
        <div className="flex gap-4" id="camera-footer-controls-group">
          {/* Audio toggle button with icon */}
          <button 
            type="button" 
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              if (onNotify) {
                onNotify(nextMuted ? "Live microphone audio feed muted." : "Live microphone active. Audio stream unlocked.");
              }
            }}
            id="camera-audio-toggle"
            className="flex items-center gap-2 hover:text-[#FAF8F5] transition duration-200 cursor-pointer text-xs tracking-wider"
          >
            {muted ? <VolumeX className="w-4 h-4 shrink-0 text-[#A0522D]" /> : <Volume2 className="w-4 h-4 shrink-0 text-green-500" />}
            {muted ? "AUDIO LOCKED (MUTED)" : "MICROPHONE FEED RECEPTIVE"}
          </button>
        </div>

        <p className="text-[8px] tracking-[0.25em] uppercase text-[#FAF8F5]/40" id="camera-security-disclaimer">
          RESTRICTED TRANSMISSION • REGISTERED OFF-SITE OWNERS CONSOLE SECURITY PRIVILEGE
        </p>
      </footer>
    </div>
  );
}
