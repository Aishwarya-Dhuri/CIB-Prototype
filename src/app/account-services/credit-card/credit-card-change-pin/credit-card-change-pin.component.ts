import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { CreditCardService } from '../@services/credit-card.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-credit-card-change-pin',
  templateUrl: './credit-card-change-pin.component.html',
  styleUrls: ['./credit-card-change-pin.component.scss'],
})
export class CreditCardChangePinComponent implements OnInit {
  stepperDetails: Stepper = {
    masterName: 'Credit Card Pin Change',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Credit Card Details', 'Review and Submit'],
    isOnlyFooter: true,
  };
  formData: any = {
    cardNo: '',
    cardType: '',
    embossedName: '',
    creditCardPIN1: '',
    creditCardPIN2: '',
    otp: '1234',
  };
  showCreditCardSearch: boolean;
  URLs;
  viewPin1: boolean;
  viewPin2: boolean;
  @ViewChild('pinChangeForm') pinChangeForm: NgForm;
  viewOtp: boolean;
  pinError: boolean;

  constructor(
    private creditCardService: CreditCardService,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    this.URLs = creditCardService.URL_CONST;
    this.setSelectedCard();
  }

  ngOnInit(): void {}

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Credit Card: ' + this.formData.cardNo;
    }
    return 'Step' + stepNo + ' Details';
  }

  onCreditCardSelection(data: any) {
    this.formData = data;
    this.formData.creditCardPIN1 = '';
    this.formData.creditCardPIN2 = '';
    this.formData.otp = '';
  }

  setSelectedCard() {
    try {
      const creditCardId = this.creditCardService.selectedCardDetails.id;
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

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return (
        this.pinChangeForm &&
        this.pinChangeForm.valid &&
        this.formData.creditCardPIN1 == this.formData.creditCardPIN2
      );
    } else if (stepNo == 2) {
      return this.formData.otp;
    }
    return true;
  }

  generateOTP() {
    // TODO: generateOTP API
  }

  beforeSubmit(response: any) {
    return true;
  }

  afterSubmit(response: any) {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'PIN is successfully changed',
    });
    return true;
  }

  goToListing() {
    this.router.navigateByUrl('/accountServices/creditCard/creditCardSummary');
  }

  validatePIN() {
    this.pinError =
      this.formData.creditCardPIN2 && this.formData.creditCardPIN1 !== this.formData.creditCardPIN2;
  }
}
