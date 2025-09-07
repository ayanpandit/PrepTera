import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, CheckCircle, Star, ArrowRight, Users, TrendingUp, Award } from 'lucide-react';
import Navbar from './navbar';
import Cards from './cards';

import img1 from "/feature-1.webp"
import img2 from "/feature-2.jpg"
import img3 from "/feature-3.jpg"
import img4 from "/feature-4.jpg"

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const shift = window.outerWidth > 782 ? 100 : 115;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "This AI interview prep tool is a game-changer! The role-specific questions and real-time feedback helped me identify areas for improvement. I felt much more confident going into my actual interview.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b667b16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Meta",
      content: "I was skeptical at first, but this AI tool exceeded my expectations. The technical questions were challenging and the final report provided valuable insights into my performance.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Microsoft",
      content: "As a recent graduate, I found this AI interview assistant incredibly helpful. The behavioral questions were spot-on and the instant feedback made the practice process engaging and effective.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-4 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            <div className="space-y-10 lg:space-y-20">
              <div className="inline-flex items-center p-2 bg-[#fabd9a] rounded-full text-sm font-medium text-slate-900">
                <Award className="w-6 h-6 mr-1 text-slate-800"/>
                Trusted by professionals
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-slate-900">
                  Transform Your Interview <span className="text-orange-700">Strategy</span>
                </h1>
                
                <p className="text-slate-800 text-lg lg:text-xl leading-relaxed max-w-xl font-medium">
                  Practice with AI-powered simulations, get instant feedback, and boost your confidence for technical and behavioral interviews.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className='flex flex-col space-y-2 lg:flex-row lg:space-x-2'>
                  <button className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-1 flex items-center justify-center">
                  Start Free Practice
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  <button className="group border-2 border-slate-800 hover:border-slate-900 hover:bg-white/20 text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center backdrop-blur">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-800/30">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">10K+</div>
                    <div className="text-sm text-slate-800 font-medium">Interviews Practiced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">95%</div>
                    <div className="text-sm text-slate-800 font-medium">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-2xl lg:text-3xl font-bold text-slate-900">4.9</span>
                      <Star className="w-5 h-5 text-yellow-500 fill-current ml-1" />
                    </div>
                    <div className="text-sm text-slate-800 font-medium">User Rating</div>
                  </div>
                </div>
              </div>
              
            </div>

            <div>
              <div className=''>
                <img src="/home-background.png" alt="Logo" className=' object-cover [mask-image:radial-gradient(circle,white,transparent)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover]' />
              </div>
            </div>            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-transparent">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-y-4 justify-between mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-[3.8rem] font-semibold text-black">
              Features
            </h2>
            <p className="text-orange-600 text-xl lg:text-xl lg:w-1/2 text-left leading-tight">
              Everything you need to excel in your next interview, powered by advanced AI technology
            </p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-4 lg:gap-y-14">

            <Cards image={img4} title={""} heading={"Detailed Analytics"} description={"Comprehensive reports with performance metrics, strengths, and areas for improvement with personalized recommendations"}/>
            <Cards image={img2} title={""} heading={"Technical & Behavioral"} description={"Practice both technical coding challenges and behavioral questions to ace every aspect of your interview with comprehensive coverage"}/>
            <Cards image={img3} title={""} heading={"Real-Time Feedback"} description={"Get instant, actionable feedback on your responses to improve your performance on the spot with AI-powered analysis"}/>
            <Cards image={img1} title={""} heading={"Role-Specific Questions"} description={"Tailored questions for your specific role and industry, from software engineering to product management with real-world scenarios"} />

            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-transparent">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row gap-y-4 justify-between mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-[3.8rem] font-semibold text-black">
              How we <span className='text-orange-800'>Work</span>
            </h2>
            <p className="text-orange-600 text-xl lg:text-xl lg:w-1/2 text-left leading-tight">
              Experience a seamless interview preparation journey designed for your success
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "Select Your Path",
                  description: "Choose your target role and interview type. Customize the experience with difficulty levels, industry focus, and specific skills you want to practice.",
                  icon: "🎯",
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  title: "Practice & Learn",
                  description: "Engage with our intelligent AI interviewer that adapts to your responses. Experience realistic scenarios with dynamic questioning and immediate guidance.",
                  icon: "🤖",
                  gradient: "from-purple-500 to-violet-600"
                },
                {
                  title: "Analyze & Excel",
                  description: "Receive comprehensive insights with detailed performance analysis, personalized improvement suggestions, and targeted learning recommendations.",
                  icon: "📊",
                  gradient: "from-emerald-500 to-teal-600"
                }
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="text-center bg-gradient-to-br from-[#93662f]/5 to-[#93662f]/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:from-[#93662f]/10 hover:to-[#93662f]/15 hover:border-white/20 transition-all duration-500 h-full flex flex-col hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl lg:text-3xl text-orange-600 mb-6 group-hover:text-orange-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-[#3f1801] text-lg">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-24 bg-transparent">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row gap-y-4 justify-between mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-[3.8rem] font-semibold text-black">
              Success <span className='text-orange-800'>Stories</span>
            </h2>
            <p className="text-[#361300] text-xl lg:text-xl lg:w-1/2 text-left leading-tight">
              Join thousands of professionals who have transformed their interview skills and landed their dream jobs
            </p>
          </div>
          
          <div className="max-w-8xl mx-auto">
            {/* Enhanced Testimonial Carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400/10 to-orange-400/25 backdrop-blur-sm border border-white/20 p-8 lg:p-12 shadow-2xl">
                <div className="transition-all duration-700 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * shift}%)` }}>
                  <div className="flex gap-10 lg:gap-0">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="w-full flex-shrink-0">
                        <div className="max-w-4xl mx-auto text-center">
                          {/* Stars Rating */}
                          <div className="flex justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-6 h-6 text-red-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          
                          {/* Quote */}
                          <blockquote className="text-xl lg:text-2xl text-[#3f2501] leading-relaxed mb-8 italic font-medium">
                            "{testimonial.content}"
                          </blockquote>
                          
                          {/* Profile */}
                          <div className="flex items-center justify-center space-x-4">
                            <div className="relative">
                              <img 
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover shadow-xl border-4 border-white/40"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-xl lg:text-2xl text-white">{testimonial.name}</div>
                              <div className="text-red-300 font-medium text-lg">{testimonial.role}</div>
                              <div className="text-blue-400 font-semibold">{testimonial.company}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Enhanced Dots Navigation */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentTestimonial === index 
                        ? 'w-12 h-3 bg-white shadow-lg' 
                        : 'w-3 h-3 bg-white/50 hover:bg-white/70 hover:scale-125'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {[
                { number: "10,000+", label: "Interviews Conducted", icon: "💼" },
                { number: "95%", label: "Success Rate", icon: "🎯" },
                { number: "500+", label: "Companies Hired", icon: "🏢" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                    <div className="text-3xl lg:text-4xl font-bold text-orange-400 mb-2">{stat.number}</div>
                    <div className="text-[#683100] font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-transparent">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-[#241700]">
            Ready to Ace Your <span className='text-[#782a00]'>Interview?</span>
          </h2>
          <p className="text-[#251901] text-lg lg:text-xl mb-10 leading-relaxed">
            Join thousands of professionals who have improved their interview skills and landed their dream jobs.
          </p>
          <button className="group bg-white hover:bg-gray-100 text-slate-900 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center mx-auto">
            Start Practice Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

      </section>

      {/* Footer */}
      <footer id="contact" className="bg-transparent border-t border-white/20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/logo.png" 
                  alt="PrepTera Logo" 
                  className="w-12 h-12 object-contain"
                />
                <span className="font-bold text-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-tight">PrepTera</span>
              </div>
              <p className="text-[#733501] mb-6 leading-relaxed max-w-md">
                Empowering professionals worldwide to ace their interviews with AI-powered practice and feedback.
              </p>
            </div>

            <div className='flex justify-between'>
                          <div>
              <h3 className="font-semibold text-black mb-4 text-lg">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors duration-300">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-4 text-lg">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors duration-300">About</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="ttext-gray-800 hover:text-gray-600 transition-colors duration-300">Privacy</a></li>
              </ul>
            </div>
          </div>
            </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/20">
            <p className="text-black text-sm">
              © 2024 PrepTera. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-black hover:text-gray-600 transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-black hover:text-gray-600 transition-colors duration-300">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;