export class ChildAccountDetails {
  constructor(
    public accountNo: string[] = [],
    public priority: string = '',
    public subAccount: string = '',
    public bank: string = '',
    public balance: string = '',
    public country: string = '',
    public currency: string = '',
    public accType: string = '',
    public type: string = '',
    public accountType: string = '',
    public structureType: string = '',
    public selectedBy: string = '',
    public balancePercentage: string = '',
    public sweepType: string = '',
    public narration: string = '',

    public positiveRate: string = '',
    public overdraftRate: string = '',
    public lendingRate: string = '',
    public borrowingRate: string = '',
    public applyToSubAccount: string = '',
    public pnGenerationFrequency: string = '',
    public pnGenerationMonth: string = '',
    public pnGenerationDay: string = '',

    public belongsToClusterCode: string = '',
    public belongsToClusterName: string = '',
    public leadForClusterCode: string = '',
    public leadForClusterName: string = '',

    public fundingAccount: string = '',
    public fundingAccountName: string = '',

    public instructions: any[] = [],
  ) {}
}
