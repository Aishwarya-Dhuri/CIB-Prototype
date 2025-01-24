export class TemplateManagement {
  public remarks?: string;
  public channelName?: string;
  public corporateRefNo?: string;
  public transactionDate?: string;
  public valueDate?: string;
  public uploadStatus?: string;
  public corporateProductId?: string;
  public isPaperBasedTransaction?: boolean;
  public debitAccountId?: string;
  public paymentMethodId?: string;
  public paymentMethodName?: string;
  public debitCurrencyId?: string;
  public debitCurrencyCode?: string;
  public debitAmount?: string;
  public debitAccountCurrency?: string;
  public debitAccountCurrencyCode?: string;
  public payableCurrencyId?: string;
  public payableCurrencyCode?: string;
  public payableAmount?: string;
  public totalRequest?: string;
  public totalRequestAmount?: string;
  public beneficiaryName?: string;
  public beneficiaryAccountNo?: string;
  public entryType?: string;
  public entryMode?: string;
  public requestBy?: string;
  public debitAccountNo?: string;
  public debitAccountBalance?: string;
  public accountTitle?: string;
  public status?: string;
  public fxRate?: string;
  public remittancePurpose?: string;
  public templateName?: string;
  public templateType?: string;
  public charge?: string;
  public paymentRequestDetails?: PaymentRequestDetail[];

  constructor() {
    this.remarks = '';
    this.channelName = 'WEB';
    this.corporateRefNo = '';
    this.transactionDate = '';
    this.valueDate = '';
    this.uploadStatus = '';
    this.corporateProductId = '';
    this.isPaperBasedTransaction = false;
    this.debitAccountId = '';
    this.paymentMethodId = '';
    this.paymentMethodName = '';
    this.debitCurrencyId = '';
    this.debitCurrencyCode = '';
    this.debitAmount = '';
    this.debitAccountCurrency = '';
    this.debitAccountCurrencyCode = '';
    this.payableCurrencyId = '';
    this.payableCurrencyCode = '';
    this.payableAmount = '';
    this.totalRequest = '1';
    this.totalRequestAmount = '';
    this.beneficiaryName = '';
    this.beneficiaryAccountNo = '';
    this.entryType = 'SINGLE';
    this.entryMode = 'MANUAL';
    this.requestBy = 'CORPORATE';
    this.debitAccountNo = '';
    this.debitAccountBalance = '';
    this.accountTitle = '';
    this.status = 'Processing';
    this.fxRate = '';
    this.remittancePurpose = '';
    this.templateName = '';
    this.templateType = '';
    this.charge = '';
    this.paymentRequestDetails = [new PaymentRequestDetail()];
  }
}

export class PaymentRequestDetail {
  constructor(
    public beneficiaryId?: string,
    public beneficiaryCode?: string,
    public beneficiaryName?: string,
    public beneficiaryType?: string,
    public accountNo?: string,
    public payeeName?: string,
    public beneficiaryAddress1?: string,
    public beneficiaryAddress2?: string,
    public beneficiaryAddress3?: string,
    public city?: string,
    public locationId?: string,
    public stateId?: string,
    public countryId?: string,
    public pinCode?: string,
    public phoneNo?: string,
    public faxNo?: string,
    public email?: string,
    public paymentMethodId?: string,
    public debitCurrencyId?: string,
    public payableCurrencyId?: string,
    public corporateProductId?: string,
    public isPaperBasedTransaction?: boolean,
    public debitAmount?: string,
    public payableAmount?: string,
    public valueDate?: string,
    public transactionDate?: string,
    public debitAccountId?: string,
    public paymentDetails1?: string,
    public paymentDetails2?: string,
    public paymentDetails3?: string,
    public paymentDetails4?: string,
    public corporateRefNo?: string,
    public paymentType?: string,
    public amountType?: string,
    public exchangeType?: string,
    public dealNo?: string,
    public forwardExchangeId?: string,
    public supportingDocList?: any,
    public enrichments?: any,
    public remarks?: string,
    public paymentRequestAdditionalDetail?: PaymentRequestAdditionalDetail[],
  ) {
    this.beneficiaryId = '';
    this.beneficiaryCode = '';
    this.beneficiaryName = '';
    this.beneficiaryType = '';
    this.accountNo = '';
    this.payeeName = '';
    this.beneficiaryAddress1 = '';
    this.beneficiaryAddress2 = '';
    this.beneficiaryAddress3 = '';
    this.city = '';
    this.locationId = '';
    this.stateId = '';
    this.countryId = '';
    this.pinCode = '';
    this.phoneNo = '';
    this.faxNo = '';
    this.email = '';
    this.paymentMethodId = '';
    this.debitCurrencyId = '';
    this.payableCurrencyId = '';
    this.corporateProductId = '';
    this.isPaperBasedTransaction = false;
    this.debitAmount = '';
    this.payableAmount = '';
    this.valueDate = '';
    this.transactionDate = '';
    this.debitAccountId = '';
    this.paymentDetails1 = '';
    this.paymentDetails2 = '';
    this.paymentDetails3 = '';
    this.paymentDetails4 = '';
    this.corporateRefNo = '';
    this.paymentType = '';
    this.amountType = 'PAYABLE';
    this.exchangeType = 'CARD';
    this.dealNo = '';
    this.forwardExchangeId = '';
    this.supportingDocList = '';
    this.enrichments = '';
    this.remarks = '';
    this.paymentRequestAdditionalDetail = [new PaymentRequestAdditionalDetail()];
  }
}

export class PaymentRequestAdditionalDetail {
  constructor(
    public beneficiaryAccountNo?: string,
    public bicCodeId?: string,
    public bicCode?: string,
    public dispatchTo?: string,
    public instrumentDispatchMode?: string,
    public beneDispatchMode?: string,
    public remarks?: string,
  ) {
    this.beneficiaryAccountNo = '';
    this.bicCodeId = '';
    this.bicCode = '';
    this.dispatchTo = 'BENEFICIARY';
    this.instrumentDispatchMode = 'EMAIL';
    this.beneDispatchMode = '';
    this.remarks = '';
  }
}
