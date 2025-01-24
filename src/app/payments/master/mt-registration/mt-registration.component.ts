import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Router } from '@angular/router';
import { MTRegistrationModel } from './@model/mt-registration.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';

@Component({
  selector: 'app-mt-registration',
  templateUrl: './mt-registration.component.html',
  styleUrls: ['./mt-registration.component.scss'],
})
export class MtRegistrationComponent implements OnInit {
  @ViewChild('mtRegistrationForm') mtRegistrationForm: any;

  formData: MTRegistrationModel;

  mode: string;

  showBicCodeModal: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'MT Registration',
    currentStep: 1,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    public userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'MT Registration - Initiate',
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
      { label: 'MT Registration' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData = new MTRegistrationModel();

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/masters/mtRegistration/private/view', data)
        .subscribe((formData: MTRegistrationModel) => {
          this.viewService.clearAll();
          if (formData) {
            this.formData = formData;
            if (this.mode == 'VIEW') {
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
          }
        });
    }
  }

  onChangeTagMapping(): void {}

  onChangeMessageType(messageType: any) {
    if (messageType.id == 'Incoming') {
      this.formData.outgoingBank[0].bicCode = '';
      this.formData.outgoingBank[0].bankName = '';
      this.formData.receivingBank[0].code = '12345';
      this.formData.receivingBank[0].bankName = 'DEMO Bank';
    } else {
      this.formData.receivingBank[0].code = '';
      this.formData.receivingBank[0].bankName = '';
      this.formData.outgoingBank[0].bicCode = '12345';
      this.formData.outgoingBank[0].bankName = 'DEMO Bank';
    }
  }

  onStatementType(statementType) {
    if (statementType.id == 'MT950') {
      this.formData.channel = 'SWIFT';
    }
  }

  reset() {
    this.formData = new MTRegistrationModel();
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.mtRegistrationForm && this.mtRegistrationForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }

  onSelectReceivingBicCode(bicCodeData: any) {
    if (this.formData.messageType == 'Incoming') {
      this.formData.outgoingBank[0].bicCode = bicCodeData.bicCode;
      this.formData.outgoingBank[0].bankName = bicCodeData.bankName;
    } else {
      this.formData.receivingBank[0].code = bicCodeData.bicCode;
      this.formData.receivingBank[0].bankName = bicCodeData.bankName;
    }
  }
}
