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
import { getWorkFinancials } from '../../utils/localWorkUtils';
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

  // 1. Precise Financial Calculations
  const { totalBusiness, totalGot, totalToGet, toGetCount, paidCount } = useMemo(() => {
    let biz = 0;
    let got = 0;
    let toGet = 0;
    let pendingCount = 0;
    let settledCount = 0;

    localWorks.forEach((w) => {
      const fin = getWorkFinancials(w);
      biz += fin.totalAmount;
      got += fin.amountGot;
      toGet += fin.amountToGet;
      if (fin.amountToGet > 0) pendingCount++;
      if (fin.paymentStatus === 'Paid') settledCount++;
    });

    return {
      totalBusiness: biz,
      totalGot: got,
      totalToGet: toGet,
      toGetCount: pendingCount,
      paidCount: settledCount,
    };
  }, [localWorks]);

  const filteredWorks = useMemo(() => {
    return localWorks.filter((w) => {
      const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
      const matchesSearch =
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.workId && w.workId.toLowerCase().includes(searchTerm.toLowerCase()));
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
            className="px-3 py-2 text-xs font-bold border border-zinc-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-zinc-600" /> View All Works
          </button>
          <button
            onClick={onCreateWork}
            className="px-4 py-2 text-xs font-bold bg-[#FF5738] hover:bg-[#ff4220] text-white rounded-lg flex items-center gap-2 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Work Order
          </button>
        </div>
      </header>

      {/* 1. DASHBOARD DEADLINE HIGHLIGHT CARD */}
      <UpcomingDeadlinesCard
        deadlines={deadlines}
        onNavigateTab={onNavigateTab}
        onOpenDeadlineDetails={onOpenDeadlineDetails}
        onOpenAddDeadlineModal={onOpenAddDeadlineModal}
        onOpenViewAllModal={onOpenViewAllModal}
        onToggleCompleteDeadline={onToggleCompleteDeadline}
      />

      {/* Cash Flow / Production Financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Total To Get
            </h3>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
              {toGetCount} Pending
            </span>
          </div>
          <p className="text-2xl font-black text-rose-950 font-mono mt-1">{formatINR(totalToGet)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Pending collection from clients</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Total Got
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              {paidCount} Paid
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-950 font-mono mt-1">{formatINR(totalGot)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Received via UPI, Cash &amp; Bank</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFA]">
          <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Total Billed Value
          </h3>
          <p className="text-2xl font-black mt-1 font-mono text-zinc-950">{formatINR(totalBusiness)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">{localWorks.length} total local works</p>
        </div>

        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
          <h3 className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">
            Active In Production
          </h3>
          <p className="text-2xl font-black text-blue-950 mt-1 font-mono">
            {localWorks.filter((w) => w.status !== 'Completed').length} Works
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Under design &amp; fabrication</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search by title, work ID, client..."
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-[#FF5738]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-800 bg-white"
          >
            <option value="All">All Production Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Designing">Designing</option>
            <option value="In Progress">In Progress</option>
            <option value="Printing">Printing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAFA] border-b border-zinc-200">
            <tr>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">
                Work ID &amp; Title
              </th>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Client</th>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Deadline</th>
              <th className="text-left p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Status</th>
              <th className="text-right p-3 text-[10px] font-mono font-bold uppercase text-slate-500">
                Payment (Got / To Get)
              </th>
              <th className="text-center p-3 text-[10px] font-mono font-bold uppercase text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredWorks.map((w) => {
              const fin = getWorkFinancials(w);
              return (
                <tr
                  key={w.id}
                  onClick={() => onNavigateTab('local-works')}
                  className="hover:bg-slate-50/80 cursor-pointer transition"
                >
                  <td className="p-3">
                    <div className="font-bold text-zinc-950">{w.title}</div>
                    <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {w.workId || w.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-zinc-900">{w.clientName}</div>
                    {w.clientPhone && (
                      <span className="text-[11px] text-zinc-400 font-mono">{w.clientPhone}</span>
                    )}
                  </td>
                  <td className="p-3 text-xs font-mono font-medium text-zinc-700">
                    {formatDate(w.deadlineDate || w.date)}
                  </td>
                  <td className="p-3">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {w.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-mono font-bold text-zinc-950 text-xs">
                      {formatINR(fin.totalAmount)}
                    </div>
                    <div className="text-[10px] font-mono mt-0.5 space-x-1">
                      <span className="text-emerald-700 font-semibold">Got: {formatINR(fin.amountGot)}</span>
                      <span className="text-zinc-300">·</span>
                      <span className={fin.amountToGet > 0 ? 'text-rose-600 font-bold' : 'text-zinc-400'}>
                        To Get: {formatINR(fin.amountToGet)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onNavigateTab('local-works')}
                      className="px-2 py-1 text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded transition"
                    >
                      Manage →
                    </button>
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
