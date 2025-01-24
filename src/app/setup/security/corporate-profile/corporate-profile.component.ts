import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { CorporateProfile } from './@models/corporateProfile.model';

@Component({
  selector: 'app-corporate-profile',
  templateUrl: './corporate-profile.component.html',
  styleUrls: ['./corporate-profile.component.scss'],
})
export class CorporateProfileComponent implements OnInit {
  @ViewChild('corporateProfileForm') corporateProfileForm: any;

  formData: CorporateProfile;

  isGroupUser: boolean = false;

  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Corporate Profile',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Corporate Profile',
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
      { label: 'Corporate Profile' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.formData = new CorporateProfile();

    this.formData.effectiveFrom = this.userService.getApplicationDate();

    if (!this.isGroupUser) {
      this.formData.profileType = 'Corporate Wise';
      this.formData.corporateId = this.userService.userDetails.corporateId;
      this.formData.corporateName = this.userService.userDetails.corporateName;
    } else {
      this.formData.profileType = 'Generic';
      this.formData.corporateId = '';
      this.formData.corporateName = '';
    }

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateProfile/private/view', data)
        .subscribe((formData: CorporateProfile) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.corporateProfileForm && this.corporateProfileForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }
}
