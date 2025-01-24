import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { AccountServicesRoutingModule } from './account-services-routing.module';
import { AccountSummaryComponent } from './services/account-summary/account-summary.component';
import { SharedModule } from '../shared/shared.module';
import { ViewCountrySummaryComponent } from './services/account-summary/large-account-summary/view-country-summary/view-country-summary.component';
import { AccountSummaryListingComponent } from './services/account-summary/@components/account-summary-listing/account-summary-listing.component';
import { TransactionDetailsListComponent } from './services/account-summary/@components/transaction-details-list/transaction-details-list.component';
import { RenderAccountNoComponent } from './services/account-summary/@components/render-account-no/render-account-no.component';
import { CreditLineSummaryComponent } from './services/credit-line-summary/credit-line-summary.component';
import { DistributionChartComponent } from './services/credit-line-summary/@components/distribution-chart/distribution-chart.component';
import { ViewCreditLineDetailsComponent } from './services/credit-line-summary/view-credit-line-details/view-credit-line-details.component';
import { ProductDetailsComponent } from './services/credit-line-summary/view-credit-line-details/product-details/product-details.component';
import { ServiceRequestComponent } from './services/service-request/service-request.component';
import { RequestNumberRendererComponent } from './services/service-request/@components/request-number-renderer/request-number-renderer.component';
import { RequestStatusRendererComponent } from './services/service-request/@components/request-status-renderer/request-status-renderer.component';
import { InitiateServiceRequestComponent } from './services/service-request/initiate-service-request/initiate-service-request.component';
import { ServiceRequestOrgTreeComponent } from './services/service-request/@components/service-request-org-tree/service-request-org-tree.component';
import { WealthManagementComponent } from './services/wealth-management/wealth-management.component';
import { HoldingsComponent } from './services/wealth-management/holdings/holdings.component';
import { InvestmentComponent } from './services/wealth-management/investment/investment.component';
import { GainLossRendererComponent } from './services/wealth-management/@components/gain-loss-renderer/gain-loss-renderer.component';
import { HoldingsRendererComponent } from './services/wealth-management/@components/holdings-renderer/holdings-renderer.component';
import { CashflowForecastComponent } from './services/cashflow-forecast/cashflow-forecast.component';
import { CashflowForecastDetailedComponent } from './services/cashflow-forecast/cashflow-forecast-detailed/cashflow-forecast-detailed.component';
import { CashflowForecastActionRendererComponent } from './services/cashflow-forecast/@components/cashflow-forecast-action-renderer/cashflow-forecast-action-renderer.component';
import { AccCurrencyRendererComponent } from './services/account-summary/@components/acc-currency-renderer/acc-currency-renderer.component';
import { ChequeBookRequestComponent } from './cheque-services/cheque-book-request/cheque-book-request.component';
import { ChequeStatusEnquiryComponent } from './cheque-services/cheque-status-enquiry/cheque-status-enquiry.component';
import { ChequeImageRendererComponent } from './cheque-services/cheque-status-enquiry/@components/cheque-image-renderer/cheque-image-renderer.component';
import { StopPayRevokeComponent } from './cheque-services/stop-pay-revoke/stop-pay-revoke.component';
import { FdSummaryComponent } from './fixed-deposit/fd-summary/fd-summary.component';
import { AccountStatementComponent } from './services/account-statement/account-statement.component';
import { HistoricalAccountStatementComponent } from './services/historical-account-statement/historical-account-statement.component';
import { AccountStatementViewComponent } from './services/account-statement/account-statement-view/account-statement-view.component';
import { ActionRendererComponent } from './services/account-statement/@components/action-renderer/action-renderer.component';
import { HistoricalAccountStatementViewComponent } from './services/historical-account-statement/historical-account-statement-view/historical-account-statement-view.component';
import { FdInitiationComponent } from './fixed-deposit/fd-initiation/fd-initiation.component';
import { MaturityInstructionsComponent } from './fixed-deposit/maturity-instructions/maturity-instructions.component';
import { EarlyRedemptionComponent } from './fixed-deposit/early-redemption/early-redemption.component';
import { LargeAccountSummaryComponent } from './services/account-summary/large-account-summary/large-account-summary.component';
import { MediumAccountSummaryComponent } from './services/account-summary/medium-account-summary/medium-account-summary.component';
import { SmallAccountSummaryComponent } from './services/account-summary/small-account-summary/small-account-summary.component';
import { AccountDetailsComponent } from './services/account-summary/account-details/account-details.component';
import { CreditCardSummaryComponent } from './credit-card/credit-card-summary/credit-card-summary.component';
import { CreditCardBillPaymentComponent } from './credit-card/credit-card-bill-payment/credit-card-bill-payment.component';
import { UnblockCreditCardComponent } from './credit-card/unblock-credit-card/unblock-credit-card.component';
import { BlockCreditCardComponent } from './credit-card/block-credit-card/block-credit-card.component';
import { CreditCardChangePinComponent } from './credit-card/credit-card-change-pin/credit-card-change-pin.component';
import { CreditCardUpgradeLimitComponent } from './credit-card/credit-card-upgrade-limit/credit-card-upgrade-limit.component';
import { CreditCardRegistrationComponent } from './credit-card/credit-card-registration/credit-card-registration.component';
import { CreditCardStatementDownloadComponent } from './credit-card/credit-card-statement-download/credit-card-statement-download.component';
import { CreditCardControlsComponent } from './credit-card/credit-card-controls/credit-card-controls.component';
import { CreditCardControlsInitComponent } from './credit-card/credit-card-controls/credit-card-controls-init/credit-card-controls-init.component';
import { CreditCardControlsReviewComponent } from './credit-card/credit-card-controls/credit-card-controls-review/credit-card-controls-review.component';
import { ManageAutoPayComponent } from './credit-card/manage-auto-pay/manage-auto-pay.component';
import { CreditCardDeregistrationComponent } from './credit-card/credit-card-deregistration/credit-card-deregistration.component';
import { CreditCardDetailsComponent } from './credit-card/credit-card-details/credit-card-details.component';
import { ViewResultComponent } from './cheque-services/cheque-status-enquiry/view-result/view-result.component';
import { RunningBalanceRendererComponent } from './services/account-summary/@components/running-balance-renderer/running-balance-renderer.component';
import { SubProductLinkRendererComponent } from './services/credit-line-summary/@components/sub-product-link-renderer/sub-product-link-renderer.component';
import { StatusWithStarRendererComponent } from './services/account-summary/@components/status-with-star-renderer/status-with-star-renderer.component';
import { MoreOptionRendererComponent } from './services/credit-line-summary/@components/more-option-renderer/more-option-renderer.component';
import { CashflowForecastMonthLinkRendererComponent } from './services/cashflow-forecast/@components/cashflow-forecast-month-link-renderer/cashflow-forecast-month-link-renderer.component';
import { SmallCreditCardSummaryComponent } from './credit-card/credit-card-summary/small-credit-card-summary/small-credit-card-summary.component';
import { DebitCardSummaryComponent } from './debit-card/debit-card-summary/debit-card-summary.component';
import { LargeDebitCardSummaryComponent } from './debit-card/debit-card-summary/large-debit-card-summary/large-debit-card-summary.component';
import { SmallDebitCardSummaryComponent } from './debit-card/debit-card-summary/small-debit-card-summary/small-debit-card-summary.component';
import { MerchantPaymentComponent } from './services/merchant-payment/merchant-payment.component';
import { ReIssueDebitCardComponent } from './debit-card/re-issue-debit-card/re-issue-debit-card.component';
import { DebitCardCancellationComponent } from './debit-card/debit-card-cancellation/debit-card-cancellation.component';
import { DebitCardControlComponent } from './debit-card/debit-card-control/debit-card-control.component';
import { DebitOrgTreeComponent } from './debit-card/debit-card-control/@components/debit-org-tree/debit-org-tree.component';
import { SwiftGpiComponent } from './services/swift-gpi/swift-gpi.component';
import { AccountSummaryChildListingComponent } from './services/account-summary/@components/account-summary-child-listing/account-summary-child-listing.component';
import { AccountSummeryActionsRendererComponent } from './services/account-summary/@components/account-summery-actions-renderer/account-summery-actions-renderer.component';
import { VirtualAccountStatementComponent } from './services/virtual-account-statement/virtual-account-statement.component';
import { VirtualAccountStatementViewComponent } from './services/virtual-account-statement/virtual-account-statement-view/virtual-account-statement-view.component';
import { ManualForecastUploadComponent } from './services/manual-forecast-upload/manual-forecast-upload.component';
import { ManualForecastComponent } from './services/manual-forecast/manual-forecast.component';
import { RdInitiationComponent } from './fixed-deposit/rd-initiation/rd-initiation.component';

