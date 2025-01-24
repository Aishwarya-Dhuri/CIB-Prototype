export class ManualReconciliation {
  matchId?: string;
  program?: string;
  corporateName?: string;
  corporateClientName?: string;
  status?: string;
  lastAction?: string;
  totalInvoiceAmount?: string;
  totalInvoices?: string;
  totalPaymentAmount?: string;
  totalPayments?: string;
  invoiceDetails?: InvoiceDetails[];
  paymentDetails?: PaymentDetails[];
}

export class InvoiceDetails {}

export class PaymentDetails {}
