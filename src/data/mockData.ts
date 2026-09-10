import {
  Invoice,
  Client,
  Project,
  LocalWork,
  InvoiceSettings,
  DeadlineItem,
} from '../types';

export const defaultSettings: InvoiceSettings = {
  businessProfile: {
    businessName: 'GIZMO DESIGN',
    tagline: 'Design & Creative Studio',
    logoUrl: '',
    address: 'Creative District, Design Hub',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pinCode: '560001',
    phone: '+91 98458 79017',
    email: 'gizmo.hub.in@gmail.com',
    gstin: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
  },
  numberingPrefix: 'A',
  startingNumber: 1,
  autoNumbering: true,
  paymentConfig: {
    upiId: '9845879017-2@ybl',
    accountName: 'GIZMO DESIGN',
    bankName: 'HDFC Bank',
    accountNumber: '50200084920194',
    ifsc: 'HDFC0001234',
    instructions: 'Scan QR using any UPI app (GPay, PhonePe, Paytm, BHIM)',
  },
  defaultGstRate: 0,
  defaultTaxType: 'CGST_SGST',
  footerText: 'For any enquiry, reach out via email at gizmo.hub.in@gmail.com | Phone: +91 98458 79017',
  disclaimer: 'This is an electronically generated document, no signature is required.',
};

export const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'DARUL HASANIYYAH SNEC',
    company: 'Darul Hasaniyyah Educational Council',
    address: 'Campus Road, Vengara',
    city: 'Malappuram',
    state: 'Kerala',
    country: 'India',
    pinCode: '676304',
    phone: '+91 94471 28409',
    email: 'darulhasaniyyah.snec@gmail.com',
    gstin: '32AABTD9841C1Z4',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Apex Retail Brands',
    company: 'Apex Retail India Pvt Ltd',
    address: 'Plot 42, Industrial Zone',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pinCode: '560068',
    phone: '+91 98860 41235',
    email: 'accounts@apexretail.in',
    gstin: '29AAACA8872L1ZX',
    createdAt: '2026-07-02T11:30:00Z',
  },
  {
    id: 'client-3',
    name: 'Lumin Studio',
    company: 'Lumin Media & Architecture',
    address: '7th Cross, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pinCode: '560034',
    phone: '+91 97410 98512',
    email: 'hello@luminstudio.co',
    createdAt: '2026-07-15T09:20:00Z',
  },
  {
    id: 'client-4',
    name: 'Eid Celebration Committee',
    company: 'Community Cultural Wing',
    address: 'Town Hall Road',
    city: 'Kozhikode',
    state: 'Kerala',
    country: 'India',
    pinCode: '673001',
    phone: '+91 98460 32189',
    email: 'eidcommittee@culture.org',
    createdAt: '2026-08-01T14:15:00Z',
  },
  {
    id: 'client-5',
    name: 'Craft & Co Boutique',
    company: 'Craft & Co Lifestyle',
    address: 'Heritage Mall, Level 2',
    city: 'Mangaluru',
    state: 'Karnataka',
    country: 'India',
    pinCode: '575001',
    phone: '+91 98450 77123',
    email: 'craftco.store@gmail.com',
    createdAt: '2026-08-10T16:00:00Z',
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Brand Identity — Darul Hasaniyyah SNEC',
    clientId: 'client-1',
    clientName: 'DARUL HASANIYYAH SNEC',
    category: 'Branding & Stationery',
    budget: 4000,
    status: 'Completed',
    dueDate: '2026-08-20',
    description: 'Complete institutional identity suite including logo, letterhead, and official seals.',
    createdAt: '2026-08-05T09:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'Brand Identity — ABC Company',
    clientId: 'client-2',
    clientName: 'Apex Retail Brands',
    category: 'Corporate Identity',
    budget: 18500,
    status: 'In Progress',
    dueDate: '2026-09-25',
    description: 'Full identity redesign, package guidelines, and retail signage mockups.',
    createdAt: '2026-08-12T10:00:00Z',
  },
  {
    id: 'proj-3',
    title: 'Lumin Studio Web Platform',
    clientId: 'client-3',
    clientName: 'Lumin Studio',
    category: 'UI/UX & Web',
    budget: 32000,
    status: 'In Progress',
    dueDate: '2026-09-30',
    description: 'Portfolio CMS and interactive showcase of architectural design projects.',
    createdAt: '2026-08-18T15:00:00Z',
  },
];

