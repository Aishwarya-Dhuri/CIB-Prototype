export class CollectionSummaryHeadOffice {
  quickReq: string;
  location: string;
  pickupPointName: string;
  pickupPointCode: string;
  pickupTime: string;
  productName: string;
  cashSummary: string;

  constructor() {
    this.quickReq = ''
    this.location = ''
    this.pickupPointName = ''
    this.pickupPointCode = ''
    this.pickupTime = ''
    this.productName = ''
    this.cashSummary = 'This Week'
  }

}