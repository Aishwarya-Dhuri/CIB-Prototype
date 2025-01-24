import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { MandateManagementRegistration } from '../registration/@model/mandate-management-registration.model';
import { DirectDebitAmendment } from './@model/direct-debit-amendment.model';

@Component({
  selector: 'app-amendment',
  templateUrl: './amendment.component.html',
  styleUrls: ['./amendment.component.scss'],
})
export class AmendmentComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  loading: boolean;
  mode: string;

  currentField: string = '';
  showRemarkModal: boolean = false;
  viewMode: boolean = false;
  isSuppdoc = false;
  isMandateUpload = false;

  remarkInput: string = '';
  amendmentRemarks: string = '';

  formData: DirectDebitAmendment = new DirectDebitAmendment();

  currentScreen: string = 'FILTERS';

  selectedFilters: Filter[] = [];

  supportingDocuments = [
    { fileName: 'MMS-CREATE-INDB-INDBH2H-25062023-526954_front', fileSize: '0.12' }
  ]

  colDefUrl: string = 'directDebit/mandateManagement/amendment/private/mandateColDefs';
  rowData: any[] = [];
  context: any = { componentParent: this };
  frameworkComponents: any = {};
  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  stepperDetails: Stepper = {
    masterName: 'Mandate Amendment',
    currentStep: 1,
    isOnlyFooter: false,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: [
      'Product & Payer Details',
      'Payment Setup',
      'Enrichment Details',
      'Review Details & Confirm',
    ],
  };

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Mandate Amendment - Initiate',
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
      { label: 'Direct Debit' },
      { label: 'Mandate Management' },
      { label: 'Amendment' },
      { label: 'Amend' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.currentScreen = 'VIEW';
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('directDebit/mandateManagement/amendment/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onView(id: string) {
    this.viewMode = true;
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        const preparedFormData: any = this.prepareAmendmentData(formData);

        this.formData = { ...preparedFormData, mandateReferenceNumber: formData.id };

        this.stepperDetails.currentStep = this.stepperDetails.headings.length;

        this.currentScreen = 'VIEW';
      });
  }

  onAmendment(id: string) {
    const data = { dataMap: { id: id } };
    this.httpService
      .httpPost('directDebit/mandateManagement/registration/private/view', data)
      .subscribe((formData: any) => {
        const preparedFormData: any = this.prepareAmendmentData(formData);

        this.formData = { ...preparedFormData, mandateReferenceNumber: formData.id };

        this.currentScreen = 'VIEW';
      });
  }

  close() {
    this.currentScreen = 'SEARCH_RESULTS';
    this.viewMode = false;
    this.stepperDetails.currentStep = 1;
  }

  back() {
    this.router.navigate(['./', 'listing'], { relativeTo: this.route });
  }

  amendment() {
    const data = this.formData;

    this.httpService
      .httpPost('directDebit/mandateManagement/amendment/private/create', data)
      .subscribe((response: any) => {
        this.formData = new DirectDebitAmendment();
        this.back();
      });
  }

  getRecords(filters: Filter[]) {
    this.selectedFilters = filters;

    this.httpService
      .httpPost('directDebit/mandateManagement/amendment/private/getAmendmentList', {
        dataMap: filters,
      })
      .subscribe((data: any) => {
        this.rowData = data.dataList;
        this.currentScreen = 'SEARCH_RESULTS';
      });
  }

  prepareAmendmentData(formData: MandateManagementRegistration) {
    return {
      ...formData,
      payerEmailId: this.getAmendmentValue(formData.payerEmailId),
      payerMobileNo: this.getAmendmentValue(formData.payerMobileNo),
      address1: this.getAmendmentValue(formData.address1),
      address2: this.getAmendmentValue(formData.address2),
      address3: this.getAmendmentValue(formData.address3),
      mandateEndDate: this.getAmendmentValue(formData.mandateEndDate),
      amount: this.getAmendmentValue(formData.amount),
      maxUpto: this.getAmendmentValue(formData.maxUpto),
      inMultiply: this.getAmendmentValue(formData.inMultiply),
      notAbove: this.getAmendmentValue(formData.notAbove),
      relationshipManager: this.getAmendmentValue(formData.relationshipManager),
    };
  }

  private getAmendmentValue(value: string) {
    return [
      {
        value: value,
        newValue: value,
        remark: '',
        showRemark: false,
      },
    ];
  }

  onComment(field: string) {
    this.currentField = field;
    this.remarkInput = this.formData[field][0].remark;
    this.showRemarkModal = true;
  }

  addRemark() {
    this.formData[this.currentField][0].remark = this.remarkInput;
    this.showRemarkModal = false;
    this.currentField = '';
    this.remarkInput = '';
  }

  onDynamicFiltersReady() {
    this.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  onCheckboxCheck(check: any) {
    console.log(check);
    if (check.checked === true) {
      this.formData.mandateEndDate[0].newValue = null;
    }
  }

  onSelectIfsc(ifsc: any) {
    this.formData.payerBank = ifsc.bicCode;
    this.formData.payerSortCode = ifsc.bankName;
  }
}
