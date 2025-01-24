import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { GenericListingComponent } from 'src/app/shared/@components/generic-listing/generic-listing.component';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-single-payment-request-listing',
  templateUrl: './single-payment-request-listing.component.html',
  styleUrls: ['./single-payment-request-listing.component.scss'],
})
export class SinglePaymentRequestListingComponent
  extends GenericListingComponent
  implements OnInit
{
  parentComponentRef: any = this;

  isLoading: boolean;
  chartData: any[] = [];
  cardData: any = {};
  totalPayments: number;
  options: any;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
    protected listingService: ListingService,
    private userService: UserService,
  ) {
    super(actionsService, breadcrumbService, menuService, router, viewService, httpService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getDashboardData();
  }

  getDashboardData(): void {
    this.isLoading = true;
    this.httpService
      .httpPost(this.menuService.getSelectedServiceUrl() + '/private/listingDashboardData')
      .subscribe((response: any) => {
        this.chartData = response.dataMap.chartData;
        this.cardData = response.dataMap.cardData;

        this.totalPayments = 0;
        this.chartData.forEach((record) => {
          this.totalPayments = this.totalPayments + parseInt(record.value);
        });

        const chartTheme = [
          getComputedStyle(document.body).getPropertyValue('--color-warning'),
          getComputedStyle(document.body).getPropertyValue('--color-success'),
          getComputedStyle(document.body).getPropertyValue('--color-error'),
        ];

        this.options = {
          data: this.chartData,
          series: [
            {
              type: 'pie',
              labelKey: 'displayName',
              angleKey: 'value',
              innerRadiusOffset: 7.5,
              label: { enabled: false },
            },
          ],
          theme: {
            baseTheme: 'default',
            palette: { fills: chartTheme, strokes: chartTheme },
          },
          legend: {
            item: {
              marker: { shape: 'circle', size: 8 },
              label: {
                fontSize: 10,
                formatter: (params: any) => {
                  return (
                    this.chartData[params.itemId].value +
                    ' ' +
                    this.chartData[params.itemId].displayName
                  );
                },
              },
            },
          },
        };
        this.isLoading = false;
      });
  }

  edit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.navigateToInitiate();
  }

  view(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.navigateToInitiate();
  }

  navigateToInitiate(): void {
    if (this.userService.userDetails.corporateType == 'L')
      this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
    else this.router.navigateByUrl(this.menuService.getSelectedServiceUrl());
  }
}
