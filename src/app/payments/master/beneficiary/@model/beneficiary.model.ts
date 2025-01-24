export class BeneficiaryModel {
  constructor(
    public beneficiaryCode = '',
    public beneficiaryName = '',
    public beneficiaryType = '',
    public payeeName = '',
    public zipCode = '',
    public contactNumber = '',
    public emailId = '',
    public address1 = '',
    public address2 = '',
    public address3 = '',
    public beneficiaryLimitApplicable = 'No',
    public limitCurrency = '',
    public limitCurrencyCode = '',
    public limitAmount = '',
    public bank = 'HSBC',
    public limitType = 'FIFO',

    public paymentMethods = [],
  ) {}
}

export class BeneficiaryAccountModel {
  constructor(
    public instrumentDispatchTo = '',
    public instrumentDispatchMode = '',
    public bicCode = '',
    public bankSortCode = '',
    public beneficiaryBank = '',
    public beneficiaryBankBranch = '',
    public address1 = '',
    public address2 = '',
    public address3 = '',
    public maxLimitCurrency = '',
    public maxLimitCurrencyCode = '',
    public maxLimitAmount = '',
    public accountNumber = '',
    public beneficiaryAdviceDispatchMode = [],
  ) {}
}
