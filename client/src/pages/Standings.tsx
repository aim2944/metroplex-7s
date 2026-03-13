import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { api } from '../lib/api';

interface StandingRow {
  id: string;
  teamId: string;
  team: { id: string; name: string; logoUrl: string | null };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  goalDifference: number;
}

export default function Standings() {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStandings()
      .then(setStandings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          LEAGUE <span className="text-gold">STANDINGS</span>
        </h1>
        <p className="text-white/50 text-center mb-10">
          Updated automatically after each match
        </p>

        {loading ? (
          <p className="text-center text-white/40">Loading standings...</p>
        ) : standings.length === 0 ? (
          <div className="text-center py-16">
            <Trophy size={48} className="text-gold/30 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No standings yet.</p>
            <p className="text-white/30 text-sm mt-2">Standings will populate once matches are played.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/20">
                  <th className="text-left py-3 px-2 text-gold/70 font-display text-xs w-8">#</th>
                  <th className="text-left py-3 px-2 text-gold/70 font-display text-xs">TEAM</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">MP</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">W</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">D</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">L</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">GF</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">GA</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">GD</th>
                  <th className="text-center py-3 px-2 text-gold/70 font-display text-xs">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-white/5 hover:bg-gold/5 transition-colors ${
                      idx < 4 ? 'bg-gold/[0.03]' : ''
                    }`}
                  >
                    <td className="py-3 px-2 text-white/50">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <span className="font-display font-semibold text-white">{row.team.name}</span>
                    </td>
                    <td className="text-center py-3 px-2 text-white/70">{row.played}</td>
                    <td className="text-center py-3 px-2 text-white/70">{row.won}</td>
                    <td className="text-center py-3 px-2 text-white/70">{row.drawn}</td>
                    <td className="text-center py-3 px-2 text-white/70">{row.lost}</td>
                    <td className="text-center py-3 px-2 text-white/70">{row.goalsFor}</td>
                    <td className="text-center py-3 px-2 text-white/70">{row.goalsAgainst}</td>
                    <td className="text-center py-3 px-2 text-white/70">
                      {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                    </td>
                    <td className="text-center py-3 px-2 font-display font-bold text-gold">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {standings.length >= 4 && (
              <p className="text-xs text-white/30 mt-3">
                Highlighted rows indicate playoff qualification spots (top 4)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
