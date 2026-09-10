import React from 'react';
import {
  FolderKanban,
  Users,
  Briefcase,
  FileText,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Invoice, Project, LocalWork, Client, DeadlineItem, ActiveTab } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { UpcomingDeadlinesCard } from './UpcomingDeadlinesCard';

interface DashboardViewProps {
  invoices: Invoice[];
  projects: Project[];
  localWorks: LocalWork[];
  clients: Client[];
  deadlines?: DeadlineItem[];
  onNavigateTab: (tab: ActiveTab) => void;
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onOpenDeadlineDetails?: (deadline: DeadlineItem) => void;
  onOpenAddDeadlineModal?: () => void;
  onOpenViewAllModal?: () => void;
  onToggleCompleteDeadline?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  projects,
  localWorks,
  clients,
  deadlines = [],
  onNavigateTab,
  onCreateInvoice,
  onViewInvoice,
  onOpenDeadlineDetails = () => {},
  onOpenAddDeadlineModal = () => {},
  onOpenViewAllModal = () => {},
  onToggleCompleteDeadline = () => {},
}) => {
  const finalizedInvoices = invoices.filter((i) => i.status !== 'Draft' && i.status !== 'Cancelled');
  const totalBilled = finalizedInvoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalCollected = finalizedInvoices.reduce((s, i) => s + (i.receivedAmount || 0), 0);
  const pendingCollection = finalizedInvoices.reduce(
    (s, i) => (i.status === 'Paid' ? s : s + (i.balanceAmount || 0)),
    0
  );

  return (
    <div id="dashboard-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-violet-200 uppercase tracking-wider">
                GIZMO DESIGN STUDIO
              </span>
              <span className="text-xs text-violet-300 font-mono">Live Operations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Studio Financials &amp; Work Management
            </h2>
            <p className="text-xs sm:text-sm text-violet-200/90 max-w-xl">
              Unified control panel for client invoices, branding projects, fast print works, and UPI collections.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('invoice')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition backdrop-blur-xs flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Invoicing Hub</span>
            </button>

            <button
              onClick={onCreateInvoice}
              className="px-4 py-2.5 bg-violet-500 hover:bg-violet-400 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-950/50 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD DEADLINE HIGHLIGHT CARD */}
      <UpcomingDeadlinesCard
        deadlines={deadlines}
        onNavigateTab={onNavigateTab}
        onOpenDeadlineDetails={onOpenDeadlineDetails}
        onOpenAddDeadlineModal={onOpenAddDeadlineModal}
        onOpenViewAllModal={onOpenViewAllModal}
        onToggleCompleteDeadline={onToggleCompleteDeadline}
      />

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
            <span>Total Invoiced</span>
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {formatINR(totalBilled)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{finalizedInvoices.length} billed orders</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
            <span>Collected (Paid)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">
            {formatINR(totalCollected)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">UPI &amp; Bank settlements</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
            <span>Active Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {projects.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Corporate &amp; institutional</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700 font-mono">
            {formatINR(pendingCollection)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting client payment</p>
        </div>
      </div>

      {/* Two Column Section: Recent Invoices & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (Cols 1-2): Recent Invoices Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Recent Invoices
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('invoice')}
              className="text-xs text-violet-700 hover:text-violet-900 font-bold flex items-center gap-1"
            >
              <span>View All Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <th className="pb-2">Invoice</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onViewInvoice(inv)}
                    className="hover:bg-violet-50/30 cursor-pointer transition"
                  >
                    <td className="py-2.5 font-mono font-bold text-violet-700">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-2.5 font-semibold text-slate-900">
                      {inv.billedTo.clientName}
                    </td>
                    <td className="py-2.5 text-slate-500">{formatDate(inv.invoiceDate)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      {formatINR(inv.grandTotal)}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (Col 3): Fast Local Works & People Shortcuts */}
        <div className="space-y-4">
          {/* Local Works Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Local Works
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('local-works')}
                className="text-xs text-violet-700 font-bold hover:underline"
              >
                View
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {localWorks.slice(0, 3).map((lw) => (
                <div
                  key={lw.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-800">{lw.title}</p>
                    <p className="text-[11px] text-slate-400">{lw.clientName}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatINR(lw.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Client Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  People / Clients
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('people')}
                className="text-xs text-violet-700 font-bold hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {clients.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.city || 'India'}</p>
                  </div>
                  <span className="text-[10px] text-violet-700 font-mono font-semibold">
                    {c.phone || 'No phone'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
