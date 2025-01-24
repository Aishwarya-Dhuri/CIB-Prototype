export class Invoice {
  id?: string;
  version?: string;
  batchNo?: string;
  supplierName?: string;
  dealerName?: string;
  applicantName?: string;
  number?: string;
  date?: string;
  financeAppliedDate?: string;
  amount?: string;
  currencyName?: string;
  dueDate?: string;
  dueInDays?: number;
  subDocType?: string;
  invoiceStatus?: string;
  amountPaidTillDate?: string;
  payableAmount?: number;
  totPayment?: number;
  netPayable?: number;
  partialReason?: string;
  status?: string;
  showDetails?: boolean;
  linkCN?: number;
  CNIds?: string[];
  DNIds?: string[];
  linkDN?: number;
  focused?: boolean;
  actions?: any;
  trackingId?: string;

  applicantId: string;
  applicantCode: string;
  sellerBuyerId?: string;
  sellerBuyerCode?: string;
  sellerBuyerName?: string;
  financeDate?: string;
  financeRequired?: number;
  attachments?: any[];
  financePercent?: number;
  interestRate?: number;
  reqInterestRate?: string;
  maxFinance?: number;

  repaymentAmt?: number;
  amountBeingPaid?: number;
  financeProcessedAmt?: number;
  recoverdAmt?: number;
  principalAmt?: number;
  intrestAmt?: number;
  penalIntrestAmt?: number;
  marginAmt?: number;

  financeAmount?: string;
  alreadyRecovered?: string;
  maturityDate?: string;
  repaidAmount?: string;
  outstandingPrincipleAmount?: string;
  outstandingIntrestAmount?: string;

  constructor() {
    this.linkCN = 0.0;
    this.linkDN = 0.0;
    this.CNIds = [];
    this.DNIds = [];
    this.netPayable = 0.0;
    this.partialReason = '';
    this.showDetails = false;
    this.financeRequired = 0.0;
    this.maxFinance = 0.0;
    this.totPayment = 0.0;
    this.status = 'Normal';
    this.trackingId = '';
    this.financePercent = 95.0;
    this.interestRate = 12.0;
    this.reqInterestRate = '';
    this.financeAppliedDate = '';
    this.repaymentAmt = 0.0;
    this.amountBeingPaid = 0.0;
    this.financeProcessedAmt = 0.0;
    this.recoverdAmt = 0.0;
    this.principalAmt = 0.0;
    this.intrestAmt = 0.0;
    this.penalIntrestAmt = 0.0;
    this.marginAmt = 0.0;
    this.showDetails = false;
  }
}
