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
  ) {}
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
  ) {}
}
