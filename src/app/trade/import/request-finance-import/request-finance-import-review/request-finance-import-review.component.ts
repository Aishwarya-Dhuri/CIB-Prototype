import { Component, Input, OnInit } from '@angular/core';
import { RequestFinanceImportComponent } from '../request-finance-import.component';

@Component({
  selector: 'app-request-finance-import-review',
  templateUrl: './request-finance-import-review.component.html',
  styleUrls: ['./request-finance-import-review.component.scss'],
})
export class RequestFinanceImportReviewComponent implements OnInit {
  @Input('parentRef') parentRef: RequestFinanceImportComponent;

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
