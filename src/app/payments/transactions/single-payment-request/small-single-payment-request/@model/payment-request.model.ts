export class PaymentRequest {
  id?: string;
  version?: string;
  remarks?: string;
  channelName?: string;
  corporateRefNo?: string;
  transactionDate?: string;
  valueDate?: string;
  uploadStatus?: string;
  corporateProductId?: string;
  debitAccountId?: string;
  paymentMethodId?: string;
  paymentMethodName?: string;
  debitCurrencyId?: string;
  debitCurrencyCode?: string;
  debitAmount?: string;
  payableCurrencyId?: string;
  payableCurrencyCode?: string;
  payableAmount?: string;
  totalRequest?: string;
  totalRequestAmount?: string;
  beneficiaryName?: string;
  entryType?: string;
  entryMode?: string;
  requestBy?: string;
  initiateMode?: string;
  debitAccountNo?: string;
  debitAccountBalance?: string;
  accountTitle?: string;
  status?: string;
  fxRate?: string;
  isShowDetails?: boolean;
  paymentRequestDetails?: PaymentRequestDetail[];

  constructor() {
    this.totalRequest = '1';
    this.channelName = 'WEB';
    this.status = 'Processing';
    this.beneficiaryName = '';
    this.entryType = 'SINGLE';
    this.entryMode = 'MANUAL';
    this.requestBy = 'CORPORATE';
    this.initiateMode = 'BENEFICIARYWISE';
    this.paymentMethodId = '';
    this.debitAccountId = '';
    this.valueDate = '';
    this.payableAmount = '';
    this.debitAmount = '';
    this.paymentMethodName = '';
    this.debitAccountId = '';
    this.paymentRequestDetails = [new PaymentRequestDetail()];
  }
}

export class PaymentRequestDetail {
  id?: string;
  version?: string;
  beneficiaryId?: string;
  beneficiaryCode?: string;
  beneficiaryName?: string;
  beneficiaryType?: string;
  accountNo?: string;
  payeeName?: string;
  beneficiaryAddress1?: string;
  beneficiaryAddress2?: string;
  beneficiaryAddress3?: string;
  city?: string;
  locationId?: string;
  stateId?: string;
  countryId?: string;
  pinCode?: string;
  phoneNo?: string;
  faxNo?: string;
  email?: string;
  paymentMethodId?: string;
  debitCurrencyId?: string;
  payableCurrencyId?: string;
  corporateProductId?: string;
  debitAmount?: string;
  payableAmount?: string;
  valueDate?: string;
  transactionDate?: string;
  debitAccountId?: string;
  paymentDetails1?: string;
  paymentDetails2?: string;
  paymentDetails3?: string;
  paymentDetails4?: string;
  corporateRefNo?: string;
  paymentType?: string;
  amountType?: string;
  exchangeType?: string;
  dealNo?: string;
  forwardExchangeId?: string;
  supportingDocList?: any;
  enrichments?: any;
  remarks?: string;
  paymentRequestAdditionalDetail?: PaymentRequestAdditionalDetail[];

  constructor() {
    this.beneficiaryId = '';
    this.beneficiaryCode = '';
    this.beneficiaryName = '';
    this.beneficiaryName = '';
    this.amountType = 'PAYABLE';
    this.exchangeType = 'CARD';
    this.dealNo = '';
    this.paymentDetails1 = '';
    this.paymentDetails2 = '';
    this.paymentDetails3 = '';
    this.paymentDetails4 = '';
    this.corporateRefNo = '';
    this.accountNo = '';
    this.beneficiaryAddress1 = '';
    this.beneficiaryAddress2 = '';
    this.beneficiaryAddress3 = '';
    this.pinCode = '';
    this.phoneNo = '';
    this.faxNo = '';
    this.email = '';
    this.enrichments = [];
    this.supportingDocList = [];
    this.paymentRequestAdditionalDetail = [new PaymentRequestAdditionalDetail()];
  }
}

export class PaymentRequestAdditionalDetail {
  id?: string;
  version?: string;
  beneficiaryAccountNo?: string;
  bicCodeId?: string;
  bicCode?: string;
  dispatchTo?: string;
  instrumentDispatchMode?: string;
  beneDispatchMode?: string;
  remarks?: string;

  constructor() {
    this.beneficiaryAccountNo = '';
    this.bicCode = '';
    this.bicCodeId = '';
    this.dispatchTo = 'BENEFICIARY';
    this.instrumentDispatchMode = 'EMAIL';
    this.beneDispatchMode = '';
    this.remarks = '';
  }
}
