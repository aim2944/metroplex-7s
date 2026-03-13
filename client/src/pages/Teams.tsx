import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { api } from '../lib/api';

interface Team {
  id: string;
  name: string;
  logoUrl: string | null;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeams()
      .then(setTeams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          CONFIRMED <span className="text-gold">TEAMS</span>
        </h1>
        <p className="text-white/50 text-center mb-10">
          {teams.length} of 16 spots filled
        </p>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="h-2 bg-navy rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
              style={{ width: `${(teams.length / 16) * 100}%` }}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-white/40">Loading teams...</p>
        ) : teams.length === 0 ? (
          <div className="text-center py-16">
            <Shield size={48} className="text-gold/30 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No confirmed teams yet.</p>
            <p className="text-white/30 text-sm mt-2">Registration is open — be the first to confirm!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {teams.map(team => (
              <div
                key={team.id}
                className="bg-navy/50 border border-gold/10 rounded-xl p-6 text-center hover:border-gold/30 transition-colors"
              >
                {team.logoUrl ? (
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center">
                    <Shield size={28} className="text-gold/50" />
                  </div>
                )}
                <p className="font-display text-sm font-bold text-white">{team.name}</p>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 16 - teams.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border border-dashed border-white/10 rounded-xl p-6 text-center opacity-30"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-white/30 text-2xl">?</span>
                </div>
                <p className="text-white/20 text-sm">Open Spot</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
