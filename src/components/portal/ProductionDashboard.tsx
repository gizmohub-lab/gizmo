import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  AlertTriangle,
  IndianRupee,
  Search,
  Filter,
  Plus,
  Clock,
  MessageCircle,
  MoreVertical,
  CheckCircle2,
  Calendar,
  LayoutGrid,
} from 'lucide-react';
import { LocalWork, Invoice, DeadlineItem, ActiveTab } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { UpcomingDeadlinesCard } from './UpcomingDeadlinesCard';

interface ProductionDashboardProps {
  localWorks: LocalWork[];
  invoices: Invoice[];
  deadlines: DeadlineItem[];
  onCreateWork: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenDeadlineDetails: (deadline: DeadlineItem) => void;
  onOpenAddDeadlineModal: () => void;
  onOpenViewAllModal: () => void;
  onToggleCompleteDeadline: (id: string) => void;
}

export const ProductionDashboard: React.FC<ProductionDashboardProps> = ({
  localWorks,
  invoices,
  deadlines,
  onCreateWork,
  onNavigateTab,
  onOpenDeadlineDetails,
  onOpenAddDeadlineModal,
  onOpenViewAllModal,
  onToggleCompleteDeadline,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculations
  const totalValue = localWorks.reduce((sum, w) => sum + w.amount, 0);
  
  // Payment tracker: Assuming LocalWorks can be linked to Invoices
  const getPaymentStatus = (workId: string) => {
    const inv = invoices.find(i => i.localWorkId === workId);
    if (!inv) return { status: 'Unpaid', received: 0, total: workId ? 0 : 0 };
    return { status: inv.status, received: inv.receivedAmount, total: inv.grandTotal };
  };

  const filteredWorks = useMemo(() => {
    return localWorks.filter(w => {
      const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
      const matchesSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            w.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [localWorks, filterStatus, searchTerm]);

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen font-sans text-[#09090B] space-y-6 max-w-7xl mx-auto">
      {/* Header & Command Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              Gizmo Operations &amp; Production Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tighter">Production Ops</h1>
        </div>
        <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('local-works')}
              className="px-3 py-2 text-xs font-bold border border-zinc-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition"
            >
              <LayoutGrid className="w-4 h-4 text-zinc-600"/> View Works
            </button>
            <button
              onClick={onCreateWork}
              className="px-4 py-2 text-xs font-bold bg-[#FF5738] hover:bg-[#ff4220] text-white rounded-lg flex items-center gap-2 transition shadow-xs"
            >
                <Plus className="w-4 h-4"/> New Work Order
            </button>
        </div>
      </header>

      {/* 1. DASHBOARD DEADLINE HIGHLIGHT CARD (Prominently near the top) */}
      <UpcomingDeadlinesCard
        deadlines={deadlines}
        onNavigateTab={onNavigateTab}
        onOpenDeadlineDetails={onOpenDeadlineDetails}
        onOpenAddDeadlineModal={onOpenAddDeadlineModal}
        onOpenViewAllModal={onOpenViewAllModal}
        onToggleCompleteDeadline={onToggleCompleteDeadline}
      />

      {/* Cash Flow / Production Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFA]">
          <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Business Value</h3>
          <p className="text-2xl font-black mt-1">{formatINR(totalValue)}</p>
        </div>
        <div className="p-4 rounded-xl border border-[#FFB2A1] bg-[#FFF1EE]">
          <h3 className="text-[10px] font-mono font-bold text-[#FF5738] uppercase tracking-wider">Total To Get</h3>
          <p className="text-2xl font-black text-zinc-950 mt-1">{formatINR(totalValue)}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-[#ECFDF5]">
          <h3 className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">Active In Production</h3>
          <p className="text-2xl font-black text-emerald-950 mt-1">{localWorks.filter(w => w.status !== 'Completed').length} Works</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search by title, client..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border rounded-lg flex items-center gap-2 text-sm font-bold"><Filter className="w-4 h-4"/> Filter</button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAFA] border-b">
            <tr>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">ID & Title</th>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Client</th>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Deadline</th>
              <th className="text-right p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Payment</th>
              <th className="text-center p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredWorks.map(w => {
              const payment = getPaymentStatus(w.id);
              return (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="font-bold">{w.title}</div>
                    <span className="text-[10px] font-mono bg-slate-100 px-1 py-0.5 rounded">{w.id.toUpperCase()}</span>
                  </td>
                  <td className="p-3">
                      <div className="font-bold">{w.clientName}</div>
                      <button className="text-[10px] text-slate-500 underline">WhatsApp</button>
                  </td>
                  <td className="p-3 text-xs font-mono font-medium">{formatDate(w.date)}</td>
                  <td className="p-3 text-right">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100">{payment.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <button><MoreVertical className="w-4 h-4"/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
