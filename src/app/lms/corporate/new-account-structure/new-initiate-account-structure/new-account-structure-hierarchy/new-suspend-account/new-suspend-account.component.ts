import { Component, Input, OnInit } from '@angular/core';
import { NewSuspendAccount } from '../../../@models/newSuspendAccount.model';

@Component({
  selector: 'app-new-suspend-account',
  templateUrl: './new-suspend-account.component.html',
  styleUrls: ['./new-suspend-account.component.scss']
})
export class NewSuspendAccountComponent implements OnInit {
  @Input('parentRef') parentRef: any;

  gridOptions: any;

  suspendAccount: NewSuspendAccount = new NewSuspendAccount();

  constructor() { }

  ngOnInit() {
    this.gridOptions = {
      columnDefs: [
        { headerName: 'Suspended by', field: 'suspendedBy' },
        { headerName: 'Days', field: 'days' },
        { headerName: 'Suspended From', field: 'suspendedFrom' },
        { headerName: 'Suspended Till', field: 'suspendedTill' },
        { headerName: 'Remarks', field: 'remarks' },
      ],
      rowData: [
        {
          suspendedBy: 'Days',
          days: '10',
          suspendedFrom: '14 June, 2020',
          suspendedTill: '24 June, 2020',
          remarks: 'Remarks',
        },
        {
          suspendedBy: 'Days',
          days: '5',
          suspendedFrom: '10 June, 2020',
          suspendedTill: '15 June, 2020',
          remarks: 'Remarks',
        },
        {
          suspendedBy: 'Days',
          days: '10',
          suspendedFrom: '14 June, 2020',
          suspendedTill: '24 June, 2020',
          remarks: 'Remarks',
        },
        {
          suspendedBy: 'Days',
          days: '5',
          suspendedFrom: '10 June, 2020',
          suspendedTill: '15 June, 2020',
          remarks: 'Remarks',
        },
      ],
      rowModelType: 'clientSide',
      paginationPageSize: 5,
    };
  }

  suspend() {
    this.parentRef.isSuspendAccount = false;
  }

}
