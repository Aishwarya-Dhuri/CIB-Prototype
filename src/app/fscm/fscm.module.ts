import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { FscmRoutingModule } from './fscm-routing.module';
import { TradingPartnerOnboardingComponent } from './trading-partner-onboarding/trading-partner-onboarding.component';
import { SellerDetailsComponent } from './trading-partner-onboarding/@components/seller-details/seller-details.component';
import { ParametersComponent } from './trading-partner-onboarding/@components/parameters/parameters.component';
import { AuthenticationRuleComponent } from './trading-partner-onboarding/@components/authentication-rule/authentication-rule.component';
import { ReviewNConfirmComponent } from './trading-partner-onboarding/@components/review-n-confirm/review-n-confirm.component';
import { ViewTransactionComponent } from './process/transaction-enquiry/view-transaction/view-transaction.component';
import { TransactionDetailsComponent } from './process/transaction-enquiry/view-transaction/@shared/transaction-details/transaction-details.component';
import { MakerCheckerDetailsComponent } from './process/transaction-enquiry/view-transaction/@shared/maker-checker-details/maker-checker-details.component';
import { GridDetailsComponent } from './process/transaction-enquiry/view-transaction/@shared/grid-details/grid-details.component';
import { FileDetailsComponent } from './process/transaction-enquiry/view-transaction/@shared/file-details/file-details.component';
import { ShowDetailsComponent } from './process/transaction-enquiry/view-transaction/@shared/show-details/show-details.component';
import { TabDetailsComponent } from './process/transaction-enquiry/view-transaction/@shared/tab-details/tab-details.component';
import { InvoicePaymentApplyFinanceComponent } from './transactions/invoice-payment-apply-finance/invoice-payment-apply-finance.component';
import { FinanceRepaymentComponent } from './transactions/finance-repayment/finance-repayment.component';
import { InvoiceUploadComponent } from './transactions/invoice-upload/invoice-upload.component';
import { DataLayoutComponent } from './transactions/invoice-upload/@component/data-layout/data-layout.component';
import { InvoicePaymentApplyFinanceListingComponent } from './transactions/invoice-payment-apply-finance/invoice-payment-apply-finance-listing/invoice-payment-apply-finance-listing.component';
import { InvoiceEntryComponent } from './transactions/invoice-entry/invoice-entry.component';
import { InvoiceAcceptanceComponent } from './transactions/invoice-acceptance/invoice-acceptance.component';
import { CancelInvoiceComponent } from './transactions/cancel-invoice/cancel-invoice.component';
import { AmendInvoiceComponent } from './transactions/amend-invoice/amend-invoice.component';
import { CreditDebitNoteEntryComponent } from './transactions/credit-debit-note-entry/credit-debit-note-entry.component';
import { CreditDebitNoteAcceptanceComponent } from './transactions/credit-debit-note-acceptance/credit-debit-note-acceptance.component';
import { PoEntryComponent } from './transactions/po-entry/po-entry.component';
import { PoAcceptanceComponent } from './transactions/po-acceptance/po-acceptance.component';
import { ConsolidatedUploadComponent } from './transactions/consolidated-upload/consolidated-upload.component';

@NgModule({
  declarations: [
    TradingPartnerOnboardingComponent,
    SellerDetailsComponent,
    ParametersComponent,
    AuthenticationRuleComponent,
    ReviewNConfirmComponent,
    ViewTransactionComponent,
    TransactionDetailsComponent,
    MakerCheckerDetailsComponent,
    GridDetailsComponent,
    FileDetailsComponent,
    ShowDetailsComponent,
    TabDetailsComponent,
    InvoicePaymentApplyFinanceComponent,
    InvoicePaymentApplyFinanceListingComponent,
    FinanceRepaymentComponent,
    InvoiceUploadComponent,
    DataLayoutComponent,
    InvoiceEntryComponent,
    InvoiceAcceptanceComponent,
    CancelInvoiceComponent,
    AmendInvoiceComponent,
    CreditDebitNoteEntryComponent,
    CreditDebitNoteAcceptanceComponent,
    PoEntryComponent,
    PoAcceptanceComponent,
    ConsolidatedUploadComponent
  ],
  imports: [CommonModule, SharedModule, FscmRoutingModule],
})
export class FscmModule { }
