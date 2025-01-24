import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CollectionsRoutingModule } from './collections-routing.module';
import { TransactionEnquiryComponent } from './process/transaction-enquiry/transaction-enquiry.component';
import { SummaryHeadOfficeComponent } from './process/summary-head-office/summary-head-office.component';
import { SummaryBranchesComponent } from './process/summary-branches/summary-branches.component';
import { ScheduledRequestComponent } from './process/scheduled-request/scheduled-request.component';
import { ScheduledRequestAdhocRequestComponent } from './process/scheduled-request-adhoc-request/scheduled-request-adhoc-request.component';
import { CollectionFormInputRendererComponent } from './process/scheduled-request/@components/collection-form-input-renderer/collection-form-input-renderer.component';
import { ScanDataEntryComponent } from './transactions/scan-data-entry/scan-data-entry.component';
import { ViewCollectionTransactionEnquiryComponent } from './process/transaction-enquiry/view-collection-transaction-enquiry/view-collection-transaction-enquiry.component';
import { ViewCollectionImageComponent } from './process/transaction-enquiry/view-collection-image/view-collection-image.component';
import { ViewCashTransactionDetailsComponent } from './process/transaction-enquiry/view-cash-transaction-details/view-cash-transaction-details.component';


@NgModule({
  declarations: [
    TransactionEnquiryComponent,
    SummaryHeadOfficeComponent,
    SummaryBranchesComponent,
    ScheduledRequestComponent,
    ScheduledRequestAdhocRequestComponent,
    CollectionFormInputRendererComponent,
    ScanDataEntryComponent,
    ViewCollectionTransactionEnquiryComponent,
    ViewCollectionImageComponent,
    ViewCashTransactionDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CollectionsRoutingModule
  ]
})
export class CollectionsModule { }
