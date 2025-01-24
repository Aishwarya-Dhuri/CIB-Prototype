import { Component, Input, OnInit } from '@angular/core';
import { RequestFinanceExportComponent } from '../request-finance-export.component';

@Component({
  selector: 'app-request-finance-export-review',
  templateUrl: './request-finance-export-review.component.html',
  styleUrls: ['./request-finance-export-review.component.scss'],
})
export class RequestFinanceExportReviewComponent implements OnInit {
  @Input('parentRef') parentRef: RequestFinanceExportComponent;

  isDealNoModalShow: boolean = false;
  isForwardNoModalShow: boolean = false;

  gridOptionsForExchangeDetails = {
    rowSelection: false,
    rowModelType: 'clientSide',
  };

  limitDetails: any[] = [
    {
      limitId: 'PARENT-LIMITNODE',
      sanctionedLimit: '2030000',
      utilizedLimit: '1000000',
      availableLimit: '1030000',
    },
    {
      limitId: 'CHILD-LIMITNODE',
      sanctionedLimit: '2030000',
      utilizedLimit: '1000000',
      availableLimit: '1030000',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
