import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSummaryComponent } from './services/account-summary/account-summary.component';
import { ViewCountrySummaryComponent } from './services/account-summary/large-account-summary/view-country-summary/view-country-summary.component';
import { CreditLineSummaryComponent } from './services/credit-line-summary/credit-line-summary.component';
import { ViewCreditLineDetailsComponent } from './services/credit-line-summary/view-credit-line-details/view-credit-line-details.component';
import { ProductDetailsComponent } from './services/credit-line-summary/view-credit-line-details/product-details/product-details.component';
import { ServiceRequestComponent } from './services/service-request/service-request.component';
import { InitiateServiceRequestComponent } from './services/service-request/initiate-service-request/initiate-service-request.component';
import { WealthManagementComponent } from './services/wealth-management/wealth-management.component';
import { HoldingsComponent } from './services/wealth-management/holdings/holdings.component';
import { InvestmentComponent } from './services/wealth-management/investment/investment.component';
import { CashflowForecastComponent } from './services/cashflow-forecast/cashflow-forecast.component';
import { CashflowForecastDetailedComponent } from './services/cashflow-forecast/cashflow-forecast-detailed/cashflow-forecast-detailed.component';
import { ChequeBookRequestComponent } from './cheque-services/cheque-book-request/cheque-book-request.component';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { ChequeStatusEnquiryComponent } from './cheque-services/cheque-status-enquiry/cheque-status-enquiry.component';
import { StopPayRevokeComponent } from './cheque-services/stop-pay-revoke/stop-pay-revoke.component';
import { FdSummaryComponent } from './fixed-deposit/fd-summary/fd-summary.component';
import { AccountStatementComponent } from './services/account-statement/account-statement.component';
import { HistoricalAccountStatementComponent } from './services/historical-account-statement/historical-account-statement.component';
import { AccountStatementViewComponent } from './services/account-statement/account-statement-view/account-statement-view.component';
import { HistoricalAccountStatementViewComponent } from './services/historical-account-statement/historical-account-statement-view/historical-account-statement-view.component';
import { FdInitiationComponent } from './fixed-deposit/fd-initiation/fd-initiation.component';
import { MaturityInstructionsComponent } from './fixed-deposit/maturity-instructions/maturity-instructions.component';
import { EarlyRedemptionComponent } from './fixed-deposit/early-redemption/early-redemption.component';
import { AccountDetailsComponent } from './services/account-summary/account-details/account-details.component';
import { CreditCardBillPaymentComponent } from './credit-card/credit-card-bill-payment/credit-card-bill-payment.component';
import { UnblockCreditCardComponent } from './credit-card/unblock-credit-card/unblock-credit-card.component';
import { BlockCreditCardComponent } from './credit-card/block-credit-card/block-credit-card.component';
import { CreditCardChangePinComponent } from './credit-card/credit-card-change-pin/credit-card-change-pin.component';
import { CreditCardUpgradeLimitComponent } from './credit-card/credit-card-upgrade-limit/credit-card-upgrade-limit.component';
import { CreditCardRegistrationComponent } from './credit-card/credit-card-registration/credit-card-registration.component';
import { CreditCardStatementDownloadComponent } from './credit-card/credit-card-statement-download/credit-card-statement-download.component';
import { CreditCardControlsComponent } from './credit-card/credit-card-controls/credit-card-controls.component';
import { ManageAutoPayComponent } from './credit-card/manage-auto-pay/manage-auto-pay.component';
import { CreditCardSummaryComponent } from './credit-card/credit-card-summary/credit-card-summary.component';
import { CreditCardDeregistrationComponent } from './credit-card/credit-card-deregistration/credit-card-deregistration.component';
import { CreditCardDetailsComponent } from './credit-card/credit-card-details/credit-card-details.component';
import { ViewResultComponent } from './cheque-services/cheque-status-enquiry/view-result/view-result.component';
import { DebitCardSummaryComponent } from './debit-card/debit-card-summary/debit-card-summary.component';
import { MerchantPaymentComponent } from './services/merchant-payment/merchant-payment.component';
import { ReIssueDebitCardComponent } from './debit-card/re-issue-debit-card/re-issue-debit-card.component';
import { DebitCardCancellationComponent } from './debit-card/debit-card-cancellation/debit-card-cancellation.component';
import { DebitCardControlComponent } from './debit-card/debit-card-control/debit-card-control.component';
import { SwiftGpiComponent } from './services/swift-gpi/swift-gpi.component';
import { SwiftGpiDataflowComponent } from '../shared/@components/swift-gpi-dataflow/swift-gpi-dataflow.component';
import { VirtualAccountStatementComponent } from './services/virtual-account-statement/virtual-account-statement.component';
import { VirtualAccountStatementViewComponent } from './services/virtual-account-statement/virtual-account-statement-view/virtual-account-statement-view.component';
import { ManualForecastComponent } from './services/manual-forecast/manual-forecast.component';
import { ManualForecastUploadComponent } from './services/manual-forecast-upload/manual-forecast-upload.component';
import { RdInitiationComponent } from './fixed-deposit/rd-initiation/rd-initiation.component';
import { RaiseDisputeComponent } from '../shared/@components/raise-dispute/raise-dispute.component';

