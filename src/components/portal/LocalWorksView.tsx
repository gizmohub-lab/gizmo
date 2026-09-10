import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { LocalWork, Invoice, Client } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';

interface LocalWorksViewProps {
  localWorks: LocalWork[];
  invoices: Invoice[];
  clients: Client[];
  onAddLocalWork: (work: LocalWork) => void;
  onCreateInvoiceForWork: (work: LocalWork) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const LocalWorksView: React.FC<LocalWorksViewProps> = ({
  localWorks,
  invoices,
  clients,
  onAddLocalWork,
  onCreateInvoiceForWork,
  onViewInvoice,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [workType, setWorkType] = useState('Print & Stationery');
  const [amount, setAmount] = useState<number>(350);
  const [description, setDescription] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const newWork: LocalWork = {
      id: `lw-${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim(),
      workType,
      amount: Number(amount) || 0,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      description: description.trim() || undefined,
    };

    onAddLocalWork(newWork);
    setShowModal(false);
    setTitle('');
    setClientName('');
    setDescription('');
  };

  return (
    <div id="local-works-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Local Works &amp; Rapid Print Orders
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Fast turnaround local assignments like Letterheads, Rubber Seals, Eid Posters, and Visiting Cards.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Local Work</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localWorks.map((work) => {
          const linkedInvoice = invoices.find((inv) => inv.localWorkId === work.id);

          return (
            <div
              key={work.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-violet-300 transition duration-150 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                    {work.workType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      work.status === 'Invoiced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {work.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mb-1 leading-snug">
                  {work.title}
                </h3>
                <p className="text-xs text-violet-700 font-semibold mb-2">
                  {work.clientName}
                </p>

                {work.description && (
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {work.description}
                  </p>
                )}

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs mb-4">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Quoted Amount</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatINR(work.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>Order Date</span>
                    <span>{formatDate(work.date)}</span>
                  </div>
                </div>
              </div>

              <div>
                {linkedInvoice ? (
                  <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                        Linked Invoice:
                      </span>
                      <span className="font-mono font-bold text-emerald-950 text-xs">
                        {linkedInvoice.invoiceNo}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewInvoice(linkedInvoice)}
                      className="px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onCreateInvoiceForWork(work)}
                    className="w-full py-2 bg-slate-100 hover:bg-violet-50 text-slate-800 hover:text-violet-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-violet-200 transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Generate Invoice for Work</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Local Work Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-3.5 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Add Local Work Order
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eid Poster Design / Rubber Seal"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. DARUL HASANIYYAH SNEC"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="Print & Stationery">Print &amp; Stationery</option>
                  <option value="Poster Design">Poster Design</option>
                  <option value="Rubber Seal">Rubber Seal</option>
                  <option value="Banner">Banner / Flex</option>
                  <option value="ID Cards">ID Cards</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quantity, paper specs, or design notes..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-2 bg-slate-100 font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg"
              >
                Save Work Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
