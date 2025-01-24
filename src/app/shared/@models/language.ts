export class Language {
  public id: string;
  public direction: 'ltr' | 'rtl';
  public icon: string;
  public displayShortName: string;
  public displayName: string;

  constructor() {
    this.id = 'en';
    this.direction = 'ltr';
    this.icon = '';
    this.displayShortName = 'EN';
    this.displayName = 'English';
  }
}
