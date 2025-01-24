export class AmendInvoiceEntry {
  constructor(
    public batchNo: string = '',
    public sponsorId: string = '',
    public sponsorCode: string = '',
    public sponsorName: string = '',
    public sellerBuyerId: string = '',
    public sellerBuyerCode: string = '',
    public sellerBuyerName: string = '',
    public productCategory: string = '',
    public productReferenceNumber: string = '',
    public entitySubCodeId: string = '',
    public entitySubCode: string = '',
    public entitySubCodeDescription: string = '',
    public invoiceType: string = '',
    public invoiceNumber: string = '',
    public invoiceEntryDate: string = '',
    public invoiceDate: string = '',
    public invoiceDueDate: string = '',
    public invoiceCurrency: string = '',
    public invoiceAmount: string = '',
    public totalPos: string = '',
    public amount: string = '',
    public totalInvoices: string = '',
    public enrtyMode: string = '',
    public recordCount: number = 1,
    public supplierId: string = '',
    public supplierCode: string = '',
    public supplierName: string = '',
    public dealerId: string = '',
    public dealerCode: string = '',
    public dealerName: string = '',
    public applicantId: string = '',
    public applicantCode: string = '',
    public applicantName: string = '',
    public allowPartialUpload: boolean = false,
    public fileDownloaded: boolean = false,
    public totalInvAmount: string = '',
    public totalInvBaseAmount: string = '',
    public custSubType: string = '',
    public invoiceDetails: AmendInvoiceDetails[] = [new AmendInvoiceDetails()],
    public invoiceEnrich: AmendInvoiceEntryEnrichment[] = [],
    public poDetails: PurchaseOrder[] = [new PurchaseOrder()],
    public itemDetails: ItemDetails[] = [],
    public totalProductItems: number = 0,
    public totalAmount: number = 0,
  ) {}
}

export class AmendInvoiceDetails {
  constructor(
    public batchNo: string = '',
    public invoiceNumber: string = '',
    public invoiceEntryDate: string = '',
    public invoiceDate: string = '',
    public invoiceDueDays: string = '',
    public invoiceDueDate: string = '',
    public invoiceCurrency: string = '',
    public invoiceAmount: Amendment[] = [new Amendment()],
    public subDocType: Amendment[] = [new Amendment()],
    public allocationNumber: Amendment[] = [new Amendment()],
    public paymentTerms: string = '',
    public vatPercentage: string = '',
    public vatAmount: string = '',
    public invoiceOutstandingAmount: string = '',
    public whtPercentage: string = '',
    public whtCalculatedOn: string = '',
    public whtAmount: string = '',
    public totalPayableAmount: string = '',
    public billingAddress: Amendment[] = [new Amendment()],
    public remarks: Amendment[] = [new Amendment()],
    public supportingDocument: any[] = [],

    public entryDate: string = '',
    public programRefId: string = '1',
    public supplierId: string = '',
    public supplierCode: string = '',
    public supplierName: string = '',
    public dealerId: string = '',
    public dealerCode: string = '',
    public dealerName: string = '',
    public applicantId: string = '',
    public applicantCode: string = '',
    public applicantName: string = '',
    public NPADate: string = '',
    public baseAmount: string = '',
    public number: string = '',
    public date: string = '',
    public dueDate: string = '',
    public financeAppliedDate: string = '',
    public amount: string = '',
    public acceptanceDate: string = '',
    public appliedAmt: string = '',
    public currencyName: string = '',
    public productName: string = '',
    public productType: string = '',
    public programRefName: string = '',
    public corpSellerCode: string = '',
    public invAmountCurr: string = '',
    public invDueDays: string = '',
    public invOutstandingAmount: string = '',
    public vatAmt: string = '',
    public whtAmt: string = '',
    public whtCalculateCon: string = '',
    public totPayment: string = '',
    public trackingCode: string = '',
    public groupPayDate: string = '',
    public invoiceType: string = '',
    public financeProcessedAmt: string = '',
    public maturityDate: string = '',
    public repaymentAmt: string = '',
    public recoverdAmt: string = '',
    public principalAmt: string = '',
    public intrestAmt: string = '',
    public penalIntrestAmt: string = '',
    public marginAmt: string = '',
    public uploadType: string = '',
    public gracePeriod: string = '-',
    public entitySubCode: string = '',
    public entitySubCodeDescThai: string = '',
    public custSubType: string = '',
    public sellerBuyerId: string = '',
    public sellerBuyerCode: string = '',
    public sellerBuyerName: string = '',
    public status: string = '',
    public invoiceEnrichDetails: any[] = [],
    public entryMode: string = '',
    public npastatus: string = '',
  ) {}
}

export class AmendInvoiceEntryEnrichment {
  constructor() {}
}
export class POEnrichment {
  constructor() {}
}

export class PurchaseOrder {
  constructor(
    public batchNo: string = '',
    public poNumber: string = '',
    public poDate: string = '',
    public poAmount: string = '',
    public poDueDate: string = '',

    public number: string = '',
    public date: string = '',
    public amount: string = '',
    public dueDate: string = '',
    public poEnrichDetails: POEnrichment[] = [],
  ) {}
}

export class ItemDetails {
  constructor(
    public productId: string = '',
    public productDescription: string = '',
    public quantity: string = '',
    public um: string = '',
    public unitPrice: string = '',
    public amount: string = '',
  ) {}
}

export class Amendment {
  public value: string;
  public newValue: string;
  public remark: string;
  public showRemark: boolean;

  constructor() {
    this.value = '';
    this.newValue = '';
    this.remark = '';
    this.showRemark = false;
  }
}
