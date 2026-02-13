
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Products', path: '/products' },
    { name: 'Distribution', path: '/distribution-network' },
    { name: 'Charity Water', path: '/charity-water' },
    { name: 'Contact', path: '/contact' },
  ];

  const LogoContent = () => (
    <img
      src="https://static.readdy.ai/image/6f2b631dac997628c51208e81abd8495/a5f9e0d89d96e9a4d5ccc2ddfdcd62fa.jpeg"
      alt="DYAM Natural Water - Premium Bottled Water Nigeria"
      className="h-14 w-auto"
    />
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - H1 on homepage only */}
          {isHomePage ? (
            <h1 className="m-0 p-0">
              <Link to="/" className="flex items-center space-x-3" aria-label="DYAM Natural Water Homepage">
                <LogoContent />
              </Link>
            </h1>
          ) : (
            <Link to="/" className="flex items-center space-x-3" aria-label="DYAM Natural Water Homepage">
              <LogoContent />
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === link.path
                    ? isScrolled
                      ? 'text-brand-500'
                      : 'text-white'
                    : isScrolled
                    ? 'text-gray-700 hover:text-brand-500'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/charity-water"
              className="bg-charity-500 hover:bg-charity-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:shadow-lg transition-all whitespace-nowrap"
            >
              <i className="ri-heart-fill mr-2"></i>
              Donate Water
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100" role="menu">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-brand-50 text-brand-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/charity-water"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block bg-charity-500 hover:bg-charity-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center"
              role="menuitem"
            >
              <i className="ri-heart-fill mr-2"></i>
              Donate Water
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
