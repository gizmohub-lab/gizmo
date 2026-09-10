import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomeView } from './components/public/HomeView';
import { ServicesView } from './components/public/ServicesView';
import { WorkView } from './components/public/WorkView';
import { AboutView } from './components/public/AboutView';
import { MyProjectsView } from './components/public/MyProjectsView';
import { PublicFooter } from './components/public/PublicFooter';
import { StartProjectModal } from './components/public/StartProjectModal';
import { InvoiceDashboard } from './components/invoice/InvoiceDashboard';
import { InvoiceList } from './components/invoice/InvoiceList';
import { InvoiceForm } from './components/invoice/InvoiceForm';
import { InvoicePreviewModal } from './components/invoice/InvoicePreviewModal';
import { InvoiceSettingsModal } from './components/invoice/InvoiceSettingsModal';
import { PaymentModal } from './components/invoice/PaymentModal';
import { ShareModal } from './components/invoice/ShareModal';
import { ProductionDashboard } from './components/portal/ProductionDashboard';
import { ProjectsView } from './components/portal/ProjectsView';
import { PeopleView } from './components/portal/PeopleView';
import { LocalWorksView } from './components/portal/LocalWorksView';
import { DeadlinesManagerModal } from './components/portal/DeadlinesManagerModal';
import { DeadlineDetailModal } from './components/portal/DeadlineDetailModal';
import {
  Invoice,
  Client,
  Project,
  LocalWork,
  InvoiceSettings,
  InvoiceStatus,
  PaymentRecord,
  DeadlineItem,
  AppRoute,
  AdminNotification,
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
  loadDeadlines,
  saveDeadlines,
  loadCategories,
  saveCategories,
} from './data/mockData';
import { getFormattedTimestamp, formatINR } from './utils/formatters';
import { generateInvoicePDF } from './utils/pdfGenerator';
import { convertLocalWorkToDeadlineItem, generateNextWorkId } from './utils/localWorkUtils';

function pathToRoute(path: string): AppRoute {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
  if (cleanPath === '/' || cleanPath === '/home') return 'home';
  if (cleanPath === '/services') return 'services';
  if (cleanPath === '/work') return 'work';
  if (cleanPath === '/about') return 'about';
  if (cleanPath === '/my-projects' || cleanPath === '/projects-client') return 'my-projects';
  if (cleanPath === '/admin' || cleanPath === '/admin/dashboard') return 'admin-dashboard';
  if (cleanPath === '/admin/projects' || cleanPath.startsWith('/admin/projects/') || cleanPath.startsWith('/admin/orders/')) return 'admin-projects';
  if (cleanPath === '/admin/clients' || cleanPath === '/admin/people') return 'admin-clients';
  if (cleanPath === '/admin/local-works' || cleanPath === '/admin/works') return 'admin-local-works';
  if (cleanPath === '/admin/invoices' || cleanPath === '/admin/invoice') return 'admin-invoices';
  if (cleanPath === '/admin/settings') return 'admin-settings';
  return 'home';
}

function routeToPath(route: AppRoute): string {
  switch (route) {
    case 'home':
      return '/';
    case 'services':
      return '/services';
    case 'work':
      return '/work';
    case 'about':
      return '/about';
    case 'my-projects':
      return '/my-projects';
    case 'admin':
    case 'admin-dashboard':
      return '/admin/dashboard';
    case 'admin-projects':
      return '/admin/projects';
    case 'admin-clients':
      return '/admin/clients';
    case 'admin-local-works':
      return '/admin/local-works';
    case 'admin-invoices':
      return '/admin/invoices';
    case 'admin-settings':
      return '/admin/settings';
    default:
      return '/';
  }
}

