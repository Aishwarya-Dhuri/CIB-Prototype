export class BillAcceptance {
  constructor(public rejectReason?: string) {
    this.rejectReason = '';
  }
}
export class PaymentDetails {
  constructor(
    public accountNumber?: string,
    public currencyId?: string,
    public amount?: string,
    public paymentDate?: string,
    public remarks?: string,
    public exchangeDetails?: ExchangeDetails[],
  ) {
    this.accountNumber = '';
    this.currencyId = '';
    this.amount = '';
    this.paymentDate = '';
    this.remarks = '';
    this.exchangeDetails = [new ExchangeDetails()];
  }
}
export class ExchangeDetails {
  constructor(
    public isCard: boolean = false,
    public isDealNo: boolean = false,
    public selectedDealNoRows: number = 0,
    public selectedDealData: any[] = [],
    public isForward: boolean = false,
    public selectedForwardNoRows: number = 0,
    public selectedForwardData: any[] = [],
    public remarks: string = '',
    public exchangeCurrency: string = '',
    public exchangeAmount: string = '',
  ) {}
}
