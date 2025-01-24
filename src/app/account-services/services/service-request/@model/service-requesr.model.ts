export class ServiceRequestModel {
  constructor(
    public id: string = '',
    public highPriority: boolean = false,
    public isMultipleRequests: boolean = false,
    public corporateCode: string = '',
    public corporateName: string = '',
    public srClass: string = '',
    public srType: string = '',
    public srSubType: string = '',
    public status: string = 'Pending',
    public srColDefs: any[] = [],
    public srRowData: any[] = [],
    public document1: any[] = [],
    public document2: any[] = [],
    public document3: any[] = [],
  ) {}
}
