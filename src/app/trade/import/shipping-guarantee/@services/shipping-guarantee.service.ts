import { Injectable } from '@angular/core';
import { ShippingGuarantee } from '../@models/shipping-guarantee.model';
@Injectable({
  providedIn: 'root',
})
export class ShippingGuaranteeService {
  activeStepIndex = 0;

  _shippingGuarantee = new ShippingGuarantee();

  shippingGuarantee = null;

  resetShippingGuarantee() {
    this.shippingGuarantee = new ShippingGuarantee();
  }

  constructor() {
    this.resetShippingGuarantee();
  }
}
