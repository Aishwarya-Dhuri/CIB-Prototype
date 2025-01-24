export class VirtualAccountStatusManagement {
  public virtualAccountId: string;
  public corporateCode: string;
  public corporateClientCode: string;
  public corporateStructureName: string;
  public virtualAccount: string;
  public vaAliceName: string;
  public status: string;
  public suspendTill: string;
  public suspendReason: string;
  public closeReason: string;
  constructor() {
    this.virtualAccountId = '';
    this.corporateCode = '';
    this.corporateClientCode = '';
    this.corporateStructureName = '';
    this.virtualAccount = '';
    this.vaAliceName = '';
    this.status = '';
    this.suspendTill = '';
    this.suspendReason = '';
    this.closeReason = '';
  }
}
