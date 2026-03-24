import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Activity, LogOut, ShieldAlert, CheckCircle2, AlertTriangle, Shield, Search, Database, Package } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'Unknown Role';
  
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/api/assets/all');
      setAssets(response.data);
      setApiStatus('Online');
    } catch (error) {
      console.error("Failed to fetch assets", error);
      setApiStatus('Degraded');
      setAssets([]); // fallback for empty state demo
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const filteredAssets = assets.filter(asset => 
    asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-brand-bg/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0 mt-0 pt-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-white tracking-tight pt-1">System Dashboard</h1>
            <div className="h-6 w-px bg-slate-700 mt-1"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 shadow-inner mt-1">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">System Status: Online</span>
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
          
          {/* Health Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
            <div className="bg-brand-sidebar/60 border border-slate-700/50 rounded-xl p-6 shadow-xl backdrop-blur-md hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium tracking-wide">API Status</h3>
                <Activity className={`w-5 h-5 ${apiStatus === 'Online' ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-white">{apiStatus}</div>
                {apiStatus === 'Online' && <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active</span>}
              </div>
            </div>

            <div className="bg-brand-sidebar/60 border border-slate-700/50 rounded-xl p-6 shadow-xl backdrop-blur-md hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium tracking-wide">Database</h3>
                <Database className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-white tracking-tight">MongoDB Atlas</div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Connected</span>
              </div>
            </div>

            <div className="bg-brand-sidebar/60 border border-slate-700/50 rounded-xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-brand-accent/50 transition-colors cursor-pointer">
              <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-slate-400 font-medium tracking-wide">Auth Method</h3>
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="text-2xl font-bold text-white">JWT Token</div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">Stateless</span>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-brand-sidebar/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative z-10">
            <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">Asset Inventory</h2>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                  {assets.length} Total
                </span>
                
                {userRole === 'ROLE_ADMIN' ? (
                  <button className="ml-4 px-3 py-1.5 rounded bg-brand-accent text-brand-bg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-400 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Add Asset
                  </button>
                ) : (
                  <div className="group relative">
                    <button disabled className="ml-4 px-3 py-1.5 rounded bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-not-allowed">
                      <Shield className="w-3.5 h-3.5" />
                      Add Asset
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-900 text-xs text-white rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Upgrade to Admin to manage resources
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2.5 bg-brand-bg border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
                  <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-brand-accent rounded-full mb-4"></div>
                  <p className="font-medium tracking-wide">Decrypting inventory data...</p>
                </div>
              ) : filteredAssets.length > 0 ? (
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4">Asset ID</th>
                      <th className="px-6 py-4">Designation</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredAssets.map((asset, idx) => {
                      const status = asset.status?.toLowerCase() || 'assigned';
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors group/row">
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">{asset.id || `AST-${1000 + idx}`}</td>
                          <td className="px-6 py-4 font-medium text-white">{asset.name || 'Unknown Designation'}</td>
                          <td className="px-6 py-4 text-slate-400">{asset.category || 'Hardware'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                              status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              status === 'repair' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/30' // assigned or other
                            }`}>
                              {status === 'available' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {status === 'repair' && <AlertTriangle className="w-3.5 h-3.5" />}
                              {status !== 'available' && status !== 'repair' && <Activity className="w-3.5 h-3.5" />}
                              <span className="capitalize">{status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {userRole === 'ROLE_ADMIN' ? (
                              <button className="text-slate-400 hover:text-brand-accent font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800/50 hover:bg-brand-accent/10 border border-transparent hover:border-brand-accent/30 group-hover/row:text-white">
                                <Shield className="w-3.5 h-3.5 text-brand-accent" />
                                Review
                              </button>
                            ) : (
                              <div className="group/tooltip relative inline-flex">
                                <button disabled className="text-slate-600 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800/30 border border-transparent opacity-50 cursor-not-allowed">
                                  <Shield className="w-3.5 h-3.5" />
                                  Locked
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-max max-w-xs px-3 py-2 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                  Upgrade to Admin to manage resources
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-24 text-center">
                  <div className="w-24 h-24 bg-brand-bg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50 shadow-inner relative group">
                    <div className="absolute inset-0 bg-brand-accent/5 rounded-2xl group-hover:bg-brand-accent/10 transition-colors"></div>
                    <Package className="w-10 h-10 text-slate-500 relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No Assets Found</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium">
                    The requested inventory search returned zero results. Verify criteria or initialize new secure assets.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
