import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { ContactInfo, CorporateBranch } from './@models/corporate-branch.model';

@Component({
  selector: 'app-corporate-branch',
  templateUrl: './corporate-branch.component.html',
  styleUrls: ['./corporate-branch.component.scss'],
})
export class CorporateBranchComponent implements OnInit {
  loading: boolean = false;
  formData: CorporateBranch = new CorporateBranch();

  stepperDetails: Stepper = {
    masterName: 'Corporate Branch',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveAsTemplateApplicable: false,
    isSaveDraftApplicable: false,
    headings: ['', ''],
  };

  mode: string = '';

  constructor(
    private httpService: HttpService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private userService: UserService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Corporate Branch',
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
      { label: 'Corporate Branch' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData.corporateName = this.userService.userDetails.corporateName;
    this.formData.effectiveFrom = this.userService.applicationDate;

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW' || this.mode == 'EDIT') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('payments/transactions/bulkPaymentRequest/private/view', data)
        .subscribe((formData: CorporateBranch) => {
          this.viewService.clearAll();

          this.formData = formData;

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  addContactInfo() {
    this.formData.contactInfo.push(new ContactInfo());
  }

  removeContactInfo(index: number) {
    this.formData.contactInfo.splice(index, 1);
  }
}
