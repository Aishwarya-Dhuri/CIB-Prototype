import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeRoutingModule } from './trade-routing.module';
import { LetterOfCreditInitiationComponent } from './import/letter-of-credit/letter-of-credit-initiation/letter-of-credit-initiation.component';
import { LetterOfCreditComponent } from './import/letter-of-credit/letter-of-credit.component';
import { SharedModule } from '../shared/shared.module';
import { LetterOfCreditStatusRendererComponent } from './import/letter-of-credit/@components/letter-of-credit-status-renderer/letter-of-credit-status-renderer.component';
import { LetterOfCreditInitComponent } from './import/letter-of-credit/letter-of-credit-initiation/letter-of-credit-init/letter-of-credit-init.component';
import { LetterOfCreditReviewComponent } from './import/letter-of-credit/letter-of-credit-initiation/letter-of-credit-review/letter-of-credit-review.component';
import { LetterOfCreditAmendComponent } from './import/letter-of-credit-amend/letter-of-credit-amend.component';
import { LetterOfCreditAmendInitiateComponent } from './import/letter-of-credit-amend/letter-of-credit-amend-initiate/letter-of-credit-amend-initiate.component';
import { LcAmendSearchResultComponent } from './import/letter-of-credit-amend/lc-amend-search-result/lc-amend-search-result.component';
import { BankGuaranteeComponent } from './export/bank-guarantee/bank-guarantee.component';
import { BankGuaranteeInitiationComponent } from './export/bank-guarantee/bank-guarantee-initiation/bank-guarantee-initiation.component';
import { BankGuaranteeInitComponent } from './export/bank-guarantee/bank-guarantee-initiation/bank-guarantee-init/bank-guarantee-init.component';
import { BankGuaranteeReviewComponent } from './export/bank-guarantee/bank-guarantee-initiation/bank-guarantee-review/bank-guarantee-review.component';
import { BankGuaranteeStatusRendererComponent } from './export/bank-guarantee/@components/bank-guarantee-status-renderer/bank-guarantee-status-renderer.component';
import { BankGuaranteeAmendComponent } from './export/bank-guarantee-amend/bank-guarantee-amend.component';
import { BgAmendSearchResultComponent } from './export/bank-guarantee-amend/bg-amend-search-result/bg-amend-search-result.component';
import { BankGuaranteeAmendInitiateComponent } from './export/bank-guarantee-amend/bank-guarantee-amend-initiate/bank-guarantee-amend-initiate.component';
import { BillPaymentAndApplyFinanceComponent } from './import/bill-payment-and-apply-finance/bill-payment-and-apply-finance.component';
import { BillPaymentAndApplyFinanceInitiateComponent } from './import/bill-payment-and-apply-finance/bill-payment-and-apply-finance-initiate/bill-payment-and-apply-finance-initiate.component';
import { BillStatusRendererComponent } from './import/bill-payment-and-apply-finance/@components/bill-status-renderer';
import { ViewLetterOfCreditComponent } from './process/transaction-enquiry/view-letter-of-credit/view-letter-of-credit.component';
import { ViewBankGuaranteeComponent } from './process/transaction-enquiry/view-bank-guarantee/view-bank-guarantee.component';
import { ViewBillPaymentAndApplyFinanceComponent } from './process/transaction-enquiry/view-bill-payment-and-apply-finance/view-bill-payment-and-apply-finance.component';
import { LetterOfCreditAmendSearchComponent } from './import/letter-of-credit-amend/letter-of-credit-amend-search/letter-of-credit-amend-search.component';
import { ShippingGuaranteeComponent } from './import/shipping-guarantee/shipping-guarantee.component';
import { ShippingGuaranteeStatusRendererComponent } from './import/shipping-guarantee/@components/shipping-guarantee-status-renderer/shipping-guarantee-status-renderer.component';
import { ShippingGuaranteeInitiationComponent } from './import/shipping-guarantee/shipping-guarantee-initiation/shipping-guarantee-initiation.component';
import { ShippingGuaranteeInitComponent } from './import/shipping-guarantee/shipping-guarantee-initiation/shipping-guarantee-init/shipping-guarantee-init.component';
import { ShippingGuaranteeReviewComponent } from './import/shipping-guarantee/shipping-guarantee-initiation/shipping-guarantee-review/shipping-guarantee-review.component';
import { ShippingCompanyComponent } from './import/shipping-guarantee/@components/shipping-company/shipping-company.component';
import { ConsigneeComponent } from './import/shipping-guarantee/@components/consignee/consignee.component';
import { NotifyPartyComponent } from './import/shipping-guarantee/@components/notify-party/notify-party.component';
import { ViewShippingGuaranteeComponent } from './process/transaction-enquiry/view-shipping-guarantee/view-shipping-guarantee.component';
import { AdvisedLcComponent } from './export/advised-lc/advised-lc.component';
import { ViewAdvisedLcComponent } from './process/transaction-enquiry/view-advised-lc/view-advised-lc.component';
import { BillPresentmentComponent } from './export/bill-presentment/bill-presentment.component';
import { BillPresentmentStatusRendererComponent } from './export/bill-presentment/@components/bill-presentment-status-renderer/bill-presentment-status-renderer.component';
import { BillPresentmentInitiationComponent } from './export/bill-presentment/bill-presentment-initiation/bill-presentment-initiation.component';
import { BillPresentmentInitComponent } from './export/bill-presentment/bill-presentment-initiation/bill-presentment-init/bill-presentment-init.component';
import { BillPresentmentReviewComponent } from './export/bill-presentment/bill-presentment-initiation/bill-presentment-review/bill-presentment-review.component';
import { BeneficiaryOrBuyerComponent } from './export/beneficiary-or-buyer/beneficiary-or-buyer.component';
import { ViewBillPresentmentComponent } from './process/transaction-enquiry/view-bill-presentment/view-bill-presentment.component';
import { ClausesComponent } from './@components/clauses/clauses.component';
import { ClausesModalComponent } from './@components/clauses/@components/clauses-modal/clauses-modal.component';
import { RequestFinanceExportComponent } from './export/request-finance-export/request-finance-export.component';
import { RequestFinanceExportInitComponent } from './export/request-finance-export/request-finance-export-init/request-finance-export-init.component';
import { RequestFinanceExportReviewComponent } from './export/request-finance-export/request-finance-export-review/request-finance-export-review.component';
import { RequestFinanceImportComponent } from './import/request-finance-import/request-finance-import.component';
import { RequestFinanceImportInitComponent } from './import/request-finance-import/request-finance-import-init/request-finance-import-init.component';
import { RequestFinanceImportReviewComponent } from './import/request-finance-import/request-finance-import-review/request-finance-import-review.component';
import { ViewRequestFinanceImportComponent } from './process/transaction-enquiry/view-request-finance-import/view-request-finance-import.component';
import { ViewRequestFinanceExportComponent } from './process/transaction-enquiry/view-request-finance-export/view-request-finance-export.component';
import { BeneficiaryComponent } from './@components/beneficiary/beneficiary.component';
import { BeneficiaryInitComponent } from './@components/beneficiary/beneficiary-init/beneficiary-init.component';
import { BeneficiaryReviewComponent } from './@components/beneficiary/beneficiary-review/beneficiary-review.component';
import { BeneficiaryExportComponent } from './export/beneficiary-export/beneficiary-export.component';
import { BeneficiaryImportComponent } from './import/beneficiary-import/beneficiary-import.component';
import { BankGuaranteeAmendSearchComponent } from './export/bank-guarantee-amend/bank-guarantee-amend-search/bank-guarantee-amend-search.component';
import { BillAcceptanceComponent } from './import/bill-acceptance/bill-acceptance.component';
import { BillAcceptanceInitiateComponent } from './import/bill-acceptance/bill-acceptance-initiate/bill-acceptance-initiate.component';
import { OutwardTelegraphicTransferComponent } from './import/outward-telegraphic-transfer/outward-telegraphic-transfer.component';
import { OutwardTelegraphicTransferStatusRendererComponent } from './import/outward-telegraphic-transfer/@components/outward-telegraphic-transfer-status-renderer/outward-telegraphic-transfer-status-renderer.component';
import { OutwardTelegraphicTransferInitiationComponent } from './import/outward-telegraphic-transfer/outward-telegraphic-transfer-initiation/outward-telegraphic-transfer-initiation.component';
import { OutwardTelegraphicTransferInitComponent } from './import/outward-telegraphic-transfer/outward-telegraphic-transfer-initiation/outward-telegraphic-transfer-init/outward-telegraphic-transfer-init.component';
import { OutwardTelegraphicTransferReviewComponent } from './import/outward-telegraphic-transfer/outward-telegraphic-transfer-initiation/outward-telegraphic-transfer-review/outward-telegraphic-transfer-review.component';

