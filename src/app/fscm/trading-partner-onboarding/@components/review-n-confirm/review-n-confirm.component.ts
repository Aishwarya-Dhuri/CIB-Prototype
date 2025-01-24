import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TradePartnerOnboarding } from '../../@model/seller-buyer-onboarding.model';
import { SellerBuyerService } from '../../@service/seller-buyer-onboarding.service';

@Component({
  selector: 'app-review-n-confirm',
  templateUrl: './review-n-confirm.component.html',
  styleUrls: ['./review-n-confirm.component.scss'],
})
export class ReviewNConfirmComponent implements OnInit {
  @Input('sellerBuyerData') sellerBuyerData: TradePartnerOnboarding;

  @Output() edit = new EventEmitter<number>();

  contactDetailsGridOptions: any;
  ipMappingGridOptions: any;
  authenticationRuleGridOptions: any;

  constructor(private tradingPartnerOnboardingService: SellerBuyerService) {}

  ngOnInit(): void {
    this.contactDetailsGridOptions = {
      columnDefs: this.tradingPartnerOnboardingService.contactDetailsColDefs,
      rowData: this.sellerBuyerData.contactDetails,
      rowModelType: 'clientSide',
      pagination: false,
    };

    this.ipMappingGridOptions = {
      columnDefs: this.tradingPartnerOnboardingService.ipMappingColDefs,
      rowData: this.sellerBuyerData.parameters[0].ipMapping,
      rowModelType: 'clientSide',
      pagination: false,
    };

    this.authenticationRuleGridOptions = {
      columnDefs: this.tradingPartnerOnboardingService.authorizationRuleColDefs,
      rowData: this.sellerBuyerData.authenticationRules,
      rowModelType: 'clientSide',
      pagination: false,
    };
  }
}
