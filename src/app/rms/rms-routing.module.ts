import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { ManualReconciliationComponent } from './transactions/manual-reconciliation/manual-reconciliation.component';
import { SearchResultComponent } from './transactions/manual-reconciliation/search-result/search-result.component';
import { ReceiptEntryComponent } from './transactions/receipt-entry/receipt-entry.component';
import { ReceiptUploadComponent } from './transactions/receipt-upload/receipt-upload.component';
import { UndoReconciliationComponent } from './transactions/undo-reconciliation/undo-reconciliation.component';

const routes: Routes = [
  {
    path: 'transactions/manualReconciliation',
    component: ManualReconciliationComponent,
  },
  {
    path: 'transactions/manualReconciliation/searchResults',
    component: SearchResultComponent,
  },
  {
    path: 'transactions/undoReconciliation',
    component: UndoReconciliationComponent,
  },
  {
    path: 'transactions/receiptEntry',
    component: ReceiptEntryComponent,
  },
  {
    path: 'transactions/receiptUpload',
    component: ReceiptUploadComponent,
  },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RmsRoutingModule {}
