export class DirectDebitAmendment {
  public corporateCode: string;
  public corporateName: string;
  public productCode: string;
  public productName: string;
  public customerNo: string;
  public legalId: string;
  public amendmentRemarks: string;

  public payerName: string;
  public payerEmailId: Amendment[];
  public payerMobileNo: Amendment[];
  public address1: Amendment[];
  public address2: Amendment[];
  public address3: Amendment[];
  public payerBank: string;
  public payerBranch: string;
  public payerSortCode: string;
  public payerAccountNumber: string;

  public supportingDocuments: any[];
  public mandateUpload: any[];
  public otherDocuments: any[];

  public mandateStartDate: string;
  public mandateEndDate: Amendment[];
  public amountType: string;
  public amount: Amendment[];
  public maxUpto: Amendment[];
  public variableAmountType: string;
  public inMultiply: Amendment[];
  public notAbove: Amendment[];
  public mandateType: string;
  public mandateFrequency: string;
  public mandateDays: string;
  public mandateIfHoliday: string;
  public remark: string;

  public loanNumber: string;
  public variableAmount: string;
  public loanAccountNumber: string;
  public enrichmentProductCode: string;
  public relationshipManager: Amendment[];

  constructor() {
    this.corporateCode = '';
    this.corporateName = '';
    this.productCode = '';
    this.productName = '';
    this.customerNo = '';
    this.legalId = '';
    this.amendmentRemarks = '';

    this.payerName = '';
    this.payerEmailId = [new Amendment()];
    this.payerMobileNo = [new Amendment()];
    this.address1 = [new Amendment()];
    this.address2 = [new Amendment()];
    this.address3 = [new Amendment()];
    this.payerBank = '';
    this.payerBranch = 'ABCD';
    this.payerSortCode = '';
    this.payerAccountNumber = '';

    this.supportingDocuments = [
      { fileName: '111', fileSize: '12' }
    ];
    this.mandateUpload = [];
    this.otherDocuments = [];

    this.mandateStartDate = '';
    this.mandateEndDate = [new Amendment()];
    this.amountType = '';
    this.amount = [new Amendment()];
    this.variableAmountType = 'Max Upto';
    this.maxUpto = [new Amendment()];
    this.inMultiply = [new Amendment()];
    this.notAbove = [new Amendment()];
    this.mandateType = '';
    this.mandateFrequency = '';
    this.mandateDays = '';
    this.mandateIfHoliday = '';
    this.remark = '-';

    this.loanNumber = '';
    this.variableAmount = '';
    this.loanAccountNumber = '';
    this.enrichmentProductCode = '';
    this.relationshipManager = [new Amendment()];
  }
}

export class Amendment {
  public value: string;
  public newValue: string;
  public remark: string;
  public showRemark: boolean;
  public amendmentRemarks: string;

  constructor() {
    this.value = '';
    this.newValue = '';
    this.remark = '';
    this.showRemark = false;
    this.amendmentRemarks = '';
  }
}
