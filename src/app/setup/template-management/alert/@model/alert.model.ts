export class Alert {
  public alertCode: string;
  public alertName: string;
  public moduleId: string;
  public module: string;
  public categoryId: string;
  public category: string;
  public eventValueForKey: string;
  public eventName: string;
  public channelType: string;
  public email: boolean;
  public sms: boolean;
  public online: boolean;
  public sendAlertTo: string;
  public bank: boolean;
  public sponsor: boolean;
  public nonSponsor: boolean;
  public corporate: boolean;
  public frequency: string;
  public alertTime: string;
  public alertText: string;
  public smsText: string;
  public onlineText: string;

  constructor() {
    this.alertCode = '';
    this.alertName = '';
    this.moduleId = '';
    this.module = '';
    this.categoryId = '';
    this.category = '';
    this.eventValueForKey = '';
    this.eventName = '';
    this.channelType = '';
    this.email = false;
    this.sms = false;
    this.online = false;
    this.sendAlertTo = '';
    this.bank = false;
    this.sponsor = false;
    this.nonSponsor = false;
    this.corporate = false;
    this.frequency = '';
    this.alertTime = '';
    this.alertText = '';
    this.smsText = '';
    this.onlineText = '';
  }
}
