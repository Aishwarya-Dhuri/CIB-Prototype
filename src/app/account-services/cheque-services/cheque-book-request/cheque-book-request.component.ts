import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ChequeBookRequest } from './@models/cheque-book-request.model';

@Component({
  selector: 'app-cheque-book-request',
  templateUrl: './cheque-book-request.component.html',
  styleUrls: ['./cheque-book-request.component.scss'],
})
export class ChequeBookRequestComponent implements OnInit {
  @ViewChild('chequeBookRequestForm') chequeBookRequestForm: any;

  loading: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Cheque Book Request',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  formData: ChequeBookRequest;
  mode: string;
  viewport: string;
  isShowDocumentUpload: boolean = false;
  viewDocuments: boolean = false;
  chequeImageUrl: string = '';

  isSubmitAck: boolean = false;

  addressLine2: boolean = false;
  addressLine3: boolean = false;

  constructor(
    private actionsService: ActionService,
    private httpService: HttpService,
    private viewService: ViewService,
    private viewportService: ViewportService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Corporate Role Initiate',
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
      { label: 'Cheque Book Request' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.chequeImageUrl = this.httpService.getAssetUrl('assets/cheque/demo-cheque.jpg');

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.formData = new ChequeBookRequest();

    this.formData.requestDate = this.userService.getApplicationDate();

    this.mode = this.viewService.getMode();

    if (this.mode) {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      if (this.mode == 'EDIT' || this.mode == 'VIEW') {
        const data = { dataMap: { id: this.viewService.getId() } };
        this.httpService
          .httpPost('accountServices/chequeServices/chequeBookRequest/private/view', data)
          .subscribe((formData: ChequeBookRequest) => {
            this.viewService.clearAll();
            this.formData = formData;
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  deleteAddressLine(line: number) {
    if (line == 2) {
      if (this.addressLine3) {
        this.formData.address2 = this.formData.address3;
        this.addressLine3 = false;
      } else {
        this.formData.address2 = '';
        this.addressLine2 = false;
      }
    } else if (line == 3) {
      this.formData.address3 = '';
      this.addressLine3 = false;
    }
  }

  afterSubmit(response: any) {
    this.formData['id'] = response.dataMap.id;

    this.isSubmitAck = true;
    return false;
  }

  cancel() {
    this.isSubmitAck = false;
    this.router.navigate(['./listing'], { relativeTo: this.route });
  }

  onAccountSelected(account: any): void {
    this.formData.accountNo = account.enrichments.accountNo;
    this.formData.accountTitle = account.enrichments.accountTitle;
    this.formData.accountName = account.enrichments.accountTitle;
  }

  onFileUploaded(files: any): void {
    this.formData.documents = files;
  }

  reset(): void {
    this.formData.documents = [];
  }

  showDocumentUploadModal(): void {
    this.isShowDocumentUpload = true;
  }

  onAccountTypeSelection(accountSelection: string) {
    this.formData.accountId = '';
    this.formData.accountTitle = '';
  }

  onDocumentUpload(files: any): void {
    this.formData.documents = files;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.chequeBookRequestForm && this.chequeBookRequestForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }
}
