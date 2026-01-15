import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Error Boundary Component for Admin Panel
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/blogs';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-background px-4'>
          <div className='max-w-md w-full text-center'>
            <div className='mb-8'>
              <svg
                className='mx-auto h-16 w-16 text-destructive'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>

            <h1 className='text-2xl font-bold mb-2'>Oops! Something went wrong</h1>
            <p className='text-muted-foreground mb-6'>
              We're sorry, but something unexpected happened. Please try refreshing the
              page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mb-6 text-left bg-muted p-4 rounded-lg'>
                <summary className='cursor-pointer font-semibold mb-2'>
                  Error Details
                </summary>
                <pre className='text-xs overflow-auto max-h-40'>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className='flex gap-3 justify-center'>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
              <Button variant='outline' onClick={this.handleReset}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
