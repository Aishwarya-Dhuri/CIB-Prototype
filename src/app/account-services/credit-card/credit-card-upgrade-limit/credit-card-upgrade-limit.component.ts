import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { CreditCardService } from '../@services/credit-card.service';
import { Router } from '@angular/router';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-credit-card-upgrade-limit',
  templateUrl: './credit-card-upgrade-limit.component.html',
  styleUrls: ['./credit-card-upgrade-limit.component.scss'],
})
export class CreditCardUpgradeLimitComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  stepperDetails: Stepper = {
    masterName: 'Block Credit Card',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Credit Card Details', 'Review and Submit'],
    isOnlyFooter: true,
  };
  formData: any = { cardNo: '', cardType: '', embossedName: '', newCardLimit: '' };
  showCreditCardSearch: boolean;
  URLs;
  showSubmitSuccess: boolean;
  submitResponse: any;
  mode: string;
  viewMode: boolean;
  private URL_CONST = {
    VIEW: 'accountServices/creditCard/creditCardUpgradeLimit/private/view',
  };
  private cardData: any;
  constructor(
    private creditCardService: CreditCardService,
    private viewService: ViewService,
    private router: Router,
  ) {
    this.URLs = creditCardService.URL_CONST;
    // this.setSelectedCard()
    this.cardData = this.router.getCurrentNavigation()?.extras?.state?.cardData;
  }

  ngOnInit(): void {
    this.mode = this.viewService.getMode();
    this.viewMode = this.mode === 'VIEW';
    if (this.viewMode) {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }
    let url = 'accountServices/creditCard/creditCardUpgradeLimit';
    this.creditCardService.setServiceURL(url);

    this.getViewData();
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
  validateForm(stepNo: number): boolean {
    if (stepNo === 1) {
      return this.form && this.form.valid;
    }
    return true;
  }
  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Credit Card: ' + this.formData.cardNo;
    }
    return 'Step' + stepNo + ' Details';
  }

  onCreditCardSelection(data: any) {
    console.log(data);
    this.formData = data;
    this.formData.newCardLimit = '';
  }

  setSelectedCard() {
    try {
      const creditCardId = this.cardData.id;
      if (creditCardId) {
        this.creditCardService
          .getCreditCardById(creditCardId)
          .subscribe((card) =>
            card.cardStatus === 'Active'
              ? this.onCreditCardSelection(card)
              : console.log('card is already block'),
          );
      }
    } catch (e) {
      console.log('credit Card Id not found');
    }
  }

  afterSubmit(response) {
    this.showSubmitSuccess = true;
    this.submitResponse = response;
    return false;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }

  private ifAlreadyPresentInListing() {
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
}
