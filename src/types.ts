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

export type LocalWorkStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting for Client'
  | 'Revision'
  | 'Ready'
  | 'Completed'
  | 'Cancelled'
  | 'Pending'
  | 'Delivered'
  | 'Invoiced';

export type LocalWorkPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type PaymentStatus =
  | 'Not Paid'
  | 'Partially Paid'
  | 'Paid'
  | 'Overpaid'
  | 'Pending'
  | 'Not Applicable';

export interface LocalWorkPaymentRecord {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  method?: 'UPI' | 'Cash' | 'Bank Transfer' | 'GPay' | 'PhonePe' | 'Card' | 'Other';
  note?: string;
  reference?: string;
  recordedAt?: string;
}

export interface LocalWorkAttachment {
  id: string;
  name: string;
  type: string;
  size?: string;
  category?: 'Design reference' | 'Client image' | 'Brief' | 'Final design' | 'Other';
  url?: string;
  uploadedAt: string;
}

export interface LocalWorkRevision {
  revisionNo: number;
  date: string;
  note?: string;
}

export interface LocalWorkHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
}

export type DesignerType = 'Portal Staff' | 'External Designer';

export interface CustomDesigner {
  id: string;
  name: string;
  type: DesignerType;
  phone?: string;
  whatsapp?: string;
  email?: string;
  roleSpecialization?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface DesignCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface WorkTypeItem {
  id: string;
  name: string; // 'Poster' | 'Motion' | 'Other' | custom
  description?: string;
  isActive: boolean;
  isSystemDefault?: boolean;
  isSystem?: boolean;
}

export type LocalWorksSubTab = 'all-works' | 'categories' | 'designers' | 'settings';

export interface LocalWork {
  id: string;
  workId?: string; // e.g. "LW-0001"
  title: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  clientWhatsApp?: string;
  clientOrg?: string;
  clientLocation?: string;
  workType: string; // 'Poster' | 'Motion' | 'Other' or custom
  otherWorkTypeDetail?: string; // when 'Other' selected: Admin entered detail
  category?: string; // Design Work Category, distinct from workType
  totalAmount?: number; // The full amount charged for the work
  amount: number; // Maintained for backward compatibility (= totalAmount)
  amountGot?: number; // The amount already received
  amountToGet?: number; // Automatically calculated: Total Amount - Amount Got
  paymentStatus?: PaymentStatus; // Automatically calculated: Not Paid, Partially Paid, Paid, Overpaid
  paymentRecords?: LocalWorkPaymentRecord[]; // Ledger of received payments
  status: LocalWorkStatus;
  priority?: LocalWorkPriority;
  assignedTo?: string; // Primary Designer
  supportingDesigners?: string[]; // Optional supporting designer(s)
  date: string; // Received date YYYY-MM-DD
  receivedDate?: string;
  deadlineDate?: string; // YYYY-MM-DD
  deadlineTime?: string; // HH:mm or 04:30 PM
  notes?: string;
  description?: string;
  attachments?: LocalWorkAttachment[];
  revisionCount?: number;
  revisions?: LocalWorkRevision[];
  history?: LocalWorkHistoryItem[];
  invoiceId?: string;
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

export type AppRoute =
  | 'home'
  | 'services'
  | 'work'
  | 'about'
  | 'my-projects'
  | 'admin'
  | 'admin-dashboard'
  | 'admin-projects'
  | 'admin-clients'
  | 'admin-local-works'
  | 'admin-invoices'
  | 'admin-settings';

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'urgent' | 'deadline' | 'payment' | 'project' | 'info';
  targetRoute?: AppRoute;
  targetId?: string;
}

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
