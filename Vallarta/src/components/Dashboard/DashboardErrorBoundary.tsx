import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class DashboardErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Dashboard error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: 'clamp(2rem, 4vw, 3rem)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                fontWeight: 400,
                color: 'var(--color-ink)',
                margin: '0 0 12px',
              }}
            >
              Something went wrong
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--color-ink-secondary)',
                margin: '0 0 24px',
                maxWidth: '320px',
                lineHeight: 1.5,
              }}
            >
              This section couldn't load. Try refreshing the page or switching sections.
            </p>
            <button
              className="dashboard-link"
              onClick={() => this.setState({ hasError: false })}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
