import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <div className="text-xs font-mono bg-white p-2 rounded border border-red-100 overflow-auto max-h-40">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <>
                <div className="font-bold mb-1">Error Details:</div>
                <div className="whitespace-pre-wrap">
                  {this.state.error.message}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
