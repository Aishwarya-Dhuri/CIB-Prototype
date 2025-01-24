import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CreditDebitNote } from './@model/credit-debit-note.model';

@Component({
  selector: 'app-credit-debit-note-entry',
  templateUrl: './credit-debit-note-entry.component.html',
  styleUrls: ['./credit-debit-note-entry.component.scss'],
})
export class CreditDebitNoteEntryComponent implements OnInit {
  @ViewChild('itemDetailsGrid') itemDetailsGrid: any;

  loading: boolean;
  formData: CreditDebitNote = new CreditDebitNote();

  mode: string = '';

  showSearchModal: boolean = false;

  showSponsorModal: boolean = false;
  showSellerModal: boolean = false;
  showEntityCodeModal: boolean = false;
  showInvoiceModal: boolean = false;

  searchModelHeader: string = '';
  searchModelColDefsUrl: string = '';
  searchModelRowDataUrl: string = '';
  searchModelRowDataReq: any = {};

  stepperDetails: Stepper = {
    masterName: 'Credit/Debit Note Entry',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isSaveAsTemplateApplicable: true,
    isSaveDraftApplicable: true,
    isOnlyFooter: true,
    headings: ['Invoice Details', 'Credit Note Details', 'Enrichment Details', 'Review and Submit'],
  };

  constructor(
    public breadcrumbService: BreadcrumbService,
    public actionService: ActionService,
    public viewService: ViewService,
    public httpService: HttpService,
    public toasterService: ToasterService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const breadcrumb: Breadcrumb[] = [
      {
        icon: 'fa-home',
      },
      {
        label: 'FSCM',
      },
      {
        label: 'Transactions',
      },
      {
        label: 'Credit/Debit Note Entry',
      },
      {
        label: 'Initiate',
      },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumb);

    const actions: Actions = {
      heading: 'Invoice ENtry - Initiate',
      print: true,
      download: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    this.mode = this.viewService.getMode();

    if (this.mode && (this.mode == 'EDIT' || this.mode == 'VIEW')) {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('fscm/transactions/invoiceEntry/private/view', data)
        .subscribe((response: any) => {
          this.formData = response;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onSearchSponsor() {
    this.searchModelHeader = 'Sponsor';
    this.searchModelColDefsUrl = 'fscm/transactions/invoiceEntry/private/sponsorColDefs';
    this.searchModelRowDataUrl = 'fscm/transactions/invoiceEntry/private/getSponsorData';
    this.searchModelRowDataReq = {};
    this.showSearchModal = true;
  }

  onSearchSellerBuyer() {
    this.searchModelHeader = 'Seller/Buyer';
    this.searchModelColDefsUrl = 'fscm/transactions/invoiceEntry/private/sellerBuyerColDefs';
    this.searchModelRowDataUrl = 'fscm/transactions/invoiceEntry/private/getSellerBuyerData';
    this.searchModelRowDataReq = { sponsorCode: this.formData.sponsorCode };
    this.showSearchModal = true;
  }

  onSearchEntityCode() {
    this.searchModelHeader = 'Entity Code';
    this.searchModelColDefsUrl = 'fscm/transactions/invoiceEntry/private/entitySubCodeColDefs';
    this.searchModelRowDataUrl = 'fscm/transactions/invoiceEntry/private/getEntitySubCodeData';
    this.searchModelRowDataReq = { sellerBuyerCode: this.formData.sellerBuyerCode };
    this.showSearchModal = true;
  }

  onSearchInvoiceNumber() {
    this.searchModelHeader = 'Invoice';
    this.searchModelColDefsUrl = 'fscm/transactions/creditDebitNoteEntry/private/invoiceColDefs';
    this.searchModelRowDataUrl =
      'fscm/transactions/creditDebitNoteEntry/private/getAcceptedInvoices';
    this.searchModelRowDataReq = {
      sponsorCode: this.formData.sponsorCode,
      sellerBuyerCode: this.formData.sellerBuyerCode,
    };
    this.showSearchModal = true;
  }


  onSponsorCode(data: any) {
    this.formData.sponsorId = data.id;
    this.formData.sponsorCode = data.sponsorCode;
    this.formData.sponsorName = data.sponsorName;
  };

  onSellerCode(data: any) {
    this.formData.sellerBuyerId = data.id;
    this.formData.sellerBuyerCode = data.sellerBuyerCode;
    this.formData.sellerBuyerName = data.sellerBuyerName;
  };


  onEntityCode(data: any) {
    this.formData.entitySubCodeId = data.id;
    this.formData.entitySubCode = data.entitySubCode;
    this.formData.entitySubCodeDescription = data.entitySubCodeDescription;
  };


  onInvoice(data: any) {
    this.formData.invoiceNumber = data.invoiceNumber;
    this.formData.invoiceAmount = data.invoiceAmount;
    this.formData.invoiceGenerationDate = data.invoiceEntryDate;
    this.formData.invoiceDueDate = data.invoiceDueDate;
  };

  onChangeCreditOrDebitNote(creditOrDebitNote: string) {
    this.stepperDetails.headings[1] = creditOrDebitNote + ' Details';
  }

  onStepChange(stepNo: number) {
    return true;
  }

  validateForm(stepNo: number) {
    return true;
  }

  beforeSubmit() {
    this.formData.creditDebitNoteDate =
      this.formData.creditNoteOrDebitNote == 'Credit Note'
        ? this.formData.creditNoteDetails[0].creditNoteDate
        : this.formData.debitNoteDetails[0].debitNoteDate;

    this.formData.creditDebitNoteAmount =
      this.formData.creditNoteOrDebitNote == 'Credit Note'
        ? this.formData.creditNoteDetails[0].creditNoteAmount
        : this.formData.debitNoteDetails[0].debitNoteAmount;
    this.formData.creditDebitNoteReferenceNumber =
      this.formData.creditNoteOrDebitNote == 'Credit Note'
        ? this.formData.creditNoteDetails[0].creditNoteReferenceNumber
        : this.formData.debitNoteDetails[0].debitNoteReferenceNumber;

    return true;
  }

  beforeSaveDraft() {
    return true;
  }

  beforeSaveTemplate() {
    return true;
  }
}
