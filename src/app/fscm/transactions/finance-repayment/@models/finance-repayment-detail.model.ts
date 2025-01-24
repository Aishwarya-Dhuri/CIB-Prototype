import { Invoice } from '../../invoice-payment-apply-finance/@models/invoice.model';

export class FinanceRepaymentDetail {
  id?: string;
  version?: string;
  applicantId?: string;
  applicantCode?: string;
  applicantName?: string;
  sellerBuyerId?: string;
  sellerBuyerCode?: string;
  sellerBuyerName?: string;
  currencyName?: string;
  sponsorAccountNo?: string;
  sponsorIntrestAccountNo?: string;
  sellerIntrestAccountNo?: string;
  paymentDate?: string;
  paymentMethod?: string;
  debitAccountId?: string;
  debitAccountNo?: string;
  accountBalance?: number;
  nameOnCard?: string;
  cardNumber?: string;
  cvvNumber?: string;
  expiryDate?: string;
  chequeNumber?: string;
  draftNo?: string;
  exchangeDetails?: string;
  fxRate?: string;
  dealNo?: string;
  isReview?: boolean;
  noIfInvoices?: number;
  totalInvoiceAmount?: number;
  totalFinanceAmt?: number;
  totalRepaymentAmt?: number;
  invoices?: Invoice[];

  constructor() {
    this.applicantId = '';
    this.applicantCode = '';
    this.applicantName = '';
    this.sellerBuyerId = '';
    this.sellerBuyerCode = '';
    this.sellerBuyerName = '';
    this.invoices = [];
    this.paymentMethod = 'Fund Transfer';
    this.debitAccountNo = '';
    this.debitAccountId = '';
    this.accountBalance = 0.0;
    this.nameOnCard = '';
    this.cardNumber = '';
    this.cvvNumber = '';
    this.expiryDate = '';
    this.chequeNumber = '';
    this.draftNo = '';
    this.exchangeDetails = 'CARD';
    this.fxRate = '';
    this.dealNo = '';
    this.noIfInvoices = 0.0;
    this.totalInvoiceAmount = 0.0;
    this.totalFinanceAmt = 0.0;
    this.totalRepaymentAmt = 0.0;
    this.isReview = false;
  }
}
