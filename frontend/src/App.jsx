import React, { useState, useEffect } from 'react';
import Home from './components/home';
import Setup from './pages/Setup';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [interviewConfig, setInterviewConfig] = useState(null);

  // Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'setup') {
        setCurrentPage('setup');
      } else {
        setCurrentPage('home');
      }
    };

    // Set initial page based on current hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateToSetup = () => {
    window.location.hash = '#setup';
  };

  const navigateToHome = () => {
    window.location.hash = '#home';
  };

  const handleStartInterview = (config) => {
    setInterviewConfig(config);
    // Here you can navigate to the interview page in the future
    console.log('Starting interview with config:', config);
    // For now, just alert the user
    alert(`Interview configured:\nRole: ${config.jobRole}\nDomain: ${config.domain}\nType: ${config.interviewType}\n\nThis will navigate to the interview page in the future.`);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'setup':
        return <Setup onStartInterview={handleStartInterview} onNavigateHome={navigateToHome} />;
      case 'home':
      default:
        return <Home onNavigateToSetup={navigateToSetup} onNavigateHome={navigateToHome} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
}

export default App
