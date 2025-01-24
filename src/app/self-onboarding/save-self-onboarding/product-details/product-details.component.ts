import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductDetails } from '../../@models/self-onboarding.model';
import { advancedProductDetails } from '../../@services/advancedPlan';
import { advancedPlusProductDetails } from '../../@services/advancedPlusPlan';
import { basicProductDetails } from '../../@services/basicPlan';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  reviewSelectedProduct: boolean = false;

  productDetails: ProductDetails[];

  constructor(public selfOnboardingService: SelfOnboardingService) {}

  ngOnInit(): void {
    this.productDetails = this.selfOnboardingService.selfOnboarding.productDetails;
  }

  onPlanChange(plan: string) {
    if (plan === 'basic') {
      this.productDetails[0].selectedPlan[0] = basicProductDetails;
    } else if (plan === 'advanced') {
      this.productDetails[0].selectedPlan[0] = advancedProductDetails;
    } else if (plan === 'advancedPlus') {
      this.productDetails[0].selectedPlan[0] = advancedPlusProductDetails;
    }
  }

  isValidate() {
    return this.productDetails[0].selectedPlan.length > 0;
  }

  next() {
    if (this.productDetails[0].selectedPlan.length > 0) {
      this.reviewSelectedProduct = true;
    }
  }

  previous() {
    this.reviewSelectedProduct = false;
  }

  ngOnDestroy() {
    this.selfOnboardingService.selfOnboarding.productDetails = this.productDetails;
  }
}
