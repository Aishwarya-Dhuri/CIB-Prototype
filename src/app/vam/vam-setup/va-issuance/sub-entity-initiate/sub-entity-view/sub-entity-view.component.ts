import { Component, Input, OnInit } from '@angular/core';
import { VaIssuanceSummaryService } from '../../@services/va-issuance-summary.service';

@Component({
  selector: 'app-sub-entity-view',
  templateUrl: './sub-entity-view.component.html',
  styleUrls: ['./sub-entity-view.component.scss'],
})
export class SubEntityViewComponent implements OnInit {
  @Input('subEntityDetails') subEntityDetails: any = {};
  contactColDef: any;

  constructor(private vaISummaryService: VaIssuanceSummaryService) {}

  ngOnInit(): void {
    this.vaISummaryService
      .getContactColDef()
      .subscribe((data) => (this.contactColDef = data.filter((a) => a.field !== 'actions')));
  }
}
