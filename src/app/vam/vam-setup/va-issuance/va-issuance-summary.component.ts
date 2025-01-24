import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/@services/user.service';
import { VaIssuanceSummaryService } from './@services/va-issuance-summary.service';
import { HttpService } from '../../../shared/@services/http.service';

@Component({
  selector: 'app-va-issuance-summary',
  templateUrl: './va-issuance-summary.component.html',
  styleUrls: ['./va-issuance-summary.component.scss'],
})
export class VaIssuanceSummaryComponent implements OnInit {
  showGroupSummary = false;
  selectedCorporate: any;
  corporateGroup: any;

  constructor(
    public userService: UserService,
    private httpService: HttpService,
    private vaISummaryService: VaIssuanceSummaryService,
  ) {}

  ngOnInit(): void {
    const isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';
    console.log('this.isGroupUser', isGroupUser);
    if (isGroupUser) {
      this.showGroupSummary = true;
    } else {
      this.userService.userDetails.corporateId;
    }
  }

  onCorporateSelect(data) {
    console.log('GP c 1212 orporate', data);
    this.selectedCorporate = data.corporate;
    this.corporateGroup = data.corporateGroup;
    this.showGroupSummary = false;
  }
}
