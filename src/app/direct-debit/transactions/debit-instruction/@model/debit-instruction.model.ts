export class DebitInstruction {
  constructor(
    public corporateCode: string = '',
    public corporateName: string = '',
    public mandateRefNo: string = '',
    public umrn: string = '',
    public prodName: string = '',
    public customerName: string = '',
    public currency: string = '',
    public amount: string = '',
    public paymentDate: string = '',
    public remarks: string = '',


    public category: string = '',
    public billerName: string = '',
    public product: string = '',

    public copyFromExistingSubscriber: string = 'N',
    public existingSubscriber: string = '',
    public consumer: string = '',
    public ref1: string = '',
    public ref2: string = '',
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

    public accountNumber: string = '',

    public type: string = 'online',
    public channel: string = 'WEB',
    public noOfBills: number = 3,
    public dueDate: string = '',
    public billAmount: string = '',
    public amountBeingPaid: string = '',
  ) { }
}
