import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import bgImage from '../assets/Wideshot-vallarta.jpeg';

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL ?? 'owner@vallartagroup.com';
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? 'vallarta2024';

interface LoginViewProps {
  onSignIn: () => void;
}

export default function LoginView({ onSignIn }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setError('Enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Email or password is incorrect.');
      return;
    }

    setIsLoading(true);
    await new Promise<void>(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    onSignIn();
  };

  const [notice, setNotice] = useState('');

  const handleForgotPassword = () => {
    setError('');
    if (email.trim() && validateEmail(email)) {
      setNotice(`Reset instructions will be sent to ${email}.`);
    } else {
      setNotice('Enter your email address above, then try again.');
    }
  };

  const handleRequestAccess = () => {
    setError('');
    setNotice('Contact our concierge: +52 322 849 0122 · concierge@vallartagroup.com');
  };

  return (
    <div
      className="relative overflow-hidden login-dark"
      style={{ width: '100vw', height: '100dvh', fontFamily: 'var(--font-ui)' }}
    >
      {/* Full-bleed image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          role="presentation"
          className="w-full h-full object-cover cinematic-grade animate-login-image"
        />
      </div>

      {/* Directional gradient — left legibility, right open */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: [
            'linear-gradient(to right,',
            '  oklch(22% 0.035 220 / 0.85) 0%,',
            '  oklch(22% 0.035 220 / 0.60) 35%,',
            '  oklch(22% 0.035 220 / 0.18) 58%,',
            '  oklch(22% 0.035 220 / 0.00) 72%',
            ')'
          ].join(' ')
        }}
      />

      {/* Mobile gradient — heavier bottom coverage on portrait */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
        style={{
          background: 'linear-gradient(to top, oklch(22% 0.035 220 / 0.90) 0%, oklch(22% 0.035 220 / 0.40) 50%, oklch(22% 0.035 220 / 0.00) 75%)'
        }}
      />

      {/* Top nav */}
      <header
        className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center"
        style={{ padding: 'clamp(20px, 3.5vh, 36px) clamp(24px, 5vw, 56px)' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)'
          }}
        >
          Vallarta Estates
        </span>
        <a
          href="tel:+523228490122"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.40)',
            textDecoration: 'none',
            transition: 'color var(--duration-fast) var(--ease-out-expo)'
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.80)')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)')}
          onFocus={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.80)')}
          onBlur={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)')}
        >
          Contact
        </a>
      </header>

      {/* Main login content */}
      <main
        className="animate-login-content absolute inset-0 z-10 flex flex-col justify-end lg:justify-center"
        style={{
          paddingTop: 'clamp(24px, 5vw, 56px)',
          paddingLeft: 'clamp(24px, 5vw, 56px)',
          paddingRight: 'clamp(24px, 5vw, 56px)',
          paddingBottom: 'clamp(88px, 14vh, 120px)'
        }}
        aria-label="Sign in to Vallarta Estates"
      >
        <div style={{ maxWidth: '420px' }}>
          {/* Location label */}
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.40)',
              marginBottom: '16px'
            }}
          >
            Puerto Vallarta · Punta Mita
          </p>

          {/* Editorial headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.875rem, 3.5vw, 2.625rem)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              marginBottom: '48px'
            }}
          >
            Your portfolio,<br />at a glance.
          </h1>

          {/* Error state */}
          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '11px 14px',
                marginBottom: '24px',
                background: 'oklch(96% 0.015 25 / 0.10)',
                border: '1px solid oklch(53% 0.20 25 / 0.45)',
                borderRadius: '6px',
                color: 'oklch(88% 0.06 25)',
                fontSize: '0.8125rem',
                lineHeight: 1.45,
                fontFamily: 'var(--font-ui)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertCircle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} />
                <span>{error}</span>
              </span>
              {error.includes('incorrect') && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    paddingLeft: '24px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent-warning)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Reset password →
                </button>
              )}
            </div>
          )}

          {/* Notice state */}
          {notice && (
            <div
              role="status"
              style={{
                padding: '11px 14px',
                marginBottom: '24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.8125rem',
                lineHeight: 1.45,
                fontFamily: 'var(--font-ui)'
              }}
            >
              {notice}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            {/* Email field */}
            <div
              style={{ borderBottom: '1px solid rgba(255,255,255,0.20)', paddingBottom: '10px' }}
              onFocusCapture={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.65)')}
              onBlurCapture={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.20)')}
            >
              <label
                htmlFor="email-input"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.40)',
                  marginBottom: '10px'
                }}
              >
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email-input"
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.88)',
                  caretColor: 'var(--color-accent-warning)'
                }}
              />
            </div>

            {/* Password field */}
            <div
              style={{ borderBottom: '1px solid rgba(255,255,255,0.20)', paddingBottom: '10px' }}
              onFocusCapture={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.65)')}
              onBlurCapture={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.20)')}
            >
              <label
                htmlFor="password-input"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.40)',
                  marginBottom: '10px'
                }}
              >
                Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password-input"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.88)',
                    caretColor: 'var(--color-accent-warning)'
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(v => !v)}
                  className="login-toggle-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '3px',
                    transition: 'color 0.15s',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.80)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)')}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 15, height: 15 }} />
                    : <Eye style={{ width: 15, height: 15 }} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '15px',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.30)',
                borderRadius: 'var(--radius-pill)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.80)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                marginTop: '8px',
                transition: [
                  'background var(--duration-fast) var(--ease-out-expo)',
                  'border-color var(--duration-fast) var(--ease-out-expo)',
                  'color var(--duration-fast) var(--ease-out-expo)'
                ].join(', ')
              }}
              onMouseEnter={e => {
                if (isLoading) return;
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(255,255,255,0.08)';
                b.style.borderColor = 'rgba(255,255,255,0.60)';
                b.style.color = 'rgba(255,255,255,1)';
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'transparent';
                b.style.borderColor = 'rgba(255,255,255,0.30)';
                b.style.color = 'rgba(255,255,255,0.80)';
              }}
            >
              {isLoading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>

          {/* Secondary actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px'
            }}
          >
            {[
              { label: 'Forgot Password', onClick: handleForgotPassword },
              { label: 'Request Access', onClick: handleRequestAccess }
            ].map(({ label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.30)',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.30)')}
              >
                {label}
              </button>
            ))}
          </div>

        </div>
      </main>

      {/* Bottom footer */}
      <footer
        className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center"
        style={{ padding: 'clamp(14px, 2.5vh, 24px) clamp(24px, 5vw, 56px)' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.18)'
          }}
        >
          © {new Date().getFullYear()} Vallarta Estates
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {(['Privacy', 'Terms'] as const).map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.18)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.50)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.18)')}
            >
              {label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
