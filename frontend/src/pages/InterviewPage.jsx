import React, { useState, useEffect } from 'react';
import { ArrowRight, Brain, Clock, User, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const InterviewPage = ({ interviewConfig, onFinishInterview, onNavigateHome }) => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(10);
  
  // Web Speech API state
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const API_BASE_URL = 'http://localhost:3000';

  // Start the interview when component mounts
  useEffect(() => {
    if (interviewConfig && isStarting) {
      startInterview();
    } else if (!interviewConfig && isStarting) {
      // If no config, redirect to setup
      setError('No interview configuration found. Please configure your interview first.');
      setTimeout(() => {
        window.location.hash = '#setup';
      }, 3000);
    }
  }, [interviewConfig]);

  // Initialize Web Speech API
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    } else {
      console.warn('Speech Synthesis not supported in this browser');
      setSpeechEnabled(false);
    }
    
    // Cleanup: stop speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech synthesis functions
  const speakText = (text) => {
    if (!speechSynthesis || !speechEnabled || !text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Use a professional voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || voices.find(voice => voice.lang.includes('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const startInterview = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewConfig),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSessionId(data.sessionId);
        setCurrentQuestion(data.firstQuestion);
        setIsStarting(false);
        
        // Speak the first question after a short delay
        setTimeout(() => {
          speakText(`Question ${questionNumber}: ${data.firstQuestion}`);
        }, 500);
      } else {
        setError(data.error || 'Failed to start interview');
      }
    } catch (err) {
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide an answer before proceeding.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          answer: currentAnswer.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setCurrentAnswer('');
          setQuestionNumber(prev => prev + 1);
          
          // Speak the next question after a short delay
          setTimeout(() => {
            speakText(`Question ${questionNumber + 1}: ${data.nextQuestion}`);
          }, 500);
        } else {
          // Interview completed
          await getFeedback();
        }
      } else {
        setError(data.error || 'Failed to submit answer');
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedback = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback(data.feedback);
        setIsCompleted(true);
      } else {
        setError(data.error || 'Failed to get feedback');
      }
    } catch (err) {
      setError('Failed to get feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitAnswer();
    }
  };

  if (!interviewConfig && !isStarting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <Navbar currentPage="interview" onNavigateToHome={onNavigateHome} />
        
        <section className="px-4 py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-12 shadow-xl">
              <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                No Interview Configuration Found
              </h2>
              <p className="text-slate-700 mb-6">
                Please configure your interview settings first before starting the interview.
              </p>
              <button
                onClick={() => window.location.hash = '#setup'}
                className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-1 flex items-center justify-center mx-auto"
              >
                Go to Setup
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isStarting && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <Navbar currentPage="interview" onNavigateToHome={onNavigateHome} />
        
        <section className="px-4 py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-12 shadow-xl">
              <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Preparing Your Interview
              </h2>
              <p className="text-slate-700">
                Generating personalized questions based on your selection...
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <Navbar currentPage="interview" onNavigateToHome={onNavigateHome} />
        
        <section className="px-4 py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center p-2 bg-green-100 rounded-full text-sm font-medium text-green-800 mb-6">
                <CheckCircle className="w-6 h-6 mr-1" />
                Interview Completed
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mb-6">
                Well Done! <span className="text-orange-700">Here's Your Feedback</span>
              </h1>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 lg:p-12 shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Interview Feedback</h2>
              <div className="prose max-w-none">
                <div className="bg-slate-50 rounded-xl p-6 whitespace-pre-wrap text-slate-800 leading-relaxed">
                  {feedback}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onFinishInterview}
                className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-1 flex items-center justify-center mx-auto"
              >
                Start New Interview
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <Navbar currentPage="interview" onNavigateToHome={onNavigateHome} />
      
      <section className="px-4 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center p-2 bg-[#fabd9a] rounded-full text-sm font-medium text-slate-900 mb-6">
              <Brain className="w-6 h-6 mr-1 text-slate-800"/>
              Live Interview Session
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mb-6">
              Question <span className="text-orange-700">{questionNumber}</span> of {totalQuestions}
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Progress</span>
                <span className="text-sm font-medium text-slate-700">{Math.round((questionNumber / totalQuestions) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interview Configuration */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-slate-600">Role:</span>
                <span className="font-medium text-slate-900">{interviewConfig?.jobRole}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-orange-600" />
                <span className="text-slate-600">Domain:</span>
                <span className="font-medium text-slate-900">{interviewConfig?.domain}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span className="text-slate-600">Type:</span>
                <span className="font-medium text-slate-900">{interviewConfig?.interviewType}</span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 lg:p-12 shadow-xl mb-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Current Question:</h2>
                
                {/* Speech Controls */}
                {speechSynthesis && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => speakText(`Question ${questionNumber}: ${currentQuestion}`)}
                      disabled={isSpeaking}
                      className="group bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Read question aloud"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                      <span>{isSpeaking ? 'Speaking...' : 'Read Aloud'}</span>
                    </button>
                    
                    {isSpeaking && (
                      <button
                        onClick={stopSpeaking}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
                        title="Stop reading"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z"/>
                        </svg>
                        <span>Stop</span>
                      </button>
                    )}
                    
                    <button
                      onClick={toggleSpeech}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                        speechEnabled 
                          ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title={speechEnabled ? 'Disable auto-read' : 'Enable auto-read'}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        {speechEnabled ? (
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        ) : (
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        )}
                      </svg>
                      <span>{speechEnabled ? 'Auto-Read ON' : 'Auto-Read OFF'}</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-orange-500">
                <p className="text-lg text-slate-800 leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-slate-900">
                Your Answer:
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your answer here... (Ctrl + Enter to submit)"
                className="w-full bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl px-6 py-4 text-slate-900 font-medium hover:bg-white/90 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-[120px] resize-y"
                disabled={isLoading}
              />
              
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Tip: Take your time to provide a thoughtful answer
                </p>
                <button
                  onClick={submitAnswer}
                  disabled={isLoading || !currentAnswer.trim()}
                  className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-1 flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : questionNumber < totalQuestions ? (
                    <>
                      Next Question
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  ) : (
                    <>
                      Finish Interview
                      <CheckCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Interview Tips
            </h3>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>• Be specific and provide examples when possible</li>
              <li>• Structure your answers clearly (situation, action, result)</li>
              <li>• Take your time to think before answering</li>
              <li>• Use Ctrl + Enter to submit your answer quickly</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InterviewPage;
