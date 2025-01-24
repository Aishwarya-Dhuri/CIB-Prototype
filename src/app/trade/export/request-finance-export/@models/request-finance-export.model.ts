export class RequestFinanceExport {
  public corporateReferenceNo: string = '';
  public transactionDate: string = '';
  public typeOfPackingCredit: string = '';
  public lcNumber: string = '';
  public buyerName: string = '';
  public applicantName: string = '';
  public invoiceDate: string = '';
  public loanCurrency: string = '';
  public loanCurrencyCode: string = '';
  public loanAmount: string = '';
  public status: string = '';
  public isExchangeDetailsShow: boolean = false;
  public acceptTermsAndConditions: boolean = false;
  public loanAppliedFor: string = '';
  public applicantDetails = [new ApplicantDetails()];
  public limitDetails = [new LimitDetails()];
  public packingCreditDetails = [new PackingCreditDetails()];
  public financeDetails = [new FinanceDetails()];
  public exchangeDetails = [new ExchangeDetails()];
  public supportingDocuments = [new SupportingDocuments()];
}
export class ApplicantDetails {
  constructor(
    public applicantName: string = '',
    public applicantEmail: string = '',
    public applicantMobileNo: string = '',
    public applicantAddress: string = '',
    public ieCode: string = '',
    public cifId: string = '',
  ) {}
}

export class LimitDetails {
  constructor(
    public limitId: string = '',
    public appliedFinanceLimit: string = '',
    public utilizedLimit: string = '',
    public availableLimit: string = '',
  ) {}
}

export class PackingCreditDetails {
  constructor(
    public typeOfPackingCredit: string = '',
    public exportTransactionType: string = '',
    public radioBuyer: string = 'Search Using Buyer Code',
    public lcNumber: string = '',
    public invoiceCurrency: string = '',
    public invoiceCurrencyCode: string = '',
    public invoiceAmount: string = '',
    public invoiceNumber: string = '',
    public invoiceDate: string = '',
    public buyerName: string = '',
    public buyerAddress: string = '',
    public buyerDetails = [new BuyerDetails()],
    public lcDetails = [new LCDetails()],
  ) {}
}

export class BuyerDetails {
  constructor(
    public buyerCode: string = '',
    public country: string = '',
    public mobileNumber: string = '',
    public email: string = '',
    public bankSwiftCode: string = '',
    public bankName: string = '',
    public bankAddress: string = '',
    public buyerAccountNo: string = '',
    public pinCode: string = '',
  ) {}
}

export class LCDetails {
  constructor(
    public lcIssuanceDate: string = '',
    public lcCurrency: string = '',
    public lcAmount: string = '',
    public lcIssuingBank: string = '',
    public lcIssuingBankAddress: string = '',
  ) {}
}

export class FinanceDetails {
  constructor(
    public transactionDate: string = '',
    public purposeCode: string = '',
    public corporateReferenceNo: string = '',
    public loanCurrency: string = '',
    public loanCurrencyCode: string = '',
    public loanAmount: string = '',
    public accountToBeCredited: string = '',
    public accountToBeCreditedCurrency: string = '',
    public loanAppliedFor: string = '',
    public selectedDueDate: string = '',
  ) {}
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

export class SupportingDocuments {
  constructor(
    public isOrderInvoiceContract: boolean = false,
    public orderInvoiceContractRefNo: string = '',
    public orderInvoiceContractDocument: any[] = [],
    public isOther: boolean = false,
    public otherRefNo: string = '',
    public otherDocument: any[] = [],
    public isInsurancePolicy: boolean = false,
    public insurancePolicyRefNo: string = '',
    public insurancePolicyDocument: any[] = [],
  ) {}
}
