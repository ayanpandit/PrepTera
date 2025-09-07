import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home' },
    { name: 'Features' },
    { name: 'Dashboard' },
    { name: 'About' },
    { name: 'Contact' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className="fixed left-0 right-0 z-50 mt-2 bg-transparent transition-all duration-500">
        <div className="w-full p-2 flex justify-center relative">
          <div className="xl:w-fit w-screen">
            <div className="flex items-center justify-center h-14 sm:h-16 lg:h-18 bg-gray-800/40 backdrop-blur-xl rounded-full px-6 sm:px-8 lg:px-12 border border-gray-700/30 shadow-xl">
              
              {/* Mobile/Tablet Logo and Name - Left side */}
              <div className="flex lg:hidden items-center space-x-3 flex-1">
                <img 
                  src="/logo.png" 
                  alt="PrepTera Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-lg text-white">PrepTera</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {/* Logo before Home */}
                <div>
                  <img 
                    src="/logo.png" 
                    alt="PrepTera Logo" 
                    className="w-10 h-10 object-contain mr-4"
                  />
                </div>
                {navItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveItem(item.name)}
                    className={`scale-100 text-white hover:scale-125 hover:text-[#a400a4] transition-all duration-400 `}
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <span className="tracking-wide">{item.name}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button - Right side */}
              <button 
                onClick={toggleMenu}
                className="lg:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1 group focus:outline-none ml-auto"
              >
                <div className={`w-5 h-0.5 bg-white transition-all duration-300 origin-center rounded-full ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></div>
                <div className={`w-5 h-0.5 bg-white transition-all duration-300 rounded-full ${
                  isMenuOpen ? 'opacity-0 scale-0' : ''
                }`}></div>
                <div className={`w-5 h-0.5 bg-white transition-all duration-300 origin-center rounded-full ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></div>
              </button>
            </div>
          </div>
          
          {/* Account Icon - Outside navbar, extreme right */}
          <div className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2">
            <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-600/30 backdrop-blur-xl">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed top-0 right-0 h-full w-72 sm:w-80 bg-gray-900/98 backdrop-blur-2xl transform transition-transform duration-500 ease-out border-l border-gray-800/50 shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
            <div className="flex items-center space-x-4">
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          </div>

          {/* Mobile navigation items */}
          <div className="p-6 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-full text-left transition-all duration-400 ${
                  activeItem === item.name 
                    ? 'bg-blue-600/20 text-white border border-blue-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/40'
                }`}
              >
                <span className="font-semibold text-lg tracking-wide">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 sm:h-18 lg:h-20"></div>
    </>
  );
};

export default Navbar;