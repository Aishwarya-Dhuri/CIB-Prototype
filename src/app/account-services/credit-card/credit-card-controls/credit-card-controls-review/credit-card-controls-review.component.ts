import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCardControlsService } from '../@services/credit-card-controls.service';
import { MenuService } from '../../../../base/main/@services/menu.service';
import { HttpService } from '../../../../shared/@services/http.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToasterService } from '../../../../shared/@services/toaster.service';

@Component({
  selector: 'app-credit-card-controls-review',
  templateUrl: './credit-card-controls-review.component.html',
  styleUrls: ['./credit-card-controls-review.component.scss'],
})
export class CreditCardControlsReviewComponent implements OnInit, OnDestroy {
  submit = false;

  viewMode = false;

  @Output() onSaveDraft = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();

  creditCardData: any;
  showSubmitSuccess: boolean;
  submitResponse: any;

  unSub$ = new Subject();

  constructor(
    private cardControlsService: CreditCardControlsService,
    private menuService: MenuService,
    private httpService: HttpService,
    private router: Router,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.viewMode = this.cardControlsService.viewMode;

    this.cardControlsService.creditCardData$.pipe(takeUntil(this.unSub$)).subscribe((data) => {
      console.log('creditCardData$', data);
      this.creditCardData = data;
    });
  }

  onEdit(stepIndex: number) {
    this.cardControlsService.editMode = true;
    this.cardControlsService.activeStepIndex = stepIndex;
    this.onPrevious.emit();
  }

  previous() {
    this.cardControlsService.activeStepIndex = 2;
    this.onPrevious.emit();
  }

  cancel() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  updateData() {
    console.log('creditCardData', this.creditCardData);
    this.showSubmitSuccess = false;
    if (this.creditCardData) {
      let tempData = JSON.parse(JSON.stringify(this.creditCardData));
      let { domesticUsage, internationalUsage, cardData, ...data } = tempData;
      data = { ...cardData };
      data.internationalUsage = [internationalUsage];
      data.domesticUsage = [domesticUsage];
      console.log('submit ', data);
      let url =
        this.menuService.getSelectedServiceUrl() || 'accountServices/creditCard/creditCardControls';
      url = url + '/private/update';
      this.httpService.httpPost(url, data).subscribe((response: any) => {
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'The edit request of Credit Card Controls / Usage Limit is succesfully submitted',
        });
        this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/listing');
      });
    }
  }

  ngOnDestroy(): void {
    this.unSub$.next(null);
    this.unSub$.complete();
  }
}
