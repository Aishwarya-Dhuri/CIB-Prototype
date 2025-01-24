import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

class BeneficiaryUploadModel {
  constructor(
    public dataLayout = '',
    public uploadFile = [],
    public fileName = '',
    public channel = 'H2H',
    public status = 'E',
  ) {}
}

@Component({
  selector: 'app-beneficiary-upload',
  templateUrl: './beneficiary-upload.component.html',
  styleUrls: ['./beneficiary-upload.component.scss'],
})
export class BeneficiaryUploadComponent implements OnInit {
  formData: BeneficiaryUploadModel;
  isLayoutData = false;
  isInfo = false;
  // isReview: boolean = false;
  dataLayouts: any[] = [
    {
      id: 'AUTOMATIONBENECORPUPLOAD',
      displayName: 'AUTOMATIONBENECORPUPLOAD',
    },
    {
      id: 'TTCFEBENEUPLOAD',
      displayName: 'TTCFEBENEUPLOAD',
    },
  ];
  mode: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private router: Router,
  ) {
    this.formData = new BeneficiaryUploadModel();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Beneficiary - Initiate',
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
      { label: 'Masters' },
      { label: 'Beneficiary Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/masters/beneficiaryUpload/private/view', data)
        .subscribe((formData: BeneficiaryUploadModel) => {
          this.viewService.clearAll();
          this.formData = formData;
          // if (this.mode == 'VIEW') {
          //   this.isReview = true;
          // }
        });
    }
  }

  onFileUploaded(files: any[]) {
    this.formData.uploadFile = [];

    this.formData.fileName = files[0].fileName;

    this.formData.uploadFile.push({
      originalFileName: files[0].fileName,
      sysFileName: files[0].sysFileName,
      size: files[0].fileSize,
      ...files[0],
    });
  }

  onSubmit() {
    let url = 'payments/masters/beneficiaryUpload/private/';
    if (this.mode == 'edit' || this.mode == 'resubmit') {
      url = url + 'update';
    } else {
      url = url + 'create';
    }
    this.httpService.httpPost(url, this.formData).subscribe((response: any) => {
      this.goToListing();
    });
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
