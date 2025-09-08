import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight, Users, Brain, Code, Zap } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Setup = ({ onStartInterview, onNavigateHome }) => {
  // State for user input fields
  const [candidateName, setCandidateName] = useState(''); // Added: State for candidate name
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedInterviewType, setSelectedInterviewType] = useState('');
  const [isJobRoleOpen, setIsJobRoleOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  
  const jobRoleRef = useRef(null);
  const domainRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobRoleRef.current && !jobRoleRef.current.contains(event.target)) {
        setIsJobRoleOpen(false);
      }
      if (domainRef.current && !domainRef.current.contains(event.target)) {
        setIsDomainOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const jobRoles = [
    'Software Engineer',
    'Data Scientist / Analyst',
    'QA / Test Engineer',
    'AI / ML Engineer',
    'UI/UX Designer'
  ];

  const domainOptions = {
    'Software Engineer': [
      'Frontend Development (React, Angular, Vue)',
      'Backend Development (Java, Node.js, Python, .NET, Go)',
      'Fullstack Development',
      'Mobile Development (Android, iOS, Flutter, React Native)',
      'DevOps / Cloud Engineering'
    ],
    'Data Scientist / Analyst': [
      'Data Analysis (SQL, Excel, BI Tools)',
      'Machine Learning (NLP, CV, Predictive Modeling)',
      'Data Engineering (ETL, Spark, Hadoop, BigQuery)',
      'Business Intelligence (Power BI, Tableau)',
      'AI Research'
    ],
    'QA / Test Engineer': [
      'Manual Testing',
      'Automation Testing (Selenium, Cypress, Playwright)',
      'Performance Testing (JMeter, LoadRunner)',
      'Security Testing',
      'Mobile App Testing'
    ],
    'AI / ML Engineer': [
      'Natural Language Processing (NLP)',
      'Computer Vision (CV)',
      'Reinforcement Learning',
      'MLOps (Model Deployment & Monitoring)',
      'Generative AI / LLMs'
    ],
    'UI/UX Designer': [
      'UI Design',
      'UX Research',
      'Interaction Design',
      'Prototyping (Figma, Sketch, XD)',
      'Design Systems'
    ]
  };

  const handleJobRoleSelect = (role) => {
    setSelectedJobRole(role);
    setSelectedDomain(''); // Reset domain when job role changes
    setIsJobRoleOpen(false);
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setIsDomainOpen(false);
  };

  const handleStartInterview = () => {
    if (isFormValid) {
      const interviewConfig = {
        candidateName: candidateName.trim(), // Updated: Include candidate name
        jobRole: selectedJobRole,
        domain: selectedDomain,
        interviewType: selectedInterviewType
      };
      onStartInterview(interviewConfig);
    }
  };

  // Updated: Include name validation
  const isFormValid = candidateName.trim() && selectedJobRole && selectedDomain && selectedInterviewType;

  return (
    <div className="min-h-screen">
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/logo.png')" }}
      ></div>

      <Navbar currentPage="setup" onNavigateToHome={onNavigateHome} onNavigateToSetup={() => {}} />
      
      {/* Hero Section */}
      <section className="px-4 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center p-2 bg-[#fabd9a] rounded-full text-sm font-medium text-slate-900 mb-6">
              <Brain className="w-6 h-6 mr-1 text-slate-800"/>
              Personalized Interview Setup
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-slate-900 mb-6">
              Customize Your <span className="text-orange-700">Interview</span> Experience
            </h1>
            
            <p className="text-slate-800 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Select your target role and domain to get tailored questions that match real-world interview scenarios.
            </p>
          </div>

          {/* Setup Form */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-8 lg:p-12 shadow-xl">
            <div className="space-y-8">
              
              {/* Name Input Field - Added: Personal greeting functionality */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-slate-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl px-6 py-4 text-slate-900 font-medium placeholder-slate-500 hover:bg-white/90 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                />
              </div>
              
              {/* Job Role Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-slate-900 mb-2">
                  Select Job Role
                </label>
                <div ref={jobRoleRef}>
                  <button
                    onClick={() => {
                      setIsJobRoleOpen(!isJobRoleOpen);
                      setIsDomainOpen(false); // Close other dropdown
                    }}
                    className="w-full bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl px-6 py-4 text-left text-slate-900 font-medium hover:bg-white/90 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className={selectedJobRole ? "text-slate-900" : "text-slate-500"}>
                        {selectedJobRole || "Choose your target role..."}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isJobRoleOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  {isJobRoleOpen && (
                    <div className="w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-300 rounded-xl shadow-inner max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                      {jobRoles.map((role, index) => (
                        <button
                          key={index}
                          onClick={() => handleJobRoleSelect(role)}
                          className="w-full px-6 py-4 text-left text-slate-900 hover:bg-orange-50 hover:text-orange-800 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-slate-200 last:border-b-0"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Domain Selection */}
              {selectedJobRole && (
                <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-lg font-semibold text-slate-900 mb-2">
                    Select Domain
                  </label>
                  <div ref={domainRef}>
                    <button
                      onClick={() => {
                        setIsDomainOpen(!isDomainOpen);
                        setIsJobRoleOpen(false); // Close other dropdown
                      }}
                      className="w-full bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl px-6 py-4 text-left text-slate-900 font-medium hover:bg-white/90 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className={selectedDomain ? "text-slate-900" : "text-slate-500"}>
                          {selectedDomain || "Choose your specialization..."}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isDomainOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    {isDomainOpen && (
                      <div className="w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-300 rounded-xl shadow-inner max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                        {domainOptions[selectedJobRole]?.map((domain, index) => (
                          <button
                            key={index}
                            onClick={() => handleDomainSelect(domain)}
                            className="w-full px-6 py-4 text-left text-slate-900 hover:bg-orange-50 hover:text-orange-800 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-slate-200 last:border-b-0"
                          >
                            {domain}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Interview Type Selection */}
              {selectedDomain && (
                <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-lg font-semibold text-slate-900 mb-4">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedInterviewType('Technical')}
                      className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 ${
                        selectedInterviewType === 'Technical'
                          ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg'
                          : 'border-slate-300 bg-white/80 hover:bg-white/90 hover:border-slate-400 hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-colors duration-300 ${
                          selectedInterviewType === 'Technical'
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}>
                          <Code className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg text-slate-900">Technical</h3>
                          <p className="text-sm text-slate-600">Coding challenges & problem solving</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedInterviewType('Behavioral')}
                      className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 ${
                        selectedInterviewType === 'Behavioral'
                          ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg'
                          : 'border-slate-300 bg-white/80 hover:bg-white/90 hover:border-slate-400 hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-colors duration-300 ${
                          selectedInterviewType === 'Behavioral'
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}>
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg text-slate-900">Behavioral</h3>
                          <p className="text-sm text-slate-600">Soft skills & experience questions</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Start Interview Button */}
              {isFormValid && (
                <div className="pt-8 animate-in slide-in-from-bottom-4 duration-300">
                  <button
                    onClick={handleStartInterview}
                    className="group w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-1 flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Interview
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              )}

              {/* Summary */}
              {isFormValid && (
                <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-semibold text-lg text-slate-900 mb-3">Interview Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Candidate:</span>
                      <span className="text-slate-900 font-medium">{candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Job Role:</span>
                      <span className="text-slate-900 font-medium">{selectedJobRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Domain:</span>
                      <span className="text-slate-900 font-medium">{selectedDomain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="text-slate-900 font-medium">{selectedInterviewType}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-24 lg:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center hover:bg-white/50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Role-Specific</h3>
              <p className="text-sm text-slate-700">Questions tailored to your target position</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center hover:bg-white/50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-700">Real-time feedback and analysis</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center hover:bg-white/50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Instant Start</h3>
              <p className="text-sm text-slate-700">Begin practicing immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Setup;
