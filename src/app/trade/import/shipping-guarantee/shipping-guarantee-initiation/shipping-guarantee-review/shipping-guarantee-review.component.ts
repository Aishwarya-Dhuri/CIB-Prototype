import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ShippingGuaranteeService } from '../../@services/shipping-guarantee.service';
import { ShippingGuaranteeInitiationComponent } from '../shipping-guarantee-initiation.component';

@Component({
  selector: 'app-shipping-guarantee-review',
  templateUrl: './shipping-guarantee-review.component.html',
  styleUrls: ['./shipping-guarantee-review.component.scss'],
})
export class ShippingGuaranteeReviewComponent implements OnInit {
  @Input('parentRef') parentRef: ShippingGuaranteeInitiationComponent;

  @Output() onSaveDraft = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();

  submit: boolean = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];

  constructor(
    private shippingGuaranteeService: ShippingGuaranteeService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {
    var reqModel = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: { type: 'Shipping Guarantee' },
      sortModel: [],
      entityName: 'TERMSANDCONDITION',
    };
    this.httpService
      .httpPost('trade/termsAndCondition/private/getTermsAndConditionList', reqModel)
      .subscribe((response: any) => {
        this.termsAndCondition = response.data;
      });
  }

  ngOnInit(): void {}

  onEdit(stepIndex: number) {
    this.shippingGuaranteeService.activeStepIndex = stepIndex;
    this.parentRef.onStepClick(stepIndex + 1);
  }

  onSubmit() {}

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
