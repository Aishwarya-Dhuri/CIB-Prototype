import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ManualForecast } from './@models/manual-forecast.model';

@Component({
  selector: 'app-manual-forecast',
  templateUrl: './manual-forecast.component.html',
  styleUrls: ['./manual-forecast.component.scss'],
})
export class ManualForecastComponent implements OnInit {
  formData: ManualForecast = new ManualForecast();
  loading: boolean = false;
  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Manual Forecast',
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
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Manual Forecast',
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
      { label: 'Service' },
      { label: 'Manual Forecast' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.getViewData();
    this.loading = false;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('accountServices/services/manualForecast/private/view', data)
        .subscribe((formData: ManualForecast) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  onAccountSelected(selectedAccount: any): void {
    this.formData.accountNumberDisplayName = selectedAccount.displayName;
    this.formData.fxRate = '1';
    this.formData.forecastedCurrencyInCcyId = selectedAccount.enrichments.currencyId;
  }
}
