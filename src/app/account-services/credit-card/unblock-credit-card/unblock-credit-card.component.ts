import { Component, OnInit } from '@angular/core';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { CreditCardService } from '../@services/credit-card.service';
import { Router } from '@angular/router';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { map } from 'rxjs/operators';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';

@Component({
  selector: 'app-unblock-credit-card',
  templateUrl: './unblock-credit-card.component.html',
  styleUrls: ['./unblock-credit-card.component.scss'],
})
export class UnblockCreditCardComponent implements OnInit {
  stepperDetails: Stepper = {
    masterName: 'Block Credit Card',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Credit Card Details', 'Review and Submit'],
    isOnlyFooter: true,
  };
  formData: any = {
    id: '',
    cardId: '',
    cardNo: '',
    cardType: '',
    embossedName: '',
    blockReason: '',
  };
  URLs: any;
  nonActiveCreditCardDataList: any[];
  selectedCardId: string;
  showSubmitSuccess: boolean;
  submitResponse: any;

  mode: string;
  viewMode: boolean;
  private URL_CONST = {
    VIEW: 'accountServices/creditCard/unblockCreditCard/private/view',
  };
  private cardData: any;

  constructor(
    private creditCardService: CreditCardService,
    private viewService: ViewService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Unblock Credit Card',
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
      { label: 'Unblock Credit Card' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.URLs = this.creditCardService.URL_CONST;

    this.cardData = this.creditCardService.selectedCardDetails;

    this.mode = this.viewService.getMode();

    this.viewMode = this.mode === 'VIEW';
    if (this.viewMode) {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    }
    let url = 'accountServices/creditCard/unblockCreditCard';
    this.creditCardService.setServiceURL(url);
    let paginationData = {
      startRow: 0,
      endRow: 100,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    };
    this.creditCardService
      .getCreditCardList(paginationData)
      .pipe(map((response: any): any[] => response.data))
      .subscribe((cards: any[]) => {
        this.nonActiveCreditCardDataList = cards.filter((a) => {
          a.displayName = a.cardNo;
          return a;
        });
        this.getViewData();
      });
  }

  private getViewData() {
    const creditCardId = this.viewService.getId();

    if (creditCardId) {
      this.creditCardService.getCreditCard(this.URL_CONST.VIEW, creditCardId).subscribe((data) => {
        this.viewService.clearAll();
        this.formData = data;
        this.onCreditCardSelection(this.formData);
      });
    } else {
      this.ifAlreadyPresentInListing();
    }
  }

  ifAlreadyPresentInListing() {
    const data = this.creditCardService.getFilterData(this.cardData?.cardNo);

    this.creditCardService
      .getCreditCardByFilter(this.URL_CONST.VIEW, data)
      .subscribe((data: any) => {
        if (this.cardData && this.cardData.cardNo === data.cardNo) {
          this.formData = data;
          this.mode = 'EDIT';
        } /* else {
          this.setSelectedCard();
        } */
        this.setSelectedCard();
      });
  }

  setSelectedCard() {
    try {
      this.selectedCardId = this.cardData.id;
      this.formData.id = this.cardData.id;
    } catch (e) {
      console.error('credit Card Id not found');
    }
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Credit Card: ' + this.formData.cardNo;
    }
    return 'Step' + stepNo + ' Details';
  }

  onCreditCardSelection(cardData: any) {
    if (cardData && this.nonActiveCreditCardDataList) {
      const selectedCard = this.nonActiveCreditCardDataList.find(
        (cardObj) => cardObj.cardNo === cardData.cardNo,
      );
      if (!selectedCard) {
        console.error('card is already Active');
      } else {
        this.formData = selectedCard;
      }
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo === 1) {
      return this.formData.cardNo && true;
    }
    return true;
  }

  afterSubmit(response: any) {
    this.showSubmitSuccess = true;
    this.submitResponse = response;

    this.submitResponse.reqTime = new Date(response.dataMap.id).toLocaleTimeString();
    return false;
  }

  goToListing() {
    this.router.navigateByUrl(this.router.url + '/listing');
  }
}
