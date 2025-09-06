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
  { name: 'Best Practices' },
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

  <nav className="fixed left-0 right-0 z-50 mt-4 bg-transparent transition-all duration-500">
  <div className="w-full px-10 sm:px-16 lg:px-32 flex justify-center">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            
            {/* ...existing code... */}

            {/* Desktop Navigation - Professional & Rounded */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className="flex items-center bg-gray-800/40 backdrop-blur-xl rounded-full p-3 border border-gray-700/30 shadow-xl">
                {navItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveItem(item.name)}
                    className={`px-2 py-1 mx-1 rounded-full text-sm transition-all duration-400 group ${
                      activeItem === item.name 
                        ? 'text-white bg-blue-600 shadow-lg transform scale-105' 
                        : 'text-gray-300 hover:scale-105'
                    }`}
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <span className="tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button - Professional & Rounded */}
            <div className="hidden lg:block">
              {/* Removed Start Practice button */}
            </div>

            {/* Mobile Menu Button - Professional & Rounded */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden relative w-12 h-12 flex flex-col justify-center items-center space-y-1.5 group focus:outline-none rounded-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/30"
            >
              <div className={`w-7 h-0.5 bg-white transition-all duration-300 origin-center rounded-full ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></div>
              <div className={`w-7 h-0.5 bg-white transition-all duration-300 rounded-full ${
                isMenuOpen ? 'opacity-0 scale-0' : ''
              }`}></div>
              <div className={`w-7 h-0.5 bg-white transition-all duration-300 origin-center rounded-full ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></div>
              
              <div className="absolute inset-0 rounded-full bg-gray-700/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Professional & Rounded */}
        <div className={`lg:hidden fixed top-0 right-0 h-full w-80 sm:w-96 bg-gray-900/98 backdrop-blur-2xl transform transition-transform duration-500 ease-out border-l border-gray-800/50 shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Mobile menu header with Logo */}
          <div className="flex items-center justify-between p-8 border-b border-gray-800/50">
            <div className="flex items-center space-x-4">
              {/* Removed logo and name from mobile menu header */}
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30"
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>

          {/* Mobile navigation items - Professional & Rounded */}
          <div className="p-8 space-y-3">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center px-6 py-5 rounded-full text-left transition-all duration-400 group border ${
                  activeItem === item.name 
                    ? 'bg-blue-600/20 text-white border-blue-500/50 shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/40 border-transparent hover:border-gray-700/30'
                }`}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <span className="font-semibold text-lg tracking-wide">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Mobile CTA - Professional & Rounded */}
          <div className="p-8 border-t border-gray-800/50 mt-auto">
            {/* Removed Start Practice button from mobile menu */}
          </div>
        </div>

  </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-20 sm:h-24 lg:h-28"></div>
    </>
  );
};

export default Navbar;