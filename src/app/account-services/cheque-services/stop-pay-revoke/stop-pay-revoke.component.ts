import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { environment } from 'src/environments/environment';
import { ChequeDetails, StopPayRevoke } from './@models/stop-pay-revoke..model';

@Component({
  selector: 'app-stop-pay-revoke',
  templateUrl: './stop-pay-revoke.component.html',
  styleUrls: ['./stop-pay-revoke.component.scss'],
})
export class StopPayRevokeComponent implements OnInit {
  loading: boolean;

  mode: string;
  formData: StopPayRevoke = new StopPayRevoke();
  viewDocuments: boolean = false;
  isChequeImage: boolean = false;
  chequeImageUrl: string = '';
  isShowTransaction: boolean = false;
  isShowDocumentUpload: boolean = false;
  isShowUploadedDocuments: boolean = false;

  chequeDetailsList: any[] = [];

  selectedChequeData: any;

  stepperDetails: Stepper = {
    masterName: 'Stop Pay / Revoke',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Stop Pay / Revoke',
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
      { label: 'Account Services' },
      { label: 'Cheque Service' },
      { label: 'Stop Pay / Revoke' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('accountServices/chequeServices/stopPayRevoke/private/view', data)
        .subscribe((formData: StopPayRevoke) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.chequeDetailsList = formData.chequeDetails;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  fetchChequeDetailsDetails(): void {
    this.httpService
      .httpPost('accountServices/chequeServices/chequeDataService/private/getChequeData')
      .subscribe((res) => {
        this.chequeDetailsList = res.data;
      });
  }

  showTransaction(chequeDetails: any): void {
    this.isShowTransaction = true;
    this.selectedChequeData = chequeDetails;
  }

  getChequeImageUrl(chequeImageUrl: string): string {
    let URL: string = '';
    URL = environment.serverUrl + '/' + chequeImageUrl;
    this.chequeImageUrl = URL;
    return URL;
  }

  onStepChange(stepNo: number) {
    if (stepNo == 2) {
      this.chequeDetailsList.forEach((chequeDetail: ChequeDetails) => {
        if (chequeDetail.isSelected) {
          this.formData.chequeDetails.push(chequeDetail);
        }
      });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      let selectedCount = 0;
      this.chequeDetailsList.forEach((chequeDetail: ChequeDetails) => {
        if (chequeDetail.isSelected) {
          selectedCount++;
        }
      });
      return selectedCount > 0 && !!this.formData.reason;
    }
    return true;
  }

  onFileUploaded(files: any): void {
    this.formData.documents = files;
  }

  resetDocuments(): void {
    this.formData.documents = [];
  }

  resetStopPayRevokeForm(chequeType?: string): void {
    this.formData = new StopPayRevoke();
    if (chequeType) {
      this.formData.chequeType = chequeType;
    }
  }

  onDocumentUpload(files: any): void {
    this.formData.documents = files;
  }

  onAccountNoSelection(event: any) {
    this.formData.accountName = event.displayName;
  }

  beforeSubmit(): boolean {
    this.formData.beneficiary = this.chequeDetailsList[0].beneficiary;
    this.formData.chequeDate = this.formData.chequeDate.toString();
    return true;
  }
}
