export class PoEntry {
  constructor(

    public sponsorId: string = '',
    public sponsorCode: string = '',
    public sponsorName: string = '',
    public sellerBuyerId: string = '',
    public sellerBuyerCode: string = '',
    public sellerBuyerName: string = '',
    public productCategory: string = '',
    public programReferenceNumberName: string = '',
    public entitySubCodeId: string = '',
    public entitySubCode: string = '',
    public entitySubCodeDescription: string = '',
    public documentType: string = '',
    public purchaseOrderNo: string = '',
    public purchaseOrderDate: string = '',
    public poEntryDate: string = '',
    public poValueCcy: string = '',
    public poValueAmount: string = '',
    public poExpiryDate: string = '',
    public expectedDeliveryDate: string = '',
    public billingAddress: string = '',
    public deliveryAddress: string = '',
    public remarks: string = '',
    public supportingDocument: any[] = []
  ) { }
}
