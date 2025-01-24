import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { CreditCardService } from '../@services/credit-card.service';
import { Router } from '@angular/router';
import { MenuService } from '../../../base/main/@services/menu.service';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { ToasterService } from '../../../shared/@services/toaster.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-block-credit-card',
  templateUrl: './block-credit-card.component.html',
  styleUrls: ['./block-credit-card.component.scss'],
})
export class BlockCreditCardComponent implements OnInit {
  @ViewChild('apsform') apsform: NgForm;
  stepperDetails: Stepper = {
    masterName: 'Block Credit Card',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Credit Card Details', 'Review and Submit'],
    isOnlyFooter: true,
  };
  formData: any = { cardNo: '', cardType: '', embossedName: '', blockReason: '' };
  showCreditCardSearch: boolean;
  URLs;
  mode: string;
  showSubmitSuccess: boolean;
  submitResponse: any;
  viewMode: boolean;
  private URL_CONST = {
    VIEW: 'accountServices/creditCard/blockCreditCard/private/view',
    SERVICE_URL: 'accountServices/creditCard/blockCreditCard',
  };
  private cardData: any;

  constructor(
    private creditCardService: CreditCardService,
    private menuService: MenuService,
    private viewService: ViewService,
    private toasterService: ToasterService,
    private router: Router,
  ) {
    this.URLs = creditCardService.URL_CONST;
    // this.setSelectedCard();
    this.cardData = this.router.getCurrentNavigation()?.extras?.state?.cardData;
  }

  ngOnInit(): void {
    this.mode = this.viewService.getMode();
    this.viewMode = this.mode === 'VIEW';
    if (this.viewMode) {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }

    let url =
      this.menuService.getSelectedServiceUrl() || 'accountServices/creditCard/blockCreditCard';
    this.creditCardService.setServiceURL(url);

    this.getViewData();
  }

  ifAlreadyPresentInListing() {
    const data = this.creditCardService.getFilterData(this.cardData.cardNo);
    this.creditCardService.getCreditCardByFilter(this.URL_CONST.VIEW, data).subscribe((data) => {
      if (this.cardData && this.cardData.cardNo === data.cardNo) {
        this.formData = data;
        this.mode = 'EDIT';
      } else {
        this.setSelectedCard();
      }
    });
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Credit Card: ' + this.formData.cardNo;
    }
    return 'Step' + stepNo + ' Details';
  }

  onCreditCardSelection(data: any) {
    this.formData = data;
    this.formData.blockReason = '';
  }

  afterSubmit(response) {
    this.showSubmitSuccess = true;
    this.submitResponse = response;

    const id = this.submitResponse.dataMap.id;
    let serviceUrl = this.menuService.getSelectedServiceUrl() || this.URL_CONST.SERVICE_URL;
    this.creditCardService.authorizeRecord(id, serviceUrl);
    return false;
  }

  beforeSubmit() {
    this.formData.status = 'Pending';
    this.showSubmitSuccess = false;
    return true;
  }

  setSelectedCard() {
    try {
      const creditCardId = this.cardData.id;
      if (creditCardId) {
        this.creditCardService.getCreditCard('', creditCardId).subscribe((card) =>
          card.cardStatus === 'Active'
            ? this.onCreditCardSelection(card)
            : this.toasterService.showToaster({
                severity: 'danger',
                detail: 'Card is already blocked',
              }),
        );
      }
    } catch (e) {
      console.log('credit Card Id not found');
    }
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  validateForm(stepNo: number): boolean {
    if (stepNo === 1) {
      return this.apsform && this.apsform.valid;
    }
    return true;
  }

  private getViewData() {
    try {
      const creditCardId = this.viewService.getId();
      this.viewService.clearAll();
      if (creditCardId) {
        this.creditCardService
          .getCreditCard(this.URL_CONST.VIEW, creditCardId)
          .subscribe((data) => {
            this.formData = data;
          });
      } else {
        this.ifAlreadyPresentInListing();
      }
    } catch (e) {
      console.log('credit Card Id not found');
    }
  }
}
