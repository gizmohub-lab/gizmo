import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from './components/layout/AdminSidebar';
import { AdminNavbar } from './components/layout/AdminNavbar';
import { InvoiceDashboard } from './components/invoice/InvoiceDashboard';
import { InvoiceList } from './components/invoice/InvoiceList';
import { InvoiceForm } from './components/invoice/InvoiceForm';
import { InvoicePreviewModal } from './components/invoice/InvoicePreviewModal';
import { InvoiceSettingsModal } from './components/invoice/InvoiceSettingsModal';
import { PaymentModal } from './components/invoice/PaymentModal';
import { ShareModal } from './components/invoice/ShareModal';
import { DashboardView } from './components/portal/DashboardView';
import { ProjectsView } from './components/portal/ProjectsView';
import { PeopleView } from './components/portal/PeopleView';
import { LocalWorksView } from './components/portal/LocalWorksView';
import {
  Invoice,
  Client,
  Project,
  LocalWork,
  InvoiceSettings,
  InvoiceStatus,
  PaymentRecord,
} from './types';
import {
  loadInvoices,
  saveInvoices,
  loadClients,
  saveClients,
  loadProjects,
  saveProjects,
  loadLocalWorks,
  saveLocalWorks,
  loadSettings,
  saveSettings,
} from './data/mockData';
import { getFormattedTimestamp, formatINR } from './utils/formatters';
import { generateInvoicePDF } from './utils/pdfGenerator';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>('invoice');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States with localStorage persistence
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadInvoices());
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [localWorks, setLocalWorks] = useState<LocalWork[]>(() => loadLocalWorks());
  const [settings, setSettings] = useState<InvoiceSettings>(() => loadSettings());

  // Invoicing Views & Modals State
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [shareInvoice, setShareInvoice] = useState<Invoice | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sync with LocalStorage on changes
  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveLocalWorks(localWorks);
  }, [localWorks]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Invoice Actions
  const handleStartCreateInvoice = () => {
    setEditingInvoice(null);
    setIsCreatingInvoice(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsCreatingInvoice(true);
    setPreviewInvoice(null);
  };

  const handleSaveInvoice = (invoicePayload: Invoice, isDraft: boolean) => {
    if (editingInvoice) {
      // Update existing
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoicePayload.id ? invoicePayload : inv))
      );
    } else {
      // Create new
      setInvoices((prev) => [invoicePayload, ...prev]);
    }
    setIsCreatingInvoice(false);
    setEditingInvoice(null);
    // Show newly created invoice in preview modal
    setPreviewInvoice(invoicePayload);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
      if (previewInvoice?.id === invoiceId) {
        setPreviewInvoice(null);
      }
    }
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const updated: Invoice = {
            ...inv,
            status: 'Paid',
            receivedAmount: inv.grandTotal,
            balanceAmount: 0,
            history: [
              ...inv.history,
              {
                id: `hist-${Date.now()}`,
                timestamp: getFormattedTimestamp(),
                action: 'Marked as Fully Paid',
                note: `Settled in full: ${formatINR(inv.grandTotal)}`,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
          if (previewInvoice?.id === invoiceId) {
            setPreviewInvoice(updated);
          }
          return updated;
        }
        return inv;
      })
    );
  };

  const handleRecordPayment = (
    invoiceId: string,
    amount: number,
    record: PaymentRecord
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newReceived = (inv.receivedAmount || 0) + amount;
          const newBalance = Math.max(0, inv.grandTotal - newReceived);
          let newStatus: InvoiceStatus = inv.status;

          if (newBalance <= 0) {
            newStatus = 'Paid';
          } else if (newReceived > 0) {
            newStatus = 'Partially Paid';
          }

          const updated: Invoice = {
            ...inv,
            receivedAmount: newReceived,
            balanceAmount: newBalance,
            status: newStatus,
            payments: [...(inv.payments || []), record],
            history: [
              ...inv.history,
              {
                id: `hist-${Date.now()}`,
                timestamp: getFormattedTimestamp(),
                action: `Payment recorded (${record.method})`,
                note: `Received: ${formatINR(amount)} via ${record.method}${
                  record.reference ? ` (Ref: ${record.reference})` : ''
                }`,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
          if (previewInvoice?.id === invoiceId) {
            setPreviewInvoice(updated);
          }
          return updated;
        }
        return inv;
      })
    );
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    await generateInvoicePDF(invoice);
  };

  // Cross-Navigation Shortcuts
  const handleCreateInvoiceForProject = (project: Project) => {
    const clientObj = clients.find((c) => c.id === project.clientId);
    const prefilledInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: project.dueDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
      billedBy: { ...settings.businessProfile },
      billedTo: {
        clientName: project.clientName,
        company: clientObj?.company || undefined,
        address: clientObj?.address || undefined,
        city: clientObj?.city || undefined,
        state: clientObj?.state || undefined,
        country: clientObj?.country || 'India',
        pinCode: clientObj?.pinCode || undefined,
        phone: clientObj?.phone || undefined,
        email: clientObj?.email || undefined,
        gstin: clientObj?.gstin || undefined,
      },
      supplyInfo: {
        countryOfSupply: 'India',
        placeOfSupply: 'Other Territory (97)',
      },
      taxType: settings.defaultTaxType,
      items: [
        {
          id: `item-${Date.now()}-1`,
          description: project.title.toUpperCase(),
          gstRate: settings.defaultGstRate || 0,
          quantity: 1,
          rate: project.budget,
          amount: project.budget,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: project.budget,
        },
      ],
      subtotal: project.budget,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
      taxTotal: 0,
      grandTotal: project.budget,
      receivedAmount: 0,
      balanceAmount: project.budget,
      payments: [],
      projectId: project.id,
      projectTitle: project.title,
      paymentDetails: { ...settings.paymentConfig },
      notes: `Invoice for project: ${project.title}`,
      footerNote: settings.disclaimer,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(prefilledInvoice);
    setIsCreatingInvoice(true);
    setActiveTab('invoice');
  };

  const handleCreateInvoiceForClient = (client: Client) => {
    const prefilledInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      billedBy: { ...settings.businessProfile },
      billedTo: {
        clientName: client.name,
        company: client.company || undefined,
        address: client.address || undefined,
        city: client.city || undefined,
        state: client.state || undefined,
        country: client.country || 'India',
        pinCode: client.pinCode || undefined,
        phone: client.phone || undefined,
        email: client.email || undefined,
        gstin: client.gstin || undefined,
      },
      supplyInfo: {
        countryOfSupply: 'India',
        placeOfSupply: 'Other Territory (97)',
      },
      taxType: settings.defaultTaxType,
      items: [
        {
          id: `item-${Date.now()}-1`,
          description: 'CREATIVE DESIGN SERVICES',
          gstRate: settings.defaultGstRate || 0,
          quantity: 1,
          rate: 3500,
          amount: 3500,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 3500,
        },
      ],
      subtotal: 3500,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
      taxTotal: 0,
      grandTotal: 3500,
      receivedAmount: 0,
      balanceAmount: 3500,
      payments: [],
      paymentDetails: { ...settings.paymentConfig },
      notes: 'Thank you for your business with GIZMO DESIGN!',
      footerNote: settings.disclaimer,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(prefilledInvoice);
    setIsCreatingInvoice(true);
    setActiveTab('invoice');
  };

  const handleCreateInvoiceForLocalWork = (work: LocalWork) => {
    const clientObj = clients.find(
      (c) => c.name.toLowerCase() === work.clientName.toLowerCase()
    );

    const prefilledInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      billedBy: { ...settings.businessProfile },
      billedTo: {
        clientName: work.clientName,
        company: clientObj?.company || undefined,
        address: clientObj?.address || undefined,
        city: clientObj?.city || undefined,
        state: clientObj?.state || undefined,
        country: clientObj?.country || 'India',
        pinCode: clientObj?.pinCode || undefined,
        phone: clientObj?.phone || undefined,
        email: clientObj?.email || undefined,
        gstin: clientObj?.gstin || undefined,
      },
      supplyInfo: {
        countryOfSupply: 'India',
        placeOfSupply: 'Other Territory (97)',
      },
      taxType: settings.defaultTaxType,
      items: [
        {
          id: `item-${Date.now()}-1`,
          description: work.title.toUpperCase(),
          gstRate: 0,
          quantity: 1,
          rate: work.amount,
          amount: work.amount,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: work.amount,
        },
      ],
      subtotal: work.amount,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
      taxTotal: 0,
      grandTotal: work.amount,
      receivedAmount: 0,
      balanceAmount: work.amount,
      payments: [],
      localWorkId: work.id,
      localWorkTitle: work.title,
      paymentDetails: { ...settings.paymentConfig },
      notes: `Local Work Order: ${work.title}`,
      footerNote: settings.disclaimer,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(prefilledInvoice);
    setIsCreatingInvoice(true);
    setActiveTab('invoice');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navigation Bar */}
      <AdminNavbar
        activeTab={activeTab}
        onCreateInvoice={handleStartCreateInvoice}
        onOpenSettings={() => setShowSettingsModal(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Studio Frame */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Admin Sidebar (Section 1) */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsCreatingInvoice(false);
          }}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              invoices={invoices}
              projects={projects}
              localWorks={localWorks}
              clients={clients}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onCreateInvoice={handleStartCreateInvoice}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              invoices={invoices}
              clients={clients}
              onAddProject={(proj) => setProjects([proj, ...projects])}
              onCreateInvoiceForProject={handleCreateInvoiceForProject}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 3: PEOPLE */}
          {activeTab === 'people' && (
            <PeopleView
              clients={clients}
              invoices={invoices}
              onAddClient={(client) => setClients([client, ...clients])}
              onCreateInvoiceForClient={handleCreateInvoiceForClient}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 4: LOCAL WORKS */}
          {activeTab === 'local-works' && (
            <LocalWorksView
              localWorks={localWorks}
              invoices={invoices}
              clients={clients}
              onAddLocalWork={(work) => setLocalWorks([work, ...localWorks])}
              onCreateInvoiceForWork={handleCreateInvoiceForLocalWork}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 5: INVOICE (DEDICATED INVOICE WORKSPACE) */}
          {activeTab === 'invoice' && (
            <>
              {isCreatingInvoice ? (
                <InvoiceForm
                  initialInvoice={editingInvoice}
                  existingInvoices={invoices}
                  clients={clients}
                  projects={projects}
                  localWorks={localWorks}
                  settings={settings}
                  onSave={handleSaveInvoice}
                  onCancel={() => {
                    setIsCreatingInvoice(false);
                    setEditingInvoice(null);
                  }}
                  onOpenSettings={() => setShowSettingsModal(true)}
                  onAddNewClient={(newClient) => setClients([newClient, ...clients])}
                />
              ) : (
                <div className="space-y-6 max-w-6xl mx-auto pb-12">
                  {/* Section 2: Invoice Dashboard Top Summary Cards */}
                  <InvoiceDashboard invoices={invoices} />

                  {/* Section 3: Invoice List Table with Filters & Actions */}
                  <InvoiceList
                    invoices={invoices}
                    onCreateInvoice={handleStartCreateInvoice}
                    onViewInvoice={(inv) => setPreviewInvoice(inv)}
                    onEditInvoice={handleEditInvoice}
                    onRecordPayment={(inv) => setPaymentInvoice(inv)}
                    onShareInvoice={(inv) => setShareInvoice(inv)}
                    onDownloadPdf={handleDownloadPdf}
                    onDeleteInvoice={handleDeleteInvoice}
                    onOpenSettings={() => setShowSettingsModal(true)}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL 1: INVOICE PREVIEW MODAL (Full HTML/PDF Document matching Darul Hasaniyyah Reference) */}
      <InvoicePreviewModal
        invoice={previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onEdit={(inv) => handleEditInvoice(inv)}
        onRecordPayment={(inv) => setPaymentInvoice(inv)}
        onShare={(inv) => setShareInvoice(inv)}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {/* MODAL 2: INVOICE SETTINGS MODAL (Business Profile, Numbering, UPI, GST, Footer) */}
      {showSettingsModal && (
        <InvoiceSettingsModal
          settings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* MODAL 3: RECORD PAYMENT MODAL (Section 14) */}
      <PaymentModal
        invoice={paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onRecordPayment={handleRecordPayment}
      />

      {/* MODAL 4: SHARE INVOICE MODAL (WhatsApp, Email, Copy Text, Direct PDF) */}
      <ShareModal
        invoice={shareInvoice}
        onClose={() => setShareInvoice(null)}
      />
    </div>
  );
}
