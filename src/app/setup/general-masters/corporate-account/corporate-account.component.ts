import { Component, OnInit, ViewChild } from '@angular/core';
import { Menu } from 'primeng/menu';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserService } from 'src/app/shared/@services/user.service';
import { CorporateAccount } from './@models/corporate-account.model';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
@Component({
  selector: 'app-corporate-account',
  templateUrl: './corporate-account.component.html',
  styleUrls: ['./corporate-account.component.scss'],
})
export class CorporateAccountComponent implements OnInit {
  @ViewChild('corporateAccountForm') corporateAccountForm: any;

  formData: CorporateAccount = new CorporateAccount();
  stepperDetails: Stepper = {
    masterName: 'Corporate Account',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  isSwiftCode: boolean = false;
  moduleList: any[] = [];
  selectedModule: any[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Corporate Account',
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
      { label: 'General Masters' },
      { label: 'Corporate Account' },
    ];
    this.getModules();
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.formData.corporateId = this.userService.corporateId;
    this.formData.corporateName = this.userService.userDetails.corporateName;
    this.formData.effectiveFrom = this.userService.applicationDate;
  }

  getModules(): void {
    this.httpService
      .httpPost('commons/commonService/private/getProductList')
      .subscribe((response) => {
        this.moduleList = response.dataList;
      });
  }

  swiftCodeSearchModelData(selectedBIC): void {
    this.formData.swiftCode = selectedBIC.bicCode;
    this.formData.bank = selectedBIC.bank;
    this.formData.accountBranch = selectedBIC.accountBranch;
    this.formData.branchAddress = selectedBIC.branchAddress;
  }

  onAssignClick(i): void {
    const d = cloneDeep(this.moduleList[i]);
    this.formData.moduleMapping.unshift(d);
    this.moduleList.splice(i, 1);
  }

  onRemoveClick(i): void {
    const d = cloneDeep(this.formData.moduleMapping[i]);
    this.moduleList.unshift(d);
    this.formData.moduleMapping.splice(i, 1);
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      if (this.corporateAccountForm && this.corporateAccountForm.valid) {
        return true;
      }
      return false;
    }
    return true;
  }
}
