import React, { useState, useEffect } from 'react';
import Home from './components/home';
import Setup from './pages/Setup';
import InterviewPage from './pages/InterviewPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [interviewConfig, setInterviewConfig] = useState(null);

  // Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'setup') {
        setCurrentPage('setup');
      } else if (hash === 'interview') {
        setCurrentPage('interview');
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

  const navigateToInterview = () => {
    window.location.hash = '#interview';
  };

  const handleStartInterview = (config) => {
    setInterviewConfig(config);
    navigateToInterview();
  };

  const handleFinishInterview = () => {
    setInterviewConfig(null);
    navigateToSetup();
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'setup':
        return <Setup onStartInterview={handleStartInterview} onNavigateHome={navigateToHome} />;
      case 'interview':
        return <InterviewPage 
          interviewConfig={interviewConfig} 
          onFinishInterview={handleFinishInterview} 
          onNavigateHome={navigateToHome} 
        />;
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
