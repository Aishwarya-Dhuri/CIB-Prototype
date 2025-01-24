import { Component, Input, OnInit } from '@angular/core';
import { CreditLineService } from '../../../../account-services/services/credit-line-summary/@services/credit-line.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../base/main/@services/breadcrumb.service';
import { UserService } from '../../../../shared/@services/user.service';
import { Actions } from '../../../../base/@models/actions';
import { HttpService } from '../../../../shared/@services/http.service';
import { VaIssuanceSummaryService } from '../@services/va-issuance-summary.service';
import { ViewService } from '../../../../shared/services/view-service/view-service';
import { ActionService } from '../../../../base/main/@services/action.service';
import { Breadcrumb } from '../../../../base/main/@models/breadcrumb.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-va-issuance-corporate-summary',
  templateUrl: './va-issuance-corporate-summary.component.html',
  styleUrls: ['./va-issuance-corporate-summary.component.scss'],
})
export class VaIssuanceCorporateSummaryComponent implements OnInit {
  @Input() groupData: any;
  @Input() selectedCorporate: any = {};

  selectedAccount: any;
  accountMoreData: boolean;

  vaIssuanceData = [];
  accountWiseAllocationChartOptions: any;
  subEntityWiseAllocationChartOptions: any;
  corporateAllocatedLimit: any;
  corporateUtilizedLimit: any;
  insightsData: any;

  URL_CONST = {
    GET_VAISSUANCE_SUMMARY: 'vam/vamSetup/virtualAccountIssuance/private/getVAIssuanceSummary',
    GET_INSIGHTS: 'vam/vamSetup/virtualAccountIssuance/insights',
    VIEW: 'vam/vamSetup/virtualAccountIssuance/private/view',
  };
  corporateId: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private userService: UserService,
    private creditLineService: CreditLineService,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute,
    private viewService: ViewService,
    private vaIssuanceSummaryService: VaIssuanceSummaryService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'VA Issuance',
      subHeading: null,

      refresh: true,

      download: true,
      print: true,
      relationshipManager: true,
      backBtn: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'VA Issuance' },
      { label: 'Summary' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.corporateId = this.selectedCorporate && this.selectedCorporate.id;
    if (!this.corporateId) {
      this.corporateId = this.userService.userDetails.corporateId;
    }

    console.log('selectedCorporate', this.selectedCorporate);
    this.getSummaryData();
  }

  createAccountWiseAllocationChart() {
    const data = this.vaIssuanceData;
    //[{"currency":"MYR","amount":693600},{"currency":"IDR","amount":693600},{"currency":"SGD","amount":693600},{"currency":"JPY","amount":693600}]

    this.accountWiseAllocationChartOptions = {
      data: data,
      labelKey: 'account',
      angleKey: 'totalAllocatedLimit',
      formatter: (params: any) => {
        return `${data[params.itemId].totalAllocatedLimit} ${this.currencyPipe.transform(
          data[params.itemId].totalAllocatedLimit,
          data[params.itemId].accountCurrency + ' ',
          'code',
        )}`;
        // return `${data[params.itemId].account} ${data[params.itemId].accountCurrency} ${data[params.itemId].totalAllocatedLimit}`;
      },

      padding: {
        left: 12,
        right: 12,
        top: 12,
        bottom: 12,
      },
      legend: {
        spacing: 6,
        layoutHorizontalSpacing: 0,
        layoutVerticalSpacing: 6,
      },
    };
  }

  onSubEntityClick(subEntity: any) {
    // vamSetup/virtualAccountIssuanceSummary/subEntityDetails
    // this.creditLineService.setSelectedProduct(product);
    this.vaIssuanceSummaryService.selectedSubEntity = subEntity;
    this.router.navigate(['./subEntityDetails'], { relativeTo: this.route });
  }

  viewCorporateDetails(corporate: any) {}

  onCardSelect(data) {
    console.log(data);
    this.selectedAccount = data;
    this.vaIssuanceSummaryService.selectedAccount = data;
    this.showAccountMoreData();
  }

  goToInitiate() {
    this.router.navigate(['../virtualAccountIssuance'], { relativeTo: this.route });
  }

  showAccountMoreData() {
    if (this.accountMoreData) {
      const data = this.selectedAccount.subEnitiesData;
      this.subEntityWiseAllocationChartOptions = {
        data: data,
        labelKey: 'subEntityName',
        angleKey: 'subEntityAllocatedLimit',
        formatter: (params: any) => {
          return `${data[params.itemId].subEntityName} ${this.selectedAccount.accountCurrency} ${
            data[params.itemId].subEntityAllocatedLimit
          }`;
          // return `${data[params.itemId].account} ${data[params.itemId].accountCurrency} ${data[params.itemId].totalAllocatedLimit}`;
        },

        padding: {
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        },
        legend: {
          spacing: 6,
          layoutHorizontalSpacing: 0,
          layoutVerticalSpacing: 6,
        },
      };
    }
  }

  viewVAIssuance(subEntity) {
    this.viewService.setId(subEntity.id);
    this.viewService.setMode('VIEW');
    this.router.navigate(['../virtualAccountIssuance'], { relativeTo: this.route });
  }

  limitEnhancement() {}

  showMoreOptions(event: MouseEvent) {
    event.stopPropagation();
    // this.vaIssuanceSummaryService.selectedSubEntity = subEntity;
  }

  private getSummaryData() {
    this.selectedAccount = {};
    this.httpService
      .httpPost(this.URL_CONST.GET_VAISSUANCE_SUMMARY, {
        dataMap: { corporateId: this.corporateId },
      })
      .subscribe((response: any) => {
        this.vaIssuanceData = response.dataMap.accountDataList;
        this.corporateAllocatedLimit = response.dataMap.corporateAllocatedLimit;
        this.corporateUtilizedLimit = response.dataMap.corporateUtilizedLimit;
        this.vaIssuanceData.map((data, index) => {
          data.header = data.account;
          data.subHeading =
            data.accountCurrency +
            ' ' +
            data.totalAllocatedLimit +
            ' | ' +
            data.subEnitiesData.length +
            ' Sub Entity';
        });
        if (this.vaIssuanceData && this.vaIssuanceData.length > 0) {
          this.vaIssuanceData[0].isSelected = true;
        }

        this.createAccountWiseAllocationChart();
      });
    this.httpService.httpPost(this.URL_CONST.GET_INSIGHTS).subscribe((response: any) => {
      console.log('GET_INSIGHTS', response);
      this.insightsData = response;
    });
  }

  onChangeCorporate(da) {
    console.log(da);
    this.corporateId = this.selectedCorporate.id;
    this.getSummaryData();
  }
}
