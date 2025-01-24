export class InterestReallocation {
  constructor(
    public accountStructure: string = '',
    public reallocationRule: string = '',
    public accountNo: string = '',
    public subRule: string = '',
    public showSubRule: boolean = true,
    public showAccountDetailsGrid: boolean = false,
    public accountHierarchy: any[] = [],
    public totalPercentage: number = 0,
  ) { }
}
