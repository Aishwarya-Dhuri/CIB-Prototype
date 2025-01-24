export interface MaturityInstructions {
  fdNumber: string;
  productTypeId: string;
  productTypeName: string;
  debitFromAccountId: string;
  debitFromAccountName: string;
  valueDate: string;
  tenor: string;
  maturityDate: string;
  amount: string;
  amountCurrency: string;
  currentBalance: string;
  accountBalance: string;
  currentBalanceCurrency: string;
  maturityInstructionsName: string;
  principalCreditMode?: string;
  principalCreditAccount?: string;
  interestCreditMode?: string;
  interestCreditAccount?: string;

  status: string;
}
