import { Invoice } from './invoice.model';

export class PayNowDetails {
  id?: string;
  version?: string;
  genericCNIds: string[];
  genericDNIds: string[];
  paymentDate: string;
  paymentDetail: string;
  DebitAccountNo: string;
  availableBalance: string;
  dealNumber: string;
  exchangeDetails: string;
  fxRate: string;
  genericCNAmount: number;
  genericDNAmount: number;
  discount: number;
  taxCharges: number;
  subTotal: number;
  totalPayableAmount: number;
  netPayable: number;
  noIfInvoices: number;
  invoices: Invoice[];
  isReview: boolean;
  trackingId?: string;
  applicantId?: string;
  applicantCode?: string;
  applicantName?: string;
  sellerBuyerId?: string;
  sellerBuyerName?: string;
  sellerBuyerCode?: string;
  totalInvoiceAmount?: number;
  currencyName?: string;

  constructor() {
    this.genericCNIds = [];
    this.genericDNIds = [];
    this.paymentDate = '';
    this.paymentDetail = '';
    this.DebitAccountNo = '';
    this.dealNumber = '';
    this.exchangeDetails = 'CARD';
    this.fxRate = '7.90';
    this.genericCNAmount = 0.0;
    this.genericDNAmount = 0.0;
    this.discount = 0.0;
    this.taxCharges = 0.0;
    this.subTotal = 0.0;
    this.totalPayableAmount = 0.0;
    this.netPayable = 0.0;
    this.noIfInvoices = 0;
    this.trackingId = '';
    this.invoices = [];
    this.applicantId = '';
    this.applicantCode = '';
    this.applicantName = '';
    this.isReview = false;
  }
}
