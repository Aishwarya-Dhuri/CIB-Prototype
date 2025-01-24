import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserAccessManagement } from './@models/userAccessManagement.model';

@Component({
  selector: 'app-user-access-management',
  templateUrl: './user-access-management.component.html',
  styleUrls: ['./user-access-management.component.scss'],
})
export class UserAccessManagementComponent implements OnInit {
  userAccessManagement: UserAccessManagement;
  isReview: boolean = false;
  userLastLoginDateTime: any;
  userName: any;
  userList: Select[] = [];
  accessTypeList: Select[] = [];
  stepperDetails: Stepper = {
    masterName: 'User Access Management',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: [''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'User Access Management',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Security' },
      { label: 'User Access Management' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.userAccessManagement = {
      userId: '',
      accessType: '',
    };
    this.getDropdownData();
  }

  getDropdownData(): void {
    this.httpService
      .httpPost('setup/security/userAccessManagement/private/dropdown/accessTypeDataList')
      .subscribe((response: any) => {
        this.accessTypeList = response.dataList;
      });
    // this.httpService.httpPost('setup/security/userAccessManagement/private/dropdown/userDataList').subscribe((response:any)=>{
    //   this.userList = response.dataList;
    // });
  }

  onAccessTypeSelect(accessType: string): void {
    const reqData = {
      dataMap: {
        isLock: +accessType === 2 ? true : false,
      },
    };
    this.httpService
      .httpPost('setup/security/corporateUser/private/getUserDataList', reqData)
      .subscribe((res: any) => {
        this.userList = res.dataList;
      });
  }

  onUserClick(selectedUser): void {
    this.userLastLoginDateTime = this.userList.find(
      (res) => res.id === selectedUser,
    ).enrichments.lastLoginDateTime;
    this.userName = this.userList.find((res) => res.id === selectedUser).enrichments.userName;
  }
}
