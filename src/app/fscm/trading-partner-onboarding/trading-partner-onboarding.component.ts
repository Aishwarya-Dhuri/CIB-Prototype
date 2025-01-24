import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { TradePartnerOnboarding } from './@model/seller-buyer-onboarding.model';

@Component({
  selector: 'app-trading-partner-onboarding',
  templateUrl: './trading-partner-onboarding.component.html',
  styleUrls: ['./trading-partner-onboarding.component.scss'],
})
export class TradingPartnerOnboardingComponent implements OnInit {
  @ViewChild('details') details: any;
  @ViewChild('parameters') parameters: any;
  @ViewChild('authenticationRules') authenticationRules: any;

  stepEditing = false;

  stepperDetails: Stepper;

  formData: TradePartnerOnboarding;

  mode: string;

  isShowCopyExistingModel = false;

  isInitiateForm: boolean = false;

  copyFromExistingColDefUrl = '';
  copyFromExistingRowDefUrl = '';

  searchText: string = '';

  constructor(
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private router: Router,
  ) {
    this.formData = new TradePartnerOnboarding();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Trading Partner Onboarding - Initiate',
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
      { label: 'FSCM' },
      { label: 'Trading Partner Onboarding' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.stepperDetails = {
      masterName: 'Trade Partner Onboarding',
      currentStep: 1,
      isSaveDraftApplicable: true,
      isSecondLastStepLabelAsReview: true,
      headings: [
        `${this.formData.type} Details`,
        'Parameters',
        'Authorization Rule',
        'Review and Confirm',
      ],
    };

    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('fscm/onboarding/tradingPartnerOnboarding/private/view', data)
        .subscribe((formData: TradePartnerOnboarding) => {
          this.viewService.clearAll();
          if (formData) {
            this.formData = formData;
            this.isInitiateForm = true;
            if (this.mode == 'VIEW') {
              this.stepperDetails.currentStep = this.stepperDetails.headings.length;
            }
          }
        });
    }
  }

  onSelection(event) {
    this.httpService
      .httpPost('fscm/onboarding/tradingPartnerOnboarding/private/copyData')
      .subscribe((sellerBuyerData: any) => {
        this.formData = sellerBuyerData;

        this.isShowCopyExistingModel = false;
        this.isInitiateForm = true;
      });
  }

  newOnboarding(sellerOrBuyer: string) {
    this.formData.type = sellerOrBuyer;

    this.isInitiateForm = true;
  }

  copyFromExisting(sellerOrBuyer: string) {
    this.formData.type = sellerOrBuyer;

    this.copyFromExistingColDefUrl = `fscm/onboarding/tradingPartnerOnboarding/private/${sellerOrBuyer.toLowerCase()}Onboarding/copyExisting${sellerOrBuyer}ColDefs`;
    this.copyFromExistingRowDefUrl = `fscm/onboarding/tradingPartnerOnboarding/private/${sellerOrBuyer.toLowerCase()}Onboarding/copyExisting${sellerOrBuyer}RowData`;

    this.isShowCopyExistingModel = true;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  validateForm(stepNo: number): boolean {
    if (stepNo === 1 && this.details) {
      if (this.details.detailsForm.invalid || this.details.details.contactDetails.length === 0) {
        return false;
      }
    } else if (stepNo === 2 && this.parameters) {
      if (
        this.parameters.parameterForm.invalid ||
        (this.parameters.parameters.isIpMapping === 'Yes' &&
          this.parameters.parameters.ipMapping.length === 0)
      ) {
        return false;
      }
    } else if (stepNo === 3 && this.authenticationRules) {
      if (this.authenticationRules.authenticationRules.length === 0) {
        return false;
      }
    }

    return true;
  }

  onNextClick(stepNo: number) {}

  getSubHeading(stepNo: number): string {
    return 'Step' + stepNo + ' Details';
  }

  useDraft(id: string) {
    const data = { dataMap: { id: id } };

    this.httpService
      .httpPost('fscm/onboarding/tradingPartnerOnboarding/private/viewDraft', data)
      .subscribe((formData: TradePartnerOnboarding) => {
        if (formData) {
          this.formData = formData;
          this.isInitiateForm = true;
          this.stepperDetails.isUpdateDraft = true;
        }
      });
  }

  delete(id: string) {}

  onEdit(step: number) {
    this.stepperDetails.currentStep = step;
  }
}
