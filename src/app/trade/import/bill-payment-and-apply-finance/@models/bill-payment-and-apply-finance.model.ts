export class BillPaymentAndApplyFinance {
  constructor(
    public paymentOptions?: string,
    public userRefNo?: string,
    public tradeBillNumber?: string,
    public tradeBillDate?: string,
    public tradeBillDueDate?: string,
    public draftAt?: string,
    public daDp?: string,
    public lcNumber?: string,
    public lcIssueDate?: string,
    public lcExpiryDate?: string,
    public billReject?: string,
    public billAmount?: string,
    public billDueDate?: string,
    public discrepant?: string,
    public paymentOption?: string,
    public financed?: string,
    public status?: string,
    public exporterBeneficiary?: string,
    public importerApplicantName?: string,
    public usanceOrSight?: string,
    public supportingDocuments = [new SupportingDocuments()],
    public paymentDetails = [],
    public financeDetails = [new FinanceDetails()],
  ) {}
}
export class SupportingDocuments {
  constructor(
    public lcIrrevocable: boolean = false,
    public lcIrrevocableRefNo: string = '',
    public lcIrrevocableDocument: any[] = [],
    public proformaInvoice: boolean = false,
    public proformaInvoiceRefNo: string = '',
    public proformaInvoiceDocument: any[] = [],
  ) {}
}

export class PaymentDetails {
  constructor(
    public paymentDetailId: string = '',
    public debitAccount: string = '',
    public paymentCurrency: string = '',
    public paymentAmount: string = '',
    public paymentDate: string = '',
    public exchangeDetail: string = 'Card',
    public debitAmount: string = '',
    public debitCurrency: string = '',
    public dealNo: string = '',
    public remarks: string = '',
  ) {}
}

export class FinanceDetails {
  constructor(
    public creditAccount: string = '',
    public loanCurrency: string = '',
    public restByLoan: string = '',
    public financeAmount: string = '',
    public financeCurrency: string = '',
    public interestRate: string = '',
    public tenor: string = '',
    public remarks: string = '',
  ) {}
}
