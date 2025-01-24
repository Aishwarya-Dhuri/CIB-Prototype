export class BulkPaymentUpload {
  public id?: string;
  public transactionDate: any;
  public initiateType: string;
  public uploadDocument: any[];
  public fileName: string;
  public supportingDocument: any[];
  public remarkForChecker: string;
  public channel: string;
  public status: string;
  public accountPosting: string;
  public amount: number;
  public noOfTxns: number;

  constructor() {
    this.transactionDate = new Date();
    this.initiateType = 'upload';
    this.uploadDocument = [];
    this.fileName = '';
    this.supportingDocument = [];
    this.remarkForChecker = '';
    this.channel = 'Web';
    this.status = 'S';
    this.accountPosting = 'Consolidated';
    this.amount = Math.ceil(Math.random() * 50000) + 123450;
    this.noOfTxns = Math.floor(Math.random() * 50);
  }
}

export class BulkPaymentManual {
  public id?: string;
  public initiateType: string;
  public transactionDate: string;
  public corporateReferenceNo: string;
  public noOfTransactions: string;
  public currency: string;
  public amount: string;
  public transactionType: 'paymentMethodWise' | 'beneficiaryWise';
  public transactions: BulkPaymentTransactionRequest[];

  constructor() {
    this.initiateType = 'manual';
    this.transactionDate = '';
    this.corporateReferenceNo = '';
    this.noOfTransactions = '';
    this.currency = '';
    this.amount = '';
    this.transactionType = 'paymentMethodWise';
    this.transactions = [new BulkPaymentTransactionRequest()];
  }
}

export class BulkPaymentTransactionRequest {
  public id?: string;
  public showDetails?: boolean;
  public transactionDate: string;
  public paymentMethod: string;
  public paymentMethodName: string;
  public accountId: string;
  public accountNumber: string;

  public accountTitle: string;

  public amountSelection: string;
  public debitAccountId: string;
  public debitAccountNo: string;
  public debitAccountBalance: string;
  public debitAccountCurrency: string;
  public debitAccountCurrencyCode: string;
  public payableCurrencyId: string;
  public payableCurrencyCode: string;
  public payableAmount: string;
  public debitCurrency: string;
  public debitCurrencyCode: string;
  public debitAmount: string;
  public isExchangeDetails: boolean;
  public exchangeType: string;
  public dealNumber: string;
  public fxRate: string;

  public charge: string;
  public bankSortCode: string;
  public remittanceCategoryId: string;
  public remittanceCategoryName: string;
  public remittanceCodeId: string;
  public remittanceCodeName: string;
  public remittancePurposeId: string;
  public remittancePurpose: string;
  public remittanceDetails: string;
  public remittanceDetailsName: string;
  public printBranch: string;
  public printBranchName: string;
  public instrumentNumber: string;
  public intermediateBankBicCode: string;
  public intermediateBankSortCode: string;
  public intermediateBankName: string;
  public intermediateBankBranchName: string;
  public intermediateBankAddress1: string;
  public intermediateBankAddress2: string;

  public beneficiary: string;
  public beneficiaryCode: string;
  public beneficiaryName: string;
  public beneAccount: string;
  public beneficiaryType: string;
  public beneficiaryZipCode: string;
  public beneficiaryContactNumber: string;
  public beneficiaryEmailId: string;
  public beneficiaryAddressCount: number;
  public beneficiaryAddress1: string;
  public beneficiaryAddress2: string;
  public beneficiaryAddress3: string;

  public instructionCount: number;
  public paymentInstructions1: string;
  public paymentInstructions2: string;
  public paymentInstructions3: string;
  public paymentInstructions4: string;

  public supportingDocument: any[];
  public enrichments: any[];

  constructor() {
    this.id = '';
    this.showDetails = false;
    this.paymentMethod = '';
    this.paymentMethodName = '';
    this.accountId = '';
    this.accountNumber = '';

    this.accountTitle = '';
    this.amountSelection = 'Payable Amount';
    this.debitAccountId = '';
    this.debitAccountNo = '';
    this.debitAccountBalance = '';
    this.debitAccountCurrency = '';
    this.debitAccountCurrencyCode = '';
    this.payableCurrencyId = '';
    this.payableCurrencyCode = '';
    this.payableAmount = '';
    this.debitCurrency = '';
    this.debitCurrencyCode = '';
    this.debitAmount = '';
    this.isExchangeDetails = false;
    this.exchangeType = '';
    this.dealNumber = '';
    this.fxRate = '';

    this.charge = '';
    this.bankSortCode = '';
    this.remittanceCategoryId = '';
    this.remittanceCategoryName = '';
    this.remittanceCodeId = '';
    this.remittanceCodeName = '';
    this.remittancePurposeId = '';
    this.remittancePurpose = '';
    this.remittanceDetails = '';
    this.remittanceDetailsName = '';
    this.printBranch = '';
    this.printBranchName = '';
    this.instrumentNumber = '';
    this.intermediateBankBicCode = '';
    this.intermediateBankSortCode = '';
    this.intermediateBankName = '';
    this.intermediateBankBranchName = '';
    this.intermediateBankAddress1 = '';
    this.intermediateBankAddress2 = '';

    this.beneficiary = '';
    this.beneficiaryCode = '';
    this.beneficiaryName = '';
    this.beneAccount = '';
    this.beneficiaryType = '';
    this.beneficiaryZipCode = '';
    this.beneficiaryContactNumber = '';
    this.beneficiaryEmailId = '';
    this.beneficiaryAddressCount = 1;
    this.beneficiaryAddress1 = '';
    this.beneficiaryAddress2 = '';
    this.beneficiaryAddress3 = '';

    this.instructionCount = 1;
    this.paymentInstructions1 = '';
    this.paymentInstructions2 = '';
    this.paymentInstructions3 = '';
    this.paymentInstructions4 = '';

    this.supportingDocument = [];
    this.enrichments = [];
  }
}

export class BeneficiaryDetails {
  public beneficiary: string;
  public beneficiaryCode: string;
  public beneficiaryName: string;
  public beneAccount: string;
  public beneficiaryType: string;
  public beneficiaryRemark: string;
  public beneficiaryZipCode: string;
  public beneficiaryContactNumber: string;
  public beneficiaryEmailId: string;
  public beneficiaryAddressCount: number;
  public beneficiaryAddress1: string;
  public beneficiaryAddress2: string;
  public beneficiaryAddress3: string;

  constructor() {
    this.beneficiary = '';
    this.beneficiaryCode = '';
    this.beneficiaryName = '';
    this.beneAccount = '';
    this.beneficiaryType = '';
    this.beneficiaryRemark = '';
    this.beneficiaryZipCode = '';
    this.beneficiaryContactNumber = '';
    this.beneficiaryEmailId = '';
    this.beneficiaryAddressCount = 1;
    this.beneficiaryAddress1 = '';
    this.beneficiaryAddress2 = '';
    this.beneficiaryAddress3 = '';
  }
}
