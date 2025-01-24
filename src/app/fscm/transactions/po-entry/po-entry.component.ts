import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Select } from 'src/app/shared/@models/select.model';
import { PoEntry } from './@model/po-entry.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-po-entry',
  templateUrl: './po-entry.component.html',
  styleUrls: ['./po-entry.component.scss']
})
export class PoEntryComponent implements OnInit {

  showSponsorModal: boolean = false;
  showSellerModal: boolean = false;
  showEntityCodeModal: boolean = false;
  currencyList: Select[] = [];

  stepperDetails: Stepper = {
    masterName: 'PO Entry',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  formData: PoEntry = new PoEntry();

  mode: string;

  constructor(
    private httpService: HttpService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private currencyService: CurrencyService,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'PO Entry - Initiate',
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
      { label: 'FSCM' },
      { label: 'Transactions' },
      { label: 'PO Entry' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('fscm/transactions/poEntry/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }

    this.currencyService.getCurrencyList().subscribe((currencyList: Select[]) => {
      if (currencyList && currencyList.length > 0) {
        this.currencyList = currencyList;
        this.formData.poValueCcy = this.currencyList[0].id;
      }
    });
  };

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    }

    return true;
  };

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

}
