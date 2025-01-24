import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PaymentsRoutingModule } from './payments-routing.module';

import { OwnAccountTransferComponent } from './transactions/own-account-transfer/own-account-transfer.component';
import { BatchDetailsRendererComponent } from './transactions/send-to-bank/@components/batch-details-renderer/batch-details-renderer.component';
import { SendToBankActionComponent } from './transactions/send-to-bank/send-to-bank-action/send-to-bank-action.component';
import { SendToBankInitiateComponent } from './transactions/send-to-bank/send-to-bank-initiate/send-to-bank-initiate.component';
import { SendToBankComponent } from './transactions/send-to-bank/send-to-bank.component';
import { LandingListingComponent } from './transactions/single-payment-request/landing-listing/landing-listing.component';
import { LargeSinglePaymentRequestComponent } from './transactions/single-payment-request/large-single-payment-request/large-single-payment-request.component';
import { LargeSinglePaymentInitiateComponent } from './transactions/single-payment-request/large-single-payment-request/single-payment-initiate/large-single-payment-initiate.component';
import { SinglePaymentRequestListingComponent } from './transactions/single-payment-request/single-payment-request-listing/single-payment-request-listing.component';
import { SinglePaymentRequestComponent } from './transactions/single-payment-request/single-payment-request.component';
import { SmallSinglePaymentRequestComponent } from './transactions/single-payment-request/small-single-payment-request/small-single-payment-request.component';
import { StatutoryPaymentDetailsComponent } from './transactions/statutory-payment/statutory-payment-initiate/statutory-payment-details/statutory-payment-details.component';
import { StatutoryPaymentInitiateComponent } from './transactions/statutory-payment/statutory-payment-initiate/statutory-payment-initiate.component';
import { StatutoryPaymentReviewComponent } from './transactions/statutory-payment/statutory-payment-initiate/statutory-payment-review/statutory-payment-review.component';
import { StatutoryPaymentComponent } from './transactions/statutory-payment/statutory-payment.component';
import { LargeOwnAccountTransferComponent } from './transactions/own-account-transfer/large-own-account-transfer/large-own-account-transfer.component';
import { SmallOwnAccountTransferComponent } from './transactions/own-account-transfer/small-own-account-transfer/small-own-account-transfer.component';
import { OwnAccountTransferInitiateComponent } from './transactions/own-account-transfer/large-own-account-transfer/own-account-transfer-initiate/own-account-transfer-initiate.component';
import { FileUploadLogComponent } from './transactions/file-upload-log/file-upload-log.component';
import { ViewResultComponent } from './transactions/file-upload-log/view-result/view-result.component';
import { AckNackCellRendererComponent } from './transactions/file-upload-log/@components/ack-nack-cell-renderer/ack-nack-cell-renderer.component';
import { ViewPaymentRequestEnquiryComponent } from './process/transaction-enquiry/view-payment-request-enquiry/view-payment-request-enquiry.component';
import { ViewOwnAccountTransferEnquiryComponent } from './process/transaction-enquiry/view-own-account-transfer-enquiry/view-own-account-transfer-enquiry.component';
import { ViewStatutoryPaymentEnquiryComponent } from './process/transaction-enquiry/view-statutory-payment-enquiry/view-statutory-payment-enquiry.component';
import { BeneficiaryComponent } from './master/beneficiary/beneficiary.component';
import { InternalFundTransferComponent } from './master/beneficiary/@components/payment-methods/internal-fund-transfer/internal-fund-transfer.component';
import { RtgsComponent } from './master/beneficiary/@components/payment-methods/rtgs/rtgs.component';
import { OutwardTelegraphicTransferComponent } from './master/beneficiary/@components/payment-methods/outward-telegraphic-transfer/outward-telegraphic-transfer.component';
import { CashierOrderComponent } from './master/beneficiary/@components/payment-methods/cashier-order/cashier-order.component';
import { CorporateChequeComponent } from './master/beneficiary/@components/payment-methods/corporate-cheque/corporate-cheque.component';
import { OwnChequeComponent } from './master/beneficiary/@components/payment-methods/own-cheque/own-cheque.component';
import { SlipsComponent } from './master/beneficiary/@components/payment-methods/slips/slips.component';
import { CeftsComponent } from './master/beneficiary/@components/payment-methods/cefts/cefts.component';
import { BulkPaymentRequestComponent } from './transactions/bulk-payment-request/bulk-payment-request.component';
import { CancelPaymentRequestComponent } from './transactions/cancel-payment-request/cancel-payment-request.component';
import { BeneficiaryUploadComponent } from './master/beneficiary-upload/beneficiary-upload.component';
import { UBDataLayoutComponent } from './master/beneficiary-upload/@components/ub-data-layout/ub-data-layout.component';
import { UbInfoComponent } from './master/beneficiary-upload/@components/ub-info/ub-info.component';
import { BPDataLayoutComponent } from './transactions/bulk-payment-request/@components/bp-data-layout/bp-data-layout.component';
import { WPSDataLayoutComponent } from './transactions/wps-payment/@components/wps-data-layout/wps-data-layout.component';
import { MtRegistrationComponent } from './master/mt-registration/mt-registration.component';
import { BillPaymentComponent } from './bill-payments/bill-payment/bill-payment.component';

