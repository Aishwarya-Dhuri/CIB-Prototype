import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

class BillPaymentModel {
  constructor(
    public transactionDate: any = new Date(),
    public uploadDocument: any[] = [],
    public fileName: string = '',
    public supportingDocument: any[] = [],
    public channel: string = 'H2H',
    public status: string = 'E',
    public totalBillAmount: number = 0,
    public noOfBills: number = 0,
  ) {}
}

@Component({
  selector: 'app-bill-payment-upload',
  templateUrl: './bill-payment-upload.component.html',
  styleUrls: ['./bill-payment-upload.component.scss'],
})
export class BillPaymentUploadComponent implements OnInit {
  loading: boolean = true;

  formData: any;
  isLayoutData = false;

  billDetails: any;

  isGroupUser: boolean = false;

  mode = '';

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Bill Payment Initiate',
          subHeader: '12 Aug 2022, 13:35',
          data: [],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'File Parsed Successfully',
          subHeader: '12 Aug 2022, 13:35',
          data: ['Total Records: 10000', 'Parsed: 7500', 'Failed: 2500'],
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Validation in Process',
          subHeader: '12 Aug 2022, 13:35',
          data: [],
          active: false,
          partiallyActive: true,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Sent for Approval',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: true,
          header: 'Authorized',
          subHeader: '',
          data: [],
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  stepperDetails: Stepper = {
    masterName: 'Bill Payment',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    // isSaveAsTemplateApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: [''],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private userService: UserService,
    private router: Router,
  ) {
    this.formData = new BillPaymentModel();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bill Payment',
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
      { label: 'Payments' },
      { label: 'Bill Payments' },
      { label: 'Bill Payment Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('payments/billPayments/billPaymentUpload/private/view', data)
        .subscribe((formData: BillPaymentModel) => {
          this.viewService.clearAll();

          this.stepperDetails.currentStep = this.stepperDetails.headings.length;

          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onViewBill(
    id: string,
    corporateName: string,
    consumerName: string,
    billAmount: string,
    paymentAmount: string,
    accountNo: string,
    billDate: string,
    dueDate: string,
    consumerNo: string,
    ref2: string,
  ) {
    this.billDetails = {
      id,
      corporateName,
      consumerName,
      billAmount,
      paymentAmount,
      accountNo,
      billDate,
      dueDate,
      consumerNo,
      ref2,
    };
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.uploadDocument.length > 0;
    }
    return true;
  }

  onFileUploaded(file: any) {
    this.formData.uploadDocument = file;
  }

  beforeSubmit() {
    const formData = new FormData();

    formData.append('transactionDate', this.formData.transactionDate);
    formData.append('channel', this.formData.channel);
    formData.append('status', this.formData.status);
    formData.append('supportingDocument', JSON.stringify(this.formData.supportingDocument));
    formData.append(
      'billPaymentFile',
      this.formData.uploadDocument[0],
      this.formData.uploadDocument[0].name,
    );
    this.formData = formData;

    return true;
  }

  onSupportingDocumentUploaded(file: any) {
    this.formData.supportingDocument = file;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
