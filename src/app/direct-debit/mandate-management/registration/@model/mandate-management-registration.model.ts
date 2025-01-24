export class MandateManagementRegistration {
  public corporateCode: string;
  public corporateName: string;
  public productCode: string;
  public productName: string;
  public utilityCode: string;
  public customerNo: string;
  public legalId: string;

  public payerName: string;
  public payerEmailId: string;
  public payerMobileNo: string;
  public address1: string;
  public address2: string;
  public address3: string;
  public payerBank: string;
  public payerBranch: string;
  public payerSortCode: string;
  public payerAccountNumber: string;

  public supportingDocuments: any[];
  public mandateUpload: any[];
  public otherDocuments: any[];

  public mandateStartDate: string;
  public monthDate: string;
  public quarterDate: string;
  public yearDate: string;
  public mandateEndDate: string;
  public amountType: string;
  public amount: string;
  public variableAmount: string;
  public variableAmountType: string;
  public maxUpto: string;
  public inMultiply: string;
  public notAbove: string;
  public mandateType: string;
  public mandateFrequency: string;
  public mandateDays: string;
  public currencyCode: string;
  public paymentMandateDays: string;
  public paymentMandate: string;
  public mandateIfHoliday: string;
  public remark: string;

  public loanNumber: string;
  public loanAccountNumber: string;
  public enrichmentProductCode: string;
  public relationshipManager: string;

  constructor() {
    this.corporateCode = '';
    this.corporateName = '';
    this.productCode = '';
    this.productName = '';
    this.utilityCode = '';
    this.customerNo = '';
    this.legalId = '';

    this.payerName = '';
    this.payerEmailId = '';
    this.payerMobileNo = '';
    this.address1 = '';
    this.address2 = '';
    this.address3 = '';
    this.payerBank = '';
    this.payerBranch = 'ABCD';
    this.payerSortCode = '';
    this.payerAccountNumber = '';

    this.supportingDocuments = [];
    this.mandateUpload = [];
    this.otherDocuments = [];

    this.mandateStartDate = '';
    this.monthDate = '';
    this.quarterDate = '';
    this.yearDate = '';
    this.mandateEndDate = '';
    this.amountType = 'Fixed';
    this.amount = '';
    this.variableAmount = '';
    this.variableAmountType = 'Max Upto';
    this.maxUpto = '';
    this.inMultiply = '';
    this.notAbove = '';
    this.mandateType = '';
    this.mandateFrequency = '';
    this.mandateDays = '';
    this.currencyCode = '';
    this.paymentMandateDays = '';
    this.paymentMandate = '';
    this.mandateIfHoliday = '';
    this.remark = '-';

    this.loanNumber = '';
    this.loanAccountNumber = '';
    this.enrichmentProductCode = '';
    this.relationshipManager = '';
  }
}
