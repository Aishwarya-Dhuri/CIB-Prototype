export class bookForward {
  constructor(
    public contract: string = '',
    public dealDate: string = '',
    public dealType?: string,
    public foreignCurr?: any,
    public localCurr?: any,
    public dealAmount = '',
    public forwardContractType?: string,
    public maturityDate: string = '',
    public corporateReferenceNo = '',
    public supportingDocList?: any[],
    public effectiveFrom: string = '',
    public effectiveTill: string = ' ',
  ) { }
}


