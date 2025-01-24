import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { AccountWiseAccessService } from '../@services/account-wise-access.service';

@Component({
  selector: 'app-awa-templates',
  templateUrl: './awa-templates.component.html',
  styleUrls: ['./awa-templates.component.scss'],
})
export class AWATemplatesComponent implements OnInit, OnDestroy {
  @ViewChild('productAccountsGrid') productAccounts: any;

  loading = false;
  productLoading = false;

  dataGridColumnDefsUrl: string = '';
  dataGridRowData: any[] = [];
  dataGridOptions: any;

  activeTemplate: any;

  products: any[] = [];
  selectedProduct: any;

  templates = [];

  constructor(
    private accountWiseAccessService: AccountWiseAccessService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.dataGridColumnDefsUrl = this.accountWiseAccessService.accessMappingAccountColDefUrl;

    this.dataGridOptions = {
      pagination: false,
      rowModelType: 'clientSide',
      rowSelection: 'multiple',
    };

    this.httpService
      .httpPost('setup/generalMasters/accountWiseAccess/private/getTemplateList', {
        startRow: 0,
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {},
        sortModel: [],
        entityName: '',
      })
      .subscribe((response: any) => {
        this.templates = response.data;

        this.getTemplateData(response.data[0]);
        this.loading = false;
      });
  }

  getTemplateData(template: any) {
    this.productLoading = true;
    this.activeTemplate = template;

    this.accountWiseAccessService.setSelectedTemplate(template);

    this.httpService
      .httpPost('setup/generalMasters/accountWiseAccess/private/viewTemplate', {
        dataMap: { id: template.id },
      })
      .subscribe((response: any) => {
        this.products = response.products;
        this.productLoading = false;
      });
  }

  leafNodeSelected(selectedProduct: any) {
    this.selectedProduct = selectedProduct;

    this.dataGridRowData = selectedProduct.selectedData;

    this.productAccounts.setRowData(this.dataGridRowData);
  }

  ngOnDestroy() {
    this.accountWiseAccessService.setSelectedTemplate(this.activeTemplate);
  }
}
