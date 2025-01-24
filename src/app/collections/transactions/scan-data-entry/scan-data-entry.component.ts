import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ScanDataEntry, HeaderFieldForm } from './@models/@model/scan-data-entry.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-scan-data-entry',
  templateUrl: './scan-data-entry.component.html',
  styleUrls: ['./scan-data-entry.component.scss']
})
export class ScanDataEntryComponent implements OnInit {
  @ViewChild('headerFieldGrid') headerFieldGrid!: AgGridListingComponent;

  showSampleBill: boolean = false;

  billers: any[] = [];
  products: any[] = [];
  accounts: any[] = [];
  existingSubscribers: any[] = [];

  showExistingSubscriberModal: boolean = false;
  showCorporateModal: boolean = false;
  showDepositDetails: boolean = false;
  showInstrumentDetails: boolean = false;
  showManualInstrumentDetails: boolean = false;
  showScanInstrumentDetails: boolean = false;
  isShowAccessibilityModal: boolean;

  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string = 'commons/searchService/private/corporateSearchData';
  pickupLocSearchColDefUrl: string = 'collections/transactions/scanDataEntry/private/pickupLocSearchColDefs';
  pickupLocSearchRowDefUrl: string = 'collections/transactions/scanDataEntry/private/pickupLocSearchData';
  pickupPointSearchColDefUrl: string = 'collections/transactions/scanDataEntry/private/pickupPointSearchColDefs';
  pickupPointSearchRowDefUrl: string = 'collections/transactions/scanDataEntry/private/pickupPointSearchData';

  stepperDetails: Stepper = {
    masterName: 'Scan Data Entry',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: ScanDataEntry = new ScanDataEntry();
  headerFieldForm: HeaderFieldForm = new HeaderFieldForm();

  mode: string;
  showAddHeaderFields: boolean = false;
  showViewHeaderFields: boolean = false;
  headerFieldIndex: number = -1;
  // this.formData.corporateName = "--";

  gridOptions = {
    pagination: false
  }

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
      heading: 'Scan Data Entry',
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
      { label: 'Transactions' },
      { label: 'Scan Data Entry' },
    ];

    this.formData.batchReference = "--";

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.effectiveStartDate = this.userService.getApplicationDate();

    this.currencyService.getCurrencyId().subscribe((ccyId: string) => {
      this.formData.currency = ccyId;
    });

    this.httpService
      .httpPost(`payments/billPayments/billerRegistration/private/dropdown/billers`)
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
        .httpPost('payments/billPayments/billerRegistration/private/view', data)
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

  // beforeSubmit() {
  //   this.formData.dueDate = this.formData.endDate;
  //   this.formData.billAmount = this.formData.amount;
  //   this.formData.amountBeingPaid = this.formData.amount;
  //   this.formData.paymentDate = this.formData.startDate;

  //   return true;
  // }

  goToListing() {
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }




  onSelectCorporate(data) {
    console.log(data);

  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName.toString();
  }
  onPickupLoationSelected(dataValue: any): void {
    if (!dataValue) return;
    this.formData.pickupLocationName = dataValue.pickupLocationName.toString();
  }
  onPickupPointSelected(dataValue: any): void {
    if (!dataValue) return;
    this.formData.pickupPointName = dataValue.pickupPointName.toString();
  }

  // Instrument Details





  private getHeaderFieldsIndex(id: string): number {
    return this.formData.headerFields.findIndex((record: HeaderFieldForm) => record.hid == id);
  }

  onClickManualCheque() {
    this.showDepositDetails = true;
    this.showInstrumentDetails = true;
    this.showManualInstrumentDetails = true;
  }

  beforeClick: boolean = true;
  afterClick: boolean = false;

  onClickStartScan() {
    this.isShowAccessibilityModal = true;
    // this.afterClick = true;
  }

  onClickSubmit() {
    this.isShowAccessibilityModal = false;
    this.onClickScanCheque();
  }

  onClickScanCheque() {

    this.showDepositDetails = true;
    this.showInstrumentDetails = true;
    this.showManualInstrumentDetails = false;

    this.headerFieldForm.hid = "1";
    this.headerFieldForm.chequeNumber = "1245";

    this.formData.headerFields = [
      {
        hid: "0",
        chequeNumber: "1221",
        micrCode: "adsasd",
        draweeBank: "",
        draweeBranch: "",
        clrLoc: "",
        chequeAmt: "",
        chequeDate: "",
        corpClientCode: "",
        corpClientName: "",
        payeeName: "",
        payeeAccNo: "",
        productCode: "",
        productName: "",
        cleringDays: "",
        creditDueDate: ""
      }
    ];

    this.headerFieldForm = this.formData.headerFields[0];

    console.log("this.formData.headerFields", this.formData.headerFields);
  }

