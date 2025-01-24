import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AuthRuleDropdownRendererComponent } from './@components/auth-rule-dropdown-renderer/auth-rule-dropdown-renderer.component';
import { CheckboxRendererComponent } from './@components/checkbox-renderer/checkbox-renderer.component';
import { UserAccessField } from './@model/user-access-field.model';

@Component({
  selector: 'app-user-access-field',
  templateUrl: './user-access-field.component.html',
  styleUrls: ['./user-access-field.component.scss'],
})
export class UserAccessFieldComponent implements OnInit {
  loading: boolean;
  showCorporateCodeModal: boolean = false;

  formData: UserAccessField = new UserAccessField();

  mode: string;
  stepperDetails: Stepper = {
    masterName: 'User Access Fields',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false,
  };

  frameworkComponents: any = {
    authRuleDropdownRenderer: AuthRuleDropdownRendererComponent,
    checkboxRenderer: CheckboxRendererComponent,
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    /* remove below : starts */
    const actions: Actions = {
      heading: 'User Field Access',
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
      { label: 'Security-Corporate' },
      { label: 'User Field Access' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.formData.corporateId = this.userService.userDetails.corporateId;
    this.formData.corporateCode = this.userService.userDetails.corporateCode;
    this.formData.corporateName = this.userService.userDetails.corporateName;

    this.httpService
      .httpPost('setup/security/userFieldAccess/private/getAllUserFields')
      .subscribe((response: any) => {
        this.formData.corporateUserAccessFields = response.data;
        this.getViewData();
      });
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('setup/security/userFieldAccess/private/view', data)
        .subscribe((formData: UserAccessField) => {
          this.viewService.clearAll();

          this.formData = formData;

          console.log(formData);

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }
}
