import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ReIssueDebitCard } from './@models/re-issue-debit-card..model';

@Component({
  selector: 'app-re-issue-debit-card',
  templateUrl: './re-issue-debit-card.component.html',
  styleUrls: ['./re-issue-debit-card.component.scss'],
})
export class ReIssueDebitCardComponent implements OnInit {
  @ViewChild('reIssueDebitCardForm') reIssueDebitCardForm: any;

  loading: boolean;
  formData: ReIssueDebitCard = new ReIssueDebitCard();
  cardDetailsList: any[] = [];
  viewDocuments: boolean = false;
  isShowUploadedDocuments: boolean = false;
  mode: string;
  isGroupUser: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Re-Issue Debit Card',
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
      heading: 'Re-Issue Debit Card',
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
      { label: 'Re-Issue Debit Card' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW' || this.mode == 'REISSUE') {
      const data = { dataMap: { id: this.viewService.getId() } };

      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      } else if (this.mode == 'REISSUE') {
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
          .httpPost('accountServices/debitCard/reIssueDebitCard/private/view', data)
          .subscribe((formData: ReIssueDebitCard) => {
            this.viewService.clearAll();
            this.formData = formData;

            this.loading = false;
          });
      }
    } else {
      this.loading = false;
    }
  }

  // validateForm(stepNo: number): boolean {
  //   if (stepNo == 1) {
  //     if (this.reIssueDebitCardForm.valid) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   return true;
  // }

  beforeSubmit(): boolean {
    this.formData.cardDetails = this.cardDetailsList;
    return true;
  }

  onAccountNoSelection(event: any) {
    this.formData.accountDisplayName = event.displayName;
  }

  resetReIssueDebitCardForm(): void {
    this.formData = new ReIssueDebitCard();
  }

  fetchCardDetailsDetails(): void {
    this.cardDetailsList = [];
    const reqModel = {
      accountId: this.formData.accountId,
    };
    this.httpService
      .httpPost('accountServices/debitCard/private/getDebitCardsByAccount', reqModel)
      .subscribe((res) => {
        this.cardDetailsList = res.dataList;
      });
  }

  deleteCard(i: any): void {
    this.cardDetailsList.splice(i, 1);
  }
}
