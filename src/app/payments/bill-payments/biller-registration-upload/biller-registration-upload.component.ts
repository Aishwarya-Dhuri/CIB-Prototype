import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BillerRegistration } from '../biller-registration/@model/biller-registration.model';

class BillerRegistrationUploadModel {
  constructor(
    public uploadFile: any[] = [],
    public channel: string = 'H2H',
    public uploadStatus: string = 'S',
    public status: string = 'Unauthorized',
  ) {}
}

@Component({
  selector: 'app-biller-registration-upload',
  templateUrl: './biller-registration-upload.component.html',
  styleUrls: ['./biller-registration-upload.component.scss'],
})
export class BillerRegistrationUploadComponent implements OnInit {
  loading: boolean = true;

  formData: BillerRegistrationUploadModel | any;

  showBillerDetails = false;
  isLayoutData = false;
  isInfo = false;

  billerDetails: BillerRegistration;

  stepperDetails: Stepper = {
    masterName: 'Biller Registration Upload',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: [''],
  };

  mode: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Biller Registration Upload - Initiate',
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
      { label: 'Biller Registration Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData = new BillerRegistrationUploadModel();

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('payments/billPayments/billerRegistrationUpload/private/view', data)
        .subscribe((formData: BillerRegistrationUploadModel) => {
          this.viewService.clearAll();

          this.formData = formData;

          this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.formData.uploadFile && this.formData.uploadFile.length > 0;
    }
    return true;
  }

  beforeSubmit() {
    const formData = new FormData();

    formData.append('channel', this.formData.channel);
    formData.append('status', this.formData.status);
    formData.append('uploadStatus', this.formData.uploadStatus);
    formData.append(
      'billerRegistrationFile',
      this.formData.uploadFile[0],
      this.formData.uploadFile[0].name,
    );

    this.formData = formData;

    return true;
  }

  afterSubmit() {
    this.toasterService.showToaster({ severity: 'success', detail: 'File Uploaded Successfully' });
    return true;
  }

  onViewBillerDetails(billerId: string) {
    console.log(this.formData.id, billerId);
    this.httpService
      .httpPost('payments/billPayments/billerRegistrationUpload/private/viewBillerDetails', {
        dataMap: { id: this.formData.id, billerId },
      })
      .subscribe((response: any) => {
        this.billerDetails = response;
        this.showBillerDetails = true;
      });
  }

  onFileUploaded(files: any[]) {
    this.formData.uploadFile = files;

    this.formData.fileName = files[0].fileName;
  }
}
