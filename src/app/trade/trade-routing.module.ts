import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LetterOfCreditAmendComponent } from './import/letter-of-credit-amend/letter-of-credit-amend.component';
import { LetterOfCreditInitiationComponent } from './import/letter-of-credit/letter-of-credit-initiation/letter-of-credit-initiation.component';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { LetterOfCreditComponent } from './import/letter-of-credit/letter-of-credit.component';
import { BankGuaranteeComponent } from './export/bank-guarantee/bank-guarantee.component';
import { BankGuaranteeInitiationComponent } from './export/bank-guarantee/bank-guarantee-initiation/bank-guarantee-initiation.component';
import { BankGuaranteeAmendComponent } from './export/bank-guarantee-amend/bank-guarantee-amend.component';
import { BillPaymentAndApplyFinanceComponent } from './import/bill-payment-and-apply-finance/bill-payment-and-apply-finance.component';
import { BillPaymentAndApplyFinanceInitiateComponent } from './import/bill-payment-and-apply-finance/bill-payment-and-apply-finance-initiate/bill-payment-and-apply-finance-initiate.component';
import { ViewLetterOfCreditComponent } from './process/transaction-enquiry/view-letter-of-credit/view-letter-of-credit.component';
import { ViewBankGuaranteeComponent } from './process/transaction-enquiry/view-bank-guarantee/view-bank-guarantee.component';
import { ViewBillPaymentAndApplyFinanceComponent } from './process/transaction-enquiry/view-bill-payment-and-apply-finance/view-bill-payment-and-apply-finance.component';
import { ShippingGuaranteeComponent } from './import/shipping-guarantee/shipping-guarantee.component';
import { ShippingGuaranteeInitiationComponent } from './import/shipping-guarantee/shipping-guarantee-initiation/shipping-guarantee-initiation.component';
import { ViewShippingGuaranteeComponent } from './process/transaction-enquiry/view-shipping-guarantee/view-shipping-guarantee.component';
import { AdvisedLcComponent } from './export/advised-lc/advised-lc.component';
import { ViewAdvisedLcComponent } from './process/transaction-enquiry/view-advised-lc/view-advised-lc.component';
import { BillPresentmentComponent } from './export/bill-presentment/bill-presentment.component';
import { BillPresentmentInitiationComponent } from './export/bill-presentment/bill-presentment-initiation/bill-presentment-initiation.component';
import { ViewBillPresentmentComponent } from './process/transaction-enquiry/view-bill-presentment/view-bill-presentment.component';
import { RequestFinanceExportComponent } from './export/request-finance-export/request-finance-export.component';
import { RequestFinanceImportComponent } from './import/request-finance-import/request-finance-import.component';
import { ViewRequestFinanceImportComponent } from './process/transaction-enquiry/view-request-finance-import/view-request-finance-import.component';
import { ViewRequestFinanceExportComponent } from './process/transaction-enquiry/view-request-finance-export/view-request-finance-export.component';
import { BeneficiaryImportComponent } from './import/beneficiary-import/beneficiary-import.component';
import { BeneficiaryExportComponent } from './export/beneficiary-export/beneficiary-export.component';
import { BillAcceptanceComponent } from './import/bill-acceptance/bill-acceptance.component';
import { OutwardTelegraphicTransferComponent } from './import/outward-telegraphic-transfer/outward-telegraphic-transfer.component';
import { OutwardTelegraphicTransferInitiationComponent } from './import/outward-telegraphic-transfer/outward-telegraphic-transfer-initiation/outward-telegraphic-transfer-initiation.component';

const routes: Routes = [
  {
    path: 'importTransactions/letterOfCredit',
    component: LetterOfCreditComponent,
  },
  {
    path: 'importTransactions/letterOfCredit/initiate',
    component: LetterOfCreditInitiationComponent,
  },
  {
    path: 'importTransactions/letterOfCreditAmend',
    component: LetterOfCreditAmendComponent,
  },
  {
    path: 'importTransactions/billAcceptance',
    component: BillAcceptanceComponent,
  },
  {
    path: 'importTransactions/billPaymentAndApplyFinance',
    component: BillPaymentAndApplyFinanceComponent,
  },
  {
    path: 'importTransactions/billPaymentAndApplyFinance/initiate',
    component: BillPaymentAndApplyFinanceInitiateComponent,
  },
  {
    path: 'importTransactions/shippingGuarantee',
    component: ShippingGuaranteeComponent,
  },
  {
    path: 'importTransactions/shippingGuarantee/initiate',
    component: ShippingGuaranteeInitiationComponent,
  },
  {
    path: 'importTransactions/requestFinance',
    component: RequestFinanceImportComponent,
  },
  {
    path: 'importTransactions/outwardTelegraphTransfer',
    component: OutwardTelegraphicTransferComponent,
  },
  {
    path: 'importTransactions/outwardTelegraphTransfer/initiate',
    component: OutwardTelegraphicTransferInitiationComponent,
  },
  {
    path: 'importMaster/beneficiary',
    component: BeneficiaryImportComponent,
  },
  {
    path: 'exportTransactions/bankGuarantee',
    component: BankGuaranteeComponent,
  },
  {
    path: 'exportTransactions/bankGuarantee/initiate',
    component: BankGuaranteeInitiationComponent,
  },
  {
    path: 'exportTransactions/bankGuaranteeAmend',
    component: BankGuaranteeAmendComponent,
  },
  {
    path: 'exportTransactions/advisedLc/initiate',
    component: AdvisedLcComponent,
  },
  {
    path: 'exportTransactions/billPresentment/initiate',
    component: BillPresentmentInitiationComponent,
  },
  {
    path: 'exportTransactions/requestFinance',
    component: RequestFinanceExportComponent,
  },
  {
    path: 'exportMaster/beneficiary',
    component: BeneficiaryExportComponent,
  },
  {
    path: 'process/transactionEnquiry/viewLetterOfCreditEnquiry',
    component: ViewLetterOfCreditComponent,
  },
  {
    path: 'process/transactionEnquiry/viewBankGuaranteeEnquiry',
    component: ViewBankGuaranteeComponent,
  },
  {
    path: 'process/transactionEnquiry/viewBillPaymentAndApplyFinanceEnquiry',
    component: ViewBillPaymentAndApplyFinanceComponent,
  },
  {
    path: 'process/transactionEnquiry/viewShippingGuaranteeEnquiry',
    component: ViewShippingGuaranteeComponent,
  },
  {
    path: 'process/transactionEnquiry/viewAdvisedLcEnquiry',
    component: ViewAdvisedLcComponent,
  },
  {
    path: 'process/transactionEnquiry/viewBillPresentmentEnquiry',
    component: ViewBillPresentmentComponent,
  },
  {
    path: 'process/transactionEnquiry/viewRequestFinanceImportEnquiry',
    component: ViewRequestFinanceImportComponent,
  },
  {
    path: 'process/transactionEnquiry/viewRequestFinanceExportEnquiry',
    component: ViewRequestFinanceExportComponent,
  },
  {
    path: 'exportTransactions/billPresentment',
    component: BillPresentmentComponent,
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
export class TradeRoutingModule {}
