import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Shield } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/signin', {
        username,
        password,
      });
      const data = response.data;
      if (data.accessToken || data.token) {
        localStorage.setItem('token', data.accessToken || data.token);
        localStorage.setItem('userRole', (data.roles && data.roles[0]) || 'ROLE_USER');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg relative overflow-hidden">
      {/* Background glowing effects for high-tech vault look */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]"></div>
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-brand-sidebar/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl z-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="w-16 h-16 bg-brand-bg rounded-xl flex items-center justify-center border border-slate-700/50 mb-4 shadow-inner relative group">
            <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Shield className="w-8 h-8 text-brand-accent animate-pulse relative z-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">LogicAuth Tracker</h1>
          <p className="text-slate-400 text-sm font-medium mb-4">Secure Enterprise Access Vault</p>
          
          {/* Demo Credentials Badge */}
          <div className="bg-slate-800/80 border border-brand-accent/30 rounded-lg p-3 w-full backdrop-blur-sm text-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-brand-accent text-xs font-bold uppercase tracking-wider mb-1">Recruiter Access</p>
            <p className="text-slate-300 text-sm font-mono tracking-wide">admin@logicauth.com <span className="text-slate-500 mx-1">/</span> admin123</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center relative z-10 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-brand-bg/80 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all shadow-inner"
              placeholder="Admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-brand-bg/80 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-brand-accent hover:bg-emerald-400 text-brand-bg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? 'Authenticating...' : (
              <>
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Verify Identity & Access Vault</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
