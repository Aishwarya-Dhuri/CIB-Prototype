import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { FDSummaryService } from './@services/fd-summary.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';

@Component({
  selector: 'app-fd-summary',
  templateUrl: './fd-summary.component.html',
  styleUrls: ['./fd-summary.component.scss'],
})
export class FdSummaryComponent implements OnInit {
  loading: boolean;

  viewport: string;
  options: any;
  chartTheme: string[];
  isViewStatement: boolean = false;
  colDefUrl: string = 'accountServices/fixedDeposit/fdSummary/private/viewStatementColDefs';
  rowDataUrl: string = 'accountServices/fixedDeposit/fdSummary/private/viewStatementData';
  gridOptions = {
    supressAutoFit: true,
    context: { componentParent: this },
  };
  fdSummaryList: any[] = [];

  selectedFD: any;

  currencyWiseFDList: any[] = [
    { total: '2', currentValue: '5,000.00' },
    { total: '10', currentValue: '5,00,000.00' },
    { total: '5', currentValue: '7,400.00' },
  ];

  accountList: any[] = [];
  FDList: any[] = [];
  fdFilteredDataList: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewportService: ViewportService,
    private httpService: HttpService,
    private router: Router,
    private fdSummaryService: FDSummaryService,
    private menuService: MenuService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const actions: Actions = {
      heading: 'FD Summary',
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
      { label: 'FD Summary' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.prepareData();

    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });

    const data = [
      {
        module: 'MYR',
        records: '2',
        amount: '500000',
      },
      {
        module: 'USD',
        records: '10',
        amount: '50000',
      },
      {
        module: 'INR',
        records: '5',
        amount: '74000',
      },
    ];

    this.options = {
      data: data,
      formatter: (params: any) => {
        return `${data[params.itemId].module}`;
      },
      padding: {
        left: 8,
        right: 18,
        top: 5,
        bottom: 12,
      },
      labelKey: 'module',
      angleKey: 'records',
      legend: {
        spacing: 10,
        layoutHorizontalSpacing: 10,
        layoutVerticalSpacing: 10,
      },
    };
  }

  prepareData(): void {
    const reqData = {
      dataMap: {
        corporateId: this.userService.getCorporateId(),
      },
    };

    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', reqData)
      .subscribe((res) => {
        this.accountList = res.dataList;
      });

    this.httpService
      .httpPost('accountServices/fixedDeposit/private/getFDSummaryCardDataList')
      .subscribe((res) => {
        this.fdSummaryList = res.dataList;
        this.selectedFD = this.fdSummaryList[0];
        this.httpService
          .httpPost('accountServices/fixedDeposit/private/getFixedDepositList')
          .subscribe((res) => {
            this.FDList = res.dataList;
            this.onSelected(this.selectedFD);
            this.loading = false;
          });
      });
  }

  onSelected(selectedFD: any): void {
    this.fdFilteredDataList = [];

    this.selectedFD = selectedFD;

    this.fdFilteredDataList = this.FDList.filter(
      (fd: any) => fd.fdType == selectedFD.enrichments.fdType,
    );
  }

  getAccountNameById(debitFromAccountId: number): string {
    return this.accountList.find((res) => res.id === debitFromAccountId).displayName;
  }

  onDownloadFdAdvice() {
    this.httpService.httpDownload('fixedDeposit/download_fd_advice.pdf');
  }

  onQuickLinkClick(LinkName: string, fdId: string): void {
    switch (LinkName) {
      case 'View Statement':
        this.isViewStatement = true;
        break;
      case 'Early Redemption':
        this.fdSummaryService.selectedId = fdId;
        this.menuService.setSelectedEntityName('EARLYREDEMPTION');
        this.menuService.setSelectedServiceUrl('accountServices/fixedDeposit/earlyRedemption');
        this.router.navigateByUrl('/accountServices/fixedDeposit/earlyRedemption');
        break;
      case 'Change Maturity Instructions':
        this.fdSummaryService.selectedId = fdId;
        this.menuService.setSelectedEntityName('MATURITYINSTRUCTIONS');
        this.menuService.setSelectedServiceUrl('accountServices/fixedDeposit/maturityInstructions');
        this.router.navigateByUrl('/accountServices/fixedDeposit/maturityInstructions');
        break;
    }
  }
}