  colDefUrl: ColDef[] = [
    { field: 'chequeNumber' },
    { field: 'micrCode' },
    { field: 'draweeBank' },
    { field: 'draweeBranch' },
    { field: 'clrLoc' },
    { field: 'chequeAmt' },
    { field: 'chequeDate' },
    { field: 'action', cellRenderer: 'actionCellRenderer' },
  ]

  dataUrl = [
    {
      hid: "2",
      chequeNumber: "789378",
      micrCode: "400244008",
      draweeBank: "ABN AMRO",
      draweeBranch: "Branch 1",
      clrLoc: "Bur Dubai",
      chequeAmt: "10,000",
      chequeDate: "10-Aug-2023",
      corpClientCode: "C1002",
      corpClientName: "JUMBO",
      payeeName: "Payee1",
      payeeAccNo: "576239087",
      productCode: "Product 1",
      productName: "Product 2",
      cleringDays: "15",
      creditDueDate: "23-Aug-2023",
      action: [
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'pi pi-trash',
          methodName: 'onDeleteHeaderField',
          paramList: 'hid',
        },
        {
          index: 3,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          methodName: 'onEditHeaderField',
          paramList: 'hid',
        },
      ]
    },
    {
      hid: "3",
      chequeNumber: "789381",
      micrCode: "400245001",
      draweeBank: "ABN CDYO",
      draweeBranch: "Branch 2",
      clrLoc: "Bur Dubai",
      chequeAmt: "30,000",
      chequeDate: "15-Jul-2023",
      corpClientCode: "C1003",
      corpClientName: "JUMBO",
      payeeName: "Payee1",
      payeeAccNo: "576239087",
      productCode: "Product 1",
      productName: "Product 2",
      cleringDays: "15",
      creditDueDate: "23-Aug-2023",
      action: [
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'pi pi-trash',
          methodName: 'onDeleteHeaderField',
          paramList: 'hid',
        },
        {
          index: 3,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          methodName: 'onEditHeaderField',
          paramList: 'hid',
        },
      ]
    }
  ]

  dataUrl2 = [
    {
      hid: "2",
      chequeNumber: "789378",
      micrCode: "400244008",
      draweeBank: "ABN AMRO",
      draweeBranch: "Branch 1",
      clrLoc: "Bur Dubai",
      chequeAmt: "10,000",
      chequeDate: "10-Aug-2023",
      corpClientCode: "C1002",
      corpClientName: "JUMBO",
      payeeName: "Payee1",
      payeeAccNo: "576239087",
      productCode: "Product 1",
      productName: "Product 2",
      cleringDays: "15",
      creditDueDate: "23-Aug-2023",
      action: [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'onViewHeaderField',
          paramList: 'hid',
        }
      ]
    },
    {
      hid: "3",
      chequeNumber: "789381",
      micrCode: "400245001",
      draweeBank: "ABN CDYO",
      draweeBranch: "Branch 2",
      clrLoc: "Bur Dubai",
      chequeAmt: "30,000",
      chequeDate: "15-Jul-2023",
      corpClientCode: "C1003",
      corpClientName: "JUMBO",
      payeeName: "Payee1",
      payeeAccNo: "576239087",
      productCode: "Product 1",
      productName: "Product 2",
      cleringDays: "15",
      creditDueDate: "23-Aug-2023",
      action: [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'onViewHeaderField',
          paramList: 'hid',
        }
      ]
    }
  ]

  onCancelHeaderFieldForm() {
    this.showAddHeaderFields = false;
    this.headerFieldIndex = -1;
    this.headerFieldForm = new HeaderFieldForm();
  }

  onAddHeaderFields() {
    const data: any = {
      ...this.headerFieldForm,
      hid: new Date().getTime() + Math.random() * 1000,
      actions: [
        // {
        //   index: 1,
        //   displayName: 'View',
        //   type: 'ICON',
        //   icon: 'fa-eye',
        //   methodName: 'onViewHeaderField',
        //   paramList: 'hid',
        // },
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'pi pi-trash',
          methodName: 'onDeleteHeaderField',
          paramList: 'hid',
        },
        {
          index: 3,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          methodName: 'onEditHeaderField',
          paramList: 'hid',
        },
      ],
    };

    this.formData.headerFields.push(data);
    console.log("this.formData.headerFields", this.formData.headerFields);

    this.headerFieldGrid?.refreshGridList();

    this.showAddHeaderFields = false;

    this.headerFieldForm = new HeaderFieldForm();
  }

  onUpdateHeaderField() {
    this.formData.headerFields[this.headerFieldIndex] = this.headerFieldForm;

    this.headerFieldIndex = -1;

    this.headerFieldGrid?.refreshGridList();

    this.showAddHeaderFields = false;

    this.headerFieldForm = new HeaderFieldForm();
  }

  onUpdateManualHeaderField() {
    this.formData.headerFields[this.headerFieldIndex] = this.headerFieldForm;

    this.headerFieldIndex = -1;

    this.headerFieldGrid?.refreshGridList();

    this.showAddHeaderFields = false;

    this.headerFieldForm = new HeaderFieldForm();
  }

  onViewHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);

    this.formData.headerFields = [
      {
        hid: "2",
        chequeNumber: "789378",
        micrCode: "400244008",
        draweeBank: "ABN AMRO",
        draweeBranch: "Branch 1",
        clrLoc: "Bur Dubai",
        chequeAmt: "10,000",
        chequeDate: "10-Aug-2023",
        corpClientCode: "C1002",
        corpClientName: "JUMBO",
        payeeName: "Payee1",
        payeeAccNo: "576239087",
        productCode: "Product 1",
        productName: "Product 2",
        cleringDays: "15",
        creditDueDate: "23-Aug-2023"
      }
    ];

    // this.headerFieldForm = this.formData.headerFields[index];
    // this.showAddHeaderFields = true;

    // this.headerFieldIndex = index;
    // this.headerFieldForm = this.formData.headerFields[index];
    this.headerFieldIndex = 0;
    this.headerFieldForm = this.formData.headerFields[0];
    this.showViewHeaderFields = true;

    // if (index >= 0) {
    //   this.headerFieldForm = this.formData.headerFields[index];
    //   this.showAddHeaderFields = true;
    // }
  }

  onDeleteHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);
    if (index >= 0) {
      this.formData.headerFields.splice(index, 1);

      this.headerFieldGrid?.refreshGridList();
    }
  }

  onEditHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);

    this.formData.headerFields = [
      {
        hid: "2",
        chequeNumber: "789378",
        micrCode: "400244008",
        draweeBank: "ABN AMRO",
        draweeBranch: "Branch 1",
        clrLoc: "Bur Dubai",
        chequeAmt: "10,000",
        chequeDate: "10-Aug-2023",
        corpClientCode: "C1002",
        corpClientName: "JUMBO",
        payeeName: "Payee1",
        payeeAccNo: "576239087",
        productCode: "Product 1",
        productName: "Product 2",
        cleringDays: "15",
        creditDueDate: "23-Aug-2023"
      }
    ];

    // this.headerFieldIndex = index;
    // this.headerFieldForm = this.formData.headerFields[index];
    this.headerFieldIndex = 0;
    this.headerFieldForm = this.formData.headerFields[0];
    this.showAddHeaderFields = true;

    // if (index >= 0) {
    //   this.headerFieldIndex = index;
    //   this.headerFieldForm = this.formData.headerFields[index];
    //   this.showAddHeaderFields = true;
    // }
  }

  onEditManualHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);

    this.formData.headerFields = [
      {
        hid: "1",
        chequeNumber: "1221",
        micrCode: "adsasd",
        draweeBank: "",
        draweeBranch: "",
        clrLoc: "",
        chequeAmt: "",
        chequeDate: "",
        corpClientCode: "",
        corpClientName: "",
        payeeName: "",
        payeeAccNo: "",
        productCode: "",
        productName: "",
        cleringDays: "",
        creditDueDate: ""
      }
    ];

    this.headerFieldIndex = index;
    this.headerFieldForm = this.formData.headerFields[index];
    this.showAddHeaderFields = true;

    // if (index >= 0) {
    //   this.headerFieldIndex = index;
    //   this.headerFieldForm = this.formData.headerFields[index];
    //   this.showAddHeaderFields = true;
    // }
  }

}