export default function App() {
  // Navigation State with Zero-Refresh Browser History Sync
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return pathToRoute(window.location.pathname);
    }
    return 'home';
  });

  const [showStartProjectModal, setShowStartProjectModal] = useState(false);
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');

  // Live Notifications State for Director CRM
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: 'notif-1',
      title: 'Urgent Local Work Delivery',
      message: 'Grand Opening Star Flex Board order is due for production today.',
      timestamp: '15m ago',
      read: false,
      type: 'warning',
      route: 'admin-local-works',
    },
    {
      id: 'notif-2',
      title: 'Invoice Balance Due',
      message: 'Invoice #GIZ-2025-001 has ₹12,500 pending collection.',
      timestamp: '1h ago',
      read: false,
      type: 'alert',
      route: 'admin-invoices',
    },
    {
      id: 'notif-3',
      title: 'Identity System Approved',
      message: 'Malabar Heritage Visual Identity approved by client account.',
      timestamp: '4h ago',
      read: true,
      type: 'success',
      route: 'admin-projects',
    },
  ]);

  // Core Data States with localStorage persistence
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadInvoices());
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [localWorks, setLocalWorks] = useState<LocalWork[]>(() => loadLocalWorks());
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [settings, setSettings] = useState<InvoiceSettings>(() => loadSettings());
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => loadDeadlines());

  // Deadline Modals State
  const [showDeadlinesModal, setShowDeadlinesModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineItem | null>(null);
  const [showDeadlineDetailModal, setShowDeadlineDetailModal] = useState(false);

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
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveDeadlines(deadlines);
  }, [deadlines]);

  // Synchronize LocalWorks to Deadlines so the Dashboard Upcoming Deadlines highlight card / alarm displays them
  useEffect(() => {
    setDeadlines((prevDeadlines) => {
      let changed = false;
      const nextDeadlines = [...prevDeadlines];

      localWorks.forEach((work) => {
        const existingIdx = nextDeadlines.findIndex(
          (d) => d.referenceId === work.id || d.id === `dl-${work.id}`
        );
        const converted = convertLocalWorkToDeadlineItem(work);

        if (existingIdx !== -1) {
          const curr = nextDeadlines[existingIdx];
          if (
            curr.title !== converted.title ||
            curr.deadlineDate !== converted.deadlineDate ||
            curr.deadlineTime !== converted.deadlineTime ||
            curr.isCompleted !== converted.isCompleted ||
            curr.priority !== converted.priority ||
            curr.status !== converted.status
          ) {
            nextDeadlines[existingIdx] = {
              ...curr,
              ...converted,
            };
            changed = true;
          }
        } else {
          nextDeadlines.unshift(converted);
          changed = true;
        }
      });

      return changed ? nextDeadlines : prevDeadlines;
    });
  }, [localWorks]);

  // Local Works CRUD Handlers
  const handleAddLocalWork = (newWork: LocalWork) => {
    setLocalWorks((prev) => [newWork, ...prev]);
  };

  const handleUpdateLocalWork = (updatedWork: LocalWork) => {
    setLocalWorks((prev) => prev.map((w) => (w.id === updatedWork.id ? updatedWork : w)));
  };

  const handleDeleteLocalWork = (id: string) => {
    setLocalWorks((prev) => prev.filter((w) => w.id !== id));
    setDeadlines((prev) => prev.filter((d) => d.referenceId !== id && d.id !== `dl-${id}`));
  };

  const handleDuplicateLocalWork = (work: LocalWork) => {
    const nextId = generateNextWorkId(localWorks);
    const duplicated: LocalWork = {
      ...work,
      id: `lw-${Date.now()}`,
      workId: nextId,
      title: `${work.title} (Copy)`,
      status: 'New',
      revisionCount: 0,
      revisions: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: `10 Sep 2026 · 11:35 AM`,
          action: `Duplicated from ${work.workId || work.id}`,
        },
      ],
    };
    setLocalWorks((prev) => [duplicated, ...prev]);
  };

  const handleImportWorks = (newWorks: LocalWork[]) => {
    setLocalWorks((prev) => [...newWorks, ...prev]);
  };

  const handleSaveCategories = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const pendingLocalWorksCount = localWorks.filter(
    (w) => w.status !== 'Completed' && w.status !== 'Cancelled'
  ).length;

  // Navigation & History Sync Engine
  const navigate = (route: AppRoute, replace = false) => {
    setCurrentRoute(route);
    setIsCreatingInvoice(false);
    const targetPath = routeToPath(route);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ route }, '', targetPath);
      } else {
        window.history.pushState({ route }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = pathToRoute(window.location.pathname);
      setCurrentRoute(route);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Deadline Operations
  const handleAddDeadline = (newDl: DeadlineItem) => {
    setDeadlines([newDl, ...deadlines]);
  };

  const handleUpdateDeadline = (updated: DeadlineItem) => {
    setDeadlines(deadlines.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter((d) => d.id !== id));
  };

  const handleToggleCompleteDeadline = (id: string) => {
    setDeadlines(
      deadlines.map((d) =>
        d.id === id ? { ...d, isCompleted: !d.isCompleted } : d
      )
    );
  };

  const handleOpenDeadlineDetails = (deadline: DeadlineItem) => {
    setSelectedDeadline(deadline);
    setShowDeadlineDetailModal(true);
  };

  const handleStartEditFromDetail = (deadline: DeadlineItem) => {
    setShowDeadlineDetailModal(false);
    setShowDeadlinesModal(true);
  };

  // Invoice Actions
  const handleStartCreateInvoice = () => {
    setEditingInvoice(null);
    setIsCreatingInvoice(true);
    navigate('admin-invoices');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsCreatingInvoice(true);
    setPreviewInvoice(null);
    navigate('admin-invoices');
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
    navigate('admin-invoices');
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
    navigate('admin-invoices');
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
    navigate('admin-invoices');
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
    navigate('admin-invoices');
  };

  const isAdminRoute = currentRoute.startsWith('admin');

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans antialiased selection:bg-[#FF5738] selection:text-white">
      {isAdminRoute ? (
        /* ========================================================================= */
        /* TIER 2: ADMIN / DIRECTOR CRM SHELL (`AdminLayout`)                        */
        /* ========================================================================= */
        <AdminLayout
          currentRoute={currentRoute}
          onNavigate={navigate}
          pendingLocalWorksCount={pendingLocalWorksCount}
          pendingInvoicesCount={
            invoices.filter((i) => i.status === 'Pending' || i.status === 'Draft').length
          }
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onLogout={() => navigate('home')}
          onOpenSettings={() => setShowSettingsModal(true)}
          onCreateInvoice={handleStartCreateInvoice}
          searchTerm={invoiceSearchTerm}
          onSearchChange={setInvoiceSearchTerm}
        >
          {/* TAB 1: DASHBOARD */}
          {currentRoute === 'admin-dashboard' && (
            <ProductionDashboard
              localWorks={localWorks}
              invoices={invoices}
              deadlines={deadlines}
              onCreateWork={() => navigate('admin-local-works')}
              onNavigateTab={(tab) => {
                if (tab === 'dashboard') navigate('admin-dashboard');
                else if (tab === 'projects') navigate('admin-projects');
                else if (tab === 'people') navigate('admin-clients');
                else if (tab === 'local-works') navigate('admin-local-works');
                else if (tab === 'invoice') navigate('admin-invoices');
              }}
              onOpenDeadlineDetails={handleOpenDeadlineDetails}
              onOpenAddDeadlineModal={() => setShowDeadlinesModal(true)}
              onOpenViewAllModal={() => setShowDeadlinesModal(true)}
              onToggleCompleteDeadline={handleToggleCompleteDeadline}
            />
          )}

          {/* TAB 2: PROJECTS */}
          {currentRoute === 'admin-projects' && (
            <ProjectsView
              projects={projects}
              invoices={invoices}
              clients={clients}
              onAddProject={(proj) => setProjects([proj, ...projects])}
              onCreateInvoiceForProject={handleCreateInvoiceForProject}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 3: CLIENTS / PEOPLE */}
          {currentRoute === 'admin-clients' && (
            <PeopleView
              clients={clients}
              invoices={invoices}
              onAddClient={(client) => setClients([client, ...clients])}
              onCreateInvoiceForClient={handleCreateInvoiceForClient}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 4: LOCAL WORKS */}
          {currentRoute === 'admin-local-works' && (
            <LocalWorksView
              localWorks={localWorks}
              invoices={invoices}
              clients={clients}
              categories={categories}
              onAddLocalWork={handleAddLocalWork}
              onUpdateLocalWork={handleUpdateLocalWork}
              onDeleteLocalWork={handleDeleteLocalWork}
              onDuplicateLocalWork={handleDuplicateLocalWork}
              onSaveCategories={handleSaveCategories}
              onImportWorks={handleImportWorks}
              onCreateInvoiceForWork={handleCreateInvoiceForLocalWork}
              onViewInvoice={(inv) => setPreviewInvoice(inv)}
            />
          )}

          {/* TAB 5: INVOICES WORKSPACE */}
          {currentRoute === 'admin-invoices' && (
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
                  <InvoiceDashboard invoices={invoices} />
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
                    searchTerm={invoiceSearchTerm}
                    onSearchChange={setInvoiceSearchTerm}
                  />
                </div>
              )}
            </>
          )}

          {/* TAB 6: ADMIN SETTINGS SUMMARY */}
          {currentRoute === 'admin-settings' && (
            <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
                <div>
                  <h2 className="text-xl font-black text-zinc-950 tracking-tight">Studio Configuration &amp; Operations</h2>
                  <p className="text-xs text-zinc-500 mt-1">Manage corporate entity, GSTIN registration, UPI payment accounts, and invoice terms.</p>
                </div>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2.5 bg-[#FF5738] hover:bg-[#ff4220] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Edit Studio Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Business Entity</span>
                  <div className="font-black text-base text-zinc-900">{settings.businessProfile.name}</div>
                  <div className="text-zinc-600 leading-relaxed">{settings.businessProfile.address}</div>
                  <div className="font-mono text-zinc-500 pt-1">GSTIN: {settings.businessProfile.gstin}</div>
                  <div className="text-zinc-500">Phone: {settings.businessProfile.phone}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider">UPI &amp; Digital Banking</span>
                  <div className="font-black text-base text-zinc-900">{settings.paymentConfig.upiId}</div>
                  <div className="text-zinc-600">Bank: {settings.paymentConfig.bankName}</div>
                  <div className="font-mono text-zinc-500">A/C: {settings.paymentConfig.accountNumber}</div>
                  <div className="font-mono text-zinc-500">IFSC: {settings.paymentConfig.ifsc}</div>
                </div>
              </div>
            </div>
          )}
        </AdminLayout>
      ) : (
        /* ========================================================================= */
        /* TIER 1: PUBLIC CLIENT PORTAL TIER (`Navbar` + Views + `PublicFooter`)     */
        /* ========================================================================= */
        <div className="min-h-screen flex flex-col bg-white text-zinc-900">
          <Navbar
            currentRoute={currentRoute}
            onNavigate={navigate}
            activeProjectsCount={projects.filter((p) => p.status !== 'Completed').length || 3}
            onOpenStartProject={() => setShowStartProjectModal(true)}
          />

          <main className="flex-1 pt-16 sm:pt-20">
            {currentRoute === 'home' && (
              <HomeView
                onNavigate={navigate}
                onOpenStartProject={() => setShowStartProjectModal(true)}
                activeProjectsCount={projects.filter((p) => p.status !== 'Completed').length || 3}
              />
            )}

            {currentRoute === 'services' && (
              <ServicesView
                onNavigate={navigate}
                onOpenStartProject={() => setShowStartProjectModal(true)}
              />
            )}

            {currentRoute === 'work' && (
              <WorkView
                onNavigate={navigate}
                onOpenStartProject={() => setShowStartProjectModal(true)}
              />
            )}

            {currentRoute === 'about' && (
              <AboutView
                onNavigate={navigate}
                onOpenStartProject={() => setShowStartProjectModal(true)}
              />
            )}

            {currentRoute === 'my-projects' && (
              <MyProjectsView
                projects={projects}
                onNavigate={navigate}
                onOpenStartProject={() => setShowStartProjectModal(true)}
              />
            )}
          </main>

          <PublicFooter
            onNavigate={navigate}
            onOpenStartProject={() => setShowStartProjectModal(true)}
          />
        </div>
      )}

      {/* ========================================================================= */
      /* GLOBAL UNIFIED MODALS                                                      */
      /* ========================================================================= */}
      <InvoicePreviewModal
        invoice={previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onEdit={(inv) => handleEditInvoice(inv)}
        onRecordPayment={(inv) => setPaymentInvoice(inv)}
        onShare={(inv) => setShareInvoice(inv)}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {showSettingsModal && (
        <InvoiceSettingsModal
          settings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      <PaymentModal
        invoice={paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onRecordPayment={handleRecordPayment}
      />

      <ShareModal
        invoice={shareInvoice}
        onClose={() => setShareInvoice(null)}
      />

      <DeadlinesManagerModal
        isOpen={showDeadlinesModal}
        onClose={() => setShowDeadlinesModal(false)}
        deadlines={deadlines}
        clients={clients}
        onAddDeadline={handleAddDeadline}
        onUpdateDeadline={handleUpdateDeadline}
        onDeleteDeadline={handleDeleteDeadline}
        onNavigateTab={(tab) => {
          if (tab === 'dashboard') navigate('admin-dashboard');
          else if (tab === 'projects') navigate('admin-projects');
          else if (tab === 'people') navigate('admin-clients');
          else if (tab === 'local-works') navigate('admin-local-works');
          else if (tab === 'invoice') navigate('admin-invoices');
        }}
      />

      <DeadlineDetailModal
        deadline={selectedDeadline}
        isOpen={showDeadlineDetailModal}
        onClose={() => {
          setShowDeadlineDetailModal(false);
          setSelectedDeadline(null);
        }}
        onEdit={(dl) => handleStartEditFromDetail(dl)}
        onToggleComplete={handleToggleCompleteDeadline}
        onNavigateTab={(tab) => {
          if (tab === 'dashboard') navigate('admin-dashboard');
          else if (tab === 'projects') navigate('admin-projects');
          else if (tab === 'people') navigate('admin-clients');
          else if (tab === 'local-works') navigate('admin-local-works');
          else if (tab === 'invoice') navigate('admin-invoices');
        }}
      />

      <StartProjectModal
        isOpen={showStartProjectModal}
        onClose={() => setShowStartProjectModal(false)}
        onProjectCreated={(newProject) => {
          setProjects([newProject, ...projects]);
          navigate('my-projects');
        }}
      />
    </div>
  );
}
