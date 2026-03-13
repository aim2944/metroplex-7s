import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, Star, Shield, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-dark via-navy to-navy-dark">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #C5A44E 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center">
            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="text-gold fill-gold" />
              ))}
            </div>

            {/* Shield/Logo area */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 mb-4">
                <Shield size={44} className="text-gold" />
              </div>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white tracking-tight leading-none">
              METROPLEX
            </h1>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gold tracking-tight leading-none mt-1">
              7's
            </h2>
            <p className="font-display text-xl sm:text-2xl lg:text-3xl text-white/90 tracking-widest mt-4 font-semibold">
              SUMMER LEAGUE
            </p>
            <p className="text-white/60 text-lg mt-3 font-body">
              Competitive 7v7 Summer League + Championship Tournament
            </p>

            {/* Key Info */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 text-white/70 text-sm sm:text-base">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gold" />
                June &ndash; August 2026
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                Dallas, Texas
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-gold" />
                Limited to 16 Teams
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                to="/register"
                className="bg-red hover:bg-red-light text-white font-display font-bold text-lg px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-red/30 tracking-wide flex items-center gap-2"
              >
                REGISTER YOUR TEAM
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/rules"
                className="border-2 border-gold/50 text-gold hover:bg-gold/10 font-display font-semibold text-lg px-8 py-4 rounded-lg transition-colors tracking-wide"
              >
                LEAGUE INFO
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </section>

      {/* League Highlights */}
      <section className="bg-navy-dark py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-center text-white mb-12">
            WHAT TO <span className="text-gold">EXPECT</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users size={32} />,
                title: '7v7 Format',
                desc: 'Fast-paced, small-sided soccer. 6 field players + goalkeeper. Max 12-player rosters.',
              },
              {
                icon: <Calendar size={32} />,
                title: 'Weekly Matches',
                desc: 'Consistent weekly schedule throughout the summer. Round-robin league stage followed by playoffs.',
              },
              {
                icon: <Trophy size={32} />,
                title: 'Championship Bracket',
                desc: 'Top teams advance to single-elimination knockout rounds. Trophies for champion, runner-up, and MVP.',
              },
              {
                icon: <Shield size={32} />,
                title: 'Competitive Level',
                desc: 'Built for teams that compete at the premier adult level in DFW. This is not a rec league.',
              },
              {
                icon: <MapPin size={32} />,
                title: 'Quality Venues',
                desc: 'Fields are based on the location of both teams playing. Indoor or outdoor depending on conditions.',
              },
              {
                icon: <Star size={32} />,
                title: 'Licensed Referees',
                desc: 'All matches officiated by certified referees. Professional, organized game environment.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-navy/50 border border-gold/10 rounded-xl p-6 hover:border-gold/30 transition-colors group"
              >
                <div className="text-gold mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="font-display text-xl font-bold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-b from-navy-dark to-navy py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-center text-white mb-4">
            REGISTRATION <span className="text-gold">PRICING</span>
          </h3>
          <p className="text-center text-white/50 mb-10">
            Secure your spot with a $100 deposit. Balance due before first match.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Early Bird */}
            <div className="relative border-2 border-gold rounded-xl p-8 text-center bg-navy-dark/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy-dark font-display font-bold text-xs px-4 py-1 rounded-full">
                FIRST 10 TEAMS
              </div>
              <p className="font-display text-lg text-gold font-semibold mb-2">EARLY BIRD</p>
              <p className="font-display text-5xl font-extrabold text-white">$325</p>
              <p className="text-white/50 text-sm mt-2">per team</p>
            </div>

            {/* Regular */}
            <div className="border-2 border-red/50 rounded-xl p-8 text-center bg-navy-dark/50">
              <p className="font-display text-lg text-red-light font-semibold mb-2 mt-3">REGULAR</p>
              <p className="font-display text-5xl font-extrabold text-white">$375</p>
              <p className="text-white/50 text-sm mt-2">per team</p>
            </div>
          </div>

          <p className="text-center text-white/40 text-sm mt-6">
            Fee includes: field rental, referees, trophies &amp; MVP award
          </p>

          <div className="text-center mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-red hover:bg-red-light text-white font-display font-bold text-lg px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-red/30 tracking-wide"
            >
              REGISTER NOW
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-navy border-y border-gold/20 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display text-2xl sm:text-3xl font-bold text-white">
            YOUR SQUAD. <span className="text-gold">YOUR SUMMER.</span>
          </p>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Don't let your season end in May. Keep competing all summer with DFW's top teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              to="/register"
              className="bg-red hover:bg-red-light text-white font-display font-semibold px-6 py-3 rounded-lg transition-colors tracking-wide"
            >
              REGISTER YOUR TEAM
            </Link>
            <a
              href="https://instagram.com/mplsdfw"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold/40 text-gold hover:bg-gold/10 font-display font-semibold px-6 py-3 rounded-lg transition-colors tracking-wide"
            >
              DM @mplsdfw
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
