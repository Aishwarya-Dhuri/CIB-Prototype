export class DebitCardCancellation {
  constructor(
    public cardNumber: string = '',
    public accountId: string = '',
    public accountDisplayName: string = '',
    public changeEmbossName: string = '',
    public requestDate: string = '01-02-2022',
    public cardDetails: CardDetails[] = [],
    public documents: any[] = [],
    public cancellationReason: string = '',
  ) {}
}
export class CardDetails {
  constructor(
    public cardImage: string = '',
    public cardType: string = '',
    public cardStatus: string = '',
    public cardNumber: string = '',
    public embossedName: string = '',
    public cancellationReason: string = '',
    public otherReason: string = '',
  ) {}
}
