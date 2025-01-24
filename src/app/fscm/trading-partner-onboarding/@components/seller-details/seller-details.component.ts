import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TradePartnerOnboarding } from '../../@model/seller-buyer-onboarding.model';
import { SellerBuyerService } from '../../@service/seller-buyer-onboarding.service';

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss'],
})
export class SellerDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('contactDetailsGrid') contactDetailsGrid: any;
  @ViewChild('detailsForm') detailsForm: any;

  @Input('details') details: TradePartnerOnboarding;

  contactDetails = {
    contactPerson: '',
    emailId: '',
    designation: '',
    telephoneNumber: '',
  };

  gridOptions: any;

  editingIndex: number;

  addresses = 1;

  editing = false;
  constructor(private tradingPartnerOnboardingService: SellerBuyerService) {}

  ngOnInit(): void {
    this.gridOptions = {
      columnDefs: this.tradingPartnerOnboardingService.contactDetailsColDefs,
      rowData: this.details.contactDetails,
      rowModelType: 'clientSide',
      pagination: false,
      context: {
        componentParent: this,
      },
    };
  }

  selectLogoFile(files: any[]) {
    this.details.logo = [];

    this.details.logo.push({
      originalFileName: files[0].fileName,
      sysFileName: files[0].sysFileName,
      size: files[0].fileSize,
      ...files[0],
    });
  }

  addAddress() {
    if (this.addresses === 3) {
      return;
    }

    this.addresses++;
  }

  deleteAddress(addressNumber: number) {
    if (this.addresses === 1) {
      return;
    }

    if (addressNumber === 2) {
      this.details.address2 = '';
    } else if (addressNumber === 3) {
      this.details.address3 = '';
    }

    this.addresses--;
  }

  onSubmitContactDetails(form: NgForm) {
    if (form.valid) {
      const contactDetails = {
        srNo: this.editing
          ? this.details.contactDetails[this.editingIndex].srNo
          : this.details.contactDetails.length + 1,
        ...form.value,
        actions: [
          {
            index: 0,
            methodName: 'edit',
            type: 'ICON',
            displayName: 'Edit',
            paramList: 'srNo, contactPerson, emailId, designation, telephoneNumber',
            icon: 'pi pi-pencil',
          },
          {
            index: 1,
            methodName: 'delete',
            type: 'ICON',
            displayName: 'Delete',
            paramList: 'srNo, contactPerson, emailId, designation, telephoneNumber',
            icon: 'pi pi-trash',
          },
        ],
      };

      form.reset();

      if (this.editingIndex >= 0) {
        this.details.contactDetails[this.editingIndex] = contactDetails;
        this.editingIndex = null;
        this.editing = false;
      } else {
        this.details.contactDetails.push(contactDetails);
      }

      if (this.contactDetailsGrid) {
        this.contactDetailsGrid.setRowData(this.details.contactDetails);
      }
    }
  }

  edit(
    srNo: string,
    contactPerson: string,
    emailId: string,
    designation: string,
    telephoneNumber: string,
  ) {
    this.editContactDetails({ srNo, contactPerson, emailId, designation, telephoneNumber });
  }

  delete(
    srNo: string,
    contactPerson: string,
    emailId: string,
    designation: string,
    telephoneNumber: string,
  ) {
    this.deleteContactDetails({ srNo, contactPerson, emailId, designation, telephoneNumber });
  }

  editContactDetails(data: any) {
    this.editingIndex = this.details.contactDetails.findIndex(
      (details: any) => details.srNo === data.srNo,
    );

    this.editing = true;

    this.contactDetails = {
      contactPerson: data.contactPersonName,
      emailId: data.emailId,
      designation: data.designation,
      telephoneNumber: data.telephoneNumber,
    };
  }

  deleteContactDetails(data: any) {
    const i = this.details.contactDetails.findIndex((details: any) => details.srNo === data.srNo);
    if (i >= 0) {
      if (this.editing && i === this.editingIndex) {
        this.editing = false;
        this.editingIndex = null;
      }

      this.details.contactDetails.splice(i, 1);

      if (this.contactDetailsGrid) {
        this.contactDetailsGrid.setRowData(this.details.contactDetails);
      }
    }
  }

  ngOnDestroy() {}
}
