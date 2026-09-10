import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  ArrowUpRight,
  FileText,
  Calendar,
  Layers,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Project, Invoice, Client } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';

interface ProjectsViewProps {
  projects: Project[];
  invoices: Invoice[];
  clients: Client[];
  onAddProject: (project: Project) => void;
  onCreateInvoiceForProject: (project: Project) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  invoices,
  clients,
  onAddProject,
  onCreateInvoiceForProject,
  onViewInvoice,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [category, setCategory] = useState('Brand Identity');
  const [budget, setBudget] = useState<number>(5000);
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const client = clients.find((c) => c.id === clientId);
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      clientId,
      clientName: client?.name || 'Selected Client',
      category,
      budget: Number(budget) || 0,
      status: 'In Progress',
      dueDate,
      description,
      createdAt: new Date().toISOString(),
    };
    onAddProject(newProj);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div id="projects-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Design &amp; Branding Projects
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage comprehensive client design engagements and generate linked tax invoices.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const linkedInvoices = invoices.filter((inv) => inv.projectId === proj.id);
          const totalInvoiced = linkedInvoices.reduce((s, i) => s + i.grandTotal, 0);

          return (
            <div
              key={proj.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-violet-300 transition duration-150 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                    {proj.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      proj.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mb-1 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-violet-700 font-semibold mb-2">
                  {proj.clientName}
                </p>
                {proj.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {proj.description}
                  </p>
                )}

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Target Budget</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatINR(proj.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Invoiced to Date</span>
                    <span className="font-mono font-bold text-violet-700">
                      {formatINR(totalInvoiced)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-200/60">
                    <span>Due Date</span>
                    <span>{formatDate(proj.dueDate)}</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Linked Invoices Pills */}
                {linkedInvoices.length > 0 ? (
                  <div className="mb-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Linked Invoices:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {linkedInvoices.map((inv) => (
                        <button
                          key={inv.id}
                          onClick={() => onViewInvoice(inv)}
                          className="px-2 py-0.5 rounded bg-violet-100 hover:bg-violet-200 text-violet-800 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{inv.invoiceNo}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 mb-3 italic">
                    No invoice linked yet.
                  </p>
                )}

                <button
                  onClick={() => onCreateInvoiceForProject(proj)}
                  className="w-full py-2 bg-slate-100 hover:bg-violet-50 text-slate-800 hover:text-violet-800 font-bold text-xs rounded-xl border border-slate-200 hover:border-violet-200 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Invoice for Project</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Create New Project
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
              <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Brand Identity — ABC Company"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold"
                required
              >
                <option value="">-- Choose Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. UI/UX, Stationery"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Scope of work..."
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
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
