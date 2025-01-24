export class QuickPay {
  constructor(
    public debitAccount?: string,
    public debitAccountId?: string,
    public currencyId?: string,
    public currencyName?: string,
    public amount?: string,
    public beneficiaryId?: string,
    public beneficiaryCode?: string,
    public beneficiaryName?: string,
    public creditAccount?: string,
    public paymentMethod?: string,
    public balance?: string,
    public bank?: string,
  ) {
    this.debitAccount = '';
    this.debitAccountId = '';
    this.currencyId = '';
    this.currencyName = '';
    this.amount = '';
    this.beneficiaryId = '';
    this.beneficiaryCode = '';
    this.beneficiaryName = '';
    this.creditAccount = '';
    this.paymentMethod = '';
    this.balance = '';
    this.bank = '';
  }
}
