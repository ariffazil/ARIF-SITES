import React from 'react';

/**
 * ErrorBoundary — F1 AMANAH + F4 CLARITY fallback shell.
 *
 * Constitutional rationale:
 * - F4 CLARITY (ΔS ≤ 0): when a subtree throws, the rest of the surface must
 *   still render coherent content + a navigable path home.
 * - F11 AUDITABILITY: every caught error is logged with component stack so
 *   the operator can diagnose without redeploying.
 * - F9 ANTIHANTU: the fallback is honest about being a fallback (no fake
 *   "we're back online" claim). It states the surface encountered an error
 *   and offers the human path back to sovereign ground.
 *
 * NOTE: React 19 still requires error boundaries to be class components.
 * There is no hook equivalent. Wrap a route tree, not the whole document.
 */

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  componentStack?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // F11: log to console with component stack so the surface can be diagnosed
    // without re-deploying. In a future iteration, this should also emit a
    // F2-tagged receipt to the operator telemetry channel.
    // eslint-disable-next-line no-console
    console.error('[arifOS F4 ErrorBoundary] surface encountered an error', {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      ts: new Date().toISOString(),
      surface: typeof window !== 'undefined' ? window.location.pathname : 'ssr',
    });
    this.setState({ componentStack: errorInfo?.componentStack ?? undefined });
  }

  private readonly handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, componentStack: undefined });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '4rem 1.5rem',
            maxWidth: '640px',
            margin: '0 auto',
            textAlign: 'center',
            fontFamily: 'inherit',
          }}
        >
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            The surface encountered an error.
          </h1>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.6, opacity: 0.85 }}>
            arifOS caught a fault in the React tree. The sovereign surface is
            still reachable — return to home or any mission.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                this.handleReset();
                window.location.href = '/';
              }}
              style={{
                padding: '0.6rem 1.2rem',
                border: '1px solid currentColor',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Reset & return home
            </a>
            <a
              href="/missions"
              style={{
                padding: '0.6rem 1.2rem',
                border: '1px solid currentColor',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Six human missions
            </a>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre
              style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '4px',
                textAlign: 'left',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '240px',
              }}
            >
              {this.state.error.message}
              {'\n\n'}
              {this.state.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;