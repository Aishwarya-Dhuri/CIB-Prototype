import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActionService } from '../../../../base/main/@services/action.service';
import { BreadcrumbService } from '../../../../base/main/@services/breadcrumb.service';
import { ViewportService } from '../../../../shared/@services/viewport.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/@services/user.service';
import { Actions } from '../../../../base/@models/actions';
import { Breadcrumb } from '../../../../base/main/@models/breadcrumb.model';
import { HttpService } from '../../../../shared/@services/http.service';
import { VaIssuanceSummaryService } from '../@services/va-issuance-summary.service';

@Component({
  selector: 'app-va-issuance-group-summary',
  templateUrl: './va-issuance-group-summary.component.html',
  styleUrls: ['./va-issuance-group-summary.component.scss'],
})
export class VaIssuanceGroupSummaryComponent implements OnInit {
  @Output() onCorporateSelect = new EventEmitter<any>();

  viewport: string;
  corporateGroup: any = {};
  insights: any[] = [];

  URL_CONST = {
    GET_GROUP_CORPORATE_DATA: 'vam/vamSetup/virtualAccountIssuance/private/getGroupCorporateData',
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private vaISummaryService: VaIssuanceSummaryService,
    private viewportService: ViewportService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private userService: UserService,
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

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });

    this.getGroupSummary();
  }

  getGroupSummary(): void {
    console.log('getGroupSummary');
    this.httpService
      .httpPost(this.URL_CONST.GET_GROUP_CORPORATE_DATA, {})
      .subscribe((response: any) => {
        let data = response.response.dataMap;
        data.groupIcon = 'assets/images/' + data.groupImage;
        data.corporateList.map((corp) => {
          corp.corporateIcon = 'assets/images/' + corp.corporateImage;
          return corp;
        });
        this.corporateGroup = data;
        console.log('Group Data ', this.corporateGroup);
      });
  }

  onCorporateGroup(corporateGroup: any) {
    // this.corporateProductService.selectedGroup = corporateGroup;
    // this.router.navigate(['./group'], { relativeTo: this.route });
  }

  onCorporate(corporate: any) {
    // this.corporateProductService.selectedCorporate = corporate;
    // this.vaISummaryService.selectedCorporate = corporate;
    // this.router.navigate(['../virtualAccountIssuanceSummary'], {relativeTo: this.route});
    console.log('GP corporate', corporate);
    this.onCorporateSelect.emit({ corporate: corporate, corporateGroup: this.corporateGroup });
  }
}
