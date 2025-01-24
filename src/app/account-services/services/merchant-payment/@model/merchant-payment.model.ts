export class MerchantPayment {
  constructor(
    public id: string = '',
    public batchNo: string = '',
    public paymentMethod: string = '',
    public merchantName: string = '',
    public transactionDate: string = '',
    public transactionAmount: string = '',
    public debitAccountNumber: string = '',
    public debitAmount: string = '',
    public status: string = '',
    public additionalInfo: string = '',
    public corporateName: string = '',
    public accountTitle: string = '',
  ) {}
}
