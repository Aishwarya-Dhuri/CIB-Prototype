import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { UserUpload } from './@models/user-upload.model';

@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.scss'],
})
export class UserUploadComponent implements OnInit {
  @ViewChild('userUploadForm') userUploadForm: any;

  formData: UserUpload;
  uploadedFiles: any[];
  mode: string;
  isLayoutData: boolean;
  userUploadList: Select[] = [];
  stepperDetails: Stepper = {
    masterName: 'User Upload',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'User Upload',
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
      { label: 'Setup' },
      { label: 'Security' },
      { label: 'User Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.formData = {
      dataLayoutId: '',
      dataLayoutName: '',
      uploadFileName: '',
      uploadDateTime: moment().format('DD-MMM-YYYY'),
      uploadedBy: 'user01',
      uploadStatus: 'E',
      uploadFile: [],
    };
    this.getViewData();
    this.getDropdownData();
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.userUploadForm && this.userUploadForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }

  onFileUploaded(files: any[]): void {
    this.uploadedFiles = files;
    this.formData.uploadFile = [];
    files.forEach((file) => {
      this.formData.uploadFile.push({
        originalFileName: file.fileName,
        sysFileName: file.sysFileName,
        size: file.fileSize,
        ...file,
      });
    });
  }

  beforeSubmit(): boolean {
    this.formData.uploadFileName = this.formData.uploadFile[0].originalFileName;
    return true;
  }

  getDropdownData(): void {
    this.httpService
      .httpPost('setup/security/userUpload/private/dropdown/userUploadDataList')
      .subscribe((response: any) => {
        this.userUploadList = response.dataList;
      });
  }

  getLayoutById(layoutId: number): string {
    var dataLayoutName: string = '';
    dataLayoutName = this.userUploadList.find((res: any) => res.id === layoutId).displayName;
    this.formData.dataLayoutName = dataLayoutName;
    return dataLayoutName;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/userUpload/private/view', data)
        .subscribe((formData: UserUpload) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }
}
