import { Component, OnInit } from '@angular/core';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { CreditCardService } from '../@services/credit-card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../shared/@services/http.service';
import { ToasterService } from '../../../shared/@services/toaster.service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';

class CreditCardRegistration {
  constructor(
    public cardNo: string = '',
    public cardExpiry: string = '',
    public creditCardPIN: string = '',
    public otp: string = '',
  ) {}
}

@Component({
  selector: 'app-credit-card-registration',
  templateUrl: './credit-card-registration.component.html',
  styleUrls: ['./credit-card-registration.component.scss'],
})
export class CreditCardRegistrationComponent implements OnInit {
  URL_CONST: any = {
    SERVICE_URL: 'accountServices/creditCard',
    DUMMY_DATA: 'accountServices/creditCard/dummyData/private/view',
  };

  stepperDetails: Stepper = {
    masterName: 'Register New Credit Card',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['Credit Card Details', 'Review and Submit'],
  };

  formData: CreditCardRegistration = new CreditCardRegistration();
  URLs: any;
  viewPin1: boolean;
  viewOtp: boolean;
  showSubmitSuccess: boolean;
  cardDummyData: any;

  constructor(
    private creditCadService: CreditCardService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Register New Card',
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
      { label: 'Credit Card Summary' },
      { label: 'Register New Card' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.URLs = this.creditCadService.URL_CONST;
    this.setSelectedCard();
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Credit Card: ' + this.formData.cardNo;
    }
    return 'Step' + stepNo + ' Details';
  }

  onCreditCardSelection(data: any) {
    this.formData = data;
    this.formData.creditCardPIN = '';
    this.formData.cardExpiry = '';
    this.formData.otp = '';
  }

  setSelectedCard() {
    try {
      const data = { dataMap: { id: Math.floor(Math.random() * 4 + 1) } };

      this.httpService.httpPost(this.URL_CONST.DUMMY_DATA, data).subscribe((card: any) => {
        this.cardDummyData = card;
      });
    } catch (e) {
      console.error('credit Card Id not found');
    }
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

  generateOTP() {
    // TODO: generateOTP API
  }

  beforeSubmit(res: any) {
    if (this.formData.cardNo) {
      let cc = this.formData.cardNo;
      this.formData.cardNo = cc.substr(0, 4) + ' XXXX XXXX ' + cc.substr(-4);
    }
    this.showSubmitSuccess = false;
    const data = { ...this.cardDummyData, ...this.formData };

    let url = this.URL_CONST.SERVICE_URL + '/private/create';

    this.httpService
      .httpPost(this.URL_CONST.SERVICE_URL + '/manageAutoPay/private/create', data)
      .subscribe((response: any) => {
        this.creditCadService.authorizeRecord(
          response.dataMap.id,
          this.URL_CONST.SERVICE_URL + '/manageAutoPay',
        );
        data.manageAutoPayId = response.dataMap.id;
        this.httpService.httpPost(url, data).subscribe((response: any) => {
          this.creditCadService.authorizeRecord(response.dataMap.id, this.URL_CONST.SERVICE_URL);
          const msg = 'This card is successfully registered';
          this.toasterService.showToaster({ severity: 'success', detail: msg });
          this.redirectToSummary();
        });
      });

    this.httpService
      .httpPost(this.URL_CONST.SERVICE_URL + '/creditCardControls/private/create', data)
      .subscribe((response: any) => {
        this.creditCadService.authorizeRecord(
          response.dataMap.id,
          this.URL_CONST.SERVICE_URL + '/creditCardControls',
        );
      });

    return false;
  }

  redirectToSummary() {
    this.router.navigate([`../creditCardSummary`], { relativeTo: this.route });
  }
}
