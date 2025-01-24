import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { CreditLineService } from '../@services/credit-line.service';

@Component({
  selector: 'app-view-credit-line-details',
  templateUrl: './view-credit-line-details.component.html',
  styleUrls: ['./view-credit-line-details.component.scss'],
})
export class ViewCreditLineDetailsComponent implements OnInit {
  loading: boolean = true;
  isGroupUser: boolean;

  corporates: any[] = [];
  selectedCorporate: any;

  corporateCreditLineData: any;

  selectedCreditLine: any;

  currency: string = '';
  currencyList: any[] = [];

  isShowMoreOptions: boolean = false;
  moreActionsStyle: any = {};

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private creditLineService: CreditLineService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private currencyService: CurrencyService,
    private currencyPipe: CurrencyPipe,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Credit Line Summary',
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
      { label: 'Credit Line Summary' },
      { label: 'View Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.isGroupUser = this.userService.loginPreferenceDetails.loginType == 'group';

    this.currencyService.getCurrencyList().subscribe((currencyList: any) => {
      this.currencyList = currencyList;
    });

    this.creditLineService.getCreditLineCurrency().subscribe((currency: any) => {
      if (!currency) {
        this.currencyService.getCurrencyName().subscribe((currency1: any) => {
          this.creditLineService.setCreditLineCurrency(currency1);
        });
        return;
      }
      this.currency = currency;
      // this.prepareFundDistributionChartData();
    });

    this.corporates = this.creditLineService.getCorporateList();

    if (!this.isGroupUser) {
      this.corporates = [];
    }

    const corporateCreditLineData = this.creditLineService.getSelectedCorporate();

    let corporateId = this.userService.userDetails.corporateId;

    if (corporateCreditLineData) {
      corporateId = corporateCreditLineData.corporateId;
    }

    this.selectedCorporate = corporateId;

    this.getCorporateCreditLineData(corporateId);
  }

  getCorporateCreditLineData(corporateId: string) {
    const data = { dataMap: { corporateId: corporateId } };
    this.httpService
      .httpPost(
        'accountServices/services/creditLineSummery/private/getCorporateCreditLineDetails',
        data,
      )
      .subscribe((response: any) => {
        this.corporateCreditLineData = response.data;
        const currencyWiseDistributionChartData = [];

        this.currencyList.forEach((currency: any) => {
          currencyWiseDistributionChartData.push({
            displayName: currency.displayName,
            amount: response.data.totalAllocatedLimit,
          });
        });

        this.corporateCreditLineData['currencyWiseDistributionChartOptions'] = {
          data: currencyWiseDistributionChartData,
          labelKey: 'displayName',
          angleKey: 'amount',
          formatter: (params: any) => {
            return `${this.currencyPipe.transform(
              currencyWiseDistributionChartData[params.itemId].amount,
              currencyWiseDistributionChartData[params.itemId].displayName + ' ',
              'code',
            )}
            `;
          },
        };

        this.prepareCorporateCreditLineData();

        this.selectedCreditLine = this.corporateCreditLineData.creditLines[0];

        this.loading = false;
      });
  }

  showMoreActions(e: MouseEvent, rowData: any) {
    e.stopPropagation();
    const top = e.pageY;
    const left = e.pageX;
    this.moreActionsStyle = {
      position: 'absolute',
      top: top + 40 + 'px',
      left: left - 70 + 'px',
      width: 'auto',
      padding: '0.5rem',
    };
    this.isShowMoreOptions = true;
  }

  prepareCorporateCreditLineData() {
    this.corporateCreditLineData.creditLines = this.corporateCreditLineData.creditLines.map(
      (creditLine: any) => {
        const productWiseDistributionChartData = [];

        creditLine.products.forEach((product: any) => {
          productWiseDistributionChartData.push({
            displayName: product.product,
            amount: product.totalAllocatedLimit,
          });
        });

        creditLine['productWiseDistributionChartOptions'] = {
          data: productWiseDistributionChartData,
          labelKey: 'displayName',
          angleKey: 'amount',
          formatter: (params: any) => {
            return `${
              productWiseDistributionChartData[params.itemId].displayName
            }\t\t\t\t${this.currencyPipe.transform(
              productWiseDistributionChartData[params.itemId].amount,
              this.currency + ' ',
              'code',
            )}`;
          },
        };

        return creditLine;
      },
    );
  }

  onChangeCorporate(e: any) {
    this.getCorporateCreditLineData(e.id);
  }

  currencyChange(e: any) {
    this.currency = e.displayName;
    this.creditLineService.setCreditLineCurrency(e.displayName);
    this.prepareCorporateCreditLineData();
  }

  onProductClick(product: any) {
    this.creditLineService.setSelectedProduct(product);

    const productList = [];
    this.selectedCreditLine.products.forEach((product: any) => {
      productList.push({
        id: product.id,
        displayName: product.product,
        enrichments: {
          subProductColDefUrl: product.subProductColDefUrl,
          subProductRowDefUrl: product.subProductRowDefUrl,
        },
      });
    });

    this.creditLineService.setProductList(productList);

    this.router.navigate(['./product'], { relativeTo: this.route });
  }
}
