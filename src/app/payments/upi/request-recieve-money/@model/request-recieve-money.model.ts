export class RequestRecieveMoney {
  constructor(
    public valueDate: string = '',
    public corporateVpaId: string = '',
    public accountNo: string = 'xxxxx005678',
    public accountBalance: string = 'Swadesh Agarwal',
    public accountName: string = 'SDCORP1',
    public upiId: string = '',
    public transferType: string = 'Allowed',

    public payerVpaId: string = '',
    public amount: any = '',
    public expiryDate: string = '',
    public remarks: string = '',
  ) { }
}
