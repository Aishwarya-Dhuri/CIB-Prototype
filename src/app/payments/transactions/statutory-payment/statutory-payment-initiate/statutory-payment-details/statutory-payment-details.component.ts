import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { StatutoryPaymentService } from '../../@services/statutory-payment.service';

@Component({
  selector: 'app-statutory-payment-details',
  templateUrl: './statutory-payment-details.component.html',
  styleUrls: ['./statutory-payment-details.component.scss'],
})
export class StatutoryPaymentDetailsComponent implements OnInit, OnDestroy {
  uploadDocuments: boolean = false;
  viewDocuments: boolean = false;

  uploadDocumentFiles: any[] = [];

  statutoryPaymentDetails: any;

  institution: any;

  institutionTypes: any[] = [
    {
      id: 'GST',
      enrichments: {
        isComplexData: false,
        value: 'GST',
      },
      displayName: 'GST',
    },
    {
      id: 'Direct Tax',
      enrichments: {
        isComplexData: false,
        value: 'Direct Tax',
      },
      displayName: 'Direct Tax',
    },
    {
      id: 'Employees Provident Fund',
      enrichments: {
        isComplexData: false,
        value: 'Employees Provident Fund',
      },
      displayName: 'Employees Provident Fund',
    },
    {
      id: 'Ports Authority',
      enrichments: {
        isComplexData: false,
        value: 'Ports Authority',
      },
      displayName: 'Ports Authority',
    },
    {
      id: 'International Container Terminal',
      enrichments: {
        isComplexData: true,
        value: 'International Container Terminal',
      },
      displayName: 'International Container Terminal',
    },
    {
      id: 'Custom Duty',
      enrichments: {
        isComplexData: true,
        value: 'Custom Duty',
      },
      displayName: 'Custom Duty',
    },
  ];

  constructor(
    private httpService: HttpService,
    private toasterService: ToasterService,
    private statutoryPaymentService: StatutoryPaymentService,
  ) { }

  ngOnInit(): void {
    this.institution = this.statutoryPaymentService.institution;
    this.statutoryPaymentDetails = this.statutoryPaymentService.statutoryPaymentDetails;

    if (!this.statutoryPaymentDetails) {
      this.statutoryPaymentDetails = {
        taxDetails: null,
        documents: [],

        institutionDetails: {
          institutionType: this.institution ? this.institution.displayName : '',
          valueDate: '',
          paymentId: '',
          searchBy: '',
          custdecNumber: '',
          containerNumber: '',
          ieCode: '',
          igRefNo: '',
          tax: '',
          surcharge: '',
          educationCess: '',
          interest: '',
          penalty: '',
          others: '',
        },
        paymentDetails: 'Debit From Account',
        merchantAccount: '',
        debitAccount: '',
        debitAccountNumber: '',
        balanceAmount: '5000001.55',
        totalAmount: '',
        remarkForChecker: '',
      };
    }

    if (!this.institution) {
      this.institution = {
        displayName: '',
        isComplexData: false,
      };
    }
  }

  onUploadDocuments(documents: any[]) {
    this.statutoryPaymentDetails.documents = documents;
    this.uploadDocuments = false;
  }

