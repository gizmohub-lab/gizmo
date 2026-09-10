import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Building2,
  UserCheck,
  CreditCard,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Check,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  TaxType,
  Client,
  Project,
  LocalWork,
  InvoiceSettings,
} from '../../types';
import {
  formatINR,
  calculateInvoiceTotals,
  getNextInvoiceNumber,
  getFormattedTimestamp,
} from '../../utils/formatters';

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  existingInvoices: Invoice[];
  clients: Client[];
  projects: Project[];
  localWorks: LocalWork[];
  settings: InvoiceSettings;
  onSave: (invoice: Invoice, isDraft: boolean) => void;
  onCancel: () => void;
  onOpenSettings: () => void;
  onAddNewClient: (client: Client) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
  existingInvoices,
  clients,
  projects,
  localWorks,
  settings,
  onSave,
  onCancel,
  onOpenSettings,
  onAddNewClient,
}) => {
  const isEditMode = Boolean(initialInvoice);

  // 1. Invoice Identification & Dates
  const [invoiceNo, setInvoiceNo] = useState<string>(() => {
    if (initialInvoice) return initialInvoice.invoiceNo;
    return getNextInvoiceNumber(
      existingInvoices,
      settings.numberingPrefix,
      settings.startingNumber
    );
  });

  const [invoiceDate, setInvoiceDate] = useState<string>(() => {
    if (initialInvoice) return initialInvoice.invoiceDate;
    return new Date().toISOString().split('T')[0];
  });

  const [dueDate, setDueDate] = useState<string>(() => {
    if (initialInvoice) return initialInvoice.dueDate;
    return new Date().toISOString().split('T')[0];
  });

  const [status, setStatus] = useState<InvoiceStatus>(
    initialInvoice ? initialInvoice.status : 'Pending'
  );

  // 2. Client & Billed To
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientName, setClientName] = useState<string>(
    initialInvoice?.billedTo?.clientName || ''
  );
  const [company, setCompany] = useState<string>(
    initialInvoice?.billedTo?.company || ''
  );
  const [address, setAddress] = useState<string>(
    initialInvoice?.billedTo?.address || ''
  );
  const [city, setCity] = useState<string>(
    initialInvoice?.billedTo?.city || ''
  );
  const [state, setState] = useState<string>(
    initialInvoice?.billedTo?.state || ''
  );
  const [country, setCountry] = useState<string>(
    initialInvoice?.billedTo?.country || 'India'
  );
  const [pinCode, setPinCode] = useState<string>(
    initialInvoice?.billedTo?.pinCode || ''
  );
  const [phone, setPhone] = useState<string>(
    initialInvoice?.billedTo?.phone || ''
  );
  const [email, setEmail] = useState<string>(
    initialInvoice?.billedTo?.email || ''
  );
  const [gstin, setGstin] = useState<string>(
    initialInvoice?.billedTo?.gstin || ''
  );

  // 3. Supply Info
  const [countryOfSupply, setCountryOfSupply] = useState<string>(
    initialInvoice?.supplyInfo?.countryOfSupply || 'India'
  );
  const [placeOfSupply, setPlaceOfSupply] = useState<string>(
    initialInvoice?.supplyInfo?.placeOfSupply || 'Other Territory (97)'
  );

  // 4. Tax Type & Rate
  const [taxType, setTaxType] = useState<TaxType>(
    initialInvoice?.taxType || settings.defaultTaxType || 'CGST_SGST'
  );

  // 5. Items Table
  const defaultItem: InvoiceItem = {
    id: `item-${Date.now()}-1`,
    description: '',
    gstRate: settings.defaultGstRate || 0,
    quantity: 1,
    rate: 0,
    amount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    total: 0,
  };

  const [items, setItems] = useState<InvoiceItem[]>(() => {
    if (initialInvoice && initialInvoice.items.length > 0) {
      return initialInvoice.items;
    }
    return [
      {
        id: `item-${Date.now()}-1`,
        description: 'LOGO DESIGN',
        gstRate: 0,
        quantity: 1,
        rate: 3500,
        amount: 3500,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 3500,
      },
    ];
  });

  // 6. Project & Local Work connections
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialInvoice?.projectId || ''
  );
  const [selectedLocalWorkId, setSelectedLocalWorkId] = useState<string>(
    initialInvoice?.localWorkId || ''
  );

  // 7. Payment Received & Notes
  const [receivedAmount, setReceivedAmount] = useState<number>(
    initialInvoice ? initialInvoice.receivedAmount : 0
  );
  const [notes, setNotes] = useState<string>(
    initialInvoice?.notes || 'Thank you for your business with GIZMO DESIGN!'
  );
  const [footerNote, setFooterNote] = useState<string>(
    initialInvoice?.footerNote || settings.disclaimer
  );

  // 8. Add Client Modal state
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientCompany, setNewClientCompany] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [newClientEmail, setNewClientEmail] = useState<string>('');
  const [newClientCity, setNewClientCity] = useState<string>('');
  const [newClientAddress, setNewClientAddress] = useState<string>('');

  // 9. Validation: Invoice Number uniqueness check (Section 27)
  const isInvoiceNumberDuplicate = React.useMemo(() => {
    const trimmed = invoiceNo.trim().toUpperCase();
    return existingInvoices.some((inv) => {
      if (initialInvoice && inv.id === initialInvoice.id) {
        return false;
      }
      return inv.invoiceNo.trim().toUpperCase() === trimmed;
    });
  }, [invoiceNo, existingInvoices, initialInvoice]);

  // Recalculate totals whenever items or taxType changes
  const calculatedTotals = React.useMemo(() => {
    return calculateInvoiceTotals(items, taxType);
  }, [items, taxType]);

  const balanceAmount = Math.max(
    0,
    Math.round((calculatedTotals.grandTotal - (Number(receivedAmount) || 0)) * 100) / 100
  );

  // Handle client selection from People (Section 6 & 26)
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) return;
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setClientName(client.name || '');
      setCompany(client.company || '');
      setAddress(client.address || '');
      setCity(client.city || '');
      setState(client.state || '');
      setCountry(client.country || 'India');
      setPinCode(client.pinCode || '');
      setPhone(client.phone || '');
      setEmail(client.email || '');
      setGstin(client.gstin || '');
    }
  };

  // Item row operations (Add, Duplicate, Delete, Reorder)
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: '',
      gstRate: settings.defaultGstRate || 0,
      quantity: 1,
      rate: 0,
      amount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleDuplicateItem = (index: number) => {
    const target = items[index];
    const duplicated: InvoiceItem = {
      ...target,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: `${target.description} (Copy)`,
    };
    const newItems = [...items];
    newItems.splice(index + 1, 0, duplicated);
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setItems(updated);
  };

  // Quick Preset Adders matching reference invoice
  const handleAddPreset = (desc: string, rate: number, qty = 1, gst = 0) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: desc,
      gstRate: gst,
      quantity: qty,
      rate: rate,
      amount: rate * qty,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: rate * qty,
    };
    setItems([...items, newItem]);
  };

  // Save handler
  const handleSave = (saveAsDraft: boolean) => {
    if (!invoiceNo.trim()) {
      alert('Please provide an invoice number.');
      return;
    }

    if (isInvoiceNumberDuplicate) {
      alert('Invoice number already exists. Please choose a unique invoice number.');
      return;
    }

    if (!clientName.trim()) {
      alert('Client name is required.');
      return;
    }

    // Auto update status if fully paid or draft
    let determinedStatus: InvoiceStatus = saveAsDraft ? 'Draft' : status;
    const numericReceived = Number(receivedAmount) || 0;
    if (!saveAsDraft) {
      if (numericReceived >= calculatedTotals.grandTotal && calculatedTotals.grandTotal > 0) {
        determinedStatus = 'Paid';
      } else if (numericReceived > 0 && numericReceived < calculatedTotals.grandTotal) {
        determinedStatus = 'Partially Paid';
      }
    }

    const projectObj = projects.find((p) => p.id === selectedProjectId);
    const localWorkObj = localWorks.find((lw) => lw.id === selectedLocalWorkId);

    const invoicePayload: Invoice = {
      id: initialInvoice?.id || `inv-${Date.now()}`,
      invoiceNo: invoiceNo.trim().toUpperCase(),
      invoiceDate,
      dueDate,
      status: determinedStatus,
      billedBy: { ...settings.businessProfile },
      billedTo: {
        clientName: clientName.trim(),
        company: company.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        country: country.trim() || 'India',
        pinCode: pinCode.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        gstin: gstin.trim() || undefined,
      },
      supplyInfo: {
        countryOfSupply: countryOfSupply.trim() || 'India',
        placeOfSupply: placeOfSupply.trim() || 'Other Territory (97)',
      },
      items: calculatedTotals.items,
      taxType,
      subtotal: calculatedTotals.subtotal,
      cgstTotal: calculatedTotals.cgstTotal,
      sgstTotal: calculatedTotals.sgstTotal,
      igstTotal: calculatedTotals.igstTotal,
      taxTotal: calculatedTotals.taxTotal,
      grandTotal: calculatedTotals.grandTotal,
      receivedAmount: numericReceived,
      balanceAmount: Math.max(0, calculatedTotals.grandTotal - numericReceived),
      payments: initialInvoice?.payments || [],
      paymentDetails: { ...settings.paymentConfig },
      projectId: selectedProjectId || undefined,
      projectTitle: projectObj?.title || initialInvoice?.projectTitle || undefined,
      localWorkId: selectedLocalWorkId || undefined,
      localWorkTitle: localWorkObj?.title || initialInvoice?.localWorkTitle || undefined,
      notes,
      footerNote,
      history: [
        ...(initialInvoice?.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: getFormattedTimestamp(),
          action: isEditMode
            ? `Invoice edited (${determinedStatus})`
            : saveAsDraft
            ? 'Draft created'
            : 'Invoice created & finalized',
          note: `Total: ${formatINR(calculatedTotals.grandTotal)}`,
        },
      ],
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(invoicePayload, saveAsDraft);
  };

  // Quick Client Creation
  const handleCreateNewClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: newClientName.trim(),
      company: newClientCompany.trim() || undefined,
      phone: newClientPhone.trim() || undefined,
      email: newClientEmail.trim() || undefined,
      city: newClientCity.trim() || undefined,
      address: newClientAddress.trim() || undefined,
      country: 'India',
      createdAt: new Date().toISOString(),
    };
    onAddNewClient(newClient);
    setSelectedClientId(newClient.id);
    setClientName(newClient.name);
    if (newClient.company) setCompany(newClient.company);
    if (newClient.phone) setPhone(newClient.phone);
    if (newClient.email) setEmail(newClient.email);
    if (newClient.city) setCity(newClient.city);
    if (newClient.address) setAddress(newClient.address);
    setShowAddClientModal(false);
  };

  return (
    <div id="invoice-form-view" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isEditMode ? `Edit Invoice — ${invoiceNo}` : 'Create New Invoice'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Dynamic HTML/PDF Invoice generator modeled after the Darul Hasaniyyah specification.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-save-draft"
            onClick={() => handleSave(true)}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Save as Draft
          </button>

          <button
            type="button"
            id="btn-finalize-invoice"
            onClick={() => handleSave(false)}
            disabled={isInvoiceNumberDuplicate}
            className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-600/30 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>{isEditMode ? 'Update Invoice' : 'Generate Invoice'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: INVOICE INFORMATION */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Invoice Information
            </h3>
          </div>
          <div className="text-xs text-slate-400">Section 4 · Automatic Numbering</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Invoice No */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Invoice No <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="input-invoice-number"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="e.g. A00002"
                className={`w-full px-3 py-2 bg-slate-50 border font-mono font-bold rounded-lg outline-none focus:bg-white ${
                  isInvoiceNumberDuplicate
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-rose-700'
                    : 'border-slate-200 focus:border-violet-500 text-slate-900'
                }`}
              />
            </div>
            {isInvoiceNumberDuplicate ? (
              <p className="mt-1 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Invoice number already exists.
              </p>
            ) : (
              <p className="mt-1 text-[10px] text-slate-400">
                Auto-sequenced or enter manually.
              </p>
            )}
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900 font-semibold"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 5 & 6: BILLED BY & BILLED TO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 5: BILLED BY */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                Billed By (Reusable Profile)
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-xs text-violet-700 hover:text-violet-900 font-bold flex items-center gap-1"
            >
              <span>Edit Profile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-violet-50/50 border border-violet-100 text-xs space-y-1">
            <div className="font-extrabold text-sm text-slate-900">
              {settings.businessProfile.businessName || 'GIZMO DESIGN'}
            </div>
            <p className="text-slate-600">{settings.businessProfile.address}</p>
            <p className="text-slate-600">
              {settings.businessProfile.city}, {settings.businessProfile.country}{' '}
              {settings.businessProfile.pinCode ? `· PIN: ${settings.businessProfile.pinCode}` : ''}
            </p>
            <div className="pt-1.5 flex flex-wrap gap-4 text-slate-600 font-medium">
              <span>Phone: {settings.businessProfile.phone}</span>
              <span>Email: {settings.businessProfile.email}</span>
            </div>
            {settings.businessProfile.gstin && (
              <p className="font-mono text-[11px] text-slate-500 pt-0.5">
                GSTIN: {settings.businessProfile.gstin}
              </p>
            )}
          </div>
        </div>

        {/* SECTION 6: BILLED TO (CLIENT) */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
                Billed To (Client)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowAddClientModal(true)}
              className="text-xs text-violet-700 hover:text-violet-900 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Client</span>
            </button>
          </div>

          {/* Select from existing People / Clients */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">
              Select Client from People
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900 font-semibold"
            >
              <option value="">-- Choose Existing Client from People --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. DARUL HASANIYYAH SNEC"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Company / Org</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Organization name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94471 28409"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Campus Road, Vengara"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / State</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PIN / Country</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="PIN Code"
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@email.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="32AABTD9841C1Z4"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7, 15, 16: SUPPLY INFO & PROJECT / LOCAL WORK CONNECTIONS */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Supply Information &amp; Optional Connections
            </h3>
          </div>
          <div className="text-xs text-slate-400">Sections 7, 15, 16</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Country of Supply */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Country of Supply</label>
            <input
              type="text"
              value={countryOfSupply}
              onChange={(e) => setCountryOfSupply(e.target.value)}
              placeholder="India"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Place of Supply */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Place of Supply</label>
            <input
              type="text"
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              placeholder="Other Territory (97)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900 font-medium"
            />
          </div>

          {/* Connected Project (Optional) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Link Project (Optional)
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
            >
              <option value="">-- No Project Linked --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Connected Local Work (Optional) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Link Local Work (Optional)
            </label>
            <select
              value={selectedLocalWorkId}
              onChange={(e) => setSelectedLocalWorkId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-900"
            >
              <option value="">-- No Local Work Linked --</option>
              {localWorks.map((lw) => (
                <option key={lw.id} value={lw.id}>
                  {lw.title} ({lw.workType})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 8, 9, 10: DYNAMIC INVOICE ITEMS & AUTOMATIC CALCULATIONS */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Invoice Items &amp; Calculations
            </h3>
          </div>

          {/* Tax Mode Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Tax Mode:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setTaxType('CGST_SGST')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  taxType === 'CGST_SGST'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CGST + SGST (Intra-state)
              </button>
              <button
                type="button"
                onClick={() => setTaxType('IGST')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  taxType === 'IGST'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                IGST (Inter-state / Territory)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-violet-700 text-white font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">No.</th>
                <th className="py-2.5 px-3 min-w-[200px]">Item / Description</th>
                <th className="py-2.5 px-2 w-24 text-right">GST Rate</th>
                <th className="py-2.5 px-2 w-16 text-right">Qty</th>
                <th className="py-2.5 px-2 w-28 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 w-28 text-right">Amount (₹)</th>
                {taxType === 'CGST_SGST' ? (
                  <>
                    <th className="py-2.5 px-2 w-20 text-right">CGST</th>
                    <th className="py-2.5 px-2 w-20 text-right">SGST</th>
                  </>
                ) : (
                  <th className="py-2.5 px-2 w-24 text-right">IGST</th>
                )}
                <th className="py-2.5 px-3 w-28 text-right">Total (₹)</th>
                <th className="py-2.5 px-2 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => {
                const itemAmount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                const gstRate = Number(item.gstRate) || 0;
                let cgst = 0;
                let sgst = 0;
                let igst = 0;
                if (taxType === 'CGST_SGST') {
                  cgst = (itemAmount * (gstRate / 2)) / 100;
                  sgst = (itemAmount * (gstRate / 2)) / 100;
                } else {
                  igst = (itemAmount * gstRate) / 100;
                }
                const itemTotal = itemAmount + cgst + sgst + igst;

                return (
                  <tr key={item.id} className="hover:bg-violet-50/20">
                    <td className="py-2 px-2 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>

                    {/* Description */}
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, 'description', e.target.value)
                        }
                        placeholder="e.g. LOGO DESIGN"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-violet-500 focus:bg-white text-slate-900 font-semibold"
                      />
                    </td>

                    {/* GST Rate */}
                    <td className="py-2 px-1 text-right">
                      <select
                        value={item.gstRate}
                        onChange={(e) =>
                          handleItemChange(index, 'gstRate', Number(e.target.value))
                        }
                        className="w-full px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-violet-500 font-medium text-right"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </td>

                    {/* Quantity */}
                    <td className="py-2 px-1 text-right">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', Number(e.target.value))
                        }
                        className="w-full px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-violet-500 text-right font-bold"
                      />
                    </td>

                    {/* Rate */}
                    <td className="py-2 px-1 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, 'rate', Number(e.target.value))
                        }
                        placeholder="0.00"
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-violet-500 text-right font-mono font-bold"
                      />
                    </td>

                    {/* Amount (Auto Qty * Rate) */}
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                      {formatINR(itemAmount)}
                    </td>

                    {/* Taxes */}
                    {taxType === 'CGST_SGST' ? (
                      <>
                        <td className="py-2 px-2 text-right font-mono text-slate-500">
                          {formatINR(cgst)}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-500">
                          {formatINR(sgst)}
                        </td>
                      </>
                    ) : (
                      <td className="py-2 px-2 text-right font-mono text-slate-500">
                        {formatINR(igst)}
                      </td>
                    )}

                    {/* Total */}
                    <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                      {formatINR(itemTotal)}
                    </td>

                    {/* Actions: Reorder, Duplicate, Delete */}
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="Move Up"
                          disabled={index === 0}
                          onClick={() => handleMoveItem(index, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Move Down"
                          disabled={index === items.length - 1}
                          onClick={() => handleMoveItem(index, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Duplicate Item"
                          onClick={() => handleDuplicateItem(index)}
                          className="p-1 text-slate-400 hover:text-violet-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete Item"
                          disabled={items.length <= 1}
                          onClick={() => handleDeleteItem(index)}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Item controls & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Quick Presets from Darul Hasaniyyah Reference */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleAddPreset('LOGO DESIGN', 3500, 1, 0)}
              className="px-2 py-1 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 rounded-md font-semibold text-[11px] transition"
            >
              + Logo Design (₹3,500)
            </button>
            <button
              type="button"
              onClick={() => handleAddPreset('Letter head', 150, 2, 0)}
              className="px-2 py-1 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 rounded-md font-semibold text-[11px] transition"
            >
              + Letter head (₹150)
            </button>
            <button
              type="button"
              onClick={() => handleAddPreset('Seal', 200, 1, 0)}
              className="px-2 py-1 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 rounded-md font-semibold text-[11px] transition"
            >
              + Seal (₹200)
            </button>
          </div>
        </div>

        {/* SECTION 12 & 14: PAYMENT SUMMARY & RECEIVED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Notes & Footer Note */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Invoice Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes shown on the invoice..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-800 resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Footer Disclaimer</label>
              <input
                type="text"
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                placeholder="This is an electronically generated document..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Strong Financial Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Subtotal</span>
              <span className="font-mono font-bold text-slate-800">
                {formatINR(calculatedTotals.subtotal, true)}
              </span>
            </div>

            {taxType === 'CGST_SGST' ? (
              <>
                <div className="flex justify-between items-center text-slate-600">
                  <span>CGST Total</span>
                  <span className="font-mono font-medium text-slate-800">
                    {formatINR(calculatedTotals.cgstTotal, true)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>SGST Total</span>
                  <span className="font-mono font-medium text-slate-800">
                    {formatINR(calculatedTotals.sgstTotal, true)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center text-slate-600">
                <span>IGST Total</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatINR(calculatedTotals.igstTotal, true)}
                </span>
              </div>
            )}

            <div className="h-px bg-slate-200 my-1"></div>

            {/* Total Row */}
            <div className="p-2.5 rounded-lg bg-violet-700 text-white flex justify-between items-center shadow-xs">
              <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
                Total (INR)
              </span>
              <span className="font-black text-base font-mono">
                {formatINR(calculatedTotals.grandTotal, true)}
              </span>
            </div>

            {/* Section 14: Payment Received & Balance */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block font-bold text-emerald-800 text-[11px] mb-1">
                  Received Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-emerald-50 border border-emerald-300 rounded-md font-mono font-bold text-emerald-900 outline-none"
                />
              </div>

              <div>
                <span className="block font-bold text-rose-700 text-[11px] mb-1">
                  Balance Remaining
                </span>
                <div className="px-2.5 py-1.5 bg-rose-50 border border-rose-200 rounded-md font-mono font-black text-rose-900 text-sm">
                  {formatINR(balanceAmount, true)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD NEW CLIENT (Section 6 & 26) */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                + Add New Client to People
              </h3>
              <button
                type="button"
                onClick={() => setShowAddClientModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. DARUL HASANIYYAH SNEC"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Org</label>
                <input
                  type="text"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  placeholder="e.g. Darul Hasaniyyah Educational Council"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+91 94471 28409"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@mail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address / City</label>
                <input
                  type="text"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none mb-2"
                />
                <input
                  type="text"
                  value={newClientCity}
                  onChange={(e) => setNewClientCity(e.target.value)}
                  placeholder="City (e.g. Malappuram)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddClientModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateNewClient}
                disabled={!newClientName.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-40"
              >
                Save &amp; Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
