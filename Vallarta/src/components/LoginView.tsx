import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onSignIn: () => void;
}

export default function LoginView({ onSignIn }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: 'var(--login-canvas)' }}
      id="login-view-container"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, var(--login-surface) 0%, transparent 60%)`
        }}
      />

      <header
        className="relative w-full flex justify-between items-center px-8 py-6"
        style={{ borderBottom: '1px solid var(--login-border)' }}
        id="login-header"
      >
        <button
          id="login-menu-toggle"
          aria-label="Menu"
          className="p-2 cursor-pointer transition-colors duration-200"
          style={{ color: 'var(--login-ink-secondary)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink-secondary)'; }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1
          className="text-3xl md:text-4xl italic tracking-wide"
          id="login-brand-logo"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--login-ink)'
          }}
        >
          Vallarta Estates
        </h1>

        <a
          id="login-contact-btn"
          href="tel:+523228490122"
          className="text-xs uppercase font-medium tracking-widest transition-colors duration-200 cursor-pointer"
          style={{ color: 'var(--login-ink-secondary)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
        >
          Contact
        </a>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 py-8" id="login-main-form-section">
        <div
          className="w-full max-w-md p-10 md:p-12 relative"
          style={{
            backgroundColor: 'var(--login-surface)',
            borderRadius: 'var(--radius-panel)',
            border: '1px solid var(--login-border)'
          }}
          id="login-card"
        >
          <h2
            className="text-center text-xs uppercase font-medium tracking-[0.2em] mb-10"
            id="login-form-title"
            style={{
              fontFamily: 'var(--font-ui)',
              color: 'var(--login-ink-secondary)'
            }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8" id="login-form">
            {error && (
              <div
                className="flex items-start gap-3 p-3 text-sm"
                style={{
                  backgroundColor: 'var(--login-error-bg)',
                  color: 'var(--login-error)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--login-error)'
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
                className="flex items-start gap-3 p-3 text-sm"
                style={{
                  backgroundColor: 'oklch(30% 0.01 70)',
                  color: 'var(--login-ink-secondary)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--login-border)'
                }}
                id="login-notice-banner"
                role="status"
              >
                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--login-accent)' }} />
                <span>{notice}</span>
              </div>
            )}

            <div
              className="relative pb-2 group"
              id="login-email-group"
              style={{ borderBottom: '1px solid var(--login-border)' }}
            >
              <label
                className="block text-[10px] uppercase tracking-[0.15em] mb-2"
                htmlFor="email-input"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--login-ink-muted)'
                }}
              >
                Email
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  id="email-input"
                  className="w-full bg-transparent focus:outline-none font-mono text-sm"
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
              className="relative pb-2 group"
              id="login-password-group"
              style={{ borderBottom: '1px solid var(--login-border)' }}
            >
              <label
                className="block text-[10px] uppercase tracking-[0.15em] mb-2"
                htmlFor="password-input"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--login-ink-muted)'
                }}
              >
                Password
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  id="password-input"
                  className="w-full bg-transparent focus:outline-none font-mono text-sm tracking-widest"
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
              className="w-full py-4 text-xs font-medium uppercase tracking-[0.2em] cursor-pointer relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--login-accent)',
                color: 'var(--login-ink)',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-ui)',
                transition: 'background-color 0.2s var(--ease-out-expo), opacity 0.2s var(--ease-out-expo)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--login-accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--login-accent)';
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </span>
            </button>
          </form>

          <div
            className="flex justify-between items-center text-[10px] uppercase tracking-[0.1em] mt-8"
            id="login-support-links"
            style={{ color: 'var(--login-ink-muted)' }}
          >
            <button
              className="cursor-pointer transition-colors duration-200"
              style={{ color: 'var(--login-ink-muted)' }}
              onClick={handleForgotPassword}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--login-ink-muted)'; }}
              id="forgot-password-link"
            >
              Forgot Password
            </button>
            <button
              className="cursor-pointer transition-colors duration-200"
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
        className="relative w-full text-center py-8 px-4"
        style={{
          borderTop: '1px solid var(--login-border)',
          backgroundColor: 'var(--login-canvas)'
        }}
        id="login-footer"
      >
        <p
          className="text-[10px] uppercase tracking-[0.15em] mb-4"
          id="login-copyright"
          style={{
            fontFamily: 'var(--font-ui)',
            color: 'var(--login-ink-muted)'
          }}
        >
          &copy; {new Date().getFullYear()} Vallarta Estates. All rights reserved.
        </p>
        <div
          className="flex justify-center gap-8 text-[9px] uppercase tracking-[0.12em]"
          id="login-footer-links"
          style={{ color: 'var(--login-ink-secondary)' }}
        >
          <a
            href="#privacy"
            className="cursor-pointer transition-colors duration-200"
            style={{ color: 'var(--login-ink-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="cursor-pointer transition-colors duration-200"
            style={{ color: 'var(--login-ink-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
          >
            Terms of Service
          </a>
          <a
            href="#accessibility"
            className="cursor-pointer transition-colors duration-200"
            style={{ color: 'var(--login-ink-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--login-ink-secondary)'; }}
          >
            Accessibility
          </a>
        </div>
      </footer>
    </div>
  );
}
