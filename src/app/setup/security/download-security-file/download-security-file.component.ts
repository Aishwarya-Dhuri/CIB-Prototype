import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-download-security-file',
  templateUrl: './download-security-file.component.html',
  styleUrls: ['./download-security-file.component.scss'],
})
export class DownloadSecurityFileComponent implements OnInit {
  loading: boolean = false;

  showOtpModal: boolean = false;
  otp: string = '';

  securityFiles: any[] = [];

  private downloadFilePath: string = '';

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Download Security File',
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
      { label: 'Download Security File(s)' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.httpService
      .httpPost('setup/security/downloadSecurityFiles/private/getSecurityFiles')
      .subscribe((response: any) => {
        this.securityFiles = response.data;
        this.loading = false;
      });
  }

  validateOTP() {
    this.httpService
      .httpPost('setup/security/downloadSecurityFiles/private/validateOTP', {
        dataMap: { otp: this.otp },
      })
      .subscribe((response: any) => {
        if (!response.otpVerificationStatus) {
          this.toasterService.showToaster({
            severity: 'error',
            detail: 'Invalid OTP, please Enter Valid OTP',
          });

          this.otp = '';
        } else {
          this.downloadFile();
          this.closeOtpModal();
        }
      });
  }

  private generateOTP() {
    this.httpService
      .httpPost('setup/security/downloadSecurityFiles/private/generateOTP')
      .subscribe((response: any) => {
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'OTP Send Successfully',
        });
        this.showOtpModal = true;
      });
  }

  onDownloadFile(filePath: string) {
    this.downloadFilePath = filePath;
    this.generateOTP();
  }

  closeOtpModal() {
    this.showOtpModal = false;
    this.otp = '';
    this.downloadFilePath = '';
  }

  private downloadFile() {
    this.httpService.httpDownload(this.downloadFilePath);
  }
}
