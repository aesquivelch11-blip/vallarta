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

      {/* Content layers go here — added in subsequent tasks */}

    </div>
  );
}