export const initialLocalWorks: LocalWork[] = [
  {
    id: 'lw-1',
    title: 'Eid Poster Design',
    clientId: 'client-4',
    clientName: 'Eid Celebration Committee',
    workType: 'Poster',
    amount: 2500,
    status: 'Delivered',
    date: '2026-08-15',
    notes: 'Multi-lingual Arabic & Malayalam commemorative poster artwork for print.',
  },
  {
    id: 'lw-2',
    title: 'Institutional Seal & Letterhead Press',
    clientId: 'client-1',
    clientName: 'DARUL HASANIYYAH SNEC',
    workType: 'Seal',
    amount: 500,
    status: 'Completed',
    date: '2026-08-19',
    notes: '250gsm parchment printing and wooden rubber stamp fabrication.',
  },
  {
    id: 'lw-3',
    title: 'Craft & Co Autumn Sale Banner',
    clientId: 'client-5',
    clientName: 'Craft & Co Boutique',
    workType: 'Banner',
    amount: 3200,
    status: 'Pending',
    date: '2026-09-02',
    notes: 'Vinyl flex board 10x4 ft for showroom entrance.',
  },
];

// Primary Visual Reference Invoice (A00002) + additional invoices
export const initialInvoices: Invoice[] = [
  {
    id: 'inv-a00002',
    invoiceNo: 'A00002',
    invoiceDate: '2026-08-20',
    dueDate: '2026-08-20',
    status: 'Paid',
    billedBy: { ...defaultSettings.businessProfile },
    billedTo: {
      clientName: 'DARUL HASANIYYAH SNEC',
      company: 'Darul Hasaniyyah Educational Council',
      address: 'Campus Road, Vengara',
      city: 'Malappuram',
      state: 'Kerala',
      country: 'India',
      pinCode: '676304',
      phone: '+91 94471 28409',
      email: 'darulhasaniyyah.snec@gmail.com',
      gstin: '32AABTD9841C1Z4',
    },
    supplyInfo: {
      countryOfSupply: 'India',
      placeOfSupply: 'Other Territory (97)',
    },
    items: [
      {
        id: 'item-1',
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
      {
        id: 'item-2',
        description: 'Letter head',
        gstRate: 0,
        quantity: 2,
        rate: 150,
        amount: 300,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 300,
      },
      {
        id: 'item-3',
        description: 'Seal',
        gstRate: 0,
        quantity: 1,
        rate: 200,
        amount: 200,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 200,
      },
    ],
    taxType: 'CGST_SGST',
    subtotal: 4000,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 0,
    taxTotal: 0,
    grandTotal: 4000,
    receivedAmount: 4000,
    balanceAmount: 0,
    payments: [
      {
        id: 'pay-1',
        date: '2026-08-20',
        amount: 4000,
        method: 'UPI',
        reference: 'UPI/98458790172/294018',
        note: 'Full payment received via UPI',
      },
    ],
    paymentDetails: { ...defaultSettings.paymentConfig },
    projectId: 'proj-1',
    projectTitle: 'Brand Identity — Darul Hasaniyyah SNEC',
    localWorkId: 'lw-2',
    localWorkTitle: 'Institutional Seal & Letterhead Press',
    notes: 'Thank you for partnering with GIZMO DESIGN!',
    footerNote: 'This is an electronically generated document, no signature is required.',
    history: [
      {
        id: 'hist-1',
        timestamp: '2026-08-20 · 10:20 AM',
        action: 'Invoice created',
      },
      {
        id: 'hist-2',
        timestamp: '2026-08-20 · 10:25 AM',
        action: 'Invoice generated',
      },
      {
        id: 'hist-3',
        timestamp: '2026-08-20 · 11:10 AM',
        action: 'Payment received ₹4,000',
        note: 'Via UPI 9845879017-2@ybl',
      },
      {
        id: 'hist-4',
        timestamp: '2026-08-20 · 11:10 AM',
        action: 'Marked Paid',
      },
    ],
    createdAt: '2026-08-20T10:20:00Z',
    updatedAt: '2026-08-20T11:10:00Z',
  },
  {
    id: 'inv-a00001',
    invoiceNo: 'A00001',
    invoiceDate: '2026-08-10',
    dueDate: '2026-08-25',
    status: 'Paid',
    billedBy: { ...defaultSettings.businessProfile },
    billedTo: {
      clientName: 'Apex Retail Brands',
      company: 'Apex Retail India Pvt Ltd',
      address: 'Plot 42, Industrial Zone',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560068',
      phone: '+91 98860 41235',
      email: 'accounts@apexretail.in',
      gstin: '29AAACA8872L1ZX',
    },
    supplyInfo: {
      countryOfSupply: 'India',
      placeOfSupply: 'Karnataka (29)',
    },
    items: [
      {
        id: 'item-101',
        description: 'Brand Identity Design Phase 1',
        gstRate: 18,
        quantity: 1,
        rate: 15000,
        amount: 15000,
        cgst: 1350,
        sgst: 1350,
        igst: 0,
        total: 17700,
      },
    ],
    taxType: 'CGST_SGST',
    subtotal: 15000,
    cgstTotal: 1350,
    sgstTotal: 1350,
    igstTotal: 0,
    taxTotal: 2700,
    grandTotal: 17700,
    receivedAmount: 17700,
    balanceAmount: 0,
    payments: [
      {
        id: 'pay-2',
        date: '2026-08-14',
        amount: 17700,
        method: 'Bank Transfer',
        reference: 'NEFT/HDFC/0019284',
        note: 'Paid via Corporate Banking',
      },
    ],
    paymentDetails: { ...defaultSettings.paymentConfig },
    projectId: 'proj-2',
    projectTitle: 'Brand Identity — ABC Company',
    history: [
      {
        id: 'hist-101',
        timestamp: '2026-08-10 · 09:15 AM',
        action: 'Invoice created',
      },
      {
        id: 'hist-102',
        timestamp: '2026-08-14 · 03:30 PM',
        action: 'Payment received ₹17,700',
      },
      {
        id: 'hist-103',
        timestamp: '2026-08-14 · 03:35 PM',
        action: 'Marked Paid',
      },
    ],
    createdAt: '2026-08-10T09:15:00Z',
    updatedAt: '2026-08-14T15:35:00Z',
  },
  {
    id: 'inv-a00003',
    invoiceNo: 'A00003',
    invoiceDate: '2026-08-25',
    dueDate: '2026-09-10',
    status: 'Partially Paid',
    billedBy: { ...defaultSettings.businessProfile },
    billedTo: {
      clientName: 'Lumin Studio',
      company: 'Lumin Media & Architecture',
      address: '7th Cross, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560034',
      phone: '+91 97410 98512',
      email: 'hello@luminstudio.co',
    },
    supplyInfo: {
      countryOfSupply: 'India',
      placeOfSupply: 'Karnataka (29)',
    },
    items: [
      {
        id: 'item-201',
        description: 'Web Architecture & UI Prototyping',
        gstRate: 0,
        quantity: 1,
        rate: 20000,
        amount: 20000,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 20000,
      },
      {
        id: 'item-202',
        description: 'CMS Design & Custom Asset Library',
        gstRate: 0,
        quantity: 1,
        rate: 12000,
        amount: 12000,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 12000,
      },
    ],
    taxType: 'CGST_SGST',
    subtotal: 32000,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 0,
    taxTotal: 0,
    grandTotal: 32000,
    receivedAmount: 20000,
    balanceAmount: 12000,
    payments: [
      {
        id: 'pay-3',
        date: '2026-08-28',
        amount: 20000,
        method: 'UPI',
        reference: 'UPI/9741098512/882103',
        note: 'Advance payment of 62.5%',
      },
    ],
    paymentDetails: { ...defaultSettings.paymentConfig },
    projectId: 'proj-3',
    projectTitle: 'Lumin Studio Web Platform',
    history: [
      {
        id: 'hist-201',
        timestamp: '2026-08-25 · 11:00 AM',
        action: 'Invoice created',
      },
      {
        id: 'hist-202',
        timestamp: '2026-08-28 · 02:15 PM',
        action: 'Payment received ₹20,000',
        note: 'Balance remaining ₹12,000',
      },
    ],
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-08-28T14:15:00Z',
  },
  {
    id: 'inv-a00004',
    invoiceNo: 'A00004',
    invoiceDate: '2026-08-15',
    dueDate: '2026-08-22',
    status: 'Overdue',
    billedBy: { ...defaultSettings.businessProfile },
    billedTo: {
      clientName: 'Eid Celebration Committee',
      company: 'Community Cultural Wing',
      address: 'Town Hall Road',
      city: 'Kozhikode',
      state: 'Kerala',
      country: 'India',
      pinCode: '673001',
      phone: '+91 98460 32189',
      email: 'eidcommittee@culture.org',
    },
    supplyInfo: {
      countryOfSupply: 'India',
      placeOfSupply: 'Other Territory (97)',
    },
    items: [
      {
        id: 'item-301',
        description: 'Eid Poster Design (High-Res Vector)',
        gstRate: 0,
        quantity: 1,
        rate: 2500,
        amount: 2500,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 2500,
      },
    ],
    taxType: 'CGST_SGST',
    subtotal: 2500,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 0,
    taxTotal: 0,
    grandTotal: 2500,
    receivedAmount: 0,
    balanceAmount: 2500,
    payments: [],
    paymentDetails: { ...defaultSettings.paymentConfig },
    localWorkId: 'lw-1',
    localWorkTitle: 'Eid Poster Design',
    history: [
      {
        id: 'hist-301',
        timestamp: '2026-08-15 · 04:00 PM',
        action: 'Invoice created',
      },
      {
        id: 'hist-302',
        timestamp: '2026-08-16 · 10:00 AM',
        action: 'Sent via WhatsApp',
      },
    ],
    createdAt: '2026-08-15T16:00:00Z',
    updatedAt: '2026-08-16T10:00:00Z',
  },
  {
    id: 'inv-a00005',
    invoiceNo: 'A00005',
    invoiceDate: '2026-09-02',
    dueDate: '2026-09-16',
    status: 'Draft',
    billedBy: { ...defaultSettings.businessProfile },
    billedTo: {
      clientName: 'Craft & Co Boutique',
      company: 'Craft & Co Lifestyle',
      address: 'Heritage Mall, Level 2',
      city: 'Mangaluru',
      state: 'Karnataka',
      country: 'India',
      pinCode: '575001',
      phone: '+91 98450 77123',
      email: 'craftco.store@gmail.com',
    },
    supplyInfo: {
      countryOfSupply: 'India',
      placeOfSupply: 'Karnataka (29)',
    },
    items: [
      {
        id: 'item-401',
        description: 'Autumn Promotional Banners & Flyers',
        gstRate: 18,
        quantity: 2,
        rate: 2800,
        amount: 5600,
        cgst: 504,
        sgst: 504,
        igst: 0,
        total: 6608,
      },
    ],
    taxType: 'CGST_SGST',
    subtotal: 5600,
    cgstTotal: 504,
    sgstTotal: 504,
    igstTotal: 0,
    taxTotal: 1008,
    grandTotal: 6608,
    receivedAmount: 0,
    balanceAmount: 6608,
    payments: [],
    paymentDetails: { ...defaultSettings.paymentConfig },
    localWorkId: 'lw-3',
    localWorkTitle: 'Craft & Co Autumn Sale Banner',
    history: [
      {
        id: 'hist-401',
        timestamp: '2026-09-02 · 01:15 PM',
        action: 'Draft created',
      },
    ],
    createdAt: '2026-09-02T13:15:00Z',
    updatedAt: '2026-09-02T13:15:00Z',
  },
];

export const initialDeadlines: DeadlineItem[] = [
  {
    id: 'dl-1',
    title: 'Order #GZ-1024',
    type: 'order',
    referenceId: 'lw-3',
    clientName: 'Apex Retail Brands',
    deadlineDate: '2026-09-09',
    deadlineTime: '16:30',
    priority: 'Urgent',
    status: 'In Progress',
    description: 'Promotional vinyl signage banner and window graphics.',
    assignedTo: 'Gizmo Print Studio',
    isCompleted: false,
  },
  {
    id: 'dl-2',
    title: 'Order #GZ-1028 — Official Seal & Stationery',
    type: 'order',
    referenceId: 'lw-2',
    clientName: 'DARUL HASANIYYAH SNEC',
    deadlineDate: '2026-09-10',
    deadlineTime: '14:30',
    priority: 'Urgent',
    status: 'In Progress',
    description: '250gsm parchment printing & wooden seal stamp pressing.',
    assignedTo: 'Production Lead',
    isCompleted: false,
  },
  {
    id: 'dl-3',
    title: 'Client Project — Brand Identity',
    type: 'project',
    referenceId: 'proj-1',
    clientName: 'DARUL HASANIYYAH SNEC',
    deadlineDate: '2026-09-11',
    deadlineTime: '11:00',
    priority: 'Normal',
    status: 'In Progress',
    description: 'Master vector logo suite, typography guidelines, and letterhead artwork.',
    assignedTo: 'Lead Designer',
    isCompleted: false,
  },
  {
    id: 'dl-4',
    title: 'Lumin Studio Web Platform — CMS Delivery',
    type: 'project',
    referenceId: 'proj-3',
    clientName: 'Lumin Studio',
    deadlineDate: '2026-09-12',
    deadlineTime: '16:00',
    priority: 'Normal',
    status: 'In Progress',
    description: 'Interactive architectural showcase & project filter module.',
    assignedTo: 'Web Architect',
    isCompleted: false,
  },
  {
    id: 'dl-5',
    title: 'Invoice Settlement #A00003 — Apex Retail',
    type: 'invoice',
    referenceId: 'inv-a00003',
    clientName: 'Apex Retail Brands',
    deadlineDate: '2026-09-13',
    deadlineTime: '17:00',
    priority: 'Normal',
    status: 'Pending',
    description: 'Phase 1 corporate identity balance payment settlement.',
    assignedTo: 'Finance Ops',
    isCompleted: false,
  },
  {
    id: 'dl-6',
    title: 'Craft & Co Autumn Sale Banner Delivery',
    type: 'local-work',
    referenceId: 'lw-3',
    clientName: 'Craft & Co Boutique',
    deadlineDate: '2026-09-15',
    deadlineTime: '15:30',
    priority: 'Normal',
    status: 'Pending',
    description: '10x4 ft storefront exterior banner print & eyelet installation.',
    assignedTo: 'Field Operations',
    isCompleted: false,
  },
];

// Helper functions for persistent storage
const STORAGE_KEYS = {
  INVOICES: 'gizmo_portal_invoices_v1',
  SETTINGS: 'gizmo_portal_settings_v1',
  CLIENTS: 'gizmo_portal_clients_v1',
  PROJECTS: 'gizmo_portal_projects_v1',
  LOCAL_WORKS: 'gizmo_portal_local_works_v1',
  DEADLINES: 'gizmo_portal_deadlines_v1',
};

export function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading invoices from localStorage', e);
  }
  return initialInvoices;
}

export function saveInvoices(invoices: Invoice[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  } catch (e) {
    console.warn('Error saving invoices', e);
  }
}

export function loadSettings(): InvoiceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading settings from localStorage', e);
  }
  return defaultSettings;
}

export function saveSettings(settings: InvoiceSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving settings', e);
  }
}

export function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading clients from localStorage', e);
  }
  return initialClients;
}

export function saveClients(clients: Client[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.warn('Error saving clients', e);
  }
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading projects from localStorage', e);
  }
  return initialProjects;
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.warn('Error saving projects', e);
  }
}

export function loadLocalWorks(): LocalWork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_WORKS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading local works from localStorage', e);
  }
  return initialLocalWorks;
}

export function saveLocalWorks(works: LocalWork[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCAL_WORKS, JSON.stringify(works));
  } catch (e) {
    console.warn('Error saving local works', e);
  }
}

export function loadDeadlines(): DeadlineItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEADLINES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading deadlines from localStorage', e);
  }
  return initialDeadlines;
}

export function saveDeadlines(deadlines: DeadlineItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DEADLINES, JSON.stringify(deadlines));
  } catch (e) {
    console.warn('Error saving deadlines', e);
  }
}

