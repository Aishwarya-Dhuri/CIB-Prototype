import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectDebitRoutingModule } from './direct-debit-routing.module';
import { RegistrationComponent } from './mandate-management/registration/registration.component';
import { SharedModule } from '../shared/shared.module';
import { CancellationComponent } from './mandate-management/cancellation/cancellation.component';
import { AmendmentComponent } from './mandate-management/amendment/amendment.component';
import { DirectFileUploadComponent } from './transactions/direct-file-upload/direct-file-upload.component';
import { DebitEnquiryComponent } from './enquiry/debit-enquiry/debit-enquiry.component';
import { MandateEnquiryComponent } from './enquiry/mandate-enquiry/mandate-enquiry.component';
import { StopPaymentRequestComponent } from './mandate-management/stop-payment-request/stop-payment-request.component';
import { StopPaymentRevokeComponent } from './mandate-management/stop-payment-revoke/stop-payment-revoke.component';
import { DdsFileUploadOrgTreeComponent } from './transactions/direct-file-upload/@components/dds-file-upload-org-tree/dds-file-upload-org-tree.component';
import { ExecutionSummaryComponent } from './mandate-management/execution-summary/execution-summary.component';
import { MandateUploadComponent } from './mandate-management/mandate-upload/mandate-upload.component';
import { CancellationUploadComponent } from './mandate-management/cancellation-upload/cancellation-upload.component';
import { AmendmentUploadComponent } from './mandate-management/amendment-upload/amendment-upload.component';
import { DebitInstructionComponent } from './transactions/debit-instruction/debit-instruction.component';
import { StopPayRevokeComponent } from './mandate-management/stop-pay-revoke/stop-pay-revoke.component';

@NgModule({
  declarations: [
    RegistrationComponent,
    CancellationComponent,
    AmendmentComponent,
    DirectFileUploadComponent,
    DebitEnquiryComponent,
    MandateEnquiryComponent,
    StopPaymentRequestComponent,
    StopPaymentRevokeComponent,
    DdsFileUploadOrgTreeComponent,
    ExecutionSummaryComponent,
    MandateUploadComponent,
    CancellationUploadComponent,
    AmendmentUploadComponent,
    DebitInstructionComponent,
    StopPayRevokeComponent,
  ],
  imports: [CommonModule, SharedModule, DirectDebitRoutingModule],
})
export class DirectDebitModule { }
