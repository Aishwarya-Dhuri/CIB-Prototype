import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { ManualForecastEntryComponent } from './transactions/manual-forecast-entry/manual-forecast-entry.component';
import { ManualForecastUploadComponent } from './transactions/manual-forecast-upload/manual-forecast-upload.component';
import { CashflowForecastComponent } from './transactions/cashflow-forecast/cashflow-forecast.component';
import { CashflowForecastDetailedComponent } from './transactions/cashflow-forecast/cashflow-forecast-detailed/cashflow-forecast-detailed.component';

const routes: Routes = [
  {
    path: 'transactions/cashflowForecast',
    component: CashflowForecastDetailedComponent,
  },
  // {
  //   path: 'transactions/cashflowForecast/detailed',
  //   component: CashflowForecastDetailedComponent,
  // },
  {
    path: 'transactions/manualForecastEntry',
    component: ManualForecastEntryComponent,
  },
  {
    path: 'transactions/manualForecastUpload',
    component: ManualForecastUploadComponent,
  },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashflowRoutingModule { }
