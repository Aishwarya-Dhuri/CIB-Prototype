import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { SinglePaymentRequestListingComponent } from './transactions/single-payment-request/single-payment-request-listing/single-payment-request-listing.component';
import { StatutoryPaymentComponent } from './transactions/statutory-payment/statutory-payment.component';
import { StatutoryPaymentInitiateComponent } from './transactions/statutory-payment/statutory-payment-initiate/statutory-payment-initiate.component';
import { OwnAccountTransferComponent } from './transactions/own-account-transfer/own-account-transfer.component';
import { SendToBankComponent } from './transactions/send-to-bank/send-to-bank.component';
import { SendToBankInitiateComponent } from './transactions/send-to-bank/send-to-bank-initiate/send-to-bank-initiate.component';
import { SendToBankActionComponent } from './transactions/send-to-bank/send-to-bank-action/send-to-bank-action.component';
import { SinglePaymentRequestComponent } from './transactions/single-payment-request/single-payment-request.component';
import { LargeSinglePaymentInitiateComponent } from './transactions/single-payment-request/large-single-payment-request/single-payment-initiate/large-single-payment-initiate.component';
import { OwnAccountTransferInitiateComponent } from './transactions/own-account-transfer/large-own-account-transfer/own-account-transfer-initiate/own-account-transfer-initiate.component';
import { FileUploadLogComponent } from './transactions/file-upload-log/file-upload-log.component';
import { ViewResultComponent } from './transactions/file-upload-log/view-result/view-result.component';
import { BeneficiaryComponent } from './master/beneficiary/beneficiary.component';
import { ViewPaymentRequestEnquiryComponent } from './process/transaction-enquiry/view-payment-request-enquiry/view-payment-request-enquiry.component';
import { ViewOwnAccountTransferEnquiryComponent } from './process/transaction-enquiry/view-own-account-transfer-enquiry/view-own-account-transfer-enquiry.component';
import { ViewStatutoryPaymentEnquiryComponent } from './process/transaction-enquiry/view-statutory-payment-enquiry/view-statutory-payment-enquiry.component';
import { BeneficiaryUploadComponent } from './master/beneficiary-upload/beneficiary-upload.component';
import { BulkPaymentRequestComponent } from './transactions/bulk-payment-request/bulk-payment-request.component';
import { CancelPaymentRequestComponent } from './transactions/cancel-payment-request/cancel-payment-request.component';
import { MtRegistrationComponent } from './master/mt-registration/mt-registration.component';
import { BillPaymentComponent } from './bill-payments/bill-payment/bill-payment.component';
import { BillPaymentUploadComponent } from './bill-payments/bill-payment-upload/bill-payment-upload.component';
import { BillPresentmentComponent } from './bill-payments/bill-presentment/bill-presentment.component';
import { BillerPaymentDetailsComponent } from './bill-payments/bill-payment/biller-payment-details/biller-payment-details.component';
import { BillPaymentHistoryComponent } from './bill-payments/bill-payment-history/bill-payment-history.component';
import { SearchResultComponent } from './bill-payments/bill-payment-history/large-bill-payment-history/search-result/search-result.component';
import { UnregisteredBillPaymentComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment.component';
import { UnregisteredBillPaymentDetailsComponent } from './bill-payments/unregistered-bill-payment/unregistered-bill-payment-details/unregistered-bill-payment-details.component';
import { BillerRegistrationComponent } from './bill-payments/biller-registration/biller-registration.component';
import { BillerRegistrationUploadComponent } from './bill-payments/biller-registration-upload/biller-registration-upload.component';
import { WpsPaymentComponent } from './transactions/wps-payment/wps-payment.component';
import { WpsPaymentInitiateComponent } from './transactions/wps-payment/wps-payment-initiate/wps-payment-initiate.component';
import { ViewWpsEnquiryComponent } from './process/transaction-enquiry/view-wps-enquiry/view-wps-enquiry.component';
import { TemplateManagementComponent } from './transactions/template-management/template-management.component';
import { SiManagementComponent } from './transactions/si-management/si-management.component';
import { OatTemplateManagementComponent } from './transactions/oat-template-management/oat-template-management.component';
import { OatSiManagementComponent } from './transactions/oat-si-management/oat-si-management.component';
import { ViewBillPaymentComponent } from './process/transaction-enquiry/view-bill-payment/view-bill-payment.component';
import { SiManagementListingComponent } from './transactions/si-management/si-management-listing/si-management-listing.component';
import { SwiftGpiDataflowComponent } from '../shared/@components/swift-gpi-dataflow/swift-gpi-dataflow.component';
import { BulkPaymentRequestInitiateComponent } from './transactions/bulk-payment-request/bulk-payment-request-initiate/bulk-payment-request-initiate.component';
import { VpaIdCreationComponent } from './upi/vpa-id-creation/vpa-id-creation.component';
import { SendMoneyComponent } from './upi/send-money/send-money.component';
import { RequestRecieveMoneyComponent } from './upi/request-recieve-money/request-recieve-money.component';
import { ChequePrintingReconcileComponent } from './printing/cheque-printing-reconcile/cheque-printing-reconcile.component';

const routes: Routes = [
  {
    path: 'transactions/singlePaymentRequest',
    children: [
      { path: '', component: SinglePaymentRequestComponent },
      { path: 'initiate', component: LargeSinglePaymentInitiateComponent },
      { path: 'listing', component: SinglePaymentRequestListingComponent },
    ],
  },
  {
    path: 'transactions/ownAccountTransfer',
    children: [
      { path: '', component: OwnAccountTransferComponent },
      { path: 'initiate', component: OwnAccountTransferInitiateComponent },
    ],
  },

  {
    path: 'transactions/statutoryPayment',
    children: [
      { path: '', component: StatutoryPaymentComponent },
      { path: 'initiate', component: StatutoryPaymentInitiateComponent },
      // { path: 'listing', component: GenericListingComponent },
    ],
  },
  {
    path: 'transactions/sendToBank',
    children: [
      { path: '', component: SendToBankComponent },
      { path: 'initiate', component: SendToBankInitiateComponent },
      { path: 'action', component: SendToBankActionComponent },
    ],
  },
  {
    path: 'transactions/bulkPaymentRequest',
    component: BulkPaymentRequestComponent,
  },
  {
    path: 'transactions/bulkPaymentRequest/initiate',
    component: BulkPaymentRequestInitiateComponent,
  },
  {
    path: 'transactions/cancelPaymentRequest',
    component: CancelPaymentRequestComponent,
  },
  {
    path: 'transactions/wpsPayment',
    component: WpsPaymentComponent,
  },
  {
    path: 'transactions/wpsPayment/initiate',
    component: WpsPaymentInitiateComponent,
  },

  {
    path: 'transactions/fileUploadLog',
    component: FileUploadLogComponent,
  },
  {
    path: 'transactions/fileUploadLog/viewResult',
    component: ViewResultComponent,
  },


  {
    path: 'printing/chequePrintingReconcile',
    component: ChequePrintingReconcileComponent,
  },


  {
    path: 'masters/beneficiary',
    component: BeneficiaryComponent,
  },
  {
    path: 'masters/beneficiaryUpload',
    component: BeneficiaryUploadComponent,
  },
  {
    path: 'masters/mtRegistration',
    component: MtRegistrationComponent,
  },
  {
    path: 'process/transactionEnquiry/viewPaymentRequestEnquiry',
    component: ViewPaymentRequestEnquiryComponent,
  },
  {
    path: 'process/transactionEnquiry/viewOwnAccountTransferEnquiry',
    component: ViewOwnAccountTransferEnquiryComponent,
  },
  {
    path: 'process/transactionEnquiry/viewWpsEnquiry',
    component: ViewWpsEnquiryComponent,
  },
  {
    path: 'process/transactionEnquiry/viewBillPaymentEnquiry',
    component: ViewBillPaymentComponent,
  },
  {
    path: 'process/transactionEnquiry/viewStatutoryPaymentEnquiry',
    component: ViewStatutoryPaymentEnquiryComponent,
  },
  {
    path: 'billPayments/payBill',
    component: BillPaymentComponent,
  },
  {
    path: 'billPayments/billPaymentUpload',
    component: BillPaymentUploadComponent,
  },
  {
    path: 'billPayments/billPresentment',
    component: BillPresentmentComponent,
  },
  {
    path: 'upi/vpaIdCreation',
    component: VpaIdCreationComponent,
  },
  {
    path: 'upi/sendMoney',
    component: SendMoneyComponent,
  },
  {
    path: 'upi/requestRecievecMoney',
    component: RequestRecieveMoneyComponent,
  },


  {
    path: 'billPayments/unregisteredBillPayment',
    component: UnregisteredBillPaymentComponent,
  },
  {
    path: 'billPayments/unregisteredBillPayment/billPaymentDetails',
    component: UnregisteredBillPaymentDetailsComponent,
  },
  {
    path: 'billPayments/billPaymentHistory',
    component: BillPaymentHistoryComponent,
  },
  {
    path: 'billPayments/billerRegistrationUpload',
    component: BillerRegistrationUploadComponent,
  },
  {
    path: 'billPayments/billPaymentHistory/searchResult',
    component: SearchResultComponent,
  },

  {
    path: 'billPayments/payBill/initiate',
    component: BillerPaymentDetailsComponent,
  },

  {
    path: 'billPayments/billerRegistration',
    component: BillerRegistrationComponent,
  },
  {
    path: 'transactions/templateManagement',
    component: TemplateManagementComponent,
  },
  {
    path: 'transactions/siManagement',
    component: SiManagementComponent,
  },
  {
    path: 'transactions/siManagement/listing',
    component: SiManagementListingComponent,
  },
  {
    path: 'transactions/oatTemplateManagement',
    component: OatTemplateManagementComponent,
  },
  {
    path: 'transactions/oatSiManagement',
    component: OatSiManagementComponent,
  },
  {
    path: ':parentMenu/:entityName/dataflow',
    component: SwiftGpiDataflowComponent,
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
export class PaymentsRoutingModule { }
