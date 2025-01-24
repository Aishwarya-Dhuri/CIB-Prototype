export class MobilityRegistration {
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
  ) { }
}
