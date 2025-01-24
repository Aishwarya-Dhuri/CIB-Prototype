import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ChequeRendererComponent } from './@component/cheque-renderer/cheque-renderer.component';

class BulkPositivePayModel {
  constructor(
    public transactionDate: any = new Date(),
    public template: string = '',
    public uploadDocument: any[] = [],
    public fileName: string = '',
    public chequeImages: any[] = [],
    public remarkForChecker: string = '',
    public channel: string = 'H2H',
    public status: string = 'E',
  ) {}
}

@Component({
  selector: 'app-cheque-upload',
  templateUrl: './cheque-upload.component.html',
  styleUrls: ['./cheque-upload.component.scss'],
})
export class ChequeUploadComponent implements OnInit {
  loading: boolean = true;

  formData: any;
  isLayoutData = false;

  chequeImageUrl: string = '';

  transactionDetails: any;

  mode = '';

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Bulk Cheque Lodgement - Initiate',
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

  frameworkComponents: any = {
    chequeRenderer: ChequeRendererComponent,
  };

  stepperDetails: Stepper = {
    masterName: 'Bulk Payment',
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
    private router: Router,
  ) {
    this.formData = new BulkPositivePayModel();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bulk Payment',
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
      { label: 'Transactions' },
      { label: 'Bulk Payment' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('positivePay/transactions/chequeUpload/private/view', data)
        .subscribe((formData: BulkPositivePayModel) => {
          this.viewService.clearAll();

          this.stepperDetails.currentStep = this.stepperDetails.headings.length;

          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onViewTransaction(transactionId: string) {
    console.log(this.formData.id, transactionId);
    this.httpService
      .httpPost('positivePay/transactions/chequeUpload/private/viewTransaction', {
        dataMap: { id: this.formData.id, transactionId },
      })
      .subscribe((response: any) => {
        this.transactionDetails = response;
      });
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.uploadDocument.length > 0 && this.formData.template;
    }
  }

  onFileUploaded(file: any) {
    this.formData.uploadDocument = file;
  }

  beforeSubmit() {
    const formData = new FormData();

    formData.append('transactionDate', this.formData.transactionDate);
    formData.append('template', this.formData.template);
    formData.append('remarkForChecker', this.formData.remarkForChecker);
    formData.append('channel', this.formData.channel);
    formData.append('status', this.formData.status);
    formData.append('chequeImages', JSON.stringify(this.formData.chequeImages));

    formData.append(
      'bulkChequeFile',
      this.formData.uploadDocument[0],
      this.formData.uploadDocument[0].name,
    );
    this.formData = formData;

    return true;
  }

  onChequeImagesUploaded(files: any) {
    this.formData.chequeImages = [];
    const n: number = files.length;
    for (let i = 0; i < n; i++) {
      this.formData.chequeImages.push({ fileSize: files[i].fileSize, fileName: files[i].fileName });
      this.chequeImageBlob(files[i], i);
    }
  }

  chequeImageBlob(file: File, i: number) {
    const reader = new FileReader();
    reader.onload = () => {
      this.formData.chequeImages[i]['chequeImageUrl'] = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onChequeClick(chequeImageUrl: string) {
    this.chequeImageUrl = chequeImageUrl;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
