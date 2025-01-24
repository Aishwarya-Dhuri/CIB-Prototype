import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { RequestRecieveMoney } from './@model/request-recieve-money.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';

@Component({
  selector: 'app-request-recieve-money',
  templateUrl: './request-recieve-money.component.html',
  styleUrls: ['./request-recieve-money.component.scss']
})
export class RequestRecieveMoneyComponent implements OnInit {

  @ViewChild('apsform') apsform: NgForm;

  stepperDetails: Stepper = {
    masterName: 'Request/Receive Money',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: RequestRecieveMoney = new RequestRecieveMoney();

  mode: string;

  constructor(
    private httpService: HttpService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Request/Receive Money - Initiate',
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
      { label: 'UPI' },
      { label: 'Request Receive Money' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('payments/upi/sendMoney/private/view', data)
        .subscribe((formData: any) => {
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

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return this.apsform && this.apsform.valid;
    }
    return true;
  }

  validateOTP() {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'UPI ID Validated Successfully',
    });
  }

}
