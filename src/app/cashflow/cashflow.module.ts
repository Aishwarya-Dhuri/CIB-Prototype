import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CashflowRoutingModule } from './cashflow-routing.module';
import { ManualForecastEntryComponent } from './transactions/manual-forecast-entry/manual-forecast-entry.component';
import { ManualForecastUploadComponent } from './transactions/manual-forecast-upload/manual-forecast-upload.component';
import { UbDataLayoutComponent } from './transactions/manual-forecast-upload/@components/ub-data-layout/ub-data-layout.component';
import { CashflowForecastComponent } from './transactions/cashflow-forecast/cashflow-forecast.component';
import { CashflowForecastDetailedComponent } from './transactions/cashflow-forecast/cashflow-forecast-detailed/cashflow-forecast-detailed.component';
import { CashflowForecastActionRendererComponent } from './transactions/cashflow-forecast/@components/cashflow-forecast-action-renderer/cashflow-forecast-action-renderer.component';
import { CashflowForecastMonthLinkRendererComponent } from './transactions/cashflow-forecast/@components/cashflow-forecast-month-link-renderer/cashflow-forecast-month-link-renderer.component';


@NgModule({
  declarations: [
    ManualForecastEntryComponent,
    ManualForecastUploadComponent,
    UbDataLayoutComponent,
    CashflowForecastComponent,
    CashflowForecastDetailedComponent,
    CashflowForecastActionRendererComponent,
    CashflowForecastMonthLinkRendererComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CashflowRoutingModule
  ]
})
export class CashflowModule { }
