import { useState, useEffect, useRef } from 'react';
import { Send, Home, LogOut, Brain, Trophy, TrendingUp, Star, CheckCircle, AlertCircle, Target, BarChart3, Award } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import appConfig from '../config';

const InterviewPage = ({ interviewConfig, onFinishInterview, onNavigateHome }) => {
  const config = interviewConfig;
  
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [waitingForStart, setWaitingForStart] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [microphonePermission, setMicrophonePermission] = useState('checking'); // 'checking', 'granted', 'denied'
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Random acknowledgment phrases
  const getAcknowledgmentPhrase = () => {
    const phrases = [
      "Hmm, interesting.",
      "I understand.",
      "That's a good point.",
      "Okay, got it.",
      "I see.",
      "Alright, thanks for that.",
      "Noted.",
      "That makes sense."
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const speakGreeting = () => {
    const greeting = `Hello ${config.candidateName}, you have chosen ${config.jobRole} as a ${config.domain}. You must know that this is your ${config.interviewType} interview. Are you ready? Shall we start?`;
    speakText(greeting);
    
    // Start listening for "yes" response
    setTimeout(() => {
      startListening();
    }, 1000);
  };

  const startListening = () => {
    console.log('startListening called - speechEnabled:', speechEnabled, 'isListening:', isListening, 'recognitionRef:', !!recognitionRef.current);
    
    if (recognitionRef.current && speechEnabled && !isListening) {
      console.log('Starting speech recognition...');
      setIsListening(true);
      try {
        recognitionRef.current.start();
        console.log('Speech recognition started successfully');
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
        
        // Check if it's a permission error
        if (error.name === 'NotAllowedError') {
          alert('Microphone access is required. Please allow microphone access and try again.');
        }
      }
    } else {
      console.log('Cannot start listening:', {
        hasRecognitionRef: !!recognitionRef.current,
        speechEnabled,
        currentlyListening: isListening
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Stopping speech recognition...');
      setIsListening(false);
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  };

  // Initialize speech synthesis and recognition
  useEffect(() => {
    // Check if Web Speech API is supported
    if (!('speechSynthesis' in window) || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Speech API not supported');
      setSpeechEnabled(false);
      return;
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    // Start with the greeting if config is available
    if (config?.candidateName) {
      speakGreeting();
    }

  }, [config]);

  // Separate useEffect for speech recognition handlers to avoid stale closures
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event) => {
      let newFinalText = '';
      let currentInterimText = '';

      // Process only new results from this event
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinalText += transcript + ' ';
        } else {
          currentInterimText += transcript;
        }
      }

      console.log('Speech recognition result:', { newFinalText, currentInterimText, waitingForStart, interviewStarted });

      if (waitingForStart && (newFinalText + currentInterimText).toLowerCase().includes('yes')) {
        console.log('Yes detected, starting interview...');
        setWaitingForStart(false);
        setInterviewStarted(true);
        stopListening();
        setTimeout(() => {
          startInterview();
        }, 500);
      } else if (interviewStarted && !waitingForStart) {
        // Accumulate final text in ref
        if (newFinalText) {
          finalTranscriptRef.current += newFinalText;
          setFinalTranscript(finalTranscriptRef.current);
        }
        
        // Update interim text
        setInterimTranscript(currentInterimText);
        
        // Update the combined answer in real-time
        const fullAnswer = (finalTranscriptRef.current + currentInterimText).trim();
        setCurrentAnswer(fullAnswer);
        console.log('Real-time answer update:', fullAnswer);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setSpeechEnabled(false);
        alert('Microphone access is required for voice input. Please allow microphone access and refresh the page.');
      }
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended, listening state:', isListening);
      if (isListening && speechEnabled) {
        // Restart recognition if we're supposed to be listening
        setTimeout(() => {
          if (isListening && speechEnabled) {
            try {
              recognitionRef.current.start();
              console.log('Restarted speech recognition');
            } catch (error) {
              console.error('Error restarting recognition:', error);
              setIsListening(false);
            }
          }
        }, 100);
      }
    };

  }, [waitingForStart, interviewStarted, isListening, speechEnabled]);

  const speakText = (text) => {
    if (!synthRef.current || !speechEnabled || !text) {
      console.log('Speech not available');
      return;
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    synthRef.current.speak(utterance);
  };

  const clearTranscripts = () => {
    finalTranscriptRef.current = '';
    setFinalTranscript('');
    setInterimTranscript('');
    setCurrentAnswer('');
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      console.log('Microphone permission granted');
      setMicrophonePermission('granted');
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setMicrophonePermission('denied');
      setSpeechEnabled(false);
      alert('Microphone access is required for voice input. Please allow microphone access and refresh the page.');
      return false;
    }
  };

  const getRandomAcknowledgment = () => {
    const acknowledgments = [
      "Hmm, interesting.",
      "I understand.",
      "Good point.",
      "That's helpful.",
      "I see.",
      "Noted.",
      "Thanks for sharing.",
      "Understood."
    ];
    return acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
  };

  const generateReport = async () => {
    if (!sessionId) return;
    
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`${appConfig.API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
        }),
      });

      const data = await response.json();
      console.log('Report data:', data);
      
      if (data.feedback) {
        setReportData(data);
        setShowReport(true);
        speakText("Your interview report has been generated. You can review your performance and feedback.");
      } else {
        console.error('No feedback received from server');
        speakText("Sorry, there was an issue generating your report. Please try again.");
      }
    } catch (error) {
      console.error('Error generating report:', error);
      speakText("Sorry, there was an issue generating your report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const startInterview = async () => {
    console.log('Starting interview with config:', config);
    setIsLoading(true);
    
    // Request microphone permission before starting
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${appConfig.API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobRole: config.jobRole,
          domain: config.domain,
          interviewType: config.interviewType,
          candidateName: config.candidateName
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.firstQuestion) {
        setSessionId(data.sessionId);
        setCurrentQuestion(data.firstQuestion);
        setCurrentQuestionNumber(1);
        setTotalQuestions(data.totalQuestions || 10);
        clearTranscripts(); // Use the helper function
        speakText(data.firstQuestion);
        // Resume listening for answers after question is asked
        setTimeout(() => {
          console.log('About to start listening after first question...');
          startListening();
        }, 3000); // Give more time for the question to be spoken
      } else {
        console.error('No question received from server');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim() || !sessionId) return;

    try {
      // First, give acknowledgment for the current answer
      const acknowledgment = getRandomAcknowledgment();
      speakText(acknowledgment);
      
      // Wait for acknowledgment to finish, then send to server
      setTimeout(async () => {
        const response = await fetch(`${appConfig.API_BASE_URL}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId,
            answer: currentAnswer,
          }),
        });

        const data = await response.json();
        console.log('Submit answer response:', data);
        
        if (data.nextQuestion) {
          const nextQuestionNumber = currentQuestionNumber + 1;
          setCurrentQuestionNumber(nextQuestionNumber);
          setCurrentQuestion(data.nextQuestion);
          clearTranscripts(); // Use the helper function
          
          // Check if this is the last question
          if (nextQuestionNumber === totalQuestions) {
            speakText("Now the last question. " + data.nextQuestion);
          } else if (nextQuestionNumber === totalQuestions - 1) {
            speakText("Now you can quit before the last question. " + data.nextQuestion);
          } else {
            speakText(data.nextQuestion);
          }
          
          // Resume listening after speaking the question
          setTimeout(() => {
            startListening();
          }, 3000);
        } else if (data.isComplete) {
          // Interview is complete
          speakText("Okay, your interview is over now. Stay for the report or you can quit.");
          stopListening();
          setInterviewStarted(false);
          // Generate the report automatically
          setTimeout(() => {
            generateReport();
          }, 3000); // Wait for the speech to finish
        }
      }, 1500); // Wait for acknowledgment to finish
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleManualStart = () => {
    setWaitingForStart(false);
    setInterviewStarted(true);
    startInterview();
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <Navbar currentPage="interview" onNavigateToHome={onNavigateHome} onNavigateToSetup={() => window.location.hash = '#setup'} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">No Configuration Found</h1>
            <p className="text-slate-700 mb-6">Please go back to setup and configure your interview.</p>
            <button
              onClick={onNavigateHome}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Go to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <Navbar currentPage="interview" onNavigateToHome={onNavigateHome} onNavigateToSetup={() => window.location.hash = '#setup'} />
      
      {/* Main Content */}
      <section className="px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Loading Report */}
          {isGeneratingReport && (
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-xl mb-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Generating Your Report</h3>
              <p className="text-slate-700">Please wait while we analyze your performance...</p>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center p-2 bg-[#fabd9a] rounded-full text-sm font-medium text-slate-900 mb-4">
              <Brain className="w-6 h-6 mr-1 text-slate-800"/>
              AI Interview Session
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Interview in Progress
            </h1>
            <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-xl p-4 inline-block">
              <div className="text-sm text-slate-700 grid grid-cols-2 gap-4">
                <div><strong>Candidate:</strong> {config.candidateName}</div>
                <div><strong>Position:</strong> {config.jobRole}</div>
                <div><strong>Domain:</strong> {config.domain}</div>
                <div><strong>Type:</strong> {config.interviewType}</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={onFinishInterview}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors inline-flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Finish Interview
              </button>
            </div>
          </div>

          {/* Main Interview Area */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-xl mb-8">
            {waitingForStart ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Ready to Start?</h2>
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
                    <p className="text-slate-700">Starting your interview...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-700 mb-6">
                      {speechEnabled 
                        ? "I've spoken the greeting. Say 'yes' to begin or click the button below."
                        : "Speech is not available. Click the button to start your interview."
                      }
                    </p>
                    <button
                      onClick={handleManualStart}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                    >
                      Start Interview
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Current Question */}
                {currentQuestion && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">Question {currentQuestionNumber} of {totalQuestions}:</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isListening ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {isListening ? '🎤 Listening...' : '🎤 Voice Ready'}
                      </div>
                    </div>
                    <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-xl p-6">
                      <p className="text-slate-800 text-lg leading-relaxed">{currentQuestion}</p>
                    </div>
                  </div>
                )}

                {/* Answer Display/Input */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Answer:</h3>
                  <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 min-h-[120px]">
                    {currentAnswer ? (
                      <div className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                        <span className="text-slate-800">{finalTranscript}</span>
                        <span className="text-slate-500 italic">{interimTranscript}</span>
                        {isListening && <span className="inline-block w-1 h-5 bg-orange-500 ml-1 animate-pulse"></span>}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">
                        {speechEnabled 
                          ? 'Speak your answer... Voice is automatically listening.'
                          : 'Type your answer below...'
                        }
                      </p>
                    )}
                  </div>
                  
                  {/* Manual text input fallback */}
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="You can also type your answer here..."
                    className="w-full mt-4 p-4 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors inline-flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Answer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Report Display - Moved to Bottom */}
      {showReport && reportData && (
        <section className="px-4 py-12 lg:py-16 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Report Header */}
              <div className="text-center">
                <div className="inline-flex items-center p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white mb-6 shadow-lg">
                  <Trophy className="w-7 h-7 mr-2"/>
                  <span className="text-lg font-semibold">Interview Performance Report</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Congratulations, {config.candidateName}!
                </h2>
                <p className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
                  Your {config.interviewType.toLowerCase()} interview for {config.jobRole} position has been completed. 
                  Here's your detailed performance analysis.
                </p>
              </div>

              {/* Overall Score Card */}
              {reportData.overallScore && (
                <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="text-center">
                      <div className="inline-flex items-center mb-4">
                        <Award className="w-8 h-8 mr-3"/>
                        <h3 className="text-2xl font-bold">Overall Performance Score</h3>
                      </div>
                      <div className="text-7xl font-bold mb-2">{reportData.overallScore}</div>
                      <div className="text-2xl font-medium opacity-90">/10</div>
                      <div className="mt-4 text-lg opacity-90">
                        {reportData.overallScore >= 8 ? "Outstanding Performance! 🌟" :
                         reportData.overallScore >= 6 ? "Good Performance! 👍" :
                         reportData.overallScore >= 4 ? "Fair Performance 📈" :
                         "Room for Improvement 💪"}
                      </div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(reportData.overallScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Communication Skills */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <Target className="w-6 h-6 text-blue-600"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Communication</h3>
                      <p className="text-sm text-slate-600">Clarity & Expression</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Clarity</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}/>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Confidence</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}/>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Knowledge */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <Brain className="w-6 h-6 text-green-600"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Technical Skills</h3>
                      <p className="text-sm text-slate-600">Domain Knowledge</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Accuracy</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 3 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}/>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Depth</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}/>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Solving */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <TrendingUp className="w-6 h-6 text-purple-600"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Problem Solving</h3>
                      <p className="text-sm text-slate-600">Analytical Thinking</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Approach</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}/>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Innovation</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= 3 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}/>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Feedback Section */}
              {reportData.feedback && (
                <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="bg-orange-100 p-3 rounded-lg mr-4">
                      <BarChart3 className="w-6 h-6 text-orange-600"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Detailed Analysis</h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-6 border-l-4 border-orange-500">
                      {reportData.feedback}
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths and Improvements Grid */}
              {(reportData.strengths || reportData.improvements) && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Strengths */}
                  {reportData.strengths && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="bg-green-500 p-3 rounded-lg mr-4">
                          <CheckCircle className="w-6 h-6 text-white"/>
                        </div>
                        <h3 className="text-2xl font-bold text-green-800">Key Strengths</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="text-green-700 text-lg leading-relaxed">
                          {reportData.strengths}
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <Trophy className="w-5 h-5 mr-2"/>
                          <span>Keep leveraging these strengths!</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Areas for Improvement */}
                  {reportData.improvements && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="bg-blue-500 p-3 rounded-lg mr-4">
                          <AlertCircle className="w-6 h-6 text-white"/>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-800">Growth Opportunities</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="text-blue-700 text-lg leading-relaxed">
                          {reportData.improvements}
                        </div>
                        <div className="flex items-center text-blue-600 font-medium">
                          <TrendingUp className="w-5 h-5 mr-2"/>
                          <span>Focus areas for your next interview</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Summary Stats */}
              <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Interview Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{totalQuestions}</div>
                    <div className="text-slate-600 font-medium">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{config.interviewType}</div>
                    <div className="text-slate-600 font-medium">Interview Type</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{config.domain.split(' ')[0]}</div>
                    <div className="text-slate-600 font-medium">Domain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">AI</div>
                    <div className="text-slate-600 font-medium">Powered</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <button
                  onClick={() => setShowReport(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2"/>
                  Back to Interview
                </button>
                <button
                  onClick={() => window.location.hash = '#setup'}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  <Target className="w-5 h-5 mr-2"/>
                  Start New Interview
                </button>
                <button
                  onClick={onFinishInterview}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5 mr-2"/>
                  Finish & Exit
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InterviewPage;