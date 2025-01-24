export interface AccountStatement {
  type?: string;
  accountNo?: string;
  iBan?: string;
  statementPeriod?: string;
  dateRange?: string;
  transactionType?: string;
  transactionAmount?: string;
  referenceNumber?: string;
  transactionAmountFrom?: string;
  transactionAmountTo?: string;
}
