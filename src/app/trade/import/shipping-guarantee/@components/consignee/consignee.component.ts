import { Component, Input, OnInit } from '@angular/core';
import { ShippingGuaranteeInitiationComponent } from '../../shipping-guarantee-initiation/shipping-guarantee-initiation.component';

@Component({
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.scss'],
})
export class ConsigneeComponent implements OnInit {
  @Input('parentRef') parentRef: ShippingGuaranteeInitiationComponent;

  constructor() {}

  ngOnInit(): void {}

  addConsigneeAddress(): void {
    if (
      !this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress2[0].show
    ) {
      this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress2[0].show =
        true;
    } else if (
      !this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].show
    ) {
      this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].show =
        true;
    }
  }

  deleteConsigneeAddress(addressLine: number): void {
    if (addressLine == 2) {
      if (
        this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].show
      ) {
        this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].show =
          false;

        this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress2[0].address =
          this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].address;

        this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].address =
          '';
      } else {
        this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress2[0].show =
          false;
        this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress2[0].address =
          '';
      }
    } else if (addressLine == 3) {
      this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].show =
        false;
      this.parentRef.formData.shippingDocumentDetails[0].consignee[0].consigneeAddress3[0].address =
        '';
    }
  }
}
