import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ConsolidatedUpload } from './@models/consolidated-upload.model';

@Component({
  selector: 'app-consolidated-upload',
  templateUrl: './consolidated-upload.component.html',
  styleUrls: ['./consolidated-upload.component.scss']
})
export class ConsolidatedUploadComponent implements OnInit {
  formData: ConsolidatedUpload;
  uploadedFiles: any[];
  mode: string;
  isLayoutData: boolean;
  isReview: boolean = false;
  userUploadList = [
    { id: 'consolidatedUpload', displayName: 'Consolidated Upload' }
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private userService: UserService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'FSCM' },
      { label: 'Transaction' },
      { label: 'Consolidated Upload' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.formData = {
      dataLayout: '',
      uploadFileName: '',
      uploadDateTime: '',
      uploadedBy: '',
      uploadStatus: 'S',
      uploadFile: [],
    };
    this.getViewData();
  }

  onFileUploaded(files: any[]) {
    var date = new Date();
    var time = date.getHours() + ':' + date.getMinutes();
    var formatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    this.uploadedFiles = files;
    this.formData.uploadFile = [];
    files.forEach((file) => {
      (this.formData.uploadFileName = file.fileName),
        (this.formData.uploadDateTime = formatedDate + '|' + time);
      this.formData.uploadedBy = this.userService.userName;
      this.formData.uploadFile.push({
        originalFileName: file.fileName,
        sysFileName: file.sysFileName,
        size: file.fileSize,
        ...file,
      });
    });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('fscm/transactions/consolidatedUpload/private/view', data)
        .subscribe((formData: ConsolidatedUpload) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.isReview = true;
          }
        });
    }
  }

  onSubmit() {
    let url = 'fscm/transactions/consolidatedUpload/private/';
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

  cancel() {
    this.router.navigateByUrl('fscm/transactions/consolidatedUpload/listing');
  }

}
