import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { MoreOptionRendererComponent } from '../../@components/more-option-renderer/more-option-renderer.component';
import { SubProductLinkRendererComponent } from '../../@components/sub-product-link-renderer/sub-product-link-renderer.component';
import { CreditLineService } from '../../@services/credit-line.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  productList: any[] = [];
  selectedProduct: any = '';
  subProductType: string;
  colDefUrl = 'accountServices/services/creditLineDetails/private/subProductTradeColDefs';
  rowDataUrl = 'accountServices/services/creditLineDetails/private/subProductTradeData';
  gridOptions = {};
  context = {
    componentParent: this,
  };

  frameworkComponents: any = {
    subProductLinkRenderer: SubProductLinkRendererComponent,
    moreOptionRenderer: MoreOptionRendererComponent,
  };

  subProductTypeDetailsColDefs: string;

  isShowMoreOptions: boolean = false;
  moreActionsStyle: any = {};

  currency: string;

  rowData: any[] = [];

  loadingData: boolean = false;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private creditLineService: CreditLineService,
    private currencyService: CurrencyService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: `Product - ${this.product ? this.product.product : ''}`,
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
      { label: 'Product Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.product = this.creditLineService.getSelectedProduct();

    if (!this.product) {
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    this.productList = this.creditLineService.getProductList();

    this.creditLineService.getCreditLineCurrency().subscribe((currency: any) => {
      if (!currency) {
        this.currencyService.getCurrencyName().subscribe((currency: any) => {
          this.creditLineService.setCreditLineCurrency(currency);
        });
        return;
      }
      this.currency = currency;
      // this.prepareFundDistributionChartData();
    });

    this.selectedProduct = this.product.id;

    if (this.product.product == 'FSCM') {
      this.subProductTypeDetailsColDefs =
        'accountServices/services/creditLineDetails/private/subProductTypeFscmDetailsColDefs';
    } else {
      this.subProductTypeDetailsColDefs =
        'accountServices/services/creditLineDetails/private/subProductTypeDetailsColDefs';
    }

    this.gridOptions = {
      rowModelType: 'clientSide',
      treeData: true,
      pagination: false,
      animateRows: true,
      groupDefaultExpanded: -1,
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
      autoGroupColumnDef: {
        field: 'subProducts',
        headerName: 'Sub Product',
        resizable: true,
        width: 400,
        cellRendererParams: {
          suppressCount: true,
          innerRenderer: 'subProductLinkRenderer',
        },
      },
      getDataPath: (data: any) => {
        return data.subProducts;
      },
      isGroupOpenByDefault: (params: any) => {
        return true;
      },
    };

    this.colDefUrl = this.product.subProductColDefUrl;
    this.rowDataUrl = this.product.subProductRowDefUrl;

    this.getRowData();
  }

  onProductChanged(e: any) {
    const data = { dataMap: { productId: e.id } };

    this.httpService
      .httpPost(
        'accountServices/services/creditLineSummery/private/getCreditLineProductDetails',
        data,
      )
      .subscribe((response: any) => {
        this.product = response.data;

        if (this.product.product == 'FSCM') {
          this.subProductTypeDetailsColDefs =
            'accountServices/services/creditLineDetails/private/subProductTypeFscmDetailsColDefs';
        } else {
          this.subProductTypeDetailsColDefs =
            'accountServices/services/creditLineDetails/private/subProductTypeDetailsColDefs';
        }

        this.colDefUrl = this.product.subProductColDefUrl;
        this.rowDataUrl = this.product.subProductRowDefUrl;
        this.getRowData();
      });
  }

  getRowData() {
    this.loadingData = true;

    const data = { dataMap: { product: this.product, currency: this.currency } };

    this.httpService.httpPost(this.rowDataUrl, data).subscribe((response: any) => {
      this.rowData = response.data;
      this.loadingData = false;
    });
  }

  onLinkClick(data: any) {
    this.subProductType = { ...data, product: this.product };
  }

  showMoreActions(top: number, left: number, rowData: any) {
    this.moreActionsStyle = {
      position: 'absolute',
      top: top + 45 + 'px',
      left: left - 70 + 'px',
      width: 'auto',
      padding: '0.5rem',
    };
    this.isShowMoreOptions = true;
  }

  onRepayNow() {}

  onApplyFinance() {}
}
