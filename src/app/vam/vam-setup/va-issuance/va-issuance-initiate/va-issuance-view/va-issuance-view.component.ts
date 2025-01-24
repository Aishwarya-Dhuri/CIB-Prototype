import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-va-issuance-view',
  templateUrl: './va-issuance-view.component.html',
  styleUrls: ['./va-issuance-view.component.scss'],
})
export class VaIssuanceViewComponent implements OnInit {
  @Input() viewData: any;

  constructor() {}

  ngOnInit(): void {}
}
