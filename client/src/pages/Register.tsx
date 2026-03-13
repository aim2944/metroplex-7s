import { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Plus, Trash2, Copy } from 'lucide-react';
import { api } from '../lib/api';

type Step = 'team' | 'captain' | 'players' | 'success';

interface Player {
  firstName: string;
  lastName: string;
  jerseyNumber: string;
}

export default function Register() {
  const [step, setStep] = useState<Step>('team');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [teamName, setTeamName] = useState('');
  const [captain, setCaptain] = useState({
    firstName: '', lastName: '', email: '', phone: '', waiverSigned: false,
  });
  const [players, setPlayers] = useState<Player[]>([
    { firstName: '', lastName: '', jerseyNumber: '' },
  ]);

  // Success state
  const [zelleMemo, setZelleMemo] = useState('');
  const [copied, setCopied] = useState(false);

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'team', label: 'Team Info', num: 1 },
    { key: 'captain', label: 'Captain', num: 2 },
    { key: 'players', label: 'Roster', num: 3 },
    { key: 'success', label: 'Confirm', num: 4 },
  ];

  const currentIdx = steps.findIndex(s => s.key === step);

  function addPlayer() {
    if (players.length >= 12) return;
    setPlayers([...players, { firstName: '', lastName: '', jerseyNumber: '' }]);
  }

  function removePlayer(idx: number) {
    setPlayers(players.filter((_, i) => i !== idx));
  }

  function updatePlayer(idx: number, field: keyof Player, value: string) {
    const updated = [...players];
    updated[idx] = { ...updated[idx], [field]: value };
    setPlayers(updated);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const validPlayers = players.filter(p => p.firstName && p.lastName);
      const result = await api.registerTeam({
        teamName,
        captain: {
          firstName: captain.firstName,
          lastName: captain.lastName,
          email: captain.email,
          phone: captain.phone,
          waiverSigned: captain.waiverSigned,
        },
        players: validPlayers.map(p => ({
          firstName: p.firstName,
          lastName: p.lastName,
          jerseyNumber: p.jerseyNumber ? parseInt(p.jerseyNumber) : null,
        })),
      });
      setZelleMemo(result.zelleMemoRef);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyMemo() {
    navigator.clipboard.writeText(zelleMemo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          REGISTER YOUR <span className="text-gold">TEAM</span>
        </h1>
        <p className="text-white/50 text-center mb-8">
          Secure your spot in the Metroplex Summer League 7's
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                i < currentIdx
                  ? 'bg-gold text-navy-dark'
                  : i === currentIdx
                  ? 'bg-gold/20 border-2 border-gold text-gold'
                  : 'bg-navy border border-white/20 text-white/40'
              }`}>
                {i < currentIdx ? <CheckCircle size={16} /> : s.num}
              </div>
              <span className={`hidden sm:block ml-2 text-sm ${
                i <= currentIdx ? 'text-white' : 'text-white/40'
              }`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
                  i < currentIdx ? 'bg-gold' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red/20 border border-red/40 text-red-light rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Team Info */}
        {step === 'team' && (
          <div className="bg-navy/50 border border-gold/10 rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-white mb-6">Team Information</h2>
            <div>
              <label className="block text-sm text-white/70 mb-1">Team Name *</label>
              <input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
                placeholder="e.g., Dallas Atletico"
              />
            </div>
            <div className="flex justify-end mt-8">
              <button
                disabled={!teamName.trim()}
                onClick={() => setStep('captain')}
                className="bg-gold hover:bg-gold-light text-navy-dark font-display font-bold px-6 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                NEXT <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Captain Info */}
        {step === 'captain' && (
          <div className="bg-navy/50 border border-gold/10 rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-white mb-6">Captain Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={captain.firstName}
                    onChange={e => setCaptain({ ...captain, firstName: e.target.value })}
                    className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={captain.lastName}
                    onChange={e => setCaptain({ ...captain, lastName: e.target.value })}
                    className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Email *</label>
                <input
                  type="email"
                  value={captain.email}
                  onChange={e => setCaptain({ ...captain, email: e.target.value })}
                  className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
                  placeholder="captain@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={captain.phone}
                  onChange={e => setCaptain({ ...captain, phone: e.target.value })}
                  className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
                  placeholder="(214) 555-0000"
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={captain.waiverSigned}
                  onChange={e => setCaptain({ ...captain, waiverSigned: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-gold"
                />
                <span className="text-sm text-white/70">
                  I acknowledge and agree to the league liability waiver. I understand that participation in the Metroplex Summer League 7's involves inherent risks, and I voluntarily assume all such risks. *
                </span>
              </label>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep('team')}
                className="text-white/60 hover:text-white font-display font-semibold px-4 py-3 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={18} /> BACK
              </button>
              <button
                disabled={!captain.firstName || !captain.lastName || !captain.email || !captain.phone || !captain.waiverSigned}
                onClick={() => setStep('players')}
                className="bg-gold hover:bg-gold-light text-navy-dark font-display font-bold px-6 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                NEXT <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Player Roster */}
        {step === 'players' && (
          <div className="bg-navy/50 border border-gold/10 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">Player Roster</h2>
              <span className="text-sm text-white/50">{players.length}/12 players</span>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Add your players now or submit later. You can update your roster before the first game.
            </p>

            <div className="space-y-3">
              {players.map((player, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-white/40 text-sm mt-3 w-6">{idx + 1}.</span>
                  <input
                    type="text"
                    value={player.firstName}
                    onChange={e => updatePlayer(idx, 'firstName', e.target.value)}
                    className="flex-1 bg-navy-dark border border-gold/20 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={player.lastName}
                    onChange={e => updatePlayer(idx, 'lastName', e.target.value)}
                    className="flex-1 bg-navy-dark border border-gold/20 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50"
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    value={player.jerseyNumber}
                    onChange={e => updatePlayer(idx, 'jerseyNumber', e.target.value)}
                    className="w-16 bg-navy-dark border border-gold/20 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/50 text-center"
                    placeholder="#"
                  />
                  {players.length > 1 && (
                    <button
                      onClick={() => removePlayer(idx)}
                      className="text-white/30 hover:text-red p-2 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {players.length < 12 && (
              <button
                onClick={addPlayer}
                className="flex items-center gap-2 text-gold hover:text-gold-light text-sm mt-4 transition-colors"
              >
                <Plus size={16} /> Add Player
              </button>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep('captain')}
                className="text-white/60 hover:text-white font-display font-semibold px-4 py-3 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={18} /> BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-red hover:bg-red-light text-white font-display font-bold px-8 py-3 rounded-lg disabled:opacity-40 transition-colors flex items-center gap-2"
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="bg-navy/50 border border-gold/20 rounded-xl p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-6">
              <CheckCircle size={36} className="text-gold" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Registration Submitted!</h2>
            <p className="text-white/60 mb-8">
              Your team <span className="text-gold font-semibold">{teamName}</span> has been registered.
              Complete your payment to confirm your spot.
            </p>

            {/* Payment Instructions */}
            <div className="bg-navy-dark border-2 border-gold/30 rounded-xl p-6 text-left mb-6">
              <h3 className="font-display text-lg font-bold text-gold mb-4">
                PAYMENT INSTRUCTIONS
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/50">Send payment to:</span>
                  <p className="text-white font-semibold text-base mt-1">beatyourtestprep@gmail.com</p>
                  <p className="text-white/50 mt-1">We accept all forms of payment (Zelle, Venmo, CashApp, PayPal, etc.)</p>
                </div>
                <div className="border-t border-gold/10 pt-3">
                  <span className="text-white/50">Amount options:</span>
                  <div className="mt-1 space-y-1">
                    <p className="text-white"><strong>$100</strong> — Deposit (to reserve your spot)</p>
                    <p className="text-white"><strong>$325</strong> — Full payment (early bird)</p>
                    <p className="text-white"><strong>$375</strong> — Full payment (regular)</p>
                  </div>
                </div>
                <div className="border-t border-gold/10 pt-3">
                  <span className="text-white/50">Include this in your payment memo:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-navy border border-gold/20 px-3 py-2 rounded text-gold font-mono flex-1">
                      {zelleMemo}
                    </code>
                    <button
                      onClick={copyMemo}
                      className="text-gold hover:text-gold-light p-2 transition-colors"
                      title="Copy memo"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  {copied && <p className="text-gold text-xs mt-1">Copied!</p>}
                </div>
              </div>
            </div>

            <div className="bg-navy-dark/50 border border-white/10 rounded-lg p-4 text-left text-sm space-y-2 mb-6">
              <p className="text-white/70"><strong className="text-white">What happens next:</strong></p>
              <ol className="list-decimal list-inside text-white/60 space-y-1.5">
                <li>Send your payment using the instructions above</li>
                <li>An admin will verify your payment and confirm your registration</li>
                <li>You'll be added to the captain's WhatsApp group for updates</li>
                <li>Finalize your roster before the first match day</li>
              </ol>
            </div>

            <p className="text-white/40 text-sm">
              Questions? DM us on Instagram{' '}
              <a href="https://instagram.com/mplsdfw" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                @mplsdfw
              </a>{' '}
              or reach out via the{' '}
              <a href="/contact" className="text-gold hover:underline">contact page</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
