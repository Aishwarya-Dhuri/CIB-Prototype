import { Component, Input, OnInit } from '@angular/core';
import { VaIssuanceSummaryService } from '../@services/va-issuance-summary.service';

@Component({
  selector: 'app-virtual-account-details',
  templateUrl: './virtual-account-details.component.html',
  styleUrls: ['./virtual-account-details.component.scss'],
})
export class VirtualAccountDetailsComponent implements OnInit {
  @Input('vaData') vaData: any;
  @Input() addContainer: boolean = true;

  contactColDef: any[] = [
    { headerName: 'Sr. No ', field: 'srNo' },
    { headerName: 'Contact Person Name', field: 'contactDetName' },
    { headerName: 'Designation', field: 'contactDetDesignation' },
    { headerName: 'Email Id', field: 'contactDetEmail' },
    { headerName: 'Telephone Number', field: 'contactDetMobile' },
    // {cellRenderer: 'actionCellRenderer', field: 'actions', headerName: 'Actions'}
  ];
  constructor(private vaIssuanceSummaryService: VaIssuanceSummaryService) {}

  ngOnInit(): void {
    if (!this.vaData) {
      this.vaData = this.vaIssuanceSummaryService.selectedVA;
    }
    console.log('vaData', this.vaData);
  }
}
