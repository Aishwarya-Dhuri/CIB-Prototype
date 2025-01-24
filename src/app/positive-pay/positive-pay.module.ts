import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositivePayRoutingModule } from './positive-pay-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DraweeComponent } from './transactions/drawee/drawee.component';
import { ChequeEntryComponent } from './transactions/cheque-entry/cheque-entry.component';
import { ChequeUploadComponent } from './transactions/cheque-upload/cheque-upload.component';
import { ChequeRendererComponent } from './transactions/cheque-upload/@component/cheque-renderer/cheque-renderer.component';
import { PositivePayDataLayoutComponent } from './transactions/cheque-upload/@component/positive-pay-data-layout/positive-pay-data-layout.component';
import { PositivePayComponent } from './transactions/positive-pay/positive-pay.component';
import { LinkActionRendererComponent } from './transactions/positive-pay/@components/link-action-renderer/link-action-renderer.component';

@NgModule({
  declarations: [
    PositivePayComponent,
    LinkActionRendererComponent,
    PositivePayDataLayoutComponent,
    ChequeRendererComponent,
    DraweeComponent,
    ChequeEntryComponent,
    ChequeUploadComponent,
  ],
  imports: [CommonModule, SharedModule, PositivePayRoutingModule],
})
export class PositivePayModule {}
