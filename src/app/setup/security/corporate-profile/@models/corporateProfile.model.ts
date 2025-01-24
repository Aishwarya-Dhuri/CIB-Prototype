export class CorporateProfile {
  public profileType?: string;
  public corporateId?: string;
  public corporateName?: string;
  public profileCode?: string;
  public profileName?: string;
  public effectiveFrom?: string;
  public effectiveTill?: string;

  constructor() {
    this.profileType = 'Generic';
    this.corporateId = '';
    this.corporateName = '';
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';
  }
}
