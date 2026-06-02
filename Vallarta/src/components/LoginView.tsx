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

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
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
        className="animate-login-content absolute inset-0 z-10 flex flex-col justify-center lg:justify-center justify-end"
        style={{ padding: 'clamp(24px, 5vw, 56px)', paddingBottom: 'clamp(80px, 12vh, 120px)' }}
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

          {/* Form and secondary actions go here — Task 4 */}

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
