import React from 'react';
import {
  Plus,
  Settings,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface AdminNavbarProps {
  activeTab: ActiveTab;
  onCreateInvoice: () => void;
  onOpenSettings: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  onCreateInvoice,
  onOpenSettings,
  searchTerm,
  onSearchChange,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'invoice':
        return 'Invoice Management';
      case 'projects':
        return 'Projects Hub';
      case 'people':
        return 'People & Clients';
      case 'local-works':
        return 'Local Works & Print Jobs';
      case 'dashboard':
      default:
        return 'Overview Dashboard';
    }
  };

  return (
    <header
      id="admin-navbar"
      className="no-print h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Left: View title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {getTabTitle()}
            </h1>
            {activeTab === 'invoice' && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-800 border border-violet-200">
                Darul Hasaniyyah Standard
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Gizmo Design Operations &amp; Billing Workspace
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search if in invoice tab */}
        {activeTab === 'invoice' && (
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice, client, phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-lg outline-none w-64 transition"
            />
          </div>
        )}

        {/* Date Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Aug–Sep 2026</span>
        </div>

        {/* Settings button */}
        <button
          id="btn-invoice-settings"
          onClick={onOpenSettings}
          title="Invoice & Business Settings"
          className="p-2 text-slate-500 hover:text-violet-700 hover:bg-violet-50 rounded-lg border border-slate-200 transition"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Prominent + Create Invoice Button */}
        <button
          id="btn-create-invoice"
          onClick={onCreateInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm shadow-violet-600/30 transition duration-150"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Create Invoice</span>
        </button>
      </div>
    </header>
  );
};
