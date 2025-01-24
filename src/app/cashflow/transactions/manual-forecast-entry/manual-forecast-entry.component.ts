import { Component, OnInit, ViewChild } from '@angular/core';
import { ManualForecast } from './@models/manual-forecast-entry.model';
import { UserService } from 'src/app/shared/@services/user.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { CorporateProfile } from 'src/app/setup/security/corporate-profile/@models/corporateProfile.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manual-forecast-entry',
  templateUrl: './manual-forecast-entry.component.html',
  styleUrls: ['./manual-forecast-entry.component.scss']
})
export class ManualForecastEntryComponent implements OnInit {
  @ViewChild('ManualForecastForm') ManualForecastForm!: any;

  loading: boolean;
  formData: ManualForecast = new ManualForecast();
  forecastingAsList: any[];
  entryTypeList: any[];
  modeList: any[];
  accountTypeList: any[];
  accountNumberList: any[];
  forecastedAmountCCYList: any[];
  recurrencePatternList: any[];
  eodBodList: any[];
  dayList: any[];
  tempDate: Date;
  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Manual Forecast Entry',
    stepperType: 'horizontal',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  constructor(
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Manual Forecast Entry',
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
      { label: 'Cashflow' },
      { label: 'Transactions' },
      { label: 'Manual Forecast Entry' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const currentState = history.state;
    if (currentState && currentState.data) {
      this.formData = currentState.data;
      console.log(this.formData);
    }


    this.getCurrentDate();
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('cashflow/transactions/manualForecastEntry/private/view', data)
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

  getCurrentDate() {
    return this.userService.applicationDate;
  }

  validateForm() {
    if (
      this.ManualForecastForm?.valid ||
      this.stepperDetails.currentStep == this.stepperDetails.headings.length
    ) {
      return true;
    } else {
      return false;
    }
  }

  onForecastingChange(value: any) {
    if (value.id == 'INWARDPAYMENT') {
      this.modeList = [
        {
          id: 'ACCOUNTDEPOSITE',
          displayName: 'Account Deposite',
        },
        {
          id: 'CASH',
          displayName: 'Cash',
        },
      ];
    } else {
      this.modeList = [
        {
          id: 'ACCOUNTWITHDRAWAL',
          displayName: 'Account Withdrawal',
        },
        {
          id: 'CASH',
          displayName: 'Cash',
        },
      ];
    }
  }

  onChangeAccountType(value: any) {
    if (value.id == 'INTERNALACCOUNT') {
      this.accountNumberList = [
        {
          id: 'INR-603342',
          displayName: 'INR-603342',
        },
        {
          id: 'INR-703976',
          displayName: 'INR-703976',
        },
      ];
    } else {
      this.accountNumberList = [
        {
          id: 'AED-5003333',
          displayName: 'AED-5003333',
        },
        {
          id: 'USD-232323',
          displayName: 'USD-232323',
        },
      ];
    }
  }

  setRecurringToMaxDate(date: Date): void {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 6);
    this.tempDate = newDate;
  }

}
