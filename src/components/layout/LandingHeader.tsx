import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import logo from '../../../public/images/logo/logo.png';

const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#top' },
    { name: 'Programs', href: '#programs' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Announcements', href: '#announcements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-green-900/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/landing" className="flex items-center">
              <div className="relative h-12 w-12 overflow-hidden">
                <Image 
                  src={logo} 
                  alt="College Logo" 
                  width={48} 
                  height={48} 
                  className="object-contain" 
                  priority
                />
              </div>
              <span className={`ml-2 font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                GGC Science
              </span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    scrolled
                      ? 'text-gray-700 border-transparent hover:border-green-600 hover:text-green-800'
                      : 'text-gray-100 border-transparent hover:border-white hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/auth/login"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                scrolled
                  ? 'text-green-700 bg-green-50 hover:bg-green-100'
                  : 'text-green-800 bg-white hover:bg-green-50'
              }`}
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors"
            >
              Register
            </Link>
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                scrolled
                  ? 'text-gray-500 hover:text-gray-700'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-base font-medium text-gray-700 hover:text-green-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-5 border-t border-gray-200 px-4 space-y-3">
            <Link
              href="/auth/login"
              className="block w-full px-4 py-2 text-center text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="block w-full px-4 py-2 text-center text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;