export class BeneficiaryOrBuyer {
  constructor(
    public code: string,
    public name: string,
    public type: string,
    public location: string,
    public address1: string,
    public address2: string,
    public address3: string,
    public country: string,
    public pinCode: string,
    public mobileNumber: string,
    public email: string,
    public effectiveFrom: string,
    public effectiveTill: string,
  ) {
    this.code = '';
    this.name = '';
    this.type = '';
    this.location = '';
    this.address1 = '';
    this.address2 = '';
    this.address3 = '';
    this.country = '';
    this.pinCode = '';
    this.mobileNumber = '';
    this.email = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
  }
}