@NgModule({
  declarations: [
    AccountSummaryComponent,
    ViewCountrySummaryComponent,
    AccountSummaryListingComponent,
    TransactionDetailsListComponent,
    RenderAccountNoComponent,
    CreditLineSummaryComponent,
    DistributionChartComponent,
    ViewCreditLineDetailsComponent,
    ProductDetailsComponent,
    ServiceRequestComponent,
    RequestNumberRendererComponent,
    RequestStatusRendererComponent,
    InitiateServiceRequestComponent,
    ServiceRequestOrgTreeComponent,
    WealthManagementComponent,
    HoldingsComponent,
    InvestmentComponent,
    GainLossRendererComponent,
    HoldingsRendererComponent,
    RunningBalanceRendererComponent,
    CashflowForecastComponent,
    CashflowForecastDetailedComponent,
    CashflowForecastActionRendererComponent,
    AccCurrencyRendererComponent,
    ChequeBookRequestComponent,
    ChequeStatusEnquiryComponent,
    ChequeImageRendererComponent,
    StopPayRevokeComponent,
    FdSummaryComponent,
    AccountStatementComponent,
    HistoricalAccountStatementComponent,
    AccountStatementViewComponent,
    ActionRendererComponent,
    HistoricalAccountStatementViewComponent,
    FdInitiationComponent,
    MaturityInstructionsComponent,
    EarlyRedemptionComponent,
    LargeAccountSummaryComponent,
    MediumAccountSummaryComponent,
    SmallAccountSummaryComponent,
    AccountDetailsComponent,
    CreditCardSummaryComponent,
    CreditCardBillPaymentComponent,
    UnblockCreditCardComponent,
    BlockCreditCardComponent,
    CreditCardChangePinComponent,
    CreditCardUpgradeLimitComponent,
    CreditCardRegistrationComponent,
    CreditCardDeregistrationComponent,
    CreditCardStatementDownloadComponent,
    CreditCardControlsComponent,
    CreditCardControlsInitComponent,
    CreditCardControlsReviewComponent,
    ManageAutoPayComponent,
    CreditCardDetailsComponent,
    ViewResultComponent,
    SubProductLinkRendererComponent,
    StatusWithStarRendererComponent,
    MoreOptionRendererComponent,
    CashflowForecastMonthLinkRendererComponent,
    SmallCreditCardSummaryComponent,
    DebitCardSummaryComponent,
    LargeDebitCardSummaryComponent,
    SmallDebitCardSummaryComponent,
    DebitOrgTreeComponent,
    MerchantPaymentComponent,
    ReIssueDebitCardComponent,
    DebitCardCancellationComponent,
    DebitCardControlComponent,
    SwiftGpiComponent,
    AccountSummaryChildListingComponent,
    AccountSummeryActionsRendererComponent,

    VirtualAccountStatementComponent,
    VirtualAccountStatementViewComponent,
    ManualForecastUploadComponent,
    ManualForecastComponent,
    RdInitiationComponent,
  ],
  imports: [CommonModule, SharedModule, AccountServicesRoutingModule],
  providers: [CurrencyPipe],
  exports: [FdInitiationComponent],
})
export class AccountServicesModule {}
