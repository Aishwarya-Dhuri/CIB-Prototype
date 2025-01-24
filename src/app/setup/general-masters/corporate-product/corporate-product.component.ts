import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { CorporateProductService } from './@services/corporate-product.service';

@Component({
  selector: 'app-corporate-product',
  templateUrl: './corporate-product.component.html',
  styleUrls: ['./corporate-product.component.scss'],
})
export class CorporateProductComponent implements OnInit {
  viewport: string;

  corporateGroups: any[] = [];

  insights: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private corporateProductService: CorporateProductService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const loginType = this.userService.loginPreferenceDetails.loginType;

    if (loginType != 'group') {
      this.router.navigate(['./corporateView'], { relativeTo: this.route });
      return;
    }

    const actions: Actions = {
      heading: 'Corporate Group',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Corporate Group' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.corporateGroups = [
      {
        groupIcon: this.userService.userDetails.groupImage,
        groupName: this.userService.userDetails.groupName,
        groupCode: this.userService.userDetails.groupId,
        liabilityId: '0073712',
        corporates: [
          {
            corporateId: 'CIF0001',
            corporateIcon: 'assets/images/toyota.png',
            corporateName: 'Toyota Motors',
            category: 'Gold',
            accounts: '5',
          },
          {
            corporateId: 'CIF0001',
            corporateIcon: 'assets/images/toyota.png',
            corporateName: 'Toyota Aftersales',
            category: 'Gold',
            accounts: '5',
          },
          {
            corporateId: 'CIF0001',
            corporateIcon: 'assets/images/toyota.png',
            corporateName: 'Toyota Mobility',
            category: 'Gold',
            accounts: '5',
          },
        ],
      },
    ];
    this.insights = this.corporateProductService.insights;
  }

  onCorporateGroup(corporateGroup: any) {
    this.corporateProductService.selectedGroup = corporateGroup;
    this.router.navigate(['./group'], { relativeTo: this.route });
  }

  getCorporates(corporates: any[]) {
    if (corporates.length <= 3) {
      return corporates;
    } else {
      return corporates.slice(0, 3);
    }
  }

  onCorporate(corporate: any) {
    this.corporateProductService.selectedCorporate = corporate;
    this.router.navigate(['./group/corporateView'], { relativeTo: this.route });
  }
}
