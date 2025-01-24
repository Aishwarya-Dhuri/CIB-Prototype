import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { ViewTransactionComponent } from './process/transaction-enquiry/view-transaction/view-transaction.component';
import { TradingPartnerOnboardingComponent } from './trading-partner-onboarding/trading-partner-onboarding.component';
import { AmendInvoiceComponent } from './transactions/amend-invoice/amend-invoice.component';
import { CancelInvoiceComponent } from './transactions/cancel-invoice/cancel-invoice.component';
import { CreditDebitNoteAcceptanceComponent } from './transactions/credit-debit-note-acceptance/credit-debit-note-acceptance.component';
import { CreditDebitNoteEntryComponent } from './transactions/credit-debit-note-entry/credit-debit-note-entry.component';
import { FinanceRepaymentComponent } from './transactions/finance-repayment/finance-repayment.component';
import { InvoiceAcceptanceComponent } from './transactions/invoice-acceptance/invoice-acceptance.component';
import { InvoiceEntryComponent } from './transactions/invoice-entry/invoice-entry.component';
import { InvoicePaymentApplyFinanceListingComponent } from './transactions/invoice-payment-apply-finance/invoice-payment-apply-finance-listing/invoice-payment-apply-finance-listing.component';
import { InvoicePaymentApplyFinanceComponent } from './transactions/invoice-payment-apply-finance/invoice-payment-apply-finance.component';
import { InvoiceUploadComponent } from './transactions/invoice-upload/invoice-upload.component';
import { PoEntryComponent } from './transactions/po-entry/po-entry.component';
import { PoAcceptanceComponent } from './transactions/po-acceptance/po-acceptance.component';
import { ConsolidatedUploadComponent } from './transactions/consolidated-upload/consolidated-upload.component';

const routes: Routes = [
  {
    path: 'onboarding/tradingPartnerOnboarding',
    component: TradingPartnerOnboardingComponent,
  },
  {
    path: 'process/transactionEnquiry/viewTransaction',
    component: ViewTransactionComponent,
  },
  {
    path: 'transactions/invoicePaymentApplyFinance',
    children: [
      { path: '', component: InvoicePaymentApplyFinanceComponent },
      { path: 'listing', component: InvoicePaymentApplyFinanceListingComponent },
    ],
  },
  {
    path: 'transactions/financeRepayment',
    component: FinanceRepaymentComponent,
  },
  {
    path: 'transactions/invoiceEntry',
    component: InvoiceEntryComponent,
  },
  {
    path: 'transactions/poEntry',
    component: PoEntryComponent,
  },
  {
    path: 'transactions/poAcceptance',
    component: PoAcceptanceComponent,
  },
  {
    path: 'transactions/invoiceAcceptance',
    component: InvoiceAcceptanceComponent,
  },
  {
    path: 'transactions/cancelInvoice',
    component: CancelInvoiceComponent,
  },
  {
    path: 'transactions/amendInvoice',
    component: AmendInvoiceComponent,
  },
  {
    path: 'transactions/creditDebitNoteEntry',
    component: CreditDebitNoteEntryComponent,
  },
  {
    path: 'transactions/creditDebitNoteAcceptance',
    component: CreditDebitNoteAcceptanceComponent,
  },
  {
    path: 'transactions/invoiceUpload',
    component: InvoiceUploadComponent,
  },
  {
    path: 'transactions/consolidatedUpload',
    component: ConsolidatedUploadComponent,
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
export class FscmRoutingModule { }
