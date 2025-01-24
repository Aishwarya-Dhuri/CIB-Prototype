import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { PaymentDetails } from '../@models/bill-acceptance.model';
import { BillAcceptanceService } from '../@services/bill-acceptance.service';

@Component({
  selector: 'app-bill-acceptance-initiate',
  templateUrl: './bill-acceptance-initiate.component.html',
  styleUrls: ['./bill-acceptance-initiate.component.scss'],
})
export class BillAcceptanceInitiateComponent implements OnInit {
  billDetails: any;
  multipleBillDetails: any[];
  mode: any;
  accountList: Select[];
  currencyList: Select[];
  formData: PaymentDetails[] = [new PaymentDetails()];

  isDealNoModalShow: boolean = false;
  isForwardNoModalShow: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Bill Acceptance',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Bill Details', 'Payment Details', 'Review Details & Confirm'],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billAcceptanceService: BillAcceptanceService,
    private viewService: ViewService,
    private httpService: HttpService,
    private userService: UserService,
    private currencyService: CurrencyService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Bill Acceptance Initiate',
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
      { label: 'Trade' },
      { label: 'Import' },
      { label: 'Bill Acceptance Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();
    if (this.billAcceptanceService.billId) {
      this.getBillDetails();
    } else {
      this.getMultipleBillDetails();
    }
    this.getDebitAccountList();
  }

  getBillDetails(): void {
    const id = this.billAcceptanceService.billId;
    this.httpService
      .httpPost('trade/importTransactions/billAcceptance/private/getViewData', {
        dataMap: { id },
      })
      .subscribe((response: any) => {
        this.billDetails = response.data;
      });
  }

  getMultipleBillDetails(): void {
    this.multipleBillDetails = [];
    this.billAcceptanceService.billIds.forEach((id) => {
      this.httpService
        .httpPost('trade/importTransactions/billAcceptance/private/getViewData', {
          dataMap: { id },
        })
        .subscribe((response: any) => {
          this.multipleBillDetails.push(response.data);
        });
    });
  }

  getDebitAccountList(): void {
    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountList = response.dataList;
      });
    this.currencyService.getCurrencyList().subscribe((currencyList: Select[]) => {
      if (currencyList && currencyList.length > 0) {
        this.currencyList = currencyList;
      }
    });
  }

  addPaymentDetails(): void {
    if (this.formData.length < 2) {
      this.formData.push(new PaymentDetails());
    }
  }

  onDealSelected(): void {
    if (this.formData[0].exchangeDetails[0].isDealNo) {
      this.isDealNoModalShow = true;
    } else {
      this.formData[0].exchangeDetails[0].selectedDealNoRows = 0;
      this.formData[0].exchangeDetails[0].selectedDealData = [];
    }
  }

  onForwardSelected(): void {
    if (this.formData[0].exchangeDetails[0].isForward) {
      this.isForwardNoModalShow = true;
    } else {
      this.formData[0].exchangeDetails[0].selectedForwardNoRows = 0;
      this.formData[0].exchangeDetails[0].selectedForwardData = [];
    }
  }

  setDealNoData(dealNos: any[]): void {
    this.formData[0].exchangeDetails[0].selectedDealNoRows = dealNos.length;
    this.formData[0].exchangeDetails[0].selectedDealData = dealNos;
  }

  setForwardNoData(dealNos: any[]): void {
    this.formData[0].exchangeDetails[0].selectedForwardNoRows = dealNos.length;
    this.formData[0].exchangeDetails[0].selectedForwardData = dealNos;
  }
}
