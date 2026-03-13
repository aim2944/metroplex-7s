import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/teams', label: 'Teams' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/standings', label: 'Standings' },
  { to: '/bracket', label: 'Bracket' },
  { to: '/rules', label: 'Rules' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-navy-dark/95 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-white tracking-wide">
              METROPLEX <span className="text-gold">7's</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                  location.pathname === link.to
                    ? 'text-gold bg-gold/10'
                    : 'text-white/80 hover:text-gold hover:bg-gold/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://instagram.com/mplsdfw"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-white/70 hover:text-gold transition-colors"
            >
              <Instagram size={20} />
            </a>
            <Link
              to="/register"
              className="ml-3 bg-red hover:bg-red-light text-white font-display font-semibold px-5 py-2 rounded transition-colors text-sm tracking-wide"
            >
              REGISTER TEAM
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-gold/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-gold bg-gold/10'
                    : 'text-white/80 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="block mt-2 bg-red hover:bg-red-light text-white font-display font-semibold px-4 py-2.5 rounded text-center text-sm tracking-wide"
            >
              REGISTER TEAM
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
