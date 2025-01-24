import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-debit-card-summary',
  templateUrl: './debit-card-summary.component.html',
  styleUrls: ['./debit-card-summary.component.scss'],
})
export class DebitCardSummaryComponent implements OnInit {
  corporateType: string;

  constructor(
    private userService: UserService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
    const actions: Actions = {
      heading: 'Debit Card Summery',
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
      { label: 'Account Services' },
      { label: 'Debit Card' },
      { label: 'Debit Card Summery' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }
}
