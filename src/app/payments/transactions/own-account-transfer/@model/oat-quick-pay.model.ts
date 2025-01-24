import { UserService } from 'src/app/shared/@services/user.service';

export class OatQuickPay {
  public valueDate?: string;
  public corporateRefNo?: string;
  public debitAccount?: string;
  public debitAccountBalance?: string;
  public debitAccountId?: string;
  public debitAccountName?: string;
  public debitAccountCorporate?: string;
  public currencyId?: string;
  public currencyName?: string;
  public amount?: string;
  public creditAccount?: string;
  public creditAccountName?: string;
  public creditAccountCorporate?: string;
  public bankName?: string;
  public creditAccountBalance?: string;
  public paymentMethod?: string;
  public paymentMethodName?: string;
  public remark?: string;

  constructor() {
    this.valueDate = '';
    this.corporateRefNo = '';
    this.debitAccount = '';
    this.debitAccountBalance = '';
    this.debitAccountId = '';
    this.debitAccountName = '';
    this.currencyId = '';
    this.currencyName = '';
    this.amount = '';
    this.creditAccount = '';
    this.creditAccountName = '';
    this.bankName = '';
    this.creditAccountBalance = '';
    this.paymentMethod = '';
    this.paymentMethodName = '';
    this.remark = '';
  }
}
