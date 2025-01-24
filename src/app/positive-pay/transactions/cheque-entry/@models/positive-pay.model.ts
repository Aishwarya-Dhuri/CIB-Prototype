export class PositivePay {
  public totalAmount: number;
  public noOfCheques: number;
  public chequeData: ChequeDetails[];

  constructor() {
    this.totalAmount = 0;
    this.noOfCheques = 0;
    this.chequeData = [];
  }
}

export class ChequeDetails {
  public isSelected: boolean;
  public draweeId: string;
  public draweeName: string;
  public accountId: string;
  public accountName: string;
  public accountCurrency: string;
  public accountHolderName: string;
  public chequeIssueDate: string;
  public chequeAmount: string;
  public chequeNumber: string;
  public chequeImage: any[];
  public chequeImageUrl: string;
  public corporateReferenceNumber: string;
  public charges: number;
  public remarkCount: number;
  public remark1: string;
  public remark2: string;
  public remark3: string;
  public remark4: string;

  constructor() {
    this.isSelected = true;
    this.draweeId = '';
    this.draweeName = '';
    this.accountId = '';
    this.accountName = '';
    this.accountCurrency = '';
    this.accountHolderName = '';
    this.chequeIssueDate = '';
    this.chequeAmount = '';
    this.chequeNumber = '';
    this.chequeImage = [];
    this.chequeImageUrl = '';
    this.corporateReferenceNumber = '';
    this.charges = 0;
    this.remarkCount = 1;
    this.remark1 = '';
    this.remark2 = '';
    this.remark3 = '';
    this.remark4 = '';
  }
}
