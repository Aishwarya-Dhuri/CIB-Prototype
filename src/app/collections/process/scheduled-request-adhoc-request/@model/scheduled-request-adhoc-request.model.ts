export class ScheduledRequestAdhocRequest {
  requestFor: string;
  product: string;
  pickupCode: string;
  pickupName: string;
  location: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  pickupInstruction: string;
  startDate: string;
  endDate: string;
  pickupTime1: string;
  pickupTime2: string;
  pickupTime3: string;
  primaryName: string;
  primaryTelNo: string;
  primaryMobNo: string;
  primaryEmailId: string;
  secondaryName: string;
  secondaryTelNo: string;
  secondaryMobNo: string;
  secondaryEmailId: string;
  dailyEvery: string;
  dailyEveryWeekday: string;
  isDailyEvery: string;
  daily: string;
  weeklyRecurEvery: string;
  monthly: string;
  monthlyDay: string;
  monthlyOfEvery: string;
  week: string;
  weekDays: string;
  monthlyMonths: string;
  quarterly: string;
  quarterlyDay: string;
  yearlyRecur: string;
  yearlyMonths: string;
  yearlyMonthsOn: string;
  weekDaysOn: string;
  PickupDate: string;
  agencyCode: string;
  agencyName: string;

  public pickupType: any = '';
  public days: any = '';
  public time: any = '';
  public timeSlot: any = '';
  public Frequency: any = '';
  public primaryTelephone: any = '';
  public primaryMob: any = '';
  public primaryEmail: any = '';
  public secondaryTelephone: any = '';
  public secondaryMob: any = '';
  public secondaryEmail: any = '';

  constructor(
    public category: string = '',
    public billerName: string = '',
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

    this.requestFor = 'Pickup';
    this.product = '';
    this.pickupCode = '';
    this.pickupName = '';
    this.location = '';
    this.address1 = '';
    this.address2 = '';
    this.city = '';
    this.state = '';
    this.postalCode = '';
    this.pickupInstruction = '';
    this.startDate = '';
    this.endDate = '';
    this.pickupTime1 = '';
    this.pickupTime2 = '';
    this.pickupTime3 = '';
    this.primaryName = '';
    this.primaryTelNo = '';
    this.primaryMobNo = '';
    this.primaryEmailId = '';
    this.secondaryName = '';
    this.secondaryTelNo = '';
    this.secondaryMobNo = '';
    this.secondaryEmailId = '';
    this.dailyEvery = '';
    this.dailyEveryWeekday = '';
    this.isDailyEvery = '';
    this.daily = '';
    this.weeklyRecurEvery = '';
    this.monthly = '';
    this.monthlyDay = '';
    this.monthlyOfEvery = '';
    this.week = '';
    this.weekDays = '';
    this.monthlyMonths = '';
    this.quarterly = '';
    this.quarterly = '';
    this.quarterlyDay = '';
    this.yearlyRecur = '';
    this.yearlyMonths = '';
    this.yearlyMonthsOn = '';
    this.weekDaysOn = '';
    this.PickupDate = '';
    this.agencyCode = 'AGENCY19';
    this.agencyName = 'Agency Pvt Ltd.';
  }
}
