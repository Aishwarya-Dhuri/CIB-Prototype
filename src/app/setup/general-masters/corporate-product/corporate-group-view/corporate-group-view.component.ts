import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CorporateProductService } from '../@services/corporate-product.service';

@Component({
  selector: 'app-corporate-group-view',
  templateUrl: './corporate-group-view.component.html',
  styleUrls: ['./corporate-group-view.component.scss'],
})
export class CorporateGroupViewComponent implements OnInit {
  corporateGroup: any;
  insights: any[] = [];
  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private corporateProductService: CorporateProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
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

    this.corporateGroup = this.corporateProductService.selectedGroup;
    this.insights = this.corporateProductService.insights;
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
    this.router.navigate(['./corporateView'], { relativeTo: this.route });
  }
}
