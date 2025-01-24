import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BillPresentmentService } from '../../@services/bill-presentment.service';
import { BillPresentmentInitiationComponent } from '../bill-presentment-initiation.component';

@Component({
  selector: 'app-bill-presentment-review',
  templateUrl: './bill-presentment-review.component.html',
  styleUrls: ['./bill-presentment-review.component.scss'],
})
export class BillPresentmentReviewComponent implements OnInit {
  @Input('parentRef') parentRef: BillPresentmentInitiationComponent;

  @Output() onSaveDraft = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();

  submit: boolean = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];

  constructor(
    private billPresentmentService: BillPresentmentService,
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

  onEdit(stepIndex: number): void {
    this.billPresentmentService.activeStepIndex = stepIndex;
    this.parentRef.onStepClick(stepIndex + 1);
  }

  onSubmit(): void {}

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
