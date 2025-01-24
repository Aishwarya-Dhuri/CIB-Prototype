export class ScanDataEntry {

  collectionMethod: string;
  depositSlip: string;
  depositDate: string;
  depositAmt: string;
  noOfCheque: string;
  batchReference: string;
  enrichment1: string;
  enrichment2: string;
  enrichment3: string;
  corporateCode: string;
  corporateName: string;
  pickupLocationCode: string;
  pickupLocationName: string;
  pickupPointCode: string;
  pickupPointName: string;

  headerFields: HeaderFieldForm[];



  constructor(
    public category: string = '',
    public billerName: string = '',
    public product: string = '',

    public copyFromExistingSubscriber: string = 'N',
    public existingSubscriber: string = '',
    public consumer: string = '',
    public ref1: string = '',
    public ref2: string = '',
    public currency: string = '',
    public maximumAmount: string = '',
    public tolerance: string = '',
    public preferredPaymentMethod: string = '',
    public effectiveStartDate: string = '',
    public effectiveEndDate: string = '',

    public schedulePayment: string = 'N',

    public schedulePaymentMethod: string = '',
    public pay: string = '',
    public ifHoliday: string = '',
    public startDate: string = '',
    public endDate: string = '',

    public amount: string = '',
    public accountNumber: string = '',

    public type: string = 'online',
    public channel: string = 'WEB',
    public noOfBills: number = 3,
    public dueDate: string = '',
    public billAmount: string = '',
    public amountBeingPaid: string = '',
    public paymentDate: string = '',
  ) {
    this.collectionMethod = '';
    this.depositSlip = '';
    this.depositDate = '';
    this.depositAmt = '';
    this.noOfCheque = '';
    this.batchReference = '';
    this.enrichment1 = '';
    this.enrichment2 = '';
    this.enrichment3 = '';
    this.corporateCode = '';
    this.corporateName = '';
    this.pickupLocationCode = '';
    this.pickupLocationName = '';
    this.pickupPointCode = '';
    this.pickupPointName = '';
    this.headerFields = [];
  }
}

export class HeaderFieldForm {
  hid: string;
  chequeNumber: string;
  micrCode: string;
  draweeBank: string;
  draweeBranch: string;
  clrLoc: string;
  chequeAmt: string;
  chequeDate: string;
  corpClientCode: string;
  corpClientName: string;
  payeeName: string;
  payeeAccNo: string;
  productCode: string;
  productName: string;
  cleringDays: string;
  creditDueDate: string;


  constructor() {






    this.hid = '';
    this.chequeNumber = '';
    this.micrCode = '';
    this.draweeBank = '';
    this.draweeBranch = '';
    this.clrLoc = '';
    this.chequeAmt = '';
    this.chequeDate = '';
    this.corpClientCode = '';
    this.corpClientName = '';
    this.payeeName = '';
    this.payeeAccNo = '';
    this.productCode = '';
    this.productName = '';
    this.cleringDays = '';
    this.creditDueDate = '';
  }
}
