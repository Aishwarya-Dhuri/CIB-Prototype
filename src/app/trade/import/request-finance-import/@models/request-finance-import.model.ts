export class RequestFinanceImport {
  public corporateReferenceNo: string = '';
  public transactionDate: string = '';
  public purposeCode: string = '';
  public loanAppliedFor: string = '';
  public selectedDueDate: string = '';
  public accountToBeCredited: string = '';
  public accountToBeCreditedCurrency: string = '';
  public applicantName: string = '';
  public loanCurrency: string = '';
  public loanCurrencyCode: string = '';
  public loanAmount: string = '';
  public status: string = '';
  public isExchangeDetailsShow: boolean = false;
  public acceptTermsAndConditions: boolean = false;
  public applicantDetails = [new ApplicantDetails()];
  public limitDetails = [new LimitDetails()];
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
    public isTypeNumber1: boolean = false,
    public typeNumber1RefNo: string = '',
    public typeNumber1Document: any[] = [],
    public isTypeNumber2: boolean = false,
    public typeNumber2RefNo: string = '',
    public typeNumber2Document: any[] = [],
  ) {}
}
