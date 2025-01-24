import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-new-main-account',
  templateUrl: './new-main-account.component.html',
  styleUrls: ['./new-main-account.component.scss']
})
export class NewMainAccountComponent implements OnInit {
  @ViewChild('form') form: any;

  @Input('parentRef') parentRef: any;
  activationPeriodValue = [];
  showMaxError: string = "";
  showMinError: string = "";

  subSteps: string[] = [
    'Structure Details',
    'Frequency Details',
    'Interest Set up',
    'Cluster Details',
    'Exception Handling',
  ];

  constructor(public userService: UserService) { }

  ngOnInit(): void { }

  addFrequencyPreDefinedDate() {
    this.parentRef.mainAccountDetails.dates.push('');
  };

  // onChangeAccountType(accountType: any) {
  //   if (accountType == 'ZBA') {
  //     this.parentRef.mainAccountDetails.minBal = "0"
  //     this.parentRef.mainAccountDetails.maxBal = "0"
  //   }
  //   else if (accountType == 'TBA') {
  //     this.parentRef.mainAccountDetails.minBal = this.parentRef.mainAccountDetails.maxBal;
  //   }
  // };

  mainAccountData = [
    { id: "777000003002-THB", displayName: "777000003002-THB" },
    { id: "773127003004-THB", displayName: "773127003004-THB" },
    { id: "777200000013-THB", displayName: "777200000013-THB" },
    { id: "777200000010-THB", displayName: "777200000010-THB" },
    { id: "777200000001-THB", displayName: "777200000001-THB" },
    { id: "777200000012-THB", displayName: "777200000012-THB" }
  ]

  onChangeAccountType(accountType: any) {
    if (accountType === 'ZBA') {
      this.parentRef.mainAccountDetails.minBal = '0';
      this.parentRef.mainAccountDetails.maxBal = '0';
    } else if (accountType === 'TBA') {
      this.onMinBalChange(); // Ensure maxBal updates when minBal changes
    } else if (accountType === 'RBA') {
      this.onMaxBalChange(); // Ensure minBal updates when maxBal changes
    }
  }

  onMinBalChange() {
    if (this.parentRef.mainAccountDetails.newAccountType === 'TBA') {
      this.parentRef.mainAccountDetails.maxBal = this.parentRef.mainAccountDetails.minBal;
    } else if (this.parentRef.mainAccountDetails.newAccountType === 'RBA') {
      if (parseFloat(this.parentRef.mainAccountDetails.maxBal) < parseFloat(this.parentRef.mainAccountDetails.minBal)) {
        this.showMinError = "Min Balance should be less than Max Balance"
      }
      else {
        this.showMinError = ""
      }
    }
  }

  onMaxBalChange() {
    if (this.parentRef.mainAccountDetails.newAccountType === 'RBA') {
      if (parseFloat(this.parentRef.mainAccountDetails.minBal) > parseFloat(this.parentRef.mainAccountDetails.maxBal)) {
        this.showMaxError = "Max Balance should be greater than Min Balance"
      }
      else {
        this.showMaxError = ""
      }
    }
  }

  onChangeExecFreq(executionFreq) {
    this.activationPeriodValue = [];
    if (executionFreq == 'Weekly') {
      this.activationPeriodValue = [
        { id: "Sunday", displayName: "Sunday" },
        { id: "Monday", displayName: "Monday" },
        { id: "Tuesday", displayName: "Tuesday" },
        { id: "Wednesday", displayName: "Wednesday" },
        { id: "Thursday", displayName: "Thursday" },
        { id: "Friday", displayName: "Friday" },
        { id: "Saturday", displayName: "Saturday" },
      ];
    }
    else if (executionFreq == 'Monthly') {
      this.activationPeriodValue = [
        { id: "1", displayName: "1" },
        { id: "2", displayName: "2" },
        { id: "3", displayName: "3" },
        { id: "4", displayName: "4" },
        { id: "5", displayName: "5" },
        { id: "6", displayName: "6" },
        { id: "7", displayName: "7" },
        { id: "8", displayName: "8" },
        { id: "9", displayName: "9" },
        { id: "10", displayName: "10" },
        { id: "11", displayName: "11" },
        { id: "12", displayName: "12" },
        { id: "13", displayName: "13" },
        { id: "14", displayName: "14" },
        { id: "15", displayName: "15" },
        { id: "16", displayName: "16" },
        { id: "17", displayName: "17" },
        { id: "18", displayName: "18" },
        { id: "19", displayName: "19" },
        { id: "20", displayName: "20" },
        { id: "21", displayName: "21" },
        { id: "22", displayName: "22" },
        { id: "23", displayName: "23" },
        { id: "24", displayName: "24" },
        { id: "25", displayName: "25" },
        { id: "26", displayName: "26" },
        { id: "27", displayName: "27" },
        { id: "28", displayName: "28" },
        { id: "29", displayName: "29" },
        { id: "30", displayName: "30" },
        { id: "31", displayName: "31" }
      ];
    }
  };

  mainAccountList = [
    { id: 1, displayName: "777000003002-SAR" },
    { id: 2, displayName: "773127003004-SAR" },
    { id: 3, displayName: "777200000013-SAR" },
    { id: 4, displayName: "777200000010-SAR" },
    { id: 5, displayName: "777200000001-SAR" },
    { id: 6, displayName: "777200000012-SAR" }
  ];

}
