'use client';
import React from 'react';
import Link from 'next/link';
import GlassSurface from '@/components/GlassSurface';

import StarBorder from '@/components/StarBorder';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [pastHero, setPastHero] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setPastHero(window.scrollY > window.innerHeight - 100); // Transition just before next section
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Close menu on click
    }
  };

  return (
    <nav className={`main-navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''} ${mounted && resolvedTheme === 'light' && !pastHero ? 'force-white-text' : ''}`}>
      <GlassSurface
        borderRadius={50}
        displace={15}
        opacity={0.8}
        className="nav-texture-container"
        style={{
          width: '100%',
          display: 'flex'
        }}
      >
        {/* Minimized Trigger (Visible only on mobile when scrolled & closed) */}
        <div
          className="mobile-minimized-trigger"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <div className="trigger-bar"></div>
        </div>

        <div className="nav-inner">

          <div className="logo" onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}><span></span> TRANSCEND FRAMES</div>

          {/* Mobile Menu Trigger (Initial State) */}
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>Menu</button>

          {/* Mobile Close Button */}
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>

          <ul className="nav-links">
            <li className="nav-item" onClick={() => scrollTo('home')}>Home</li>
            <li className="nav-item" onClick={() => scrollTo('services')}>Services</li>
            <li className="nav-item" onClick={() => scrollTo('process')}>Process</li>
            <li className="nav-item">
              Testimonials ▾
              <div className="dropdown-menu">
                <Link href="#reviews" className="dropdown-item">Client Reviews</Link>
              </div>
            </li>
            <li className="nav-item" onClick={() => scrollTo('about')}>About</li>
            <li className="nav-item" onClick={() => scrollTo('contact')}>Contact</li>
          </ul>

          <div className="nav-actions">
            <StarBorder
              as="button"
              className={`quote-btn ${mounted && resolvedTheme === 'light' ? '' : 'filled'}`}
              onClick={() => window.open('https://topmate.io/manan_shah05/', '_blank')}
              color={mounted && resolvedTheme === 'light' ? "black" : "white"}
              speed="4s"
            >
              Book a Call
            </StarBorder>

            <button
              className="theme-toggle"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              data-tooltip={mounted ? (resolvedTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode") : "Toggle Theme"}
            >
              {mounted ? (resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />) : <div style={{ width: 20, height: 20 }} />}
            </button>
          </div>

        </div>
      </GlassSurface>
    </nav>
  );
}