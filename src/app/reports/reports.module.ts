import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';
import { InitiateReportComponent } from './initiate-report/initiate-report.component';
import { DownloadReportRendererComponent } from './@components/download-report-renderer/download-report-renderer.component';
import { OnScreenReportComponent } from './@components/on-screen-report/on-screen-report.component';

@NgModule({
  declarations: [
    ReportsComponent,
    InitiateReportComponent,
    DownloadReportRendererComponent,
    OnScreenReportComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
