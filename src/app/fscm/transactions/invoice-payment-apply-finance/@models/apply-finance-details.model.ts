import { Invoice } from './invoice.model';

export class ApplyFinanceDetails {
  id?: string;
  version?: string;
  sellerDetail?: SellerBuyer[];
  buyerDetail?: SellerBuyer[];
  invoices: Invoice[];
  remarks?: string;
  genericCNIds?: string[];
  genericCNAmount?: number;
  appliedDate: string;
  noIfInvoices: number;
  totalInvoiceAmount: number;
  totalFinanceAppliedAmount: number;
  applicantId: string;
  applicantCode: string;
  applicantName: string;
  sellerBuyerId: string;
  sellerBuyerCode: string;
  sellerBuyerName: string;
  currencyName?: string;
  isReview?: boolean;

  constructor() {
    this.sellerDetail = [new SellerBuyer()];
    this.buyerDetail = [new SellerBuyer()];
    this.invoices = [];
    this.remarks = '';
    this.genericCNIds = [];
    this.genericCNAmount = 0.0;
    this.appliedDate = '';
    this.totalInvoiceAmount = 0.0;
    this.totalFinanceAppliedAmount = 0.0;
    this.applicantId = '';
    this.applicantCode = '';
    this.applicantName = '';
    this.sellerBuyerId = '';
    this.sellerBuyerCode = '';
    this.sellerBuyerName = '';
    this.currencyName = '';
    this.isReview = false;
  }
}

export class SellerBuyer {
  name?: string;
  nameInThai?: string;
  expiresOn?: string;
  availableLimit?: number;
  appliedFinanceLimit?: number;
  utilizedLimit?: number;
  availableAdhocLimit?: number;

  constructor() {
    this.name = '';
    this.nameInThai = '';
    this.expiresOn = '';
    this.availableLimit = 0.0;
    this.appliedFinanceLimit = 0.0;
    this.utilizedLimit = 0.0;
    this.availableAdhocLimit = 0.0;
  }
}
