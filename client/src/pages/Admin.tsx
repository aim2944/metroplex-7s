import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Calendar, LogOut, Check, X, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

type Tab = 'teams' | 'matches';

interface Team {
  id: string;
  name: string;
  status: string;
  depositPaid: boolean;
  fullFeePaid: boolean;
  zelleMemoRef: string | null;
  createdAt: string;
  captain: { firstName: string; lastName: string; email: string; phone: string } | null;
  players: { id: string; firstName: string; lastName: string }[];
}

interface Match {
  id: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  phase: string;
  status: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // New match form
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [matchForm, setMatchForm] = useState({
    homeTeamId: '', awayTeamId: '', date: '', time: '', venue: '', phase: 'LEAGUE', week: '',
  });

  // Score editing
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreForm, setScoreForm] = useState({ homeScore: '', awayScore: '' });

  useEffect(() => {
    const token = localStorage.getItem('msl7s_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [t, m] = await Promise.all([api.getAdminTeams(), api.getAdminMatches()]);
      setTeams(t);
      setMatches(m);
    } catch {
      localStorage.removeItem('msl7s_token');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  async function updateTeam(id: string, data: Partial<Team>) {
    await api.updateTeam(id, data);
    loadData();
  }

  async function deleteTeam(id: string) {
    if (!confirm('Delete this team? This cannot be undone.')) return;
    await api.deleteTeam(id);
    loadData();
  }

  async function createMatch(e: React.FormEvent) {
    e.preventDefault();
    await api.createMatch({
      ...matchForm,
      week: matchForm.week ? parseInt(matchForm.week) : null,
    });
    setShowMatchForm(false);
    setMatchForm({ homeTeamId: '', awayTeamId: '', date: '', time: '', venue: '', phase: 'LEAGUE', week: '' });
    loadData();
  }

  async function updateScore(matchId: string) {
    await api.updateMatch(matchId, {
      homeScore: parseInt(scoreForm.homeScore),
      awayScore: parseInt(scoreForm.awayScore),
    });
    setEditingScore(null);
    loadData();
  }

  function logout() {
    localStorage.removeItem('msl7s_token');
    navigate('/admin/login');
  }

  const confirmedTeams = teams.filter(t => t.status === 'CONFIRMED');

  if (loading) {
    return <div className="bg-navy-dark min-h-screen flex items-center justify-center text-white/40">Loading...</div>;
  }

  return (
    <div className="bg-navy-dark min-h-screen">
      {/* Admin header */}
      <div className="bg-navy border-b border-gold/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-lg font-bold text-white">
              MSL <span className="text-gold">7's</span>
            </Link>
            <span className="text-gold/50 text-sm font-display">ADMIN</span>
          </div>
          <button onClick={logout} className="text-white/50 hover:text-white flex items-center gap-2 text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Teams', value: teams.length, color: 'text-white' },
            { label: 'Confirmed', value: teams.filter(t => t.status === 'CONFIRMED').length, color: 'text-green-400' },
            { label: 'Pending', value: teams.filter(t => t.status !== 'CONFIRMED').length, color: 'text-yellow-400' },
            { label: 'Matches', value: matches.length, color: 'text-gold' },
          ].map(s => (
            <div key={s.label} className="bg-navy/50 border border-gold/10 rounded-lg p-4">
              <p className="text-white/50 text-xs">{s.label}</p>
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('teams')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold ${
              tab === 'teams' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-white/50 border border-white/10'
            }`}
          >
            <Users size={16} /> Teams
          </button>
          <button
            onClick={() => setTab('matches')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold ${
              tab === 'matches' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-white/50 border border-white/10'
            }`}
          >
            <Calendar size={16} /> Matches
          </button>
        </div>

        {/* Teams Tab */}
        {tab === 'teams' && (
          <div className="space-y-3">
            {teams.map(team => (
              <div key={team.id} className="bg-navy/50 border border-gold/10 rounded-xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-white">{team.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        team.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                        team.status === 'REGISTERED' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {team.status}
                      </span>
                    </div>
                    {team.captain && (
                      <p className="text-white/50 text-sm mt-1">
                        Captain: {team.captain.firstName} {team.captain.lastName} &bull; {team.captain.email} &bull; {team.captain.phone}
                      </p>
                    )}
                    <p className="text-white/30 text-xs mt-1">
                      {team.players.length} players &bull; Registered {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Status dropdown */}
                    <select
                      value={team.status}
                      onChange={e => updateTeam(team.id, { status: e.target.value })}
                      className="bg-navy-dark border border-gold/20 rounded px-2 py-1.5 text-white text-xs focus:outline-none"
                    >
                      <option value="INTERESTED">Interested</option>
                      <option value="REGISTERED">Registered</option>
                      <option value="CONFIRMED">Confirmed</option>
                    </select>

                    {/* Payment toggles */}
                    <button
                      onClick={() => updateTeam(team.id, { depositPaid: !team.depositPaid })}
                      className={`text-xs px-3 py-1.5 rounded border ${
                        team.depositPaid
                          ? 'bg-green-500/20 border-green-500/30 text-green-400'
                          : 'border-white/10 text-white/40'
                      }`}
                    >
                      {team.depositPaid ? <Check size={12} className="inline mr-1" /> : null}
                      Deposit
                    </button>
                    <button
                      onClick={() => updateTeam(team.id, { fullFeePaid: !team.fullFeePaid })}
                      className={`text-xs px-3 py-1.5 rounded border ${
                        team.fullFeePaid
                          ? 'bg-green-500/20 border-green-500/30 text-green-400'
                          : 'border-white/10 text-white/40'
                      }`}
                    >
                      {team.fullFeePaid ? <Check size={12} className="inline mr-1" /> : null}
                      Full Fee
                    </button>

                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="text-white/20 hover:text-red p-1.5 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matches Tab */}
        {tab === 'matches' && (
          <div>
            <button
              onClick={() => setShowMatchForm(!showMatchForm)}
              className="mb-4 bg-gold hover:bg-gold-light text-navy-dark font-display font-bold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + CREATE MATCH
            </button>

            {showMatchForm && (
              <form onSubmit={createMatch} className="bg-navy/50 border border-gold/20 rounded-xl p-5 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <select
                    value={matchForm.homeTeamId}
                    onChange={e => setMatchForm({ ...matchForm, homeTeamId: e.target.value })}
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none"
                    required
                  >
                    <option value="">Home Team</option>
                    {confirmedTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <select
                    value={matchForm.awayTeamId}
                    onChange={e => setMatchForm({ ...matchForm, awayTeamId: e.target.value })}
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none"
                    required
                  >
                    <option value="">Away Team</option>
                    {confirmedTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={matchForm.date}
                    onChange={e => setMatchForm({ ...matchForm, date: e.target.value })}
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={matchForm.time}
                    onChange={e => setMatchForm({ ...matchForm, time: e.target.value })}
                    placeholder="7:00 PM"
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none placeholder-white/30"
                    required
                  />
                  <input
                    type="text"
                    value={matchForm.venue}
                    onChange={e => setMatchForm({ ...matchForm, venue: e.target.value })}
                    placeholder="Venue"
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none placeholder-white/30"
                    required
                  />
                  <input
                    type="number"
                    value={matchForm.week}
                    onChange={e => setMatchForm({ ...matchForm, week: e.target.value })}
                    placeholder="Week #"
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none placeholder-white/30"
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <select
                    value={matchForm.phase}
                    onChange={e => setMatchForm({ ...matchForm, phase: e.target.value })}
                    className="bg-navy-dark border border-gold/20 rounded px-3 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="LEAGUE">League</option>
                    <option value="PLAYOFF">Playoff</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-gold hover:bg-gold-light text-navy-dark font-display font-bold text-sm px-4 py-2 rounded transition-colors"
                  >
                    CREATE
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMatchForm(false)}
                    className="text-white/40 hover:text-white text-sm px-3 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {matches.map(match => (
                <div key={match.id} className="bg-navy/50 border border-gold/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-display font-semibold text-white text-sm flex-1 text-right">
                        {match.homeTeam.name}
                      </span>

                      {editingScore === match.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={scoreForm.homeScore}
                            onChange={e => setScoreForm({ ...scoreForm, homeScore: e.target.value })}
                            className="w-10 bg-navy-dark border border-gold/30 rounded px-1 py-1 text-white text-center text-sm focus:outline-none"
                          />
                          <span className="text-white/30">-</span>
                          <input
                            type="number"
                            min="0"
                            value={scoreForm.awayScore}
                            onChange={e => setScoreForm({ ...scoreForm, awayScore: e.target.value })}
                            className="w-10 bg-navy-dark border border-gold/30 rounded px-1 py-1 text-white text-center text-sm focus:outline-none"
                          />
                          <button
                            onClick={() => updateScore(match.id)}
                            className="text-green-400 hover:text-green-300 p-1"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingScore(null)}
                            className="text-white/30 hover:text-white p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingScore(match.id);
                            setScoreForm({
                              homeScore: match.homeScore?.toString() ?? '',
                              awayScore: match.awayScore?.toString() ?? '',
                            });
                          }}
                          className="text-gold/60 hover:text-gold text-sm font-display min-w-[60px] text-center"
                        >
                          {match.status === 'COMPLETED'
                            ? `${match.homeScore} - ${match.awayScore}`
                            : 'Enter Score'}
                        </button>
                      )}

                      <span className="font-display font-semibold text-white text-sm flex-1">
                        {match.awayTeam.name}
                      </span>
                    </div>

                    <div className="text-white/30 text-xs ml-4 hidden sm:block">
                      {new Date(match.date).toLocaleDateString()} &bull; {match.time} &bull; {match.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
