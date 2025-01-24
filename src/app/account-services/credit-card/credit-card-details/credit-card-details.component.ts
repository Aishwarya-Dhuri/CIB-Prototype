import { Component, OnInit } from '@angular/core';
import { CreditCardService } from '../@services/credit-card.service';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.component.html',
  styleUrls: ['./credit-card-details.component.scss'],
})
export class CreditCardDetailsComponent implements OnInit {
  cardData;
  URL_CONST = {
    VIEW: 'accountServices/creditCard/private/view',
  };
  constructor(
    private creditCardService: CreditCardService,
    private router: Router,
    private viewService: ViewService,
  ) {
    this.getViewData();
  }

  ngOnInit(): void {
    // this.getViewData();
  }

  private getViewData() {
    try {
      let creditCardId = this.creditCardService.selectedCardDetails.id;
      // creditCardId = '1641918869003'; // TODO:remove this line
      if (creditCardId) {
        this.creditCardService
          .getCreditCard(this.URL_CONST.VIEW, creditCardId)
          .subscribe((data) => {
            this.cardData = data;
          });
      } else console.log('credit Card Id not found');
    } catch (e) {
      console.log('credit Card Id not found');
    }
  }
}
