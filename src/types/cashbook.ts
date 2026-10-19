export type CashTransactionType = 'pemasukan' | 'pengeluaran';

export type PaymentMethod = 'Tunai' | 'Transfer Bank' | 'QRIS' | 'Tempo';

export type InvoicePaymentStatus = 'Lunas' | 'Tempo';

export interface CashTransaction {
  id: string;
  date: string;
  time: string;
  type: CashTransactionType;
  category: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  invoiceId?: string;
}

export interface SalesInvoiceItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface SalesInvoice {
  id: string;
  buyerName: string;
  buyerPhone?: string;
  date: string;
  time: string;
  items: SalesInvoiceItem[];
  subtotal: number;
  discount: number;
  finalAmount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: InvoicePaymentStatus;
  notes?: string;
}
