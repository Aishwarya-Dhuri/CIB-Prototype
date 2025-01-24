import { Component, Input, OnInit } from '@angular/core';
import { BeneficiaryComponent } from '../beneficiary.component';

@Component({
  selector: 'app-beneficiary-review',
  templateUrl: './beneficiary-review.component.html',
  styleUrls: ['./beneficiary-review.component.scss'],
})
export class BeneficiaryReviewComponent implements OnInit {
  @Input('parentRef') parentRef: BeneficiaryComponent;

  constructor() {}

  ngOnInit(): void {}
}
