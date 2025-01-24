import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { RegistrationForLoans } from './@model/registration-for-loans.model';

@Component({
  selector: 'app-request-for-loans',
  templateUrl: './request-for-loans.component.html',
  styleUrls: ['./request-for-loans.component.scss']
})
export class RequestForLoansComponent implements OnInit {
  showSampleBill: boolean = false;

  billers: any[] = [];
  products: any[] = [];
  accounts: any[] = [];
  existingSubscribers: any[] = [];

  showExistingSubscriberModal: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Request For Loans',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: RegistrationForLoans = new RegistrationForLoans();

  mode: string;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,) { }

  ngOnInit(): void {

    const actions: Actions = {
      heading: 'Request For Loans - Initiate',
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
      { label: 'Loans' },
      { label: 'Loan' },
      { label: 'Request For Loans' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.effectiveStartDate = this.userService.getApplicationDate();

    this.currencyService.getCurrencyId().subscribe((ccyId: string) => {
      this.formData.currency = ccyId;
    });

    this.httpService
      .httpPost(`loans/loan/requestForLoans/private/dropdown/billers`)
      .subscribe((response: any) => {
        this.billers = response.dataList;
      });

    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accounts = response.dataList;
      });

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('loans/loan/requestForLoans/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          if (formData) {
            this.formData = formData;
            if (this.mode == 'VIEW') {
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
          }
        });
    }
  }


  getSampleBill() {
    return this.httpService.getAssetUrl('assets/images/sample-images/billing-invoice-template.png');
  }

  getExistingSubscribers() {
    const data = {
      dataMap: {
        category: this.formData.category,
        billerName: this.formData.loanType,
        product: this.formData.product,
      },
    };

    this.httpService
      .httpPost('loans/loan/requestForLoans/private/getExistingConsumers', data)
      .subscribe((res: any) => {
        this.existingSubscribers = res.data.map((row: any) => {
          return {
            id: row.consumer,
            displayName: row.consumer,
            enrichments: { ...row },
          };
        });
      });
  }

  resetExistingSubscriber() {
    this.formData = {
      ...this.formData,
      copyFromExistingSubscriber: 'N',
      existingSubscriber: '',
      consumer: '',
      ref1: '',
      ref2: '',
      maximumAmount: '',
      name: '',
      preferredPaymentMethod: '',
    };
  }

  onSelectExistingSubscriber(subscriber: any) {
    this.formData.consumer = subscriber.enrichments.consumer;
    this.formData.ref1 = subscriber.enrichments.ref1 ? subscriber.enrichments.ref1 : '';
    this.formData.ref2 = subscriber.enrichments.ref2 ? subscriber.enrichments.ref2 : '';
    this.formData.maximumAmount = subscriber.enrichments.maximumAmount;
    this.formData.name = subscriber.enrichments.tolerance;
    this.formData.preferredPaymentMethod = subscriber.enrichments.preferredPaymentMethod;
  }

  onBiller(biller: any) {
    this.formData.category = biller.enrichments.categoryName;

    console.log(biller.enrichments.products);

    this.httpService
      .httpPost(
        `loans/loan/requestForLoans/private/dropdown/${biller.enrichments.products}`,
      )
      .subscribe((response: any) => {
        this.products = response.dataList;
        this.formData.product = '';
      });
  }

  onSchedulePaymentMethod() {
    this.formData.accountNumber = '';
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    }

    return true;
  }

  beforeSubmit() {
    this.formData.dueDate = this.formData.endDate;
    this.formData.billAmount = this.formData.amount;
    this.formData.amountBeingPaid = this.formData.amount;
    this.formData.paymentDate = this.formData.startDate;

    return true;
  }

  goToListing() {
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }

}
