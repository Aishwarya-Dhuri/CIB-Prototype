import { Component, OnInit, ViewChild } from '@angular/core';
import { Breadcrumb } from '../../../base/main/@models/breadcrumb.model';
import { Actions } from '../../../base/@models/actions';
import { ActionService } from '../../../base/main/@services/action.service';
import { BreadcrumbService } from '../../../base/main/@services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { HttpService } from '../../../shared/@services/http.service';
import { CreditCardService } from '../@services/credit-card.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-manage-auto-pay',
  templateUrl: './manage-auto-pay.component.html',
  styleUrls: ['./manage-auto-pay.component.scss'],
})
export class ManageAutoPayComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  loading: boolean;

  URL_CONST: any = {
    VIEW: 'accountServices/creditCard/manageAutoPay/private/view',
    GET_DAYS: 'accountServices/fixedDeposit/fdInitiation/private/dropdown/daysDataList',
  };

  stepperDetails: any = {
    masterName: 'Manage Auto Pay',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };
  formData: any = {};
  daysList: any;
  viewMode: boolean;
  accounts: any[] = [];
  mode: string;
  ifHolidayList: any;
  private cardData: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private router: Router,
    private toasterService: ToasterService,
    private httpService: HttpService,
    private creditCardService: CreditCardService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Manage Auto Pay - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    this.mode = this.viewService.getMode();

    this.viewMode = this.mode === 'VIEW';

    if (this.viewMode) {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Credit Card' },
      { label: 'Manage Auto Pay' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.cardData = this.router.getCurrentNavigation()?.extras?.state?.cardData;

    let url = 'accountServices/creditCard/manageAutoPay';

    this.creditCardService.setServiceURL(url);

    this.ifHolidayList = [
      { id: 'prepone', displayName: 'Prepone' },
      { id: 'postpone', displayName: 'Postpone' },
      { id: 'Process', displayName: 'Process' },
    ];

    this.getViewData();
    this.getDays();
    this.getAccounts();
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.form && this.form.valid;
    }

    return true;
  }

  beforeSubmit() {
    return true;
  }

  afterSubmit(response: any) {
    let message = 'Your set / edit request of Auto Pay is submitted';

    if (this.formData.requestType === 'Cancel Auto Pay') {
      message = 'Your cancel request of Auto Pay is submitted';
    }

    this.toasterService.showToaster({ severity: 'success', detail: message });

    this.goToListing();

    return false;
  }

  goToListing() {
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }

  handleCancelAutoPay(event: Event, form: NgForm) {
    form.resetForm({
      requestType: form.form.get('requestType').value,
    });
    this.resetOtherAmount();
  }

  resetOtherAmount() {
    // setTimeout(() => form.form.controls.payableAmount.reset(), 100);
    this.formData.payableAmount = '';
    this.formData.paymentAmountDisplayName = '';
  }

  private getDays() {
    this.httpService
      .httpPost(this.URL_CONST.GET_DAYS, {})
      .subscribe((response: any) => (this.daysList = response.dataList));
  }

  private getViewData() {
    try {
      // let creditCardId = this.cardData.id;
      let creditCardId = this.cardData?.id || this.viewService.getId();
      this.viewService.clearAll();
      if (creditCardId) {
        this.creditCardService
          .getCreditCard(this.URL_CONST.VIEW, creditCardId)
          .subscribe((data) => {
            this.formData = data;
            if (!this.formData.autoPayStatus || this.formData.autoPayStatus === 'Not Registered') {
              this.formData.requestType = 'Set / Edit Auto Pay';
              this.formData.requestTypeDisplayName = 'Set / Edit Auto Pay';
            }

            this.loading = false;
          });
      } else {
        console.log('credit Card Id not found');
        this.goToListing();
      }
    } catch (e) {
      console.log('credit Card Id not found');
      this.goToListing();
    }
  }

  getSuccessMessage() {
    return this.formData.requestType === 'Set / Edit Auto Pay'
      ? 'Your set / edit request of Auto Pay is submitted'
      : 'Your cancel request of Auto Pay is submitted';
  }

  private getAccounts() {
    this.creditCardService.getAccounts().subscribe((data) => (this.accounts = data));
  }

  onChangeDebitAccount() {
    this.formData.debitAccountNo = this.accounts.find(
      (acc: any) => acc.id === this.formData.debitAccount,
    ).displayName;
  }

  onChangePayDay() {
    this.formData.payDayData = this.daysList.find(
      (data: any) => data.id === this.formData.payDay,
    ).displayName;
  }

  onChangeIfHoliday() {
    this.formData.ifHolidayData = this.ifHolidayList.find(
      (data: any) => data.id === this.formData.ifHoliday,
    ).displayName;
  }
}