import { BillPaymentDetailsCardComponent } from './bill-payments/bill-payment/@components/bill-payment-details/bill-payment-details-card/bill-payment-details-card.component';
import { BillPaymentDetailsComponent } from './bill-payments/bill-payment/@components/bill-payment-details/bill-payment-details.component';
import { FetchBillsActionRendererComponent } from './bill-payments/@components/fetch-bills-action-renderer/fetch-bills-action-renderer.component';
import { LogoWithLabelRendererComponent } from './bill-payments/@components/logo-with-label-renderer/logo-with-label-renderer.component';
import { BillerPaymentDetailsComponent } from './bill-payments/bill-payment/biller-payment-details/biller-payment-details.component';
import { AmountBeingPaidRendererComponent } from './bill-payments/@components/amount-being-paid-renderer/amount-being-paid-renderer.component';
import { PaymentDateRendererComponent } from './bill-payments/@components/payment-date-renderer/payment-date-renderer.component';
import { BillPaymentHistoryComponent } from './bill-payments/bill-payment-history/bill-payment-history.component';
import { SearchResultComponent } from './bill-payments/bill-payment-history/large-bill-payment-history/search-result/search-result.component';
import { UnregisteredBillPaymentComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment.component';
import { UnregisteredBillPaymentDetailsComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment-details/unregistered-bill-payment-details.component';
import { DueDateRendererComponent } from './bill-payments/@components/due-date-renderer/due-date-renderer.component';
import { BillerRegistrationComponent } from './bill-payments/biller-registration/biller-registration.component';
import { LargeBillerPaymentDetailsComponent } from './bill-payments/bill-payment/biller-payment-details/large-biller-payment-details/large-biller-payment-details.component';
import { MediumBillerPaymentDetailsComponent } from './bill-payments/bill-payment/biller-payment-details/medium-biller-payment-details/medium-biller-payment-details.component';
import { SmallBillerPaymentDetailsComponent } from './bill-payments/bill-payment/biller-payment-details/small-biller-payment-details/small-biller-payment-details.component';
import { LargeUnregisteredBillPaymentDetailsComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment-details/large-unregistered-bill-payment-details/large-unregistered-bill-payment-details.component';
import { MediumUnregisteredBillPaymentDetailsComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment-details/medium-unregistered-bill-payment-details/medium-unregistered-bill-payment-details.component';
import { SmallUnregisteredBillPaymentDetailsComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment-details/small-unregistered-bill-payment-details/small-unregistered-bill-payment-details.component';
import { ReceiptComponent } from './bill-payments/bill-payment-history/@component/receipt/receipt.component';
import { LargeBillPaymentHistoryComponent } from './bill-payments/bill-payment-history/large-bill-payment-history/large-bill-payment-history.component';
import { MediumBillPaymentHistoryComponent } from './bill-payments/bill-payment-history/medium-bill-payment-history/medium-bill-payment-history.component';
import { SmallBillPaymentHistoryComponent } from './bill-payments/bill-payment-history/small-bill-payment-history/small-bill-payment-history.component';
import { VirtualIdComponent } from './master/beneficiary/@components/payment-methods/virtual-id/virtual-id.component';
import { DefaultAccountRendererComponent } from './master/beneficiary/@components/default-account-renderer/default-account-renderer.component';
import { BillerRegistrationUploadComponent } from './bill-payments/biller-registration-upload/biller-registration-upload.component';
import { BRDataLayoutComponent } from './bill-payments/biller-registration-upload/@components/br-data-layout/br-data-layout.component';
import { BrInfoComponent } from './bill-payments/biller-registration-upload/@components/br-info/br-info.component';
import { WpsPaymentComponent } from './transactions/wps-payment/wps-payment.component';
import { WpsPaymentInitiateComponent } from './transactions/wps-payment/wps-payment-initiate/wps-payment-initiate.component';
import { ViewWpsEnquiryComponent } from './process/transaction-enquiry/view-wps-enquiry/view-wps-enquiry.component';
import { ViewBillPaymentComponent } from './process/transaction-enquiry/view-bill-payment/view-bill-payment.component';
import { TemplateManagementComponent } from './transactions/template-management/template-management.component';
import { SiManagementComponent } from './transactions/si-management/si-management.component';
import { OatTemplateManagementComponent } from './transactions/oat-template-management/oat-template-management.component';
import { OatSiManagementComponent } from './transactions/oat-si-management/oat-si-management.component';
import { SiManagementListingComponent } from './transactions/si-management/si-management-listing/si-management-listing.component';
import { BillPaymentUploadComponent } from './bill-payments/bill-payment-upload/bill-payment-upload.component';
import { BillPresentmentComponent } from './bill-payments/bill-presentment/bill-presentment.component';
import { BillPaymentDataLayoutComponent } from './bill-payments/bill-payment-upload/@components/bill-payment-data-layout/bill-payment-data-layout.component';
import { AccountServicesModule } from '../account-services/account-services.module';
import { BulkPaymentRequestInitiateComponent } from './transactions/bulk-payment-request/bulk-payment-request-initiate/bulk-payment-request-initiate.component';
import { VpaIdCreationComponent } from './upi/vpa-id-creation/vpa-id-creation.component';
import { SendMoneyComponent } from './upi/send-money/send-money.component';
import { RequestRecieveMoneyComponent } from './upi/request-recieve-money/request-recieve-money.component';
import { ChequePrintingReconcileComponent } from './printing/cheque-printing-reconcile/cheque-printing-reconcile.component';
import { PritingReconcileNumberRendererComponent } from './printing/cheque-printing-reconcile/@components/priting-reconcile-number-renderer/priting-reconcile-number-renderer.component';
import { PritingReconcileDropdownRendererComponent } from './printing/cheque-printing-reconcile/@components/priting-reconcile-dropdown-renderer/priting-reconcile-dropdown-renderer.component';

@NgModule({
  declarations: [
    SinglePaymentRequestComponent,
    LargeSinglePaymentRequestComponent,
    LandingListingComponent,
    SmallSinglePaymentRequestComponent,
    LargeSinglePaymentInitiateComponent,
    SinglePaymentRequestListingComponent,
    OwnAccountTransferComponent,
    OwnAccountTransferInitiateComponent,
    StatutoryPaymentComponent,
    StatutoryPaymentInitiateComponent,
    StatutoryPaymentDetailsComponent,
    StatutoryPaymentReviewComponent,
    SendToBankComponent,
    SendToBankInitiateComponent,
    SendToBankActionComponent,
    BatchDetailsRendererComponent,
    LargeOwnAccountTransferComponent,
    SmallOwnAccountTransferComponent,
    FileUploadLogComponent,
    ViewResultComponent,
    AckNackCellRendererComponent,
    BeneficiaryComponent,
    InternalFundTransferComponent,
    RtgsComponent,
    OutwardTelegraphicTransferComponent,
    CashierOrderComponent,
    CorporateChequeComponent,
    OwnChequeComponent,
    SlipsComponent,
    CeftsComponent,
    ViewPaymentRequestEnquiryComponent,
    ViewOwnAccountTransferEnquiryComponent,
    ViewStatutoryPaymentEnquiryComponent,
    BulkPaymentRequestComponent,
    CancelPaymentRequestComponent,
    BeneficiaryUploadComponent,
    UBDataLayoutComponent,
    BPDataLayoutComponent,
    WPSDataLayoutComponent,
    UbInfoComponent,
    MtRegistrationComponent,

    BillPaymentComponent,
    BillPaymentDetailsCardComponent,
    BillPaymentDetailsComponent,
    FetchBillsActionRendererComponent,
    BillerPaymentDetailsComponent,
    BillPaymentHistoryComponent,
    UnregisteredBillPaymentComponent,
    UnregisteredBillPaymentDetailsComponent,
    LogoWithLabelRendererComponent,
    AmountBeingPaidRendererComponent,
    PaymentDateRendererComponent,
    SearchResultComponent,
    ReceiptComponent,
    DueDateRendererComponent,
    BillerRegistrationComponent,
    LargeBillerPaymentDetailsComponent,
    MediumBillerPaymentDetailsComponent,
    SmallBillerPaymentDetailsComponent,
    LargeUnregisteredBillPaymentDetailsComponent,
    MediumUnregisteredBillPaymentDetailsComponent,
    SmallUnregisteredBillPaymentDetailsComponent,
    LargeBillPaymentHistoryComponent,
    MediumBillPaymentHistoryComponent,
    SmallBillPaymentHistoryComponent,
    VirtualIdComponent,
    DefaultAccountRendererComponent,
    BillerRegistrationUploadComponent,

    BRDataLayoutComponent,
    BrInfoComponent,
    WpsPaymentComponent,
    WpsPaymentInitiateComponent,
    ViewWpsEnquiryComponent,
    ViewBillPaymentComponent,
    TemplateManagementComponent,
    SiManagementComponent,
    OatTemplateManagementComponent,
    OatSiManagementComponent,
    SiManagementListingComponent,
    BillPaymentUploadComponent,
    BillPresentmentComponent,
    BillPaymentDataLayoutComponent,
    BulkPaymentRequestInitiateComponent,
    VpaIdCreationComponent,
    SendMoneyComponent,
    RequestRecieveMoneyComponent,
    ChequePrintingReconcileComponent,
    PritingReconcileNumberRendererComponent,
    PritingReconcileDropdownRendererComponent
  ],
  imports: [CommonModule, SharedModule, AccountServicesModule, PaymentsRoutingModule],
})
export class PaymentsModule { }
