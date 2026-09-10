import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Briefcase,
  FileText,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../../types';

export type AdminTab = ActiveTab;

interface AdminSidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  invoiceCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  invoiceCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'people', label: 'People', icon: Users },
    { id: 'local-works', label: 'Local Works', icon: Briefcase },
    {
      id: 'invoice',
      label: 'Invoice',
      icon: FileText,
      badge: invoiceCount > 0 ? invoiceCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`no-print w-64 shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between min-h-screen select-none transition-transform duration-200 z-40 fixed md:static inset-y-0 left-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-900/30">
                G
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">GIZMO</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-violet-900/70 text-violet-300 border border-violet-700/50">PORTAL</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Design &amp; Creative Studio</p>
              </div>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4">
            <div className="px-3 mb-2 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              Admin Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isInvoice = item.id === 'invoice';

                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? isInvoice
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                          : 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4.5 h-4.5 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-violet-950 text-violet-300 border border-violet-800/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Admin User Profile Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center font-bold text-white text-xs ring-2 ring-violet-400/30">
              GD
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-100 truncate">Gizmo Admin</p>
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">gizmo.hub.in@gmail.com</p>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>v2.6 Enterprise</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">India (97)</span>
        </div>
      </div>
    </aside>
  </>
);
};
