import React, { useEffect, useState, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error detected:', event.error);
      setHasError(true);
      setErrorMessage(event.message || 'An unexpected error occurred.');
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection detected:', event.reason);
      setHasError(true);
      setErrorMessage(String(event.reason) || 'An unhandled promise rejection occurred.');
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 text-stone-900 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-6 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h1 className="font-serif text-xl font-bold">Application Error</h1>
          <p className="text-xs text-stone-500">
            {errorMessage || 'A script error prevented the page from rendering.'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition"
          >
            Clear Stored State & Reload
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
