export interface PaymentRequest {
  id?: string;
  version?: string;
  remarks?: string;
  channelName?: string;
  corporateRefNo?: string;
  transactionDate?: string;
  valueDate?: string;
  uploadStatus?: string;
  corporateProductId?: string;
  isPaperBasedTransaction?: boolean;
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
  paymentRequestDetails?: PaymentRequestDetail[];
}

export interface PaymentRequestDetail {
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
  isPaperBasedTransaction?: boolean;
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
}

export interface PaymentRequestAdditionalDetail {
  id?: string;
  version?: string;
  beneficiaryAccountNo?: string;
  bicCodeId?: string;
  bicCode?: string;
  dispatchTo?: string;
  instrumentDispatchMode?: string;
  beneDispatchMode?: string;
  remarks?: string;
}
