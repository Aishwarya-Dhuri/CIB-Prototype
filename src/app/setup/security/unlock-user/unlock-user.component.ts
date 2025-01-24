import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UnlockUser } from './@models/unlock-user.model';

@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.component.html',
  styleUrls: ['./unlock-user.component.scss'],
})
export class UnlockUserComponent implements OnInit {
  @ViewChild('unblockUserForm') unblockUserForm: any;

  formData: UnlockUser = new UnlockUser();

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
      heading: 'Unlock User - Initiate',
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
      { label: 'Unlock User' },
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

  unlock(): void {
    const data = { dataMap: { id: this.formData.userId } };
    this.httpService.httpPost('setup/security/unlockUser/private/unlock', data).subscribe((res) => {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'User Unlock Successfully',
      });
      this.formData = new UnlockUser();
    });
  }
}
