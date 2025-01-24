import { Component, Input, OnInit } from '@angular/core';
import { ShippingGuaranteeInitiationComponent } from '../../shipping-guarantee-initiation/shipping-guarantee-initiation.component';

@Component({
  selector: 'app-notify-party',
  templateUrl: './notify-party.component.html',
  styleUrls: ['./notify-party.component.scss'],
})
export class NotifyPartyComponent implements OnInit {
  @Input('parentRef') parentRef: ShippingGuaranteeInitiationComponent;

  constructor() {}

  ngOnInit(): void {}

  addNotifyPartyAddress(): void {
    if (
      !this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress2[0].show
    ) {
      this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress2[0].show =
        true;
    } else if (
      !this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].show
    ) {
      this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].show =
        true;
    }
  }

  deleteNotifyPartyAddress(addressLine: number): void {
    if (addressLine == 2) {
      if (
        this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0]
          .show
      ) {
        this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].show =
          false;

        this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress2[0].address =
          this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].address;

        this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].address =
          '';
      } else {
        this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress2[0].show =
          false;
        this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress2[0].address =
          '';
      }
    } else if (addressLine == 3) {
      this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].show =
        false;
      this.parentRef.formData.shippingDocumentDetails[0].notifyParty[0].notifyPartyAddress3[0].address =
        '';
    }
  }
}
