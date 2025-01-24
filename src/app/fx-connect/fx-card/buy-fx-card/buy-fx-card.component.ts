import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BuyFxCard, CurrencyDetails } from './@model/buyFxCard.model';

@Component({
  selector: 'app-buy-fx-card',
  templateUrl: './buy-fx-card.component.html',
  styleUrls: ['./buy-fx-card.component.scss'],
})
export class BuyFxCardComponent implements OnInit {
  loading: boolean;
  mode: string = '';

  isAgree: boolean = false;

  showTermsAndConditions: boolean = false;

  showMfContractFxRate: boolean = false;

  otp: string = '';

  formData: BuyFxCard = new BuyFxCard();

  currencyDetails: CurrencyDetails = new CurrencyDetails();

  supportingDocuments: any[] = [];

  termsAndConditions: any[] = [];

  editFxDetailsIndex: number = -1;

  colDefUrl: string = 'fxConnect/fxCard/buy/private/colDefs';

  columnDefs: any[] = [
    {
      field: 'srNo',
      headerName: 'Sr. No.',
    },
    {
      field: 'currency',
      headerName: 'FX Currency',
    },
    {
      field: 'amount',
      headerName: 'Balance',
    },
    {
      field: 'accountNumber',
      headerName: 'Account Number',
    },
    {
      field: 'rateType',
      headerName: 'Rate Type',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: 'actionCellRenderer',
    },
  ];

  addressLine2: boolean = false;
  addressLine3: boolean = false;

  context: any = { componentParent: this };

  frameworkComponents: any = {};

  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  stepperDetails: Stepper = {
    masterName: 'Buy FX Card',
    currentStep: 1,
    isOnlyFooter: false,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Forex & Travel Details', 'ID & Documents Details', 'Review Details & Confirm'],
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'FX Card - Buy - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'FX Connect' },
      { label: 'FX Card' },
      { label: ' Buy' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getSupportingDocuments();
    this.getTermsAndConditions();
  }

  deleteAddressLine(line: number) {
    if (line == 2) {
      if (this.addressLine3) {
        this.formData.address2 = this.formData.address3;
        this.addressLine3 = false;
      } else {
        this.formData.address2 = '';
        this.addressLine2 = false;
      }
    } else if (line == 3) {
      this.formData.address3 = '';
      this.addressLine3 = false;
    }
  }

  getViewData() {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('fxConnect/fxCard/buy/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  generateSupportingDocuments() {
    this.supportingDocuments.forEach((document: any) => {
      document.fieldList.forEach((field: any) => {
        if (field.fieldType == 'FILE') {
          this.formData[field.name] = [];
        } else {
          this.formData[field.name] = '';
        }
      });
    });
  }

  addForexDetails() {
    const currencyDetailsIndex = this.formData.currencyDetails.findIndex(
      (curDetails: CurrencyDetails) => curDetails.currencyCode == this.currencyDetails.currencyCode,
    );

    if (currencyDetailsIndex >= 0) {
      this.formData.currencyDetails[currencyDetailsIndex].amount = (
        +this.formData.currencyDetails[currencyDetailsIndex].amount + +this.currencyDetails.amount
      ).toString();
    } else {
      this.currencyDetails.actions = [
        {
          index: 1,
          paramList: 'id',
          methodName: 'view',
          type: 'BUTTON',
          displayName: 'VIEW',
          icon: '',
        },
      ];

      this.formData.currencyDetails.push(this.currencyDetails);
    }

    this.calculateCharges();
    this.currencyDetails = new CurrencyDetails();
  }

  getSubHeading(stepNo: number) {
    if (stepNo == 1) {
      return `${this.formData.totalBalance} | ${this.formData.purpose} | ${this.formData.countryOfTravel}`;
    } else if (stepNo == 2) {
      return `${this.formData.nationalId}`;
    } else {
      return `Step ${stepNo} Details`;
    }
  }

  onStepChanged(stepNo: number) {
    if (stepNo == 1) {
      // Step 1 Operations
    } else if (stepNo == 2) {
      this.formData.currencyDetails = this.formData.currencyDetails.map((data: any, i: number) => {
        return { ...data, ['srNo']: i + 1 };
      });
    } else if (stepNo == 3) {
      // Step 2 Operations
    }
    return true;
  }

  editForexDetails(index: number) {
    this.editFxDetailsIndex = index;

    this.currencyDetails = this.formData.currencyDetails[index];

    this.stepperDetails.currentStep = 1;
  }

  saveForexDetails() {
    this.formData.currencyDetails[this.editFxDetailsIndex] = this.currencyDetails;

    this.calculateCharges();

    this.currencyDetails = new CurrencyDetails();

    this.editFxDetailsIndex = -1;
  }

  getSupportingDocuments() {
    this.httpService
      .httpPost('fxConnect/buy/private/getSupportingDocumentsFields')
      .subscribe((response: any) => {
        this.supportingDocuments = response.dataList;
        this.generateSupportingDocuments();
        this.getViewData();
      });
  }

  getTermsAndConditions() {
    this.httpService
      .httpPost('fxConnect/buy/private/getTermsAndConditions')
      .subscribe((response: any) => {
        this.termsAndConditions = response.dataList;
      });
  }

  calculateCharges() {
    let totalBalance: number = 0;

    this.formData.currencyDetails.forEach((record: any) => {
      totalBalance += record.amount ? +record.amount : 0;
    });

    this.formData.totalBalance = totalBalance;
    this.formData.charges = totalBalance * 0.005;
    this.formData.gstOnCharges = this.formData.charges * 0.05;
    this.formData.gstOnCFxConversion = this.formData.charges * 0.05;
    this.formData.totalChargesApplicable =
      this.formData.charges + this.formData.gstOnCharges + this.formData.gstOnCFxConversion;
    this.formData.netTotal = totalBalance + this.formData.totalChargesApplicable;
  }

  onChangeMfContractFxRate(event: any) {
    this.currencyDetails.mfContractFxRate = event.mfContract;
  }

  deleteForexDetails(index: number) {
    this.formData.currencyDetails.splice(index, 1);
    this.calculateCharges();
  }
}
