const BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

async function request(path: string, options?: RequestInit) {
  const token = localStorage.getItem('msl7s_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Public
  getTeams: () => request('/teams'),
  getMatches: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/matches${qs}`);
  },
  getStandings: () => request('/standings'),
  getRules: () => request('/rules'),
  registerTeam: (data: any) =>
    request('/teams/register', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminTeams: () => request('/admin/teams'),
  updateTeam: (id: string, data: any) =>
    request(`/admin/teams/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTeam: (id: string) =>
    request(`/admin/teams/${id}`, { method: 'DELETE' }),
  getAdminMatches: () => request('/admin/matches'),
  createMatch: (data: any) =>
    request('/admin/matches', { method: 'POST', body: JSON.stringify(data) }),
  updateMatch: (id: string, data: any) =>
    request(`/admin/matches/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
