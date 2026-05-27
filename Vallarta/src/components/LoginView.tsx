import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, Sparkles, HelpCircle } from 'lucide-react';

interface LoginViewProps {
  onSignIn: () => void;
}

export default function LoginView({ onSignIn }: LoginViewProps) {
  const [email, setEmail] = useState('owner@vallartagroup.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerToast('Please provide your estate authorization email.');
      return;
    }
    triggerToast('Access Authorizing... Welcome back.');
    setTimeout(() => {
      onSignIn();
    }, 800);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div 
      className="relative min-h-screen flex flex-col justify-between text-white bg-cover bg-center font-sans overflow-hidden" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80')` 
      }}
      id="login-view-container"
    >
      {/* Top Header Bar */}
      <header className="w-full flex justify-between items-center px-8 py-6 border-b border-white/10" id="login-header">
        <button 
          id="login-menu-toggle"
          aria-label="Menu"
          className="p-2 text-white/80 hover:text-white transition duration-200 cursor-pointer"
          onClick={() => triggerToast('Please authenticate to unlock system dashboard.')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-2xl md:text-3xl font-serif tracking-[0.2em] uppercase text-white font-light" id="login-brand-logo">
          VALLARTA
        </h1>
        
        <button 
          id="login-contact-btn"
          className="text-xs uppercase tracking-[0.2em] font-medium text-white/80 hover:text-white hover:underline transition-all cursor-pointer"
          onClick={() => triggerToast('Concierge available at +52 (322) 849-0122')}
        >
          CONTACT
        </button>
      </header>

      {/* Main Glassmorphic Form Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8" id="login-main-form-section">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md glass p-10 md:p-12 rounded-none border border-white/20 shadow-2xl relative"
          id="login-card"
        >
          <h2 className="text-center text-sm uppercase tracking-[0.3em] font-medium text-amber-200/90 mb-10" id="login-form-title">
            ESTATE ACCESS
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8" id="login-form">
            {/* Email Input */}
            <div className="relative border-b border-white/20 pb-2 group" id="login-email-group">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1" htmlFor="email-input">
                EMAIL ADDRESS
              </label>
              <div className="flex items-center">
                <input 
                  type="email"
                  id="email-input"
                  className="bg-transparent w-full focus:outline-none text-white font-light text-sm tracking-wider"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@vallarta.com"
                />
                <Mail className="w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative border-b border-white/20 pb-2 group" id="login-password-group">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1" htmlFor="password-input">
                SECURE PASSWORD
              </label>
              <div className="flex items-center">
                <input 
                  type="password"
                  id="password-input"
                  className="bg-transparent w-full focus:outline-none text-white font-light text-sm tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            {/* Error/Notice Notification */}
            {showToast && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-amber-300 bg-amber-950/40 p-3 border border-amber-500/30 font-light flex items-center gap-2"
                id="login-alert-box"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              id="login-sign-in-btn"
              className="w-full bg-black text-white hover:bg-neutral-900 transition-colors duration-300 py-4 text-xs font-medium tracking-[0.3em] uppercase border border-white/10 cursor-pointer shadow-lg active:scale-[0.98]"
            >
              SIGN IN
            </button>
          </form>

          {/* Underneath Links */}
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] text-white/60 mt-8" id="login-support-links">
            <button 
              className="hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={() => triggerToast('A password authentication link is sent on request.')}
              id="forgot-password-link"
            >
              FORGOT PASSWORD
            </button>
            <button 
              className="hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={() => triggerToast('Please contact primary estate concierge to register new units.')}
              id="request-access-link"
            >
              REQUEST ACCESS
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer Details */}
      <footer className="w-full text-center py-8 px-4 border-t border-white/10 bg-black/30" id="login-footer">
        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4" id="login-copyright">
          © 2024 ARCHITECTURAL COLLECTIVE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex justify-center gap-8 text-[9px] tracking-[0.25em] text-white/60 uppercase" id="login-footer-links">
          <button onClick={() => triggerToast('Privacy parameters are set according to state framework.')} className="hover:text-white transition-all cursor-pointer">PRIVACY POLICY</button>
          <button onClick={() => triggerToast('Terms of system deployment apply.')} className="hover:text-white transition-all cursor-pointer">TERMS OF SERVICE</button>
          <button onClick={() => triggerToast('High contrast accessible layouts active.')} className="hover:text-white transition-all cursor-pointer">ACCESSIBILITY</button>
        </div>
      </footer>
    </div>
  );
}