  fetchInstitutionTaxDetails(form: NgForm) {
    if (form.valid) {
      if (this.statutoryPaymentDetails.institutionDetails.institutionType == 'GST') {
        this.httpService
          .httpPost(`payments/transactions/statutoryPayment/gstData`)
          .subscribe((taxDetails: any) => {
            this.toasterService.showToaster({
              severity: 'success',
              detail: 'Your GST Number has been Verified',
            });

            this.statutoryPaymentDetails.taxDetails = taxDetails;
            this.statutoryPaymentDetails.totalAmount = taxDetails.voucherAmount;
          });
      } else if (this.statutoryPaymentDetails.institutionDetails.institutionType == 'Direct Tax') {
        this.httpService
          .httpPost(`payments/transactions/statutoryPayment/directTaxData`)
          .subscribe((taxDetails: any) => {
            this.toasterService.showToaster({
              severity: 'success',
              detail: 'Your PAN Number has been Verified',
            });

            this.statutoryPaymentDetails.taxDetails = taxDetails;
            this.statutoryPaymentDetails.totalAmount = taxDetails.voucherAmount;
          });
      }

      else if (this.statutoryPaymentDetails.institutionDetails.institutionType == 'Custom Duty') {
        this.httpService
          .httpPost(
            `payments/transactions/statutoryPayment/${this.institution.isComplexData
              ? 'institutionTaxDetailsCustomDuty'
              : 'institutionTaxDetails'
            }`,
          )
          .subscribe((taxDetails: any) => {
            if (this.institution.isComplexData) {
              this.statutoryPaymentDetails.taxDetails = taxDetails.map((td: any) => {
                return {
                  ...td,
                  isSelected: false,
                  isTaxDetailsFetched: false,
                };
              });
            } else {
              this.statutoryPaymentDetails.taxDetails = taxDetails;
              this.statutoryPaymentDetails.totalAmount = taxDetails.voucherAmount;
            }
          });
      }


      else {
        this.httpService
          .httpPost(
            `payments/transactions/statutoryPayment/${this.institution.isComplexData
              ? 'institutionTaxDetailsComplex'
              : 'institutionTaxDetails'
            }`,
          )
          .subscribe((taxDetails: any) => {
            if (this.institution.isComplexData) {
              this.statutoryPaymentDetails.taxDetails = taxDetails.map((td: any) => {
                return {
                  ...td,
                  isSelected: false,
                  isTaxDetailsFetched: false,
                };
              });
            } else {
              this.statutoryPaymentDetails.taxDetails = taxDetails;
              this.statutoryPaymentDetails.totalAmount = taxDetails.voucherAmount;
            }
          });
      }
    }
  }

  validateTaxDetails(taxDetails: any) {
    if (
      taxDetails.weightCharges &&
      taxDetails.collectionStartDate &&
      taxDetails.collectionEndDate
    ) {
      return false;
    }
    return true;
  }

  fetchTaxDetails(taxDetails: any, i: number) {
    this.httpService
      .httpPost('payments/transactions/statutoryPayment/fetchComplexTaxDetails')
      .subscribe((taxDetails: any) => {
        this.statutoryPaymentDetails.taxDetails[i].isTaxDetailsFetched = true;
        this.statutoryPaymentDetails.taxDetails[i].outstandingAmount = taxDetails.outstandingAmount;
        this.statutoryPaymentDetails.taxDetails[i].tax = taxDetails.tax;
        this.statutoryPaymentDetails.taxDetails[i].total = taxDetails.total;

        this.setTotalAmount();
      });
  }

  setTotalAmount() {
    let totalAmount = 0;

    this.statutoryPaymentDetails.taxDetails.forEach((td: any) => {
      totalAmount = totalAmount + (td.total ? +td.total : 0);
    });

    this.statutoryPaymentDetails.totalAmount = totalAmount.toString();
  }

  resetInstitutionDetailsForm(form: NgForm) {
    form.resetForm({
      institutionType: '',
      valueDate: '',
      paymentId: '',
      searchBy: '',
      custdecNumber: '',
      containerNumber: '',
      ieCode: '',
      igRefNo: '',
      tax: '',
      surcharge: '',
      educationCess: '',
      interest: '',
      penalty: '',
      others: '',
    });

    this.statutoryPaymentDetails.debitAccount = null
  }

  onChangeInstituteType(institution: any) {
    this.institution = {
      displayName: institution.enrichments.value,
      isComplexData: institution.enrichments.isComplexData,
    };
  }

  ngOnDestroy() {
    this.statutoryPaymentService.statutoryPaymentDetails = this.statutoryPaymentDetails;
    if (!this.statutoryPaymentService.institution) {
      this.statutoryPaymentService.institution = this.institution;
    }
  }
}
