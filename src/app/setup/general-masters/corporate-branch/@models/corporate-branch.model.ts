export class CorporateBranch {
  public corporateName: string;
  public corporateBranchCode: string;
  public corporateBranchName: string;
  public branchAddressCount: number;
  public branchAddress1: string;
  public branchAddress2: string;
  public branchAddress3: string;
  public locationName: string;
  public pinCode: string;
  public city: string;
  public state: string;
  public country: string;
  public telNo: string;
  public faxNo: string;
  public emailId: string;
  public contactInfo: ContactInfo[];
  public printerAvailable: string;
  public printBranch: string;
  public printBranchName: string;
  public effectiveFrom: string;
  public effectiveTill: string;
  public noOfInstrumentPerPage: string;

  constructor() {
    this.corporateName = '';
    this.corporateBranchCode = '';
    this.corporateBranchName = '';
    this.branchAddressCount = 1;
    this.branchAddress1 = '';
    this.branchAddress2 = '';
    this.branchAddress3 = '';
    this.locationName = '';
    this.pinCode = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.telNo = '';
    this.faxNo = '';
    this.emailId = '';
    this.contactInfo = [new ContactInfo()];
    this.printerAvailable = '';
    this.printBranch = '';
    this.printBranchName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.noOfInstrumentPerPage = '10';
  }
}

export class ContactInfo {
  public contactPersonName: string;
  public designation: string;
  public emailId: string;
  public telNo: string;

  constructor() {
    this.contactPersonName = '';
    this.designation = '';
    this.emailId = '';
    this.telNo = '';
  }
}