const routes: Routes = [
  { path: 'services/accountSummary', component: AccountSummaryComponent },

  { path: 'services/accountSummary/countryView', component: ViewCountrySummaryComponent },

  {
    path: 'services/accountSummary/accountDetails',
    component: AccountDetailsComponent,
  },

  {
    path: 'services/creditLineSummary',
    component: CreditLineSummaryComponent,
  },
  { path: 'creditCard/creditCardSummary', component: CreditCardSummaryComponent },
  { path: 'creditCard/creditCardBillPayment', component: CreditCardBillPaymentComponent },
  { path: 'creditCard/unblockCreditCard', component: UnblockCreditCardComponent },
  { path: 'creditCard/blockCreditCard', component: BlockCreditCardComponent },
  { path: 'creditCard/creditCardChangePin', component: CreditCardChangePinComponent },
  { path: 'creditCard/creditCardUpgradeLimit', component: CreditCardUpgradeLimitComponent },
  { path: 'creditCard/creditCardRegistration', component: CreditCardRegistrationComponent },
  { path: 'creditCard/creditCardDeregistration', component: CreditCardDeregistrationComponent },
  {
    path: 'creditCard/creditCardStatementDownload',
    component: CreditCardStatementDownloadComponent,
  },
  { path: 'creditCard/creditCardControls', component: CreditCardControlsComponent },
  { path: 'creditCard/manageAutoPay', component: ManageAutoPayComponent },
  { path: 'creditCard/creditCardDetails', component: CreditCardDetailsComponent },
  { path: 'debitCard/debitCardSummary', component: DebitCardSummaryComponent },
  { path: 'debitCard/debitCardControl', component: DebitCardControlComponent },
  { path: 'debitCard/reIssueDebitCard', component: ReIssueDebitCardComponent },
  { path: 'debitCard/debitCardCancellation', component: DebitCardCancellationComponent },

  {
    path: 'services/creditLineSummary/viewDetails',
    component: ViewCreditLineDetailsComponent,
  },
  {
    path: 'services/creditLineSummary/viewDetails/product',
    component: ProductDetailsComponent,
  },

  {
    path: 'services/serviceRequest',
    component: ServiceRequestComponent,
  },

  {
    path: 'services/serviceRequest/initiate',
    component: InitiateServiceRequestComponent,
  },

  {
    path: 'services/wealthManagement',
    component: WealthManagementComponent,
  },
  {
    path: 'services/wealthManagement/holdings',
    component: HoldingsComponent,
  },
  {
    path: 'services/wealthManagement/investment',
    component: InvestmentComponent,
  },
  {
    path: 'services/cashflowForecast',
    component: CashflowForecastComponent,
  },
  {
    path: 'services/cashflowForecast/detailed',
    component: CashflowForecastDetailedComponent,
  },
  {
    path: 'services/manualForecast',
    component: ManualForecastComponent,
  },
  {
    path: 'services/manualForecastUpload',
    component: ManualForecastUploadComponent,
  },
  {
    path: 'services/merchantPayment',
    component: MerchantPaymentComponent,
  },
  {
    path: 'chequeServices/chequeBookRequest',
    component: ChequeBookRequestComponent,
  },
  {
    path: 'chequeServices/chequeStatusEnquiry',
    component: ChequeStatusEnquiryComponent,
  },
  {
    path: 'chequeServices/chequeStatusEnquiry/viewResult',
    component: ViewResultComponent,
  },
  {
    path: 'chequeServices/stopPayRevoke',
    component: StopPayRevokeComponent,
  },
  {
    path: 'fixedDeposit/fdSummary',
    component: FdSummaryComponent,
  },
  {
    path: 'fixedDeposit/fdInitiation',
    component: FdInitiationComponent,
  },
  {
    path: 'fixedDeposit/rdInitiation',
    component: RdInitiationComponent,
  },
  {
    path: 'fixedDeposit/maturityInstructions',
    component: MaturityInstructionsComponent,
  },
  {
    path: 'fixedDeposit/earlyRedemption',
    component: EarlyRedemptionComponent,
  },
  {
    path: 'services/accountStatement',
    component: AccountStatementComponent,
  },
  {
    path: 'services/accountStatementView',
    component: AccountStatementViewComponent,
  },
  {
    path: 'services/virtualAccountStatement',
    component: VirtualAccountStatementComponent,
  },
  {
    path: 'services/virtualAccountStatementView',
    component: VirtualAccountStatementViewComponent,
  },
  {
    path: 'services/historicalAccountStatement',
    component: HistoricalAccountStatementComponent,
  },
  {
    path: 'services/historicalAccountStatementView',
    component: HistoricalAccountStatementViewComponent,
  },
  {
    path: 'services/swiftGpi/listing',
    component: SwiftGpiComponent,
  },
  {
    path: ':parentMenu/:entityName/dataflow',
    component: SwiftGpiDataflowComponent,
  },
  {
    path: ':parentMenu/:entityName/raiseDispute',
    component: RaiseDisputeComponent,
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
export class AccountServicesRoutingModule {}
