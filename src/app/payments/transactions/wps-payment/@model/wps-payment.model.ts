export class WpsPaymentUpload {
  constructor(
    public valueDate: string = '',
    public molId: string = '',
    public debitFromAccount: string = '',
    public debitFromAccountNumber: string = '',
    public debitFromAccountTitle: string = '',
    public accountBalance: string = '',
    public dataLayout: string = 'Data Layout 1',
    public initiateType: string = '',
    public wpsFile: any[] = [],
  ) {}
}

export class WpsPaymentManual {
  constructor(
    public entryDateAndTime: string = '',
    public valueDate: string = '',
    public molId: string = '',
    public debitFromAccount: string = '',
    public debitFromAccountNumber: string = '',
    public debitFromAccountTitle: string = '',
    public accountBalance: string = '',
    public routingCodeAgentId: string = '',
    public payableCurrencyAndSalaryAmount: string = '',
    public salaryMonth: string = '',
    public edrCount: string = '0',
    public employerReference: string = '',
    public totalAmount: string = '',
    public initiateType: string = '',
    public edrList: EDR[] = [],
  ) {}
}

export class EDR {
  constructor(
    public isExpand: boolean = false,
    public employeeId: string = '',
    public creditAccount: string = '',
    public routingCodeAgentId: string = '',
    public payStartDate: string = '',
    public payEndDate: string = '',
    public noOfDaysInMonth: string = '',
    public fixedSalary: string = '',
    public variableSalary: string = '',
    public noOfDaysWithUnpaidLeaves: string = '',
    public housingAllowance: string = '',
    public conveyanceAllowance: string = '',
    public medicalAllowance: string = '',
    public annualPassageAllowance: string = '',
    public overtimeAllowance: string = '',
    public allOtherAllowances: string = '',
    public leaveEncashment: string = '',
    public requestStatus: string = 'Pending',
    public rejectFailReason: string = '',
  ) {}
}
