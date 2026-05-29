import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import bgImage from '../assets/Wideshot-vallarta.jpeg';

interface LoginViewProps {
  onSignIn: () => void;
}

export default function LoginView({ onSignIn }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (email !== 'owner@vallartagroup.com' || password !== 'vallarta2024') {
      setError('Invalid email or password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSignIn();
    }, 800);
  };

  const [notice, setNotice] = useState('');

  const handleForgotPassword = () => {
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setNotice('Password reset instructions will be sent to ' + email);
    setTimeout(() => setNotice(''), 5000);
  };

  const handleRequestAccess = () => {
    setError('');
    setNotice('Please contact our concierge team to request access.');
    setTimeout(() => setNotice(''), 5000);
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden font-sans bg-black"
      id="login-view-container"
    >
      {/* Right Panel: Image (60%) - Rendered first for mobile stacking, ordered second on desktop */}
      <div className="w-full h-[35vh] lg:h-auto lg:w-[60%] relative z-0 order-1 lg:order-2 animate-fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        {/* Subtle overlay to ensure the image sits slightly back */}
        <div className="absolute inset-0 pointer-events-none bg-black/10" />
      </div>

      {/* Left Panel: Form & Content (40%) */}
      <div 
        className="w-full lg:w-[40%] min-h-[65vh] lg:min-h-screen flex flex-col relative z-30 order-2 lg:order-1"
        style={{ backgroundColor: 'var(--login-canvas)' }}
      >
        <header
          className="flex justify-between items-center w-full px-8 py-10 animate-fade-in-up"
          id="login-header"
          style={{ animationDelay: '150ms' }}
        >
          {/* Spacer to keep title centered against the contact link */}
          <div className="w-16" />

          <h1
            className="text-xs md:text-sm tracking-[0.35em] uppercase font-medium"
            id="login-brand-logo"
            style={{
              color: 'var(--login-ink)'
            }}
          >
            Vallarta Estates
          </h1>

          <a
            id="login-contact-btn"
            href="tel:+523228490122"
            className="p-2 -mr-2 text-xs uppercase font-medium tracking-widest transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
            style={{ color: 'var(--login-ink-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
          >
            Contact
          </a>
        </header>

        <main className="relative flex-1 flex items-center justify-center px-8 py-8" id="login-main-form-section">
          <div className="w-full max-w-sm mx-auto">
            <h2
              className="text-4xl font-serif font-light tracking-wide mb-16 text-center animate-fade-in-up"
              id="login-title"
              style={{ color: 'var(--login-ink)', animationDelay: '300ms' }}
            >
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full" id="login-form">
              {error && (
                <div
                  className="flex items-start gap-3 p-3 text-sm animate-fade-in-up"
                  style={{
                    backgroundColor: 'var(--login-error-bg)',
                    color: 'var(--login-error)',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--login-error)',
                    animationDelay: '350ms'
                  }}
                  id="login-error-banner"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {notice && (
                <div
                  className="flex items-start gap-3 p-3 text-sm animate-fade-in-up"
                  style={{
                    backgroundColor: 'oklch(30% 0.01 70)',
                    color: 'var(--login-ink-secondary)',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--login-border)',
                    animationDelay: '350ms'
                  }}
                  id="login-notice-banner"
                  role="status"
                >
                  <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--login-accent)' }} />
                  <span>{notice}</span>
                </div>
              )}

              <div
                className="relative pb-2 group border-b border-[var(--login-border)] focus-within:border-[var(--login-ink)] transition-colors duration-200 animate-fade-in-up"
                id="login-email-group"
                style={{ animationDelay: '400ms' }}
              >
                <label
                  className="block text-xs uppercase tracking-[0.15em] mb-3"
                  htmlFor="email-input"
                  style={{
                    color: 'var(--login-ink-muted)'
                  }}
                >
                  Email
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    id="email-input"
                    className="w-full bg-transparent focus:outline-none font-mono text-sm pb-1"
                    style={{
                      color: 'var(--login-ink)',
                      caretColor: 'var(--login-accent)'
                    }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  <Mail
                    className="w-4 h-4 shrink-0 transition-colors duration-200"
                    style={{ color: 'var(--login-ink-muted)' }}
                  />
                </div>
              </div>

              <div
                className="relative pb-2 group border-b border-[var(--login-border)] focus-within:border-[var(--login-ink)] transition-colors duration-200 animate-fade-in-up"
                id="login-password-group"
                style={{ animationDelay: '500ms' }}
              >
                <label
                  className="block text-xs uppercase tracking-[0.15em] mb-3"
                  htmlFor="password-input"
                  style={{
                    color: 'var(--login-ink-muted)'
                  }}
                >
                  Password
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password-input"
                    className="w-full bg-transparent focus:outline-none font-mono text-sm tracking-widest pb-1"
                    style={{
                      color: 'var(--login-ink)',
                      caretColor: 'var(--login-accent)'
                    }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="········"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-3 -mr-2 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] rounded-sm shrink-0"
                    style={{ color: 'var(--login-ink-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink-muted)'; }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <Lock
                    className="w-4 h-4 shrink-0 transition-colors duration-200"
                    style={{ color: 'var(--login-ink-muted)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="login-sign-in-btn"
                disabled={isLoading}
                className="w-full py-5 text-xs font-medium uppercase tracking-[0.25em] cursor-pointer relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--login-canvas)] animate-fade-in-up"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--login-ink)',
                  border: '1px solid var(--login-ink)',
                  borderRadius: 'var(--radius-pill)',
                  animationDelay: '600ms',
                  transition: 'background-color 0.4s var(--ease-out-expo), color 0.4s var(--ease-out-expo), opacity 0.2s var(--ease-out-expo)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--login-ink)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-canvas)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink)';
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </span>
              </button>
            </form>

            <div
              className="flex justify-between items-center text-[11px] uppercase tracking-[0.15em] mt-12 animate-fade-in-up"
              id="login-support-links"
              style={{ color: 'var(--login-ink-muted)', animationDelay: '700ms' }}
            >
              <button
                className="p-2 -ml-2 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] rounded-sm"
                style={{ color: 'var(--login-ink-muted)' }}
                onClick={handleForgotPassword}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink-muted)'; }}
                id="forgot-password-link"
              >
                Forgot Password
              </button>
              <button
                className="p-2 -mr-2 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] rounded-sm"
                style={{ color: 'var(--login-ink-muted)' }}
                onClick={handleRequestAccess}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink-muted)'; }}
                id="request-access-link"
              >
                Request Access
              </button>
            </div>
          </div>
        </main>

        <footer
          className="relative w-full text-center py-8 px-8 animate-fade-in-up"
          id="login-footer"
          style={{ animationDelay: '850ms' }}
        >
          <p
            className="text-[11px] uppercase tracking-[0.2em] mb-6"
            id="login-copyright"
            style={{
              color: 'var(--login-ink-muted)'
            }}
          >
            &copy; {new Date().getFullYear()} Vallarta Estates
          </p>
          <div
            className="flex justify-center gap-4 md:gap-8 text-[11px] uppercase tracking-[0.15em]"
            id="login-footer-links"
          >
            <a
              href="#privacy"
              className="p-2 cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] rounded-sm"
              style={{ color: 'var(--login-ink-secondary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="p-2 cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--login-ink)] rounded-sm"
              style={{ color: 'var(--login-ink-secondary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
            >
              Terms
            </a>
          </div>
        </footer>
      </div>

    </div>
  );
}