@NgModule({
  declarations: [
    LetterOfCreditComponent,
    LetterOfCreditInitiationComponent,
    LetterOfCreditStatusRendererComponent,
    LetterOfCreditInitComponent,
    LetterOfCreditReviewComponent,
    LetterOfCreditAmendComponent,
    LetterOfCreditAmendInitiateComponent,
    LcAmendSearchResultComponent,
    BankGuaranteeComponent,
    BankGuaranteeInitiationComponent,
    BankGuaranteeInitComponent,
    BankGuaranteeReviewComponent,
    BankGuaranteeStatusRendererComponent,
    BankGuaranteeAmendComponent,
    BgAmendSearchResultComponent,
    BankGuaranteeAmendInitiateComponent,
    BillPaymentAndApplyFinanceComponent,
    BillPaymentAndApplyFinanceInitiateComponent,
    BillStatusRendererComponent,
    ViewLetterOfCreditComponent,
    ViewBankGuaranteeComponent,
    ViewBillPaymentAndApplyFinanceComponent,
    ShippingGuaranteeComponent,
    ShippingGuaranteeStatusRendererComponent,
    ShippingGuaranteeInitiationComponent,
    ShippingGuaranteeInitComponent,
    ShippingGuaranteeReviewComponent,
    ShippingCompanyComponent,
    ConsigneeComponent,
    NotifyPartyComponent,
    ViewShippingGuaranteeComponent,
    LetterOfCreditAmendSearchComponent,
    AdvisedLcComponent,
    ViewAdvisedLcComponent,
    BillPresentmentComponent,
    BillPresentmentStatusRendererComponent,
    BillPresentmentInitiationComponent,
    BillPresentmentInitComponent,
    BillPresentmentReviewComponent,
    BeneficiaryOrBuyerComponent,
    ViewBillPresentmentComponent,
    ClausesComponent,
    ClausesModalComponent,
    RequestFinanceExportComponent,
    RequestFinanceExportInitComponent,
    RequestFinanceExportReviewComponent,
    RequestFinanceImportComponent,
    RequestFinanceImportInitComponent,
    RequestFinanceImportReviewComponent,
    ViewRequestFinanceImportComponent,
    ViewRequestFinanceExportComponent,
    BeneficiaryComponent,
    BeneficiaryInitComponent,
    BeneficiaryReviewComponent,
    BeneficiaryExportComponent,
    BeneficiaryImportComponent,
    BankGuaranteeAmendSearchComponent,
    BillAcceptanceComponent,
    BillAcceptanceInitiateComponent,
    OutwardTelegraphicTransferComponent,
    OutwardTelegraphicTransferStatusRendererComponent,
    OutwardTelegraphicTransferInitiationComponent,
    OutwardTelegraphicTransferInitComponent,
    OutwardTelegraphicTransferReviewComponent,
  ],
  imports: [CommonModule, SharedModule, TradeRoutingModule],
})
export class TradeModule {}
