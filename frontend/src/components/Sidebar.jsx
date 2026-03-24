import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-brand-sidebar border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-brand-bg rounded-lg border border-slate-700 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-brand-accent" />
          </div>
          <div>
            <h2 className="text-white font-bold leading-tight tracking-wide">LogicAuth</h2>
            <p className="text-xs text-slate-400 font-medium">Enterprise Tracker</p>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive 
                  ? 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard Command</span>
          </NavLink>
          
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive 
                  ? 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`
            }
          >
            <Package className="w-5 h-5" />
            <span>Asset Inventory</span>
          </NavLink>

          {localStorage.getItem('userRole') === 'ROLE_ADMIN' && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive 
                    ? 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`
              }
            >
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="mt-auto p-6 text-xs text-slate-500 font-medium text-center border-t border-slate-800/50 bg-slate-900/20">
        LogicAuth Secure Systems v1.0.0
      </div>
    </div>
  );
}
