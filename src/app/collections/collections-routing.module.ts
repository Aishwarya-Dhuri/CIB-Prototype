import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionEnquiryComponent } from './process/transaction-enquiry/transaction-enquiry.component';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { SummaryHeadOfficeComponent } from './process/summary-head-office/summary-head-office.component';
import { SummaryBranchesComponent } from './process/summary-branches/summary-branches.component';
import { ScheduledRequestAdhocRequestComponent } from './process/scheduled-request-adhoc-request/scheduled-request-adhoc-request.component';
import { ScheduledRequestComponent } from './process/scheduled-request/scheduled-request.component';
import { ScanDataEntryComponent } from './transactions/scan-data-entry/scan-data-entry.component';
import { ViewCollectionTransactionEnquiryComponent } from './process/transaction-enquiry/view-collection-transaction-enquiry/view-collection-transaction-enquiry.component';
import { ViewCashTransactionDetailsComponent } from './process/transaction-enquiry/view-cash-transaction-details/view-cash-transaction-details.component';
import { ViewCollectionImageComponent } from './process/transaction-enquiry/view-collection-image/view-collection-image.component';

const routes: Routes = [

  // ................Process................
  {
    path: 'process/transactionQuery',
    component: TransactionEnquiryComponent,
  },
  {
    path: 'process/summaryHeadOffice',
    component: SummaryHeadOfficeComponent,
  },
  {
    path: 'process/summaryHeadOffice/initiate',
    component: SummaryBranchesComponent,
  },
  {
    path: 'process/scheduledRequest',
    component: ScheduledRequestComponent,
  },
  {
    path: 'process/adhocRequest',
    component: ScheduledRequestAdhocRequestComponent,
  },
  // ................Process................


  // ................Transactions................
  {
    path: 'transactions/scanDataEntry',
    component: ScanDataEntryComponent,
  },
  {
    path: 'process/viewCollectionTransactionEnquiry',
    component: ViewCollectionTransactionEnquiryComponent,
  },
  {
    path: 'process/viewCollectionChequeImage',
    component: ViewCollectionImageComponent,
  },
  {
    path: 'process/viewCashTransactionDetails',
    component: ViewCashTransactionDetailsComponent,
  },
  // ................Transactions................
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }
