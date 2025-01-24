import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmsRoutingModule } from './rms-routing.module';
import { ManualReconciliationComponent } from './transactions/manual-reconciliation/manual-reconciliation.component';
import { SharedModule } from '../shared/shared.module';
import { SearchResultComponent } from './transactions/manual-reconciliation/search-result/search-result.component';
import { PaymentRendererComponent } from './transactions/manual-reconciliation/search-result/@components/payment-renderer/payment-renderer.component';
import { EditCurrencyRendererComponent } from './transactions/manual-reconciliation/search-result/@components/edit-currency-renderer/edit-currency-renderer.component';
import { InvoiceDetailsComponent } from './transactions/manual-reconciliation/search-result/@components/invoice-details/invoice-details.component';
import { PaymentDetailsComponent } from './transactions/manual-reconciliation/search-result/@components/payment-details/payment-details.component';
import { FiltersComponent } from './transactions/manual-reconciliation/@components/filters/filters.component';
import { UndoReconciliationComponent } from './transactions/undo-reconciliation/undo-reconciliation.component';
import { ReceiptEntryComponent } from './transactions/receipt-entry/receipt-entry.component';
import { ReceiptUploadComponent } from './transactions/receipt-upload/receipt-upload.component';
import { LinkCellRendererComponent } from './transactions/undo-reconciliation/@components/link-cell-renderer/link-cell-renderer.component';

@NgModule({
  declarations: [
    ManualReconciliationComponent,
    SearchResultComponent,
    PaymentRendererComponent,
    EditCurrencyRendererComponent,
    InvoiceDetailsComponent,
    PaymentDetailsComponent,
    FiltersComponent,
    UndoReconciliationComponent,
    ReceiptEntryComponent,
    ReceiptUploadComponent,
    LinkCellRendererComponent,
  ],
  imports: [CommonModule, SharedModule, RmsRoutingModule],
})
export class RmsModule {}
