import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ReceiptUpload } from './@models/receipt-upload.model';

@Component({
  selector: 'app-receipt-upload',
  templateUrl: './receipt-upload.component.html',
  styleUrls: ['./receipt-upload.component.scss'],
})
export class ReceiptUploadComponent implements OnInit {
  @ViewChild('receiptUploadForm') receiptUploadForm: any;
  @ViewChild('edrDataListingGrid') edrDataListingGrid: AgGridListingComponent;

  listingType: string = 'card';
  edrDataColDefsUrl: string = 'rms/transactions/receiptUpload/private/uploadedDataColDefs';

  orgTreeData: any[];
  formData: ReceiptUpload | any;
  programList: Select[] = [];
  stepperDetails: Stepper = {
    masterName: 'Receipt Upload',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  mode: string = '';
  recentUploadedReceipt: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
  ) {
    this.formData = {
      transactionDate: '',
      programId: '',
      programName: '',
      uploadedFileName: '',
      totalRecords: '',
      totalUploadedRecords: '',
      uploadDate: '',
      uploadBy: '',
      status: 'Success',
      fileName: '',
      fileSize: '',
      fileFormat: '',
      uploadDocuments: [],
    };
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Receipt Entry Initiate',
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
      { label: 'RMS' },
      { label: 'Transactions' },
      { label: 'Receipt Upload' },
      { label: 'Upload' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.orgTreeData = [
      {
        type: 'single',
        nodes: [
          {
            isLeafNode: false,
            header: 'Receipt file Upload',
            subHeader: '12 Aug 2022, 13:35',
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
            header: 'File Parsed Sucessfully',
            subHeader: '16 Aug 2022, 14:27',
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
            isLeafNode: false,
            header: 'Validation in Progress',
            subHeader: '19 Aug 2022, 12:16',
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
            isLeafNode: false,
            header: 'Sent for Approval',
            subHeader: '',
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
            active: false,
            partiallyActive: false,
            disabled: true,
          },
        ],
      },
    ];
    this.getDropdownData();
    this.formData.transactionDate = this.userService.applicationDate;
    this.getViewData();
  }

  getDropdownData(): void {
    this.httpService
      .httpPost('rms/transactions/receiptUpload/private/dropdown/programDataList')
      .subscribe((response: any) => {
        this.programList = response.dataList;
      });
    // this.httpService.httpPost('rms/transactions/receiptUpload/private/getAuthorizedList').subscribe((response: any) => {
    //   this.recentUploadedReceipt = response.data
    // })
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('rms/transactions/receiptUpload/private/view', data)
        .subscribe((formData: ReceiptUpload) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  setProgramNameById(programId: string): void {
    this.formData.programName = this.programList.find(
      (res: any) => res.id === programId,
    ).displayName;
  }

  onFileUploaded(files: any[]): void {
    this.formData.uploadDocuments = [];
    this.formData.uploadDocuments = files;
    this.formData.totalRecords = this.formData.uploadDocuments.length.toString();
    this.formData.totalUploadedRecords = this.formData.uploadDocuments.length.toString();
    this.formData.uploadBy = this.userService.userDetails.fullName;
    this.formData.uploadDate = this.formData.transactionDate;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.receiptUploadForm && this.receiptUploadForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }

  beforeSubmit(): boolean {
    const formData = new FormData();
    formData.append('transactionDate', this.formData.transactionDate);
    formData.append('programId', this.formData.programId);
    formData.append('programName', this.formData.programName);
    formData.append('uploadedFileName', this.formData.uploadedFileName);
    formData.append('totalRecords', this.formData.totalRecords);
    formData.append('totalUploadedRecords', this.formData.totalUploadedRecords);
    formData.append('uploadBy', this.formData.uploadBy);
    formData.append('status', this.formData.status);
    formData.append('uploadDate', this.formData.uploadDate);
    formData.append(
      'uploadDocuments',
      this.formData.uploadDocuments[0],
      this.formData.uploadDocuments[0].fileName,
    );
    this.formData = formData;

    return true;
  }
}
