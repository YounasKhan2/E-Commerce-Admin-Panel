'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.state = { hasError: true, error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, resetError }) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    resetError();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-sidebar rounded-lg p-6 text-center">
        <div className="mb-4">
          <span className="material-symbols-outlined text-red-500 text-6xl">
            error
          </span>
        </div>
        
        <h1 className="text-2xl font-semibold text-white mb-2">
          Something went wrong
        </h1>
        
        <p className="text-slate-400 text-sm mb-6">
          We encountered an unexpected error. Please try going back to the dashboard.
        </p>

        {error && (
          <div className="bg-background-dark rounded p-3 mb-6 text-left">
            <p className="text-xs text-red-400 font-mono break-all">
              {error.toString()}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={handleGoToDashboard}
            icon="home"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="secondary"
            onClick={resetError}
            icon="refresh"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
