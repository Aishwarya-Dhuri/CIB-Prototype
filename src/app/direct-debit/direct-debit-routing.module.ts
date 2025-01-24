import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { DebitEnquiryComponent } from './enquiry/debit-enquiry/debit-enquiry.component';
import { MandateEnquiryComponent } from './enquiry/mandate-enquiry/mandate-enquiry.component';
import { AmendmentComponent } from './mandate-management/amendment/amendment.component';
import { CancellationComponent } from './mandate-management/cancellation/cancellation.component';
import { RegistrationComponent } from './mandate-management/registration/registration.component';
import { ExecutionSummaryComponent } from './mandate-management/execution-summary/execution-summary.component';
import { StopPaymentRequestComponent } from './mandate-management/stop-payment-request/stop-payment-request.component';
import { StopPaymentRevokeComponent } from './mandate-management/stop-payment-revoke/stop-payment-revoke.component';
import { DirectFileUploadComponent } from './transactions/direct-file-upload/direct-file-upload.component';
import { MandateUploadComponent } from './mandate-management/mandate-upload/mandate-upload.component';
import { CancellationUploadComponent } from './mandate-management/cancellation-upload/cancellation-upload.component';
import { AmendmentUploadComponent } from './mandate-management/amendment-upload/amendment-upload.component';
import { StopPayRevokeComponent } from './mandate-management/stop-pay-revoke/stop-pay-revoke.component';
import { DebitInstructionComponent } from './transactions/debit-instruction/debit-instruction.component';

const routes: Routes = [
  { path: 'mandateManagement/registration', component: RegistrationComponent },

  { path: 'mandateManagement/mandateFileUpload', component: MandateUploadComponent },
  { path: 'mandateManagement/cancellationUpload', component: CancellationUploadComponent },
  { path: 'mandateManagement/amendmentUpload', component: AmendmentUploadComponent },

  { path: 'mandateManagement/executionSummary', component: ExecutionSummaryComponent },
  { path: 'mandateManagement/cancellation', component: CancellationComponent },
  { path: 'mandateManagement/amendment', component: AmendmentComponent },

  { path: 'mandateManagement/stopPaymentRequest', component: StopPaymentRequestComponent },
  { path: 'mandateManagement/stopPaymentRevoke', component: StopPaymentRevokeComponent },

  { path: 'mandateManagement/stopPayRevoke', component: StopPayRevokeComponent },

  { path: 'transactions/directFileUpload', component: DirectFileUploadComponent },
  { path: 'transactions/debitInstruction', component: DebitInstructionComponent },

  { path: 'enquiry/debitEnquiry', component: DebitEnquiryComponent },
  { path: 'enquiry/mandateEnquiry', component: MandateEnquiryComponent },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectDebitRoutingModule { }
