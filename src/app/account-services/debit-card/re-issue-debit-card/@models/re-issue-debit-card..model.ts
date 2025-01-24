export class ReIssueDebitCard {
  constructor(
    public cardNumber: string = '',
    public accountId: string = '',
    public accountDisplayName: string = '',
    public reason: string = '',
    public otherReason: string = '',
    public termsAndConditions: boolean = false,
    public changeEmbossName: string = '',
    public requestDate: string = '01-02-2022',
    public cardDetails: CardDetails[] = [],
    public documents: any[] = [],
  ) {}
}
export class CardDetails {
  constructor(
    public cardImage: string = '',
    public cardType: string = '',
    public cardStatus: string = '',
    public cardNumber: string = '',
    public embossedName: string = '',
  ) {}
}
