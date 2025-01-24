import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ReceiptEntry } from './@models/receipt-entry.model';

@Component({
  selector: 'app-receipt-entry',
  templateUrl: './receipt-entry.component.html',
  styleUrls: ['./receipt-entry.component.scss'],
})
export class ReceiptEntryComponent implements OnInit {
  @ViewChild('receiptEntryForm') receiptEntryForm: any;

  formData: ReceiptEntry;
  programList: Select[] = [];
  creditAccountList: Select[] = [];
  ccyList: Select[] = [];
  isCorporateClient: boolean = false;
  stepperDetails: Stepper = {
    masterName: 'Receipt Entry',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  viewPort: string = '';
  mode: string = '';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private currencyService: CurrencyService,
    private viewPortService: ViewportService,
    private userService: UserService,
    private viewService: ViewService,
  ) {
    this.formData = {
      programId: '',
      programName: '',
      entryMode: '',
      currencyId: '',
      corporateId: '',
      corporateCode: '',
      corporateName: '',
      corporateClientId: '',
      corporateClientCode: '',
      corporateClientName: '',
      status: 'create',
      paymentDate: '',
      paymentMode: '',
      creditAccountId: '',
      creditAccountNo: '',
      paymentAmount: '',
      receiptEntryDetails: [
        {
          entryDate: '',
          remarks: '',
          paymentDate: '',
          paymentMode: 'Cash',
          creditAccountNo: '',
          ccy: '',
          paymentAmount: '',
          paymentReference: '',
          invoiceLink: 'No',
          receiptEntryInvoiceDetails: [
            {
              invoiceNo: '',
              invoiceAmount: '',
              invoiceDate: '',
            },
          ],
        },
      ],
    };
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Receipt Entry Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'RMS' },
      { label: 'Transactions' },
      { label: 'Receipt Entry' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.viewPortService.getViewport().subscribe((res) => {
      this.viewPort = res;
    });
    this.getDropdownData();
    this.getViewData();
  }

  getDropdownData(): void {
    this.httpService
      .httpPost('rms/transactions/receiptEntry/private/dropdown/programDataList')
      .subscribe((response: any) => {
        this.programList = response.dataList;
      });
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList')
      .subscribe((response: any) => {
        this.creditAccountList = response.dataList;
      });
    this.currencyService.getCurrencyList().subscribe((res: any) => {
      this.ccyList = res;
    });
    this.currencyService.getCurrencyId().subscribe((res: any) => {
      this.formData.receiptEntryDetails[0].ccy = res;
      this.formData.currencyId = res;
    });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('rms/transactions/receiptEntry/private/view', data)
        .subscribe((formData: ReceiptEntry) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  corporateClientSearchModelData(selectedData: any): void {
    this.formData.corporateClientId = selectedData.id;
    this.formData.corporateClientCode = selectedData.corporateClientCode;
    this.formData.corporateClientName = selectedData.corporateClientName;
  }

  setProgramNameById(programId: string): void {
    this.formData.programName = this.programList.find(
      (res: any) => res.id === programId,
    ).displayName;
  }

  setCurrencyNameById(currencyId: string): string {
    return this.ccyList.find((res: any) => res.id === currencyId).displayName;
  }

  setCreditAccountNameById(creditAccountId: string): void {
    let creditAccountNo: string = '';
    creditAccountNo = this.creditAccountList.find(
      (res: any) => res.id === creditAccountId,
    ).displayName;
    this.formData.creditAccountNo = creditAccountNo;
    this.formData.receiptEntryDetails[0].creditAccountNo = creditAccountNo;
  }

  deleteInvoiceDetail(i: number): void {
    if (this.formData.receiptEntryDetails[0].receiptEntryInvoiceDetails.length > 1) {
      this.formData.receiptEntryDetails[0].receiptEntryInvoiceDetails.splice(i, 1);
    }
  }

  addMoreInvoiceDetail(): void {
    if (this.formData.receiptEntryDetails[0].receiptEntryInvoiceDetails.length < 5) {
      this.formData.receiptEntryDetails[0].receiptEntryInvoiceDetails.push({
        invoiceNo: '',
        invoiceAmount: '',
        invoiceDate: '',
      });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.receiptEntryForm && this.receiptEntryForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }

  beforeSubmit(): boolean {
    this.formData.entryMode = 'MANUAL';
    this.formData.corporateId = this.userService.getCorporateId();
    this.formData.corporateCode = this.userService.userDetails.corporateCode;
    this.formData.corporateName = this.userService.userDetails.corporateName;
    this.formData.receiptEntryDetails[0].entryDate = this.userService.getApplicationDate();

    // For Grid Columns Shift Child to parent
    this.formData.paymentDate = this.formData.receiptEntryDetails[0].paymentDate;
    this.formData.paymentMode = this.formData.receiptEntryDetails[0].paymentMode;
    this.formData.creditAccountNo = this.formData.receiptEntryDetails[0].creditAccountNo;
    this.formData.paymentAmount = this.formData.receiptEntryDetails[0].paymentAmount;
    return true;
  }
}
