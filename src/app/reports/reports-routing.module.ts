import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiateReportComponent } from './initiate-report/initiate-report.component';
import { ReportsComponent } from './reports.component';
import { OnScreenReportComponent } from './@components/on-screen-report/on-screen-report.component';

const routes: Routes = [
  { path: ':product/:reportType', component: ReportsComponent },
  { path: ':product/:category/initiate', component: InitiateReportComponent },
  { path: ':product/:reportType/OnScreenReport', component: OnScreenReportComponent },
  // {
  //   path: ':parentMenu/:entityName/listing',
  //   component: GenericListingComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
