import { Component, Input, OnInit } from '@angular/core';
import { ShippingGuaranteeInitiationComponent } from '../../shipping-guarantee-initiation/shipping-guarantee-initiation.component';

@Component({
  selector: 'app-shipping-company',
  templateUrl: './shipping-company.component.html',
  styleUrls: ['./shipping-company.component.scss'],
})
export class ShippingCompanyComponent implements OnInit {
  @Input('parentRef') parentRef: ShippingGuaranteeInitiationComponent;

  constructor() {}

  ngOnInit(): void {}

  addShippingAddress(): void {
    if (
      !this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0]
        .shippingCompanyAddress2[0].show
    ) {
      this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress2[0].show =
        true;
    } else if (
      !this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0]
        .shippingCompanyAddress3[0].show
    ) {
      this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].show =
        true;
    }
  }

  deleteShippingCompanyAddress(addressLine: number): void {
    if (addressLine == 2) {
      if (
        this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0]
          .shippingCompanyAddress3[0].show
      ) {
        this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].show =
          false;

        this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress2[0].address =
          this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].address;

        this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].address =
          '';
      } else {
        this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress2[0].show =
          false;
        this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress2[0].address =
          '';
      }
    } else if (addressLine == 3) {
      this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].show =
        false;
      this.parentRef.formData.shippingDocumentDetails[0].shippingCompany[0].shippingCompanyAddress3[0].address =
        '';
    }
  }
}
