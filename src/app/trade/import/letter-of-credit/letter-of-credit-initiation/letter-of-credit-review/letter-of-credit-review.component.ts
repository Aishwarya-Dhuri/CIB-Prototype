import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LetterOfCreditService } from '../../@services/letter-of-credit.service';
import { LetterOfCreditInitiationComponent } from '../letter-of-credit-initiation.component';

@Component({
  selector: 'app-letter-of-credit-review',
  templateUrl: './letter-of-credit-review.component.html',
  styleUrls: ['./letter-of-credit-review.component.scss'],
})
export class LetterOfCreditReviewComponent implements OnInit {
  @Input('parentRef') parentRef: LetterOfCreditInitiationComponent;

  @Output() onSaveDraft = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();

  submit: boolean = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];

  constructor(
    private letterOfCreditService: LetterOfCreditService,
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

  onEdit(stepIndex: number) {
    this.letterOfCreditService.activeStepIndex = stepIndex;
    this.parentRef.onStepClick(stepIndex + 1);
  }

  onSubmit() {}

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
