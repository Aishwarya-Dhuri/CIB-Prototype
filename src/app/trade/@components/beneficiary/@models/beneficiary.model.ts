export class Beneficiary {
  constructor(
    public tradeType: string = '',
    public beneficiaryCode: string = '',
    public beneficiaryName: string = '',
    public beneficiaryType: string = '',
    public beneficiaryLocation: string = '',
    public beneficiaryAddress1: Address[] = [new Address(true, '')],
    public beneficiaryAddress2: Address[] = [new Address(false, '')],
    public beneficiaryAddress3: Address[] = [new Address(false, '')],
    public country: string = '',
    public pinCode: string = '',
    public mobileNumber: string = '',
    public email: string = '',
    public effectiveFrom: string = '',
    public effectiveTill: string = '',
    public bankSwiftCode: string = '',
    public beneficiaryAccountNumber: string = '',
    public beneficiaryBankName: string = '',
    public beneficiaryBankAddress1: Address[] = [new Address(true, '')],
    public beneficiaryBankAddress2: Address[] = [new Address(false, '')],
    public beneficiaryBankAddress3: Address[] = [new Address(false, '')],
  ) {}
}

export class Address {
  constructor(public show: boolean = true, public address: string = '') {}
}
