import React, { useState, useEffect } from 'react';

/**
 * Higher Order Component that adds loading functionality to any component
 * @param {React.Component} WrappedComponent - Component to wrap with loader
 * @param {number} loadingDelay - Delay in milliseconds (default: 2000ms)
 * @returns {React.Component} Enhanced component with loading state
 */
const withLoader = (WrappedComponent, loadingDelay = 2000) => {
  const WithLoaderComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, loadingDelay);

      // Cleanup timer on component unmount
      return () => clearTimeout(timer);
    }, []);

    // Loading spinner component
    const LoadingSpinner = () => (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
        <div className="text-center">
          {/* Animated spinner */}
          <div className="relative">
            
            
          </div>
          
          {/* Loading text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Loading Task Manager</h2>
            <p className="text-gray-600">Preparing your tasks...</p>
            
            {/* Progress dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );

    // Show loading spinner or wrapped component
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for better debugging
  WithLoaderComponent.displayName = `withLoader(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithLoaderComponent;
};

export default withLoader;
