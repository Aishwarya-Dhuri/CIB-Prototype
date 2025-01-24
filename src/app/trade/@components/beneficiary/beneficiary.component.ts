import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Beneficiary } from './@models/beneficiary.model';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiaryComponent implements OnInit {
  @ViewChild('initiate') initiateComponent: any;
  @ViewChild('review') reviewComponent: any;
  @Input('tradeType') tradeType: string;

  @Input() isViewMode: boolean;

  loading: boolean;
  formData: Beneficiary = new Beneficiary();
  mode: string = '';

  stepperDetails: Stepper = {
    masterName: 'Beneficiary Details',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Beneficiary Details', 'Review and Submit'],
  };
  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
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
      { label: 'Trade' },
      { label: 'Import' },
      { label: 'Beneficiary' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('trade/beneficiary/private/view', data)
        .subscribe((formData: Beneficiary) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }
  onStepClick(stepNo: number) {
    this.stepperDetails.currentStep = stepNo;
  }

  onStepChange(stepNo: number, subStepNo?: number): void {
    if (stepNo < 9) {
      this.initiateComponent.changeStep(stepNo - 1);
    }
  }
  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (
        this.initiateComponent &&
        this.initiateComponent.form &&
        this.initiateComponent.form.invalid
      ) {
        return false;
      }
    }
    return true;
  }
  beforSubmit(): boolean {
    this.formData.tradeType = this.tradeType;
    return true;
  }
}
