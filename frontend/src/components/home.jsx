import React from 'react';
import Navbar from './navbar';

const home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                Ace Your Next
                <br />
                <span className="text-blue-400">Interview</span>
              </h1>
              
              <p className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-xl">
                Practice with AI-powered simulations, get instant feedback, and boost your confidence for technical and behavioral interviews.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-white">
                Start Free Practice
              </button>
              <button className="border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-white hover:bg-gray-900">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Interviews Practiced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src="/src/assets/hero-interview.jpg" 
                alt="AI Interview Simulation Dashboard" 
                className="w-full h-80 sm:h-96 lg:h-[500px] object-cover rounded-lg shadow-2xl border border-gray-800"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to excel in your next interview, powered by advanced AI technology
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <img 
                src="/src/assets/role-icon.png" 
                alt="Role-specific questions" 
                className="w-8 h-8"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-white text-2xl font-bold">Q</span>
            </div>
            <h3 className="font-bold text-xl mb-3 text-white">Role-Specific Questions</h3>
            <p className="text-gray-400 leading-relaxed">Tailored questions for your specific role and industry, from software engineering to product management.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <img 
                src="/src/assets/modes-icon.png" 
                alt="Technical and behavioral modes" 
                className="w-8 h-8"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <h3 className="font-bold text-xl mb-3 text-white">Technical & Behavioral</h3>
            <p className="text-gray-400 leading-relaxed">Practice both technical coding challenges and behavioral questions to ace every aspect of your interview.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <img 
                src="/src/assets/feedback-icon.png" 
                alt="Real-time feedback" 
                className="w-8 h-8"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-white text-2xl font-bold">F</span>
            </div>
            <h3 className="font-bold text-xl mb-3 text-white">Real-Time Feedback</h3>
            <p className="text-gray-400 leading-relaxed">Get instant, actionable feedback on your responses to improve your performance on the spot.</p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <img 
                src="/src/assets/report-icon.png" 
                alt="Detailed analytics report" 
                className="w-8 h-8"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-white text-2xl font-bold">R</span>
            </div>
            <h3 className="font-bold text-xl mb-3 text-white">Detailed Analytics</h3>
            <p className="text-gray-400 leading-relaxed">Comprehensive reports with performance metrics, strengths, and areas for improvement.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto bg-gray-900/50">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-center text-white">How It Works</h2>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-white mb-2">Select your role & mode</h3>
              <p className="text-gray-400">Choose your target role and interview type - technical, behavioral, or mixed mode.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-white mb-2">Answer AI's questions</h3>
              <p className="text-gray-400">Engage with our AI interviewer and answer questions just like in a real interview.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-white mb-2">Get feedback & final report</h3>
              <p className="text-gray-400">Receive detailed analysis of your performance with actionable improvement suggestions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-center text-white">What Our Users Say</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <img 
                src="/src/assets/user1.jpg" 
                alt="User testimonial" 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                }}
              />
              <div>
                <div className="font-semibold text-white">Sarah Chen</div>
                <div className="text-sm text-gray-400">Software Engineer</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              "This AI interview prep tool is a game-changer! The role-specific questions and real-time feedback helped me identify areas for improvement. I felt much more confident going into my actual interview."
            </p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <img 
                src="/src/assets/user2.jpg" 
                alt="User testimonial" 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                }}
              />
              <div>
                <div className="font-semibold text-white">Marcus Johnson</div>
                <div className="text-sm text-gray-400">Product Manager</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              "I was skeptical at first, but this AI tool exceeded my expectations. The technical questions were challenging and the final report provided valuable insights into my performance. Highly recommend!"
            </p>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <img 
                src="/src/assets/user3.jpg" 
                alt="User testimonial" 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b667b16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                }}
              />
              <div>
                <div className="font-semibold text-white">Emily Rodriguez</div>
                <div className="text-sm text-gray-400">Data Scientist</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              "As a recent graduate, I found this AI interview assistant incredibly helpful. The behavioral questions were spot-on and the instant feedback made the practice process engaging and effective."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto text-center bg-gray-900/50">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
          Ready to Ace Your Interview?
        </h2>
        <p className="text-gray-400 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have improved their interview skills and landed their dream jobs.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-white">
          Start Practice Now
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IP</span>
              </div>
              <span className="font-bold text-xl text-white">InterviewPrep AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering professionals worldwide to ace their interviews with AI-powered practice and feedback.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © 2024 InterviewPrep AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default home;