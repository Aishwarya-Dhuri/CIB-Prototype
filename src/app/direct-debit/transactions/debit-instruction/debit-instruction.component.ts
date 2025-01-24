import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { DebitInstruction } from './@model/debit-instruction.model';

@Component({
  selector: 'app-debit-instruction',
  templateUrl: './debit-instruction.component.html',
  styleUrls: ['./debit-instruction.component.scss']
})
export class DebitInstructionComponent implements OnInit {
  products: any[] = [];
  existingSubscribers: any[] = [];

  stepperDetails: Stepper = {
    masterName: 'Debit Instruction',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: DebitInstruction = new DebitInstruction();
  mode: string;

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Debit Instruction - Initiate',
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
      { label: 'Direct Debit' },
      { label: 'Transactions' },
      { label: 'Debit Instruction' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.effectiveStartDate = this.userService.getApplicationDate();

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('directDebit/transactions/debitInstruction/private/view', data)
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

  onSelectCorporate(corporate: any) {
    this.formData.corporateCode = corporate.corporateCode;
    this.formData.corporateName = corporate.corporateName;
  }

  onSelectMandate(mandateDetails: any) {
    this.formData.mandateRefNo = mandateDetails.mandateRefNo;
    this.formData.umrn = mandateDetails.umrn;
    this.formData.prodName = mandateDetails.prodName;
    this.formData.customerName = mandateDetails.customerName;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    }
    return true;
  }
}
