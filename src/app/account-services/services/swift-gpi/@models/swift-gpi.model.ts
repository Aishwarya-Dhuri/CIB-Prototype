export class SearchBy {
  public uetrNumber: string;
  public accountNumber: string;
  public amount: string;
  public date: string;
  public payerName: string;
  public payeeName: string;
  public swiftCode: string;
  public bankName: string;
  public city: string;
  public creditCurrency: string;
  public bankReferenceNumber: string;
  public corporateReferenceNumber: string;
  constructor() {
    this.uetrNumber = '';
    this.accountNumber = '';
    this.amount = '';
    this.date = '';
    this.payerName = '';
    this.payeeName = '';
    this.swiftCode = '';
    this.bankName = '';
    this.city = '';
    this.creditCurrency = '';
    this.bankReferenceNumber = '';
    this.corporateReferenceNumber = '';
  }
}

export class UploadFile {
  uploadedFileName: string;
  batchNo: string;
  uploadDate: string;
  channel: string;
  uploadedBy: string;
  uploadStatus: string;
  document: any[] = [];
  constructor() {
    this.uploadedFileName = '';
    this.batchNo = '';
    this.uploadDate = '';
    this.channel = '';
    this.uploadedBy = '';
    this.uploadStatus = '';
    this.document = [];
  }
}
