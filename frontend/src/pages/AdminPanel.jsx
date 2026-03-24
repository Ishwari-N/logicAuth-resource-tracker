import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LogOut, Shield, Search, Users, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'Unknown Role';
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not admin, redirect to dashboard as fallback
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [userRole, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/all');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-brand-bg/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0 mt-0 pt-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-white tracking-tight pt-1">User Management (Admin)</h1>
            <div className="h-6 w-px bg-slate-700 mt-1"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 shadow-inner mt-1">
              <span className="text-xs font-bold text-brand-accent tracking-wider uppercase">High Clearance Zone</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 font-medium tracking-wide">Verified Clearance</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-brand-accent" />
                <span className="text-sm font-bold text-brand-accent uppercase tracking-wide">{userRole.replace('ROLE_', '')}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all font-medium text-sm group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Secure Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {/* Background glowing effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[128px] pointer-events-none"></div>

          {/* Data Table */}
          <div className="bg-brand-sidebar/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative z-10">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">Registered Personnel</h2>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                  {users.length} Users
                </span>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
                  <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-brand-accent rounded-full mb-4"></div>
                  <p className="font-medium tracking-wide">Decrypting user identities...</p>
                </div>
              ) : users.length > 0 ? (
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4">User ID</th>
                      <th className="px-6 py-4">Username</th>
                      <th className="px-6 py-4">Email Contact</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {users.map((user, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{user.id || `USR-${1000 + idx}`}</td>
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          {user.username}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user.email || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${user.enabled !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                            {user.enabled !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                            {user.enabled !== false ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1.5">
                            {(user.roles || ['ROLE_USER']).map((r, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded text-xs font-bold border ${r === 'ROLE_ADMIN' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                {r.replace('ROLE_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-24 text-center">
                  <div className="w-24 h-24 bg-brand-bg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50 shadow-inner relative group">
                    <Users className="w-10 h-10 text-slate-500 relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No Personnel Found</h3>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
