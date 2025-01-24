import * as moment from 'moment';

export class RdInitiation {
  batchNo?: string;
  placementDate?: string;
  valueDate?: string;
  productTypeId?: any;
  productTypeName?: string;
  debitFromAccountId?: any;
  debitFromAccountName?: string;
  accountBalance?: string;
  currencyId?: string;
  currencyName?: string;
  amount?: string;
  tenor?: string;
  // years?: any;
  // months?: string;
  // days?: string;
  interestRate?: string;
  maturityInstructionsId?: any;
  maturityInstructionsName?: string;
  remarks?: string;
  principalCreditMode?: string;
  principalCreditAccount?: string;
  principalPrefferedCurrency?: string;
  interestCreditMode?: string;
  interestCreditAccount?: string;
  interestPrefferedCurrency?: string;
  termsAndCondition?: string;
  status: string;

  //fd summary
  fdType?: string;
  branch?: string;
  depositStartDate?: string;
  depositAmount?: string;
  maturityAmount?: string;
  maturityDate?: string;
  fdClosedDate?: string;
  isExpand?: boolean;

  noOfInstallments?: number

  constructor() {
    this.batchNo = '123456789';
    this.placementDate = moment().format('DD-MMM-YYYY');
    this.valueDate = moment().format('DD-MMM-YYYY');
    this.productTypeId = '';
    this.productTypeName = '';
    this.debitFromAccountId = '';
    this.debitFromAccountName = '';
    this.accountBalance = '';
    this.currencyId = '';
    this.currencyName = '';
    this.amount = '';
    // this.years = '';
    // this.months = '';
    // this.days = '';
    this.tenor = '';
    this.interestRate = '';
    this.maturityInstructionsId = '';
    this.maturityInstructionsName = '';
    this.remarks = '';
    this.principalCreditMode = '';
    this.principalCreditAccount = '';
    this.principalPrefferedCurrency = '';
    this.interestCreditMode = '';
    this.interestCreditAccount = '';
    this.interestPrefferedCurrency = '';
    this.termsAndCondition = '';
    this.status = 'Unauthorized';

    this.fdType = 'ongoing';
    this.branch = '';
    this.depositStartDate = '';
    this.depositAmount = '';
    this.maturityAmount = '';
    this.maturityDate = '';
    this.fdClosedDate = '';
    this.isExpand = false;
  }
}
