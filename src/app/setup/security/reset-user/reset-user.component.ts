import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ResetUser } from './@models/reset-user.model';

@Component({
  selector: 'app-reset-user',
  templateUrl: './reset-user.component.html',
  styleUrls: ['./reset-user.component.scss'],
})
export class ResetUserComponent implements OnInit {
  @ViewChild('resetUserForm') resetUserForm: any;

  formData: ResetUser = new ResetUser();

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Reset User - Initiate',
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
      { label: 'Reset User' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  onUserChnage(selectedUser): void {
    this.formData.displayName = selectedUser.displayName;
    this.formData.userId = selectedUser.enrichments?.userId;
  }

  cancel(): void {
    this.router.navigate(['/dashboard/consolidated'], { relativeTo: this.route });
  }

  reset(): void {
    const data = { dataMap: { id: this.formData.userId } };
    this.httpService.httpPost('setup/security/resetUser/private/reset', data).subscribe((res) => {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'User Reset Successfully',
      });
      this.formData = new ResetUser();
    });
  }
}
