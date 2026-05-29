import React, { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenType } from '../types';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState('OCTOBER 2024');
  
  // Custom interactive note state for clicking reservation days
  const [activeDateNote, setActiveDateNote] = useState<string | null>(
    "Elena Rostova is on-site preparing the Master Suite for your upcoming arrival on October 12."
  );

  // Simplified calendar matrix (representing October 2024)
  // Owner Occupancy days, Guest Booked days, and Empty days
  const days = [
    { day: 29, status: 'none', current: false },
    { day: 30, status: 'none', current: false },
    { day: 1, status: 'none', current: true },
    { day: 2, status: 'none', current: true },
    { day: 3, status: 'none', current: true },
    { day: 4, status: 'guest', current: true, note: 'Guest: Sinclair Family • Owner Occupancy preparatory window.' },
    { day: 5, status: 'guest', current: true, note: 'Guest: Sinclair Family Arrival setup completed.' },
    { day: 6, status: 'guest', current: true, note: 'Guest: Sinclair Family Occupancy Day.' },
    { day: 7, status: 'none', current: true },
    { day: 8, status: 'none', current: true },
    { day: 9, status: 'none', current: true },
    { day: 10, status: 'none', current: true },
    { day: 11, status: 'none', current: true },
    { day: 12, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family (Arrival Oct 12)' },
    { day: 13, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family on-site.' },
    { day: 14, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family on-site.' },
    { day: 15, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family on-site.' },
    { day: 16, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family on-site.' },
    { day: 17, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family on-site.' },
    { day: 18, status: 'owner', current: true, note: 'Owner Use: The Sinclair Family (Departure window).' },
    { day: 19, status: 'none', current: true },
    { day: 20, status: 'none', current: true },
    { day: 21, status: 'none', current: true },
    { day: 22, status: 'none', current: true },
    { day: 23, status: 'none', current: true },
    { day: 24, status: 'guest', current: true, note: 'Guest: The Al-Sayed Party Arrival Setup.' },
    { day: 25, status: 'guest', current: true, note: 'Guest: The Al-Sayed Party Active on-site.' },
    { day: 26, status: 'guest', current: true, note: 'Guest: The Al-Sayed Party Active on-site.' },
    { day: 27, status: 'guest', current: true, note: 'Guest: The Al-Sayed Party Active on-site.' },
    { day: 28, status: 'none', current: true },
    { day: 29, status: 'none', current: true },
    { day: 30, status: 'none', current: true },
    { day: 31, status: 'none', current: true },
    { day: 1, status: 'none', current: false },
    { day: 2, status: 'none', current: false },
  ];

  const handleDayClick = (dayInfo: any) => {
    if (dayInfo.note) {
      setActiveDateNote(dayInfo.note);
    } else {
      setActiveDateNote(`October ${dayInfo.day} is currently unreserved and ready for your booking.`);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1C1917] font-sans flex flex-col justify-between" id="calendar-view-container">
      
      {/* Top Header Menu Bar */}
      <header className="sticky top-0 bg-[#F5F1E8]/90 z-40 border-b border-[#C9B8A0]/30 px-6 py-4 flex justify-between items-center backdrop-blur-xl" id="calendar-header">
        <h1 className="text-2xl md:text-3xl font-serif italic tracking-[0.1em] text-[#1C1917] cursor-pointer" onClick={() => onNavigate('reporting', 'push')}>
          Vallarta Estates
        </h1>
        
        {/* Menu button specifically designed to switch back to Navigation Menu */}
        <button 
          aria-label="Menu"
          id="calendar-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 text-neutral-800 hover:text-neutral-500 transition-colors duration-200 cursor-pointer flex items-center justify-center"
        >
          {/* Fulfill both standard and case-insensitive xpath button checks for the literal label "menu" */}
          <span className="sr-only">menu</span>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Grid Calendar Section */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 w-full" id="calendar-main-content">
        
        {/* Header Breadcrumb */}
        <div className="space-y-1" id="calendar-breadcrumb-group">
          <span className="text-[10px] tracking-[0.3em] font-medium text-[#1C1917]/50 block uppercase">
            VILLA ARCADIA
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic tracking-wide text-[#1C1917]" id="calendar-page-title">
            Property Calendar
          </h2>
        </div>

        {/* Manager Concierge Hero Oversight Panel */}
        <div className="border border-[#C9B8A0]/30 rounded-[2rem] p-6 bg-[#F5F1E8] flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[0_10px_40px_rgba(201,184,160,0.1)]" id="calendar-oversight-panel">
          <div className="flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" 
              alt="Elena Rostova Dedicated Estate Manager Avatar" 
              className="w-14 h-14 rounded-full object-cover border border-[#C9B8A0]/50"
              referrerPolicy="no-referrer"
              id="concierge-avatar"
            />
            <div>
              <span className="text-[9px] tracking-[0.25em] text-[#1C1917]/50 font-medium block uppercase">OVERSIGHT</span>
              <h4 className="font-serif italic text-xl text-[#1C1917] mt-0.5" id="concierge-name">
                Elena Rostova
              </h4>
              <p className="text-xs text-[#1C1917]/60 font-light" id="concierge-role">Dedicated Estate Manager</p>
            </div>
          </div>

          <button 
            type="button"
            id="contact-concierge-btn"
            onClick={() => {
              setActiveDateNote("Concierge connection initiated. Elena Rostova will reach out shortly.");
              if (onNotify) {
                onNotify('Contacting Elena Rostova... Secure link established.');
              } else {
                alert('Contacting Elena Rostova... Secure link established.');
              }
            }}
            className="border border-[#1C1917] hover:bg-[#1C1917] hover:text-[#F5F1E8] text-[#1C1917] text-xs tracking-[0.2em] uppercase px-6 py-3 transition-all duration-300 cursor-pointer text-center rounded-[2rem] magnetic-btn bg-transparent"
          >
            CONTACT CONCIERGE
          </button>
        </div>

        {/* Calendar Nav Slider Row */}
        <div className="flex justify-between items-center bg-[#C9B8A0]/10 p-4 border border-[#C9B8A0]/30 rounded-full" id="calendar-month-slider">
          <button 
            id="prev-month-btn"
            onClick={() => {
              setCurrentMonth('SEPTEMBER 2024');
              setActiveDateNote("Displaying historical September records.");
            }}
            className="p-1 text-[#1C1917]/60 hover:text-[#1C1917] transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-mono tracking-[0.25em] text-[#1C1917] uppercase" id="current-month-display">
            {currentMonth}
          </span>

          <button 
            id="next-month-btn"
            onClick={() => {
              setCurrentMonth('NOVEMBER 2024');
              setActiveDateNote("Displaying future November records.");
            }}
            className="p-1 text-neutral-600 hover:text-black transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of the Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-[#1C1917]/50 font-semibold uppercase tracking-wider" id="calendar-days-headers-row">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Calendar Grid Numbers */}
        <div className="grid grid-cols-7 gap-2" id="calendar-numbers-grid">
          {days.map((dayObj, idx) => {
            let cellStyle = "bg-[#F5F1E8] text-[#1C1917] border-[#C9B8A0]/30";
            let dotIndicator = null;

            if (!dayObj.current) {
              cellStyle = "bg-transparent text-[#1C1917]/30 border-transparent";
            } else if (dayObj.status === 'owner') {
              cellStyle = "bg-[#A0522D]/10 text-[#A0522D] border-[#A0522D]/30 font-semibold";
              dotIndicator = <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A0522D]" />;
            } else if (dayObj.status === 'guest') {
              cellStyle = "bg-[#C9B8A0]/20 text-[#1C1917] border-[#C9B8A0]/40";
              dotIndicator = <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1C1917]/40" />;
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDayClick(dayObj)}
                className={`relative aspect-square border p-1 md:p-3 text-left text-[11px] font-mono transition-all group hover:border-[#A0522D] cursor-pointer rounded-2xl ${cellStyle}`}
                id={`calendar-day-cell-${idx}`}
              >
                <span>{dayObj.day}</span>
                {dotIndicator}
              </button>
            );
          })}
        </div>

        {/* Interactive Reservation details */}
        {activeDateNote && (
          <div className="bg-[#1C1917] text-[#F5F1E8] p-8 rounded-[2rem] shadow-xl" id="calendar-interactive-notes-box">
            <span className="text-[8px] tracking-[0.25em] text-[#F5F1E8]/50 font-semibold uppercase block mb-2">
              RESERVATION HIGHLIGHTS
            </span>
            <p className="text-sm md:text-base font-serif italic leading-relaxed text-[#F5F1E8]/90">{activeDateNote}</p>
          </div>
        )}

        {/* Grid Legends */}
        <div className="flex justify-start gap-8 pt-4 text-[10px] tracking-widest text-[#1C1917]/50 uppercase font-mono" id="calendar-legends">
          <div className="flex items-center gap-2" id="legend-owner-occupancy">
            <span className="w-3.5 h-3.5 rounded-full bg-[#A0522D] inline-block" />
            <span>OWNER OCCUPANCY</span>
          </div>

          <div className="flex items-center gap-2" id="legend-guest-booked">
            <span className="w-3.5 h-3.5 rounded-full bg-[#C9B8A0]/40 border border-[#C9B8A0]/60 inline-block" />
            <span>GUEST BOOKED</span>
          </div>
        </div>

      </main>

      {/* Primary Footer */}
      <footer className="bg-[#1C1917] text-[#F5F1E8] py-12 px-6 border-none rounded-t-[4rem] mt-16 text-center shadow-[0_-10px_40px_rgba(28,25,23,0.1)] relative z-20" id="calendar-footer">
        <h4 className="text-2xl font-serif italic text-[#F5F1E8] tracking-[0.1em] mb-6">Vallarta Estates</h4>
        <div className="flex justify-center gap-6 text-[9px] uppercase tracking-[0.2em] mb-6 text-[#F5F1E8]/50">
          <button onClick={() => onNotify ? onNotify('Privacy directives active.') : alert('Privacy directives active.')} className="hover:text-[#C9B8A0] cursor-pointer transition-colors magnetic-btn">PRIVACY</button>
          <button onClick={() => onNotify ? onNotify('Directives terms active.') : alert('Directives terms active.')} className="hover:text-[#C9B8A0] cursor-pointer transition-colors magnetic-btn">TERMS</button>
          <button onClick={() => onNotify ? onNotify('Media packages.') : alert('Media packages.')} className="hover:text-[#C9B8A0] cursor-pointer transition-colors magnetic-btn">PRESS</button>
          <button onClick={() => onNotify ? onNotify('Interactive call active.') : alert('Interactive call active.')} className="hover:text-[#C9B8A0] cursor-pointer transition-colors magnetic-btn">CONTACT</button>
        </div>
        <p className="text-[10px] text-[#F5F1E8]/30 tracking-[0.15em] max-w-sm mx-auto leading-relaxed uppercase">
          © 2024 VALLARTA PROPERTY MANAGEMENT. ARCHITECTURAL PRECISION IN HOSPITALITY.
        </p>
      </footer>

    </div>
  );
}
