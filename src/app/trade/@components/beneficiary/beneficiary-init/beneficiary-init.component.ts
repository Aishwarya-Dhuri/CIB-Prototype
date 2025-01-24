import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { BeneficiaryComponent } from '../beneficiary.component';

@Component({
  selector: 'app-beneficiary-init',
  templateUrl: './beneficiary-init.component.html',
  styleUrls: ['./beneficiary-init.component.scss'],
})
export class BeneficiaryInitComponent implements OnInit {
  @Input('parentRef') parentRef: BeneficiaryComponent;
  @ViewChild('form') form: any;

  beneficiaryTypeDataList: Select[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getDropdownData();
  }

  getDropdownData(): void {
    this.httpService
      .httpPost('trade/beneficiary/private/dropdown/beneficiaryTypeDataList')
      .subscribe((response: any) => {
        this.beneficiaryTypeDataList = response.dataList;
      });
  }

  addBeneficiaryAddress(): void {
    if (!this.parentRef.formData.beneficiaryAddress2[0].show) {
      this.parentRef.formData.beneficiaryAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryAddress3[0].show) {
      this.parentRef.formData.beneficiaryAddress3[0].show = true;
    }
  }
  addBeneficiaryBankAddress(): void {
    if (!this.parentRef.formData.beneficiaryBankAddress2[0].show) {
      this.parentRef.formData.beneficiaryBankAddress2[0].show = true;
    } else if (!this.parentRef.formData.beneficiaryBankAddress3[0].show) {
      this.parentRef.formData.beneficiaryBankAddress3[0].show = true;
    }
  }
}
