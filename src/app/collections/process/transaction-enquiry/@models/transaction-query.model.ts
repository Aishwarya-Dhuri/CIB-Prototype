export class TransactionQuery {
  id: string;
  transactionDate: string;
  displayName: string;
  amount: string;
  product: string;
  paymentMethod: string;
  status: string;
  status2: string;
  userId: string;
  selectedFilters = [];
  constructor() {
    this.id = '';
    this.transactionDate = '26-Dec-2022 - 31-Jan-2023';
    this.displayName = 'Toyota Motors';
    this.amount = '';
    this.userId = '';
    this.product = 'Cheque';
    this.paymentMethod = 'Corporate Cheques';
    this.status = '';
    this.status2 = '';
  }
}
