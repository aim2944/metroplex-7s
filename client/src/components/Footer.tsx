import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-gold/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-bold text-white tracking-wide">
              METROPLEX <span className="text-gold">7's</span> SUMMER LEAGUE
            </p>
            <p className="text-white/50 text-sm mt-1">
              Dallas, Texas &bull; Summer 2026
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/mplsdfw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-gold transition-colors"
            >
              <Instagram size={22} />
            </a>
            <span className="text-white/40 text-xs">
              &copy; 2026 MSL7s. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
