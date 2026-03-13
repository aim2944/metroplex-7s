import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { api } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('msl7s_token', token);
      navigate('/admin');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-navy-dark min-h-screen flex items-center justify-center px-4">
      <div className="bg-navy/50 border border-gold/20 rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <Shield size={40} className="text-gold mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-white">ADMIN LOGIN</h1>
        </div>

        {error && (
          <div className="bg-red/20 border border-red/40 text-red-light rounded-lg p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-navy-dark border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-navy-dark font-display font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
