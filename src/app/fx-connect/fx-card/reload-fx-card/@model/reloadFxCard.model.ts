export class ReloadFxCard {
  public currencyDetails: CurrencyDetails[];

  public fxCardNo: string;
  public cardBalance: string;
  public expiryMonth: string;
  public expiryYear: string;
  public pin: string;

  public totalBalance: number;
  public charges: number;
  public gstOnCharges: number;
  public gstOnCFxConversion: number;
  public totalChargesApplicable: number;
  public netTotal: number;

  public countryOfTravel: string;
  public purpose: string;
  public activationDate: string;
  public embossedName: string;
  public mobileNo: string;
  public emailId: string;
  public deliveryDetails: string;
  public addressType: string;
  public address1: string;
  public address2: string;
  public address3: string;
  public branch: string;
  public collectingOfficialsName: string;
  public collectingOfficialsIdType: string;
  public idCardNumberDetails: string;

  public nationalId: string;
  public nationalIdLimit: string;

  public supportingDocuments: any[];

  public remarks: string;
  public actions: any[];
  public ['key']?: any;

  constructor() {
    this.currencyDetails = [];

    this.fxCardNo = '';
    this.cardBalance = '';
    this.expiryMonth = '';
    this.expiryYear = '';
    this.pin = '';

    this.totalBalance = 0;
    this.charges = 0;
    this.gstOnCharges = 0;
    this.gstOnCFxConversion = 0;
    this.totalChargesApplicable = 0;
    this.netTotal = 0;

    this.countryOfTravel = '';
    this.purpose = '';
    this.activationDate = '';
    this.embossedName = '';
    this.mobileNo = '';
    this.emailId = '';
    this.deliveryDetails = '';
    this.addressType = '';
    this.address1 = '';
    this.address2 = '';
    this.address3 = '';
    this.branch = '';
    this.collectingOfficialsName = '';
    this.collectingOfficialsIdType = '';
    this.idCardNumberDetails = '';

    this.nationalId = '';
    this.nationalIdLimit = '';
    this.supportingDocuments = [];
    this.remarks = '';
  }
}

export class CurrencyDetails {
  public currency: string;
  public currencyCode: string;
  public amount: string;
  public paymentType: string;
  public account: string;
  public accountNumber: string;
  public accountCurrency: string;
  public accountBalance: string;
  public rateType: string;
  public fxRate: string;
  public mfContractFxRate: string;
  public actions: any[];

  constructor() {
    this.currency = '';
    this.currencyCode = '';
    this.amount = '';
    this.paymentType = '';
    this.account = '';
    this.accountNumber = '';
    this.accountBalance = '';
    this.rateType = '';
    this.fxRate = '';
    this.mfContractFxRate = '';
    this.actions = [];
  }
}
