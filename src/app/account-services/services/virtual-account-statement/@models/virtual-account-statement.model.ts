export interface VirtualAccountStatement {
  type?: string;
  accountNo?: string;
  virtualAccountNumber?: string;
  statementPeriod?: string;
  dateRange?: string;
  transactionType?: string;
  transactionAmount?: string;
  referenceNumber?: string;
  transactionAmountFrom?: string;
  transactionAmountTo?: string;
}
