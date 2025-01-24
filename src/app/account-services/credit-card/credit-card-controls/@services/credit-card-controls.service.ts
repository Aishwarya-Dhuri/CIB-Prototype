import { Injectable } from '@angular/core';
import { ViewService } from '../../../../shared/services/view-service/view-service';
import { CreditCardService } from '../../@services/credit-card.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CreditCardControlsService {
  URL_CONST = {
    VIEW: 'accountServices/creditCard/creditCardControls/private/view',
  };

  viewMode = false;
  editMode = false;

  steps = [
    {
      completeStatus: '',
      completePercentage: 0,
      displayLabel: 'Card Details ',
      key: 'cardData',
      displayFields: [
        { displayName: 'Card No', key: 'cardNo' },
        { displayName: 'Embossed Name', key: 'embossedName' },
      ],
    },
    {
      completeStatus: '',
      completePercentage: 0,
      displayLabel: 'Domestic Usage / Limits',
      key: 'domesticUsage',
      displayFields: [
        { displayName: 'Merchant Outlet Usage', key: 'domesticMerchantOutletUsage' },
        { displayName: 'Merchant Outlet Usage Limit', key: 'domesticMerchantOutletUsageLimit' },
      ],
    },
    {
      completeStatus: '',
      completePercentage: 0,
      displayLabel: 'International Usage / Limits',
      key: 'internationalUsage',
      displayFields: [
        { displayName: 'Merchant Outlet Usage', key: 'interMerchantOutletUsage' },
        { displayName: 'Merchant Outlet Usage Limit', key: 'interMerchantOutletUsageLimit' },
      ],
    },
  ];

  activeStepIndex = 0;

  private _creditCardData = new BehaviorSubject(null);
  creditCardData;
  creditCardData$: Observable<any> = this._creditCardData.asObservable();

  constructor(private viewService: ViewService, private creditCardService: CreditCardService) {
    // this.resetData();
  }
  getViewData() {
    try {
      const creditCardId = this.viewService.getId();
      if (creditCardId) {
        this.creditCardService.getCreditCard(this.URL_CONST.VIEW, creditCardId).subscribe((res) => {
          console.log(res);
          let data = JSON.parse(JSON.stringify(res));
          let { domesticUsage, internationalUsage, ...cardData } = data;
          domesticUsage = (domesticUsage && domesticUsage[0]) || {
            atmusage: '',
            atmUsageLimit: '',
            domesticMerchantOutletUsage: '',
            domesticMerchantOutletUsageLimit: '',
            onlineUsage: '',
            onlineUsageLimit: '',
            contactlessUsage: '',
            contactlessUsageLimit: '',
          };
          internationalUsage = (internationalUsage && internationalUsage[0]) || {
            allowInternationalUsage: '',
            interAtmusage: '',
            interAtmUsageLimit: '',
            interMerchantOutletUsageLimit: '',
            interMerchantOutletUsage: '',
            interOnlineUsage: '',
            interOnlineUsageLimit: '',
            interContactlessUsage: '',
            interContactlessUsageLimit: '',
          };
          let obj = { cardData, domesticUsage, internationalUsage };
          this._creditCardData.next(obj);
          console.log(this._creditCardData.value);
        });
      } else console.log('credit Card Id not found');
    } catch (e) {
      console.log('credit Card Id not found');
    }
  }

  resetData() {
    /*this.creditCardData = {
      cardData: {},
      domesticUsage: {
        atmusage: '', atmUsageLimit: '', domesticMerchantOutletUsage: '',
        domesticMerchantOutletUsageLimit: '', onlineUsage: '', onlineUsageLimit: '',
        contactlessUsage: '', contactlessUsageLimit: ''
      },
      internationalUsage: {
        interAtmusage: '', interAtmUsageLimit: '', interMerchantOutletUsage: '',
        interMerchantOutletUsageLimit: '', interOnlineUsage: '', interOnlineUsageLimit: '',
        interContactlessUsage: '', interContactlessUsageLimit: ''
      }
    };*/
  }
}
