export class StopPayRevoke {
  constructor(
    public chequeType: string = 'Stop Payment',
    public accountNoId: string = '',
    public accountName: string = '',
    public chequeDate: string = '',
    public chequeNumber: string = '',
    public chequeAmount: string = '',
    public chequeStatus: string = '',
    public beneficiary: string = '',
    public reason: string = '',
    public documents: any[] = [],
    public chequeDetails: ChequeDetails[] = [],

    /////////
    public mandateRefNo: string = '',
    public payerName: string = '',
    public mandateStartEndDate: string = '',
    public originatorCode: string = '',
    public payerBank: string = '',
    public payerAccNo: string = '',
    public startDate: string = '',
    public endDate: string = '',
    public holdDays: number = 0,
    /////////
  ) { }
}
export class ChequeDetails {
  constructor(
    public isSelected: boolean = false,
    public accountNo: string = '',
    public chequeNumber: string = '',
    public chequeAmount: string = '',
    public beneficiary: string = '',
    public status: string = '',
    public chequeUrl: string = '',


    /////////
    public mandateRefNo: string = '',
    public payerName: string = '',
    public mandateStartEndDate: string = '',
    public originatorCode: string = '',
    public payerBank: string = '',
    public payerAccNo: string = '',
    public startDate: string = '',
    public endDate: string = '',
    /////////
  ) { }
}
