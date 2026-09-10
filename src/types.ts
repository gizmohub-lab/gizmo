export type InvoiceStatus =
  | 'Draft'
  | 'Sent'
  | 'Pending'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue'
  | 'Cancelled';

export type TaxType = 'CGST_SGST' | 'IGST';

export interface Client {
  id: string;
  name: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  avatar?: string;
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  category: string;
  budget: number;
  status: 'In Progress' | 'Completed' | 'Review' | 'Planning';
  dueDate: string;
  description?: string;
  createdAt: string;
}

export interface LocalWork {
  id: string;
  title: string;
  clientId?: string;
  clientName: string;
  workType: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Delivered' | 'Invoiced';
  priority?: 'Normal' | 'Urgent';
  assignedTo?: string;
  date: string;
  notes?: string;
  description?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  gstRate: number; // e.g. 0, 5, 12, 18, 28
  quantity: number;
  rate: number;
  amount: number; // quantity * rate
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface InvoiceHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer' | 'Cash' | 'Cheque';
  reference?: string;
  note?: string;
}

export interface BusinessProfile {
  businessName: string;
  tagline?: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  email: string;
  gstin?: string;
  pan?: string;
}

export interface PaymentConfig {
  upiId: string;
  accountName: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  instructions?: string;
}

export interface SupplyInfo {
  countryOfSupply: string;
  placeOfSupply: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string; // e.g. A00002
  invoiceDate: string; // YYYY-MM-DD or readable
  dueDate: string;
  status: InvoiceStatus;
  
  billedBy: BusinessProfile;
  billedTo: {
    clientName: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    phone?: string;
    email?: string;
    gstin?: string;
  };
  
  supplyInfo: SupplyInfo;
  items: InvoiceItem[];
  
  taxType: TaxType;
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  grandTotal: number;
  
  receivedAmount: number;
  balanceAmount: number;
  payments: PaymentRecord[];
  
  paymentDetails: PaymentConfig;
  
  projectId?: string;
  projectTitle?: string;
  localWorkId?: string;
  localWorkTitle?: string;
  
  notes?: string;
  footerNote?: string;
  history: InvoiceHistoryItem[];
  
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSettings {
  businessProfile: BusinessProfile;
  numberingPrefix: string;
  startingNumber: number;
  autoNumbering: boolean;
  paymentConfig: PaymentConfig;
  defaultGstRate: number;
  defaultTaxType: TaxType;
  footerText: string;
  disclaimer: string;
}

export type ActiveTab = 'dashboard' | 'projects' | 'people' | 'local-works' | 'invoice';

export type DeadlineUrgency = 'NORMAL' | 'APPROACHING' | 'URGENT' | 'DUE_NOW' | 'OVERDUE';

export interface DeadlineItem {
  id: string;
  title: string;
  type: 'project' | 'local-work' | 'order' | 'task' | 'invoice' | 'custom';
  referenceId?: string;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime: string; // HH:mm
  priority?: 'Normal' | 'Urgent';
  status?: string;
  relatedUrl?: string;
  clientName?: string;
  description?: string;
  assignedTo?: string;
  isCompleted?: boolean;
}
