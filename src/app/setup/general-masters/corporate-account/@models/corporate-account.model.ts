export class CorporateAccount {
  account: string;
  corporateId: string;
  corporateName: string;
  accountNo: string;
  accountDesc: string;
  corporateAccountAlias: string;
  accountType: string;
  swiftCode: string;
  country: string;
  currencyId: string;
  currencyCode: string;
  bank: String;
  accountBranch: string;
  isMT940VIAH2H: boolean;
  branchAddress: string;
  effectiveFrom: string;
  effectiveTill: string;
  moduleMapping: any[];

  constructor() {
    this.account = 'External';
    this.corporateId = '';
    this.corporateName = '';
    this.accountNo = '';
    this.accountDesc = '';
    this.corporateAccountAlias = '';
    this.accountType = '';
    this.swiftCode = '';
    this.country = '';
    this.currencyId = '';
    this.currencyCode = '';
    this.bank = '';
    this.accountBranch = '';
    this.isMT940VIAH2H = false;
    this.branchAddress = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
    this.moduleMapping = [];
  }
}
