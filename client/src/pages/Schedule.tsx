import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { api } from '../lib/api';

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  week: number | null;
  phase: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
}

export default function Schedule() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    api.getMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = matches.filter(m => {
    if (filter === 'upcoming') return m.status === 'SCHEDULED';
    if (filter === 'completed') return m.status === 'COMPLETED';
    return true;
  });

  // Group by week
  const grouped = filtered.reduce((acc, m) => {
    const key = m.week ? `Week ${m.week}` : m.phase === 'PLAYOFF' ? 'Playoffs' : 'TBD';
    (acc[key] = acc[key] || []).push(m);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          MATCH <span className="text-gold">SCHEDULE</span>
        </h1>
        <p className="text-white/50 text-center mb-8">
          {matches.length} matches scheduled
        </p>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(['all', 'upcoming', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'text-white/50 hover:text-white border border-white/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-white/40">Loading schedule...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={48} className="text-gold/30 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No matches to display.</p>
            <p className="text-white/30 text-sm mt-2">Schedule will be posted once registration closes.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([week, weekMatches]) => (
              <div key={week}>
                <h3 className="font-display text-lg font-bold text-gold mb-4 border-b border-gold/10 pb-2">
                  {week}
                </h3>
                <div className="space-y-3">
                  {weekMatches.map(match => (
                    <div
                      key={match.id}
                      className="bg-navy/50 border border-gold/10 rounded-xl p-4 sm:p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <p className="font-display font-bold text-white text-sm sm:text-base">
                            {match.homeTeam.name}
                          </p>
                        </div>

                        <div className="mx-4 sm:mx-6 text-center min-w-[80px]">
                          {match.status === 'COMPLETED' ? (
                            <div className="font-display text-xl font-bold">
                              <span className={match.homeScore! > match.awayScore! ? 'text-gold' : 'text-white'}>
                                {match.homeScore}
                              </span>
                              <span className="text-white/30 mx-1">-</span>
                              <span className={match.awayScore! > match.homeScore! ? 'text-gold' : 'text-white'}>
                                {match.awayScore}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white/40 text-sm font-display">VS</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-display font-bold text-white text-sm sm:text-base">
                            {match.awayTeam.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 mt-3 text-white/40 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(match.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {match.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {match.venue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
