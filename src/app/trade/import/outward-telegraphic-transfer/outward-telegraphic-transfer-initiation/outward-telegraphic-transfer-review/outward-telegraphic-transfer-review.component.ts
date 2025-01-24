import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { OutwardTelegraphicTransferService } from '../../@services/outward-telegraphic-transfer.service';
import { OutwardTelegraphicTransferInitiationComponent } from '../outward-telegraphic-transfer-initiation.component';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';


@Component({
  selector: 'app-outward-telegraphic-transfer-review',
  templateUrl: './outward-telegraphic-transfer-review.component.html',
  styleUrls: ['./outward-telegraphic-transfer-review.component.scss']
})
export class OutwardTelegraphicTransferReviewComponent implements OnInit {
  @ViewChild('paymentDetailsGridReview') paymentDetailsGridReview!: AgGridListingComponent;
  @Input('parentRef') parentRef: OutwardTelegraphicTransferInitiationComponent;

  @Output() onSaveDraft = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();

  submit: boolean = false;
  isTermsAndCondition: boolean = false;
  termsAndCondition: any[] = [];

  paymentDetailsGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };

  constructor(
    private OutwardTelegraphicTransferService: OutwardTelegraphicTransferService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,) { }

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
    this.OutwardTelegraphicTransferService.activeStepIndex = stepIndex;
    this.parentRef.onStepClick(stepIndex + 1);
  }

  onSubmit() { }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
