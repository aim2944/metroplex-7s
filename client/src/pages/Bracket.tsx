import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { api } from '../lib/api';

interface Match {
  id: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  phase: string;
}

export default function Bracket() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMatches({ phase: 'PLAYOFF' })
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Split into rounds: semis (first 2), final (last 1)
  const semis = matches.slice(0, 2);
  const final_ = matches.slice(2, 3);

  function MatchCard({ match }: { match?: Match }) {
    if (!match) {
      return (
        <div className="bg-navy/30 border border-dashed border-white/10 rounded-lg p-3 w-56">
          <div className="flex justify-between items-center py-1">
            <span className="text-white/20 text-sm">TBD</span>
            <span className="text-white/10">-</span>
          </div>
          <div className="border-t border-white/5 my-1" />
          <div className="flex justify-between items-center py-1">
            <span className="text-white/20 text-sm">TBD</span>
            <span className="text-white/10">-</span>
          </div>
        </div>
      );
    }

    const homeWon = match.status === 'COMPLETED' && match.homeScore! > match.awayScore!;
    const awayWon = match.status === 'COMPLETED' && match.awayScore! > match.homeScore!;

    return (
      <div className="bg-navy/50 border border-gold/20 rounded-lg p-3 w-56">
        <div className={`flex justify-between items-center py-1 ${homeWon ? 'text-gold' : 'text-white'}`}>
          <span className={`text-sm font-display font-semibold ${homeWon ? '' : 'font-normal'}`}>
            {match.homeTeam.name}
          </span>
          <span className="font-display font-bold">
            {match.homeScore ?? '-'}
          </span>
        </div>
        <div className="border-t border-gold/10 my-1" />
        <div className={`flex justify-between items-center py-1 ${awayWon ? 'text-gold' : 'text-white'}`}>
          <span className={`text-sm font-display font-semibold ${awayWon ? '' : 'font-normal'}`}>
            {match.awayTeam.name}
          </span>
          <span className="font-display font-bold">
            {match.awayScore ?? '-'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          PLAYOFF <span className="text-gold">BRACKET</span>
        </h1>
        <p className="text-white/50 text-center mb-10">
          Single-elimination knockout stage
        </p>

        {loading ? (
          <p className="text-center text-white/40">Loading bracket...</p>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <Trophy size={48} className="text-gold/30 mx-auto mb-4" />
            <p className="text-white/40 text-lg">Playoff bracket not yet set.</p>
            <p className="text-white/30 text-sm mt-2">
              The bracket will be populated after the group stage concludes.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8 overflow-x-auto py-8">
            {/* Semifinals */}
            <div className="flex flex-col gap-16">
              <div>
                <p className="text-gold/50 text-xs font-display mb-2 text-center">SEMIFINAL 1</p>
                <MatchCard match={semis[0]} />
              </div>
              <div>
                <p className="text-gold/50 text-xs font-display mb-2 text-center">SEMIFINAL 2</p>
                <MatchCard match={semis[1]} />
              </div>
            </div>

            {/* Connector lines */}
            <div className="flex flex-col items-center h-48 justify-center">
              <div className="w-8 border-t-2 border-gold/30" />
              <div className="h-full border-r-2 border-gold/30" />
              <div className="w-8 border-t-2 border-gold/30" />
            </div>

            {/* Final */}
            <div>
              <p className="text-gold text-xs font-display mb-2 text-center font-bold">FINAL</p>
              <MatchCard match={final_[0]} />
              <div className="flex items-center justify-center mt-4">
                <Trophy size={24} className="text-gold" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
