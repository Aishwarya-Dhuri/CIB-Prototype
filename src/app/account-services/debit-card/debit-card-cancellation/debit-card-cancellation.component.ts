import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CardDetails, DebitCardCancellation } from './@models/debit-card-cancellation..model';

@Component({
  selector: 'app-debit-card-cancellation',
  templateUrl: './debit-card-cancellation.component.html',
  styleUrls: ['./debit-card-cancellation.component.scss'],
})
export class DebitCardCancellationComponent implements OnInit {
  loading: boolean;
  formData: DebitCardCancellation = new DebitCardCancellation();
  viewDocuments: boolean = false;
  isShowUploadedDocuments: boolean = false;
  mode: string;
  isGroupUser: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Debit Card Cancellation',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Debit Card Cancellation',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Debit Card' },
      { label: 'Debit Card Cancellation' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'CANCELLATION') {
      const data = { dataMap: { id: this.viewService.getId() } };

      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      } else if (this.mode == 'CANCELLATION') {
        this.httpService
          .httpPost('accountServices/debitCard/private/view', data)
          .subscribe((formData: any) => {
            this.viewService.clearAll();
            this.formData = formData;
            this.formData.documents = [];
            this.fetchCardDetailsDetails();

            this.loading = false;
          });
      } else {
        this.httpService
          .httpPost('accountServices/debitCard/debitCardCancellation/private/view', data)
          .subscribe((formData: DebitCardCancellation) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.loading = false;
          });
      }
    } else {
      this.loading = false;
    }
  }

  beforeSubmit(): boolean {
    return true;
  }

  onAccountNoSelection(event: any) {
    this.formData.accountDisplayName = event.displayName;
  }

  resetReIssueDebitCardForm(): void {
    this.formData = new DebitCardCancellation();
  }

  fetchCardDetailsDetails(): void {
    const reqModel = {
      accountId: this.formData.accountId,
    };
    this.httpService
      .httpPost('accountServices/debitCard/private/getDebitCardsByAccount', reqModel)
      .subscribe((res) => {
        this.formData.cardDetails = [];
        res.dataList.forEach((record: CardDetails) => {
          this.formData.cardDetails.push({
            ...record,
            cancellationReason: '',
            otherReason: '',
          });
        });
      });
  }

  deleteCard(i: any): void {
    this.formData.cardDetails.splice(i, 1);
  }
}
