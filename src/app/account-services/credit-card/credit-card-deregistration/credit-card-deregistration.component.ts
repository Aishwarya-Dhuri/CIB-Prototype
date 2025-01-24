import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { HttpService } from '../../../shared/@services/http.service';
import { ToasterService } from '../../../shared/@services/toaster.service';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { CreditCardService } from '../@services/credit-card.service';

@Component({
  selector: 'app-credit-card-deregistration',
  templateUrl: './credit-card-deregistration.component.html',
  styleUrls: ['./credit-card-deregistration.component.scss'],
})
export class CreditCardDeregistrationComponent implements OnInit {
  stepperDetails: Stepper = {
    masterName: 'Credit Card Deregistration',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Credit Card Details', 'Review and Submit'],
    isOnlyFooter: true,
  };
  formData: any = { cardNo: '', cardType: '', embossedName: '' };
  showCreditCardSearch: boolean;
  URLs: any;
  submitSuccess: boolean;
  mode: string;
  showSubmitSuccess: boolean;
  submitResponse: any;
  viewOtp: boolean;
  urls: any;
  URL_CONST: any = {
    UPDATE: 'accountServices/creditCard/private/update',
    DELETE: 'accountServices/creditCard/private/delete',
    AUTHORIZE: 'accountServices/creditCard/private/authorize',
    CREDICARD_SEARCH_LIST_ROWDEF_URL: 'accountServices/creditCard/private/getAuthorizedList',
    VIEW: 'accountServices/creditCard/private/view',
  };
  private cardData: any;

  constructor(
    private creditCardService: CreditCardService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService,
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Deregister Credit Card',
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
      { label: 'Account Services' },
      { label: 'Credit Card' },
      { label: 'Deregister Credit Card' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.URLs = this.creditCardService.URL_CONST;
    this.cardData = this.creditCardService.selectedCardDetails;

    this.urls = this.creditCardService.URL_CONST;
    this.getViewData();
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Credit Card: ' + this.formData.cardNo;
    }
    return 'Step' + stepNo + ' Details';
  }

  onCreditCardSelection(data: any) {
    if (data) {
      this.formData = data;
    }

    this.formData.otp = '';
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return (
        this.formData.cardNo &&
        this.formData.cardExpiry &&
        this.formData.creditCardPIN &&
        this.formData.creditCardPIN.length == 4
      );
    } else if (stepNo == 2) {
      return this.formData.otp && this.formData.otp.length == 6;
    }
    return true;
  }

  beforeSubmit() {
    this.httpService
      .httpPost(this.URL_CONST.DELETE, { dataMap: { id: this.formData.id } })
      .subscribe((response: any) => {
        const msg = 'This card is successfully deregistered';
        this.toasterService.showToaster({ severity: 'success', detail: msg });
        this.redirectToSummary();
      });

    return false;
  }

  setSelectedCard() {
    try {
      const cardData = this.cardData;
      if (cardData && cardData.id) {
        this.creditCardService.getCreditCard('', cardData.id).subscribe((card) => {
          this.onCreditCardSelection(card);
        });
      }
    } catch (e) {
      console.error('credit Card Id not found');
    }
  }

  redirectToSummary() {
    this.router.navigate([`../creditCardSummary`], { relativeTo: this.route });
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
