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
import { ScheduledRequestAdhocRequest } from './@model/scheduled-request-adhoc-request.model';

@Component({
  selector: 'app-scheduled-request-adhoc-request',
  templateUrl: './scheduled-request-adhoc-request.component.html',
  styleUrls: ['./scheduled-request-adhoc-request.component.scss']
})
export class ScheduledRequestAdhocRequestComponent implements OnInit {
  showSampleBill: boolean = false;

  billers: any[] = [];
  products: any[] = [];
  accounts: any[] = [];
  selectedPattern: any;
  noOfTime: any = 1;
  existingSubscribers: any[] = [];
  instructionCount: number = 1;
  dataUrl: any[] = [];
  showPickupModal: boolean = false
  showDeliveryModal: boolean = false
  isSelectionPickupModalValue: boolean = false
  isSelectionDeliveryModalValue: boolean = false
  pickupDeliveryHeader: string = 'Pickup'

  onShowPickupModal(val) {
    this.formData.pickupCode = val.pickupCode
    this.formData.pickupName = val.pickupName
    this.formData.location = val.location
    this.formData.address1 = val.address1
    this.formData.address2 = val.address2
    this.formData.city = val.city
    this.formData.state = val.state
    this.formData.postalCode = val.postalCode
    this.formData.pickupInstruction = val.pickupInstruction
    this.formData.startDate = val.startDate
    this.formData.endDate = val.endDate
    this.isSelectionPickupModalValue = true
  }

  onShowDeliveryModal(val) {
    this.formData.pickupCode = val.pickupCode
    this.formData.pickupName = val.pickupName
    this.formData.location = val.location
    this.formData.address1 = val.address1
    this.formData.address2 = val.address2
    this.formData.city = val.city
    this.formData.state = val.state
    this.formData.postalCode = val.postalCode
    this.formData.pickupInstruction = val.pickupInstruction
    this.formData.startDate = val.startDate
    this.formData.endDate = val.endDate
    this.isSelectionDeliveryModalValue = true
  }

  productList = [
    { displayName: 'Cash', id: 'Cash' },
    { displayName: 'Cheque', id: 'Cheque' },
    { displayName: 'Document', id: 'Document' }
  ]

  onChangeRequestFor(data) {
    this.productList = []
    if (data === 'Pickup') {
      this.pickupDeliveryHeader = 'Pickup'
      this.productList = [
        { displayName: 'Cash', id: 'Cash' },
        { displayName: 'Cheque', id: 'Cheque' },
        { displayName: 'Document', id: 'Document' }
      ]
    }
    else if (data === 'Delivery') {
      this.pickupDeliveryHeader = 'Delivery'
      this.productList = [
        { displayName: 'Cash', id: 'Cash' },
        { displayName: 'Cheque', id: 'Cheque' }
      ]
    }
  }

  onPickupAdd() {
    this.showPickupModal = true;
    console.log("clicked");
  }

  onDeliveryAdd() {
    this.showDeliveryModal = true;
    console.log("clicked");
  }

  addMoreInstruction() {
    if (this.instructionCount < 4) this.instructionCount = this.instructionCount + 1;
  }

  showExistingSubscriberModal: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Adhoc Request',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: ScheduledRequestAdhocRequest = new ScheduledRequestAdhocRequest();

  mode: string;


  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Adhoc Request',
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
      { label: 'Collections' },
      { label: 'Process' },
      { label: 'Adhoc Request' },
    ];

    this.selectedPattern = this.patternList[0];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.effectiveStartDate = this.userService.getApplicationDate();

    this.currencyService.getCurrencyId().subscribe((ccyId: string) => {
      this.formData.currency = ccyId;
    });

    this.httpService
      .httpPost(`collections/process/adhocRequest/private/dropdown/billers`)
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
        .httpPost('collections/process/adhocRequest/private/view', data)
        .subscribe((formData: any) => {

          // this.formData = any
          this.formData = formData;
          console.log("view data", formData);
          this.viewService.clearAll();
          if (formData) {
            this.formData = formData;
            if (this.mode == 'VIEW') {
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
          }
          if (this.mode == 'EDIT') {

            this.onShowPickupModal(formData);
          }
        });
    }

  }

  getSampleBill() {
    return this.httpService.getAssetUrl('assets/images/sample-images/billing-invoice-template.png');
  }

  getRecords(filters) {
    this.httpService
      .httpPost(
        'collections/process/adhocRequest/private/getContactListList',
        {
          dataMap: filters,
        },
      )
      .subscribe((data: any) => {
        this.dataUrl = data.dataList;
      });
  }

  getExistingSubscribers() {
    const data = {
      dataMap: {
        category: this.formData.category,
        billerName: this.formData.billerName,
        product: this.formData.product,
      },
    };

    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/getExistingConsumers', data)
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
      tolerance: '',
      preferredPaymentMethod: '',
    };
  }

  onSelectExistingSubscriber(subscriber: any) {
    this.formData.consumer = subscriber.enrichments.consumer;
    this.formData.ref1 = subscriber.enrichments.ref1 ? subscriber.enrichments.ref1 : '';
    this.formData.ref2 = subscriber.enrichments.ref2 ? subscriber.enrichments.ref2 : '';
    this.formData.maximumAmount = subscriber.enrichments.maximumAmount;
    this.formData.tolerance = subscriber.enrichments.tolerance;
    this.formData.preferredPaymentMethod = subscriber.enrichments.preferredPaymentMethod;
  }

  onBiller(biller: any) {
    this.formData.category = biller.enrichments.categoryName;

    console.log(biller.enrichments.products);

    this.httpService
      .httpPost(
        `payments/billPayments/billerRegistration/private/dropdown/${biller.enrichments.products}`,
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


  changePattern(data: any) {
    this.selectedPattern = data;
  }

  addTime() {
    if (this.noOfTime === 3) {
      return;
    }
    this.noOfTime++;
  }

  patternList: any = [{ displayName: 'Daily', value: 'daily' },
  { displayName: 'Weekly', value: 'weekly' },
  { displayName: 'Monthly', value: 'monthly' },
  { displayName: 'Quarterly', value: 'quarterly' },
  { displayName: 'Yearly', value: 'yearly' },
  ]

  weekList: any = [{ displayName: 'Mon', value: 'Mon' },
  { displayName: 'Tue', value: 'Tue' },
  { displayName: 'Wed', value: 'Wed' },
  { displayName: 'Thu', value: 'Thu' },
  { displayName: 'Fri', value: 'Fri' },
  { displayName: 'Sat', value: 'Sat' },
  { displayName: 'Sun', value: 'Sun' },
  ]

}
