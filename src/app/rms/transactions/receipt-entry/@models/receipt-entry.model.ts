export class ReceiptEntry {
  programId?: string;
  programName?: string;
  entryMode?: string;
  currencyId?: string;
  corporateId?: string;
  corporateCode?: string;
  corporateName?: string;
  corporateClientId?: string;
  corporateClientCode?: string;
  corporateClientName?: string;
  status?: string;
  paymentDate?: string;
  paymentMode?: string;
  creditAccountId?: string;
  creditAccountNo?: string;
  paymentAmount?: string;
  receiptEntryDetails?: ReceiptEntryDetails[];
}
export class ReceiptEntryDetails {
  entryDate?: string;
  remarks?: string;
  paymentDate?: string;
  paymentMode?: string;
  creditAccountId?: string;
  creditAccountNo?: string;
  ccy?: string;
  paymentAmount?: string;
  paymentReference?: string;
  invoiceLink?: string;
  receiptEntryInvoiceDetails?: InvoiceDetails[];
}

export class InvoiceDetails {
  invoiceNo?: string;
  invoiceAmount?: string;
  invoiceDate?: string;
}
