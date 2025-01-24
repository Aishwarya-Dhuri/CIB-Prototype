import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BankGuaranteeService } from '../../@services/bank-guarantee.service';
import { BankGuaranteeInitiationComponent } from '../bank-guarantee-initiation.component';

@Component({
  selector: 'app-bank-guarantee-review',
  templateUrl: './bank-guarantee-review.component.html',
  styleUrls: ['./bank-guarantee-review.component.scss'],
})
export class BankGuaranteeReviewComponent implements OnInit {
  @Input('parentRef') parentRef: BankGuaranteeInitiationComponent;

  @Output() onSaveDraft = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();

  submit: boolean = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];

  constructor(
    private bankGuaranteeService: BankGuaranteeService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    var reqModel = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: { type: 'Bank Guarantee' },
      sortModel: [],
      entityName: 'TERMSANDCONDITION',
    };
    this.httpService
      .httpPost('trade/termsAndCondition/private/getTermsAndConditionList', reqModel)
      .subscribe((response: any) => {
        this.termsAndCondition = response.data;
      });
  }

  onEdit(stepIndex: number) {
    this.bankGuaranteeService.activeStepIndex = stepIndex;
    this.parentRef.onStepClick(stepIndex + 1);
  }

  onSubmit() {}

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
