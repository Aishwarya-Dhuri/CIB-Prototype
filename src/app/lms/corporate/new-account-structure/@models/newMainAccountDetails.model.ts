export class NewAccountDetails {
  constructor(
    public accountNo: string[] = [],
    public structureType: string = '',
    public corporateName: string = '',
    public structureName: string = '',
    public mainAccount: string = '',
    public newAccountType: string = '',
    public balanceType: string = '',
    public minBal: string = '',
    public maxBal: string = '',
    public narration: string = '',
    public mainAccountNo: string = '',
    public bank: string = '',
    public balance: string = '',
    public country: string = '',
    public currency: string = '',
    public accType: string = '',
    public type: string = '',
    public accountType: string = '',
    public sweepType: string = '',
    public executionSequence: string = '',

    public frequencyOfExecution: string = 'custom',

    public dates: string[] = [''],

    public recurrenceFrequency: string = '',
    public numberOfOccurrence: string = '',
    public startDateTime: string = '',
    public startDate: string = '',
    public endDateTime: string = '',
    public endDate: string = '',
    public noEndDate: string = '',
    public recurrenceDays: string[] = [],

    public positiveRate: string = '',
    public overdraftRate: string = '',
    public lendingRate: string = '',
    public borrowingRate: string = '',
    public applyToSubAccount: string = '',
    public selectedBy: string = '',
    public pnGenerationFrequency: string = '',
    public pnGenerationMonth: string = '',
    public pnGenerationDay: string = '',

    public belongsToClusterCode: string = '1',
    public belongsToClusterName: string = '',
    public leadForClusterCode: string = '1',
    public leadForClusterName: string = '',

    public fundingAccountName: string = '',
    public fundingAccount: string = '',
    public onHoliday: string = '',
    public failureRule: string = '',
  ) { }
}
