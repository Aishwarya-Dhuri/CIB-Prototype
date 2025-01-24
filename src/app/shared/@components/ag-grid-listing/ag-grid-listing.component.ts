import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { ApsTranslatePipe } from '../../@pipes/aps-translate.pipe';
import { AppSettingService } from '../../@services/app-setting.service';
import { HttpService } from '../../@services/http.service';
import { ViewportService } from '../../@services/viewport.service';
import { AmountRendererComponent } from './amount-renderer/amount-renderer.component';
import { CurrencyRendererComponent } from './currency-renderer/currency-renderer.component';
import { DangerCurrencyRendererComponent } from './danger-currency-renderer/danger-currency-renderer.component';
import { DateRendererComponent } from './date-renderer/date-renderer.component';
import { FavoriteRendererComponent } from './favorite-renderer/favorite-renderer.component';
import { GridActionRendererComponent } from './grid-action-renderer/grid-action-renderer.component';
import { LinkRendererComponent } from './link-renderer/link-renderer.component';
import { MaskRendererComponent } from './mask-renderer/mask-renderer.component';
import { RejectReasonRendererComponent } from './reject-reason-renderer/reject-reason-renderer.component';
import { SuccessCurrencyRendererComponent } from './success-currency-renderer/success-currency-renderer.component';

@Component({
  selector: 'app-ag-grid-listing',
  templateUrl: './ag-grid-listing.component.html',
  styleUrls: ['./ag-grid-listing.component.scss'],
})
export class AgGridListingComponent implements OnInit, OnChanges {
  @ViewChild('agGridAngular') agGridAngular: any;

  loading: boolean;
  loadingData: boolean;
  viewport: string = 'web';

  @Input('id') id: any;
  @Input('gridOptions') gridOptions: any;
  @Input('colDefUrl') colDefUrl: string;
  @Input('colDefReq') colDefReq: any;
  @Input('supressAutoFit') supressAutoFit: boolean = false;
  @Input('rowDefUrl') rowDefUrl: string;
  @Input('rowDefReq') rowDefReq?: any;
  @Input('columnDefs') columnDefs: any[] = [];
  @Input('frameworkComponents') frameworkComponents!: any;
  @Input('context') context!: any;
  @Input('rowData') rowData!: any;
  @Input('entityName') entityName?: string = '';

  @Output() rowSelected = new EventEmitter<any>();
  @Output() rowDragEnd = new EventEmitter<any>();
  @Output() gridReady = new EventEmitter<any>();
  @Output() firstDataRendered = new EventEmitter<any>();

  gridApi: any;
  gridColumnApi: any;
  data: any;
  numberOfRecords: number = 0;
  pages: any[] = [];

  pageSizes: number[] = [5, 10, 20];

  pageSize = 10;
  // currentPage = 0;

  defaultColDef: {
    [key: string]: any;
  } = {
    floatingFilter: false,
    /* filter: true, */
    enablePivot: true,
    enableValue: true,
    sortable: true,
    filterParams: {
      buttons: ['cancel', 'clear', 'reset', 'apply'],
      closeOnApply: true,
    },
  };

  agGridOptions: any;

  isCheckboxSelection: boolean = false;
  noOfHiddenCols: number = 0;

  overlayNoRowsTemplate: string = `<span class="text-size-13">No Rows To Show</span>`;
  constructor(
    private viewportService: ViewportService,
    private httpService: HttpService,
    private appSettingService: AppSettingService,
    private apsTranslatePipe: ApsTranslatePipe,
  ) {
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      if (this.agGridOptions) {
        this.agGridOptions.enableRtl = extraSetting.direction === 'rtl';
        this.refreshGridList();
      }
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadingData = true;

    this.isCheckboxSelection = false;
    this.noOfHiddenCols = 0;

    if (this.columnDefs && this.columnDefs.length > 0) {
      this.columnDefs = this.columnDefs.map((colDef) => {
        if (colDef.checkboxSelection) {
          this.isCheckboxSelection = true;
        }

        if (colDef.hide == 'true' || colDef.field == 'checkbox') {
          this.noOfHiddenCols++;
        }

        return {
          pinned: null,
          filter: 'agTextColumnFilter',
          sortable: true,
          resizable: true,
          floatingFilter: false,
          /* checkboxSelection: false, */
          enableRowGroup: true,
          enableValue: true,
          unSortIcon: true,
          showOnGrid: colDef?.hide == true ? false : true,
          ...colDef,
          headerName: this.apsTranslatePipe.transform(colDef.headerName),
        };
      });
    }

    this.agGridOptions = {
      columnDefs: this.columnDefs,
      defaultColDef: this.defaultColDef,
      animateRows: true,
      rowGroupPanelShow: false,
      pivotPanelShow: false,
      debug: false,
      context: { componentParent: this, ...this.context },
      rowData: this.rowData,
      rowSelection: true,
      rowModelType: this.rowData ? 'clientSide' : 'serverSide',
      serverSideStoreType: 'partial',
      pagination: true,
      paginateChildRows: true,
      paginationPageSize: 10,
      paginationAutoPageSize: false,
      cacheBlockSize: 10,
      maxBlocksInCache: 3,
      enableCharts: true,
      enableRtl: false,
      enableRangeSelection: true,
      rowDragManaged: true,
      statusBar: false,
      suppressPaginationPanel: true,
      suppressScrollOnNewData: true,
      overlayNoRowsTemplate: this.overlayNoRowsTemplate,
      frameworkComponents: {
        actionCellRenderer: GridActionRendererComponent,
        amountRenderer: AmountRendererComponent,
        currencyRenderer: CurrencyRendererComponent,
        dateRenderer: DateRendererComponent,
        linkRenderer: LinkRendererComponent,
        favoriteRenderer: FavoriteRendererComponent,
        dangerCurrencyRenderer: DangerCurrencyRendererComponent,
        successCurrencyRenderer: SuccessCurrencyRendererComponent,
        rejectReasonRenderer: RejectReasonRendererComponent,
        maskRenderer: MaskRendererComponent,

        ...this.frameworkComponents,
      },

      ...this.gridOptions,
      onGridReady: (event: any) => this.onGridReady(event),
      onFirstDataRendered: (event: any) => this.onFirstDataRendered(event),
      onRowSelected: (event: any) => this.onRowSelected(event),
      onRowDragEnd: (event: any) => this.onRowDragEnd(event),
    };

    if (!this.rowData) {
      this.rowData = [];
    } else {
      if (this.isCheckboxSelection) {
        this.rowData = this.rowData.map((data: any) => {
          return { checkboxChecked: false, ...data };
        });
      }
    }

    this.pageSizeConf();

    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
      if (viewport == 'mobile' && this.rowData.length == 0) {
        this.afterGridReady();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewport == 'mobile') {
      // if (this.viewport == 'mobile') {
      //   this.afterGridReady();
      // }
      if (this.isCheckboxSelection) {
        this.rowData = this.rowData.map((data: any) => {
          return { checkboxChecked: false, ...data };
        });
      }
    } else {
      this.setRowData(this.rowData);
    }
    this.refreshGridList();
  }

  setSuppressRowDrag(param: boolean): void {
    // this.gridApi.setSuppressRowDrag(param);
  }

  pageSizeConf() {
    if (!this.pageSizes.includes(this.agGridOptions.paginationPageSize)) {
      this.pageSizes.push(this.agGridOptions.paginationPageSize);
      // this.pageSizes = this.pageSizes.sort();
    }

    this.pageSize = this.agGridOptions.paginationPageSize;
  }

  refreshGridList() {
    this.loading = true;
    this.loadingData = true;

    // this.currentPage = 0;

    if (this.gridApi && this.agGridOptions.rowModelType === 'serverSide') {
      this.gridApi.refreshServerSideStore({
        route: null,
        purge: true,
      });
    }

    setTimeout(() => {
      this.loading = false;
      this.loadingData = false;
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.setSuppressRowDrag(false);
    this.gridColumnApi = params.columnApi;
    this.afterGridReady();
  }

  afterGridReady() {
    if (this.colDefUrl) {
      this.httpService
        .httpPost(this.colDefUrl, this.colDefReq ? this.colDefReq : {})
        .subscribe((response: any) => {
          const columns = response.columnDefs ? response.columnDefs : response;

          this.isCheckboxSelection = false;
          this.noOfHiddenCols = 0;

          const colDefs = columns.map((colDef: any) => {
            if (colDef.checkboxSelection) {
              this.isCheckboxSelection = true;
            }

            if (colDef.hide == 'true' || colDef.field == 'checkbox') {
              this.noOfHiddenCols++;
            }

            return {
              pinned: colDef.field == 'actions' && columns.length > 7 ? 'right' : null,
              filter: 'agTextColumnFilter',
              sortable: true,
              resizable: true,
              floatingFilter: false,
              /* checkboxSelection: false, */
              enableRowGroup: true,
              enableValue: true,
              unSortIcon: true,
              showOnGrid: colDef?.hide == true ? false : true,
              ...colDef,
              headerName: this.apsTranslatePipe.transform(colDef.headerName),
            };
          });

          this.columnDefs = colDefs;

          if (this.gridApi) {
            this.gridApi.setColumnDefs(colDefs);
          }
          if (this.supressAutoFit === undefined) {
            this.supressAutoFit = colDefs.length > 7;
          }

          this.fitColumns();

          if (this.rowDefUrl) {
            if (this.gridOptions && this.gridOptions.treeData) {
              this.httpService
                .httpPost(this.rowDefUrl, this.rowDefReq ? this.rowDefReq : {})
                .subscribe((resData: any) => {
                  const fakeServer = createFakeServer(
                    resData,
                    this.gridOptions.autoGroupColumnDef.field,
                  );

                  const dataSource = createServerSideDataSource(fakeServer);
                  this.gridApi.setServerSideDatasource(dataSource);

                  if (this.agGridOptions.pagination) {
                    let numberOfRecords = 0;
                    for (let i = 0; i < resData.length; i++) {
                      numberOfRecords += this.numberOfTreeNodes(resData[i]) + 1;
                    }

                    this.numberOfRecords = numberOfRecords;

                    // this.setPages();
                  }
                  this.rowData = resData;

                  if (this.isCheckboxSelection) {
                    this.rowData = this.rowData.map((data: any) => {
                      return { checkboxChecked: false, ...data };
                    });
                  }

                  this.loadingData = false;
                });
            } else {
              if (this.gridApi) {
                this.gridApi.setServerSideDatasource(this.ServerSideDataSource(this.httpService));
              }
            }
          } else {
            this.numberOfRecords = this.agGridOptions.rowData
              ? this.agGridOptions.rowData.length
              : 0;

            this.rowData = this.agGridOptions.rowData;

            if (this.isCheckboxSelection) {
              this.rowData =
                this.rowData && this.rowData?.length > 0
                  ? this.rowData.map((data: any) => {
                      return { checkboxChecked: false, ...data };
                    })
                  : [];
            }

            this.loadingData = false;

            // this.setPages();
          }
          this.gridReady.emit(this.gridApi);
        });
    } else {
      this.gridReady.emit(this.gridApi);

      if (this.agGridOptions.pagination) {
        this.numberOfRecords = this.agGridOptions.rowData ? this.agGridOptions.rowData.length : 0;
        // this.setPages();
      }
    }
  }

  numberOfTreeNodes(data: any): number {
    let sum = 0;

    if (!data.children) {
      return sum;
    }

    const n = data.children.length;

    for (let i = 0; i < n; i++) {
      sum = sum + data.children.length;

      this.numberOfTreeNodes(data.children[i]);
    }

    return sum;
  }

  ServerSideDataSource(httpService: HttpService) {
    this.gridApi.hideOverlay();

    return {
      getRows: (params: any) => {
        params.request.entityName = this.entityName;
        if (this.rowDefReq) {
          params.request.dataMap = this.rowDefReq;
        }
        httpService.httpPost(this.rowDefUrl, params.request).subscribe((response: any) => {
          let rowData = response.dataList
            ? response.dataList
            : response.data
            ? response.data
            : response;
          params.success({
            rowData: rowData,
            rowCount: response.lastRow
              ? response.lastRow
              : response.dataList
              ? response.dataList.length
              : response.data
              ? response.data.length
              : response.length,
          });

          if (rowData.length <= 0) {
            this.gridApi.showNoRowsOverlay();
          }

          if (this.agGridOptions.pagination) {
            this.numberOfRecords = response.lastRow
              ? response.lastRow
              : response.dataList
              ? response.dataList.length
              : response.data
              ? response.data.length
              : response.length;

            // this.setPages();
          }

          this.rowData = rowData;

          if (this.isCheckboxSelection) {
            this.rowData = this.rowData.map((data: any) => {
              return { checkboxChecked: false, ...data };
            });
          }

          this.loadingData = false;
        });
      },
    };
  }

  private getTreeData(groupKeys: any[], data: any) {
    if (groupKeys.length === 0) {
      return data.map((d: any) => {
        const newData = {
          group: d.children && d.children.length > 0,
          ...d,
        };

        if (d.children && d.children.length > 0) {
          delete newData.children;
        }

        return newData;
      });
    }

    const key = groupKeys[0];

    for (let i = 0; i < data.length; i++) {
      if (data[i][this.agGridOptions.autoGroupColumnDef.field] === key) {
        return this.getTreeData(groupKeys.slice(1), data[i].children.slice());
      }
    }
  }

  updateGridOptions(option: string, value: any) {
    this.agGridOptions[option] = value;
  }

  setRowData(rowData: any[]) {
    if (this.viewport != 'mobile') {
      if (this.gridApi) {
        this.gridApi.setRowData(rowData);

        if (this.agGridOptions.pagination) {
          this.numberOfRecords = rowData ? rowData.length : 0;
          // this.setPages();
        }
      }
    } else {
      this.rowData = rowData;
      if (this.isCheckboxSelection) {
        this.rowData = this.rowData.map((data: any) => {
          return { checkboxChecked: false, ...data };
        });
      }
    }
  }

  getAllRows() {
    if (this.viewport != 'mobile') {
      let rowData = [];
      if (this.gridApi) {
        this.gridApi.forEachNode((node: any) => rowData.push(node.data));
      }
      return rowData;
    } else {
      return this.rowData;
    }
  }

  updateRowDataByIndex(rowIndex: number, rowData: any) {
    if (this.viewport != 'mobile') {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
      if (rowData.group) {
        rowNode.group = true;
      }
      rowNode.setData(rowData);
    } else {
      this.rowData[rowIndex] = rowData;
      if (this.isCheckboxSelection) {
        this.rowData[rowIndex].checkboxChecked = false;
      }
    }
  }

  updateRowDataById(rowId: number, rowData: any) {
    if (this.viewport != 'mobile') {
      const rowNode = this.gridApi.getRowNode(rowId);
      rowNode.setData(rowData);
    } else {
      const index = this.rowData.findIndex((data: any) => data.id == rowId);
      if (index >= 0) {
        this.rowData[index] = rowData;
        if (this.isCheckboxSelection) {
          this.rowData[index].checkboxChecked = false;
        }
      }
    }
  }

  onRowSelected(e: any) {
    this.rowSelected.emit(e);
  }

  onRowDragEnd(e: any) {
    this.rowDragEnd.emit(e);
  }

  getSelectedRows() {
    if (this.viewport != 'mobile') {
      return this.gridApi.getSelectedRows();
    } else {
      return this.rowData.filter((data: any) => data.checkboxChecked);
    }
  }

  selectRow(data: any, key: string) {
    if (this.viewport != 'mobile') {
      this.agGridOptions?.api?.forEachNode((node: any) => {
        if (node.data[key] === data[key]) {
          node.setSelected(true);
        }
      });
    } else {
      this.rowData.forEach((rData: any, i: number) => {
        if (rData.data[key] === data[key]) {
          this.rowData[i].checkboxChecked = true;

          this.onRowSelected({
            data: this.rowData[i],
            rowIndex: i,
            node: { data: this.rowData[i], selected: true, rowIndex: i },
            context: this.gridOptions.context,
          });
        }
      });
    }
  }

  selectRowsByIds(ids: string[]) {
    ids.forEach((id: string) => {
      if (this.viewport != 'mobile') {
        this.agGridOptions.api.forEachNode((node: any) => {
          if (node.data.id == id) {
            node.setSelected(true);
          }
        });
      } else {
        const index = this.rowData.findIndex((data: any) => data.id == id);
        if (index >= 0) {
          this.rowData[index].checkboxChecked = true;

          this.onRowSelected({
            data: this.rowData[index],
            rowIndex: index,
            node: { data: this.rowData[index], selected: true, rowIndex: index },
            context: this.gridOptions.context,
          });
        }
      }
    });
  }

  unselectRowsByIds(ids: string[]) {
    ids.forEach((id: string) => {
      if (this.viewport != 'mobile') {
        this.agGridOptions.api.forEachNode((node: any) => {
          if (node.data.id == id) {
            node.setSelected(false);
          }
        });
      } else {
        const index = this.rowData.findIndex((data: any) => data.id == id);
        if (index >= 0) {
          this.rowData[index].checkboxChecked = false;

          this.onRowSelected({
            data: this.rowData[index],
            rowIndex: index,
            node: { data: this.rowData[index], selected: false, rowIndex: index },
            context: this.gridOptions.context,
          });
        }
      }
    });
  }

  selectAllRow() {
    if (this.viewport == 'mobile') {
      this.rowData = this.rowData.map((data: any, i: number) => {
        data.checkboxChecked = true;
        this.onRowSelected({
          data,
          rowIndex: i,
          node: { data, selected: true, rowIndex: i },
          context: this.gridOptions.context,
        });
        return data;
      });
    } else {
      this.agGridOptions?.api?.selectAll();
    }
  }

  deselectAllRow() {
    if (this.viewport == 'mobile') {
      this.rowData = this.rowData.map((data: any, i: number) => {
        data.checkboxChecked = false;
        this.onRowSelected({
          data,
          rowIndex: i,
          node: { data, selected: false, rowIndex: i },
          context: this.gridOptions.context,
        });
        return data;
      });
    } else {
      this.agGridOptions?.api?.deselectAll();
    }
  }

  onMobileRowSelect(i: number, isChecked: boolean) {
    if (this.gridOptions.rowSelection == 'single') {
      this.rowData = this.rowData.map((data: any, j: number) => {
        if (data.checkboxChecked) {
          data.checkboxChecked = false;

          this.onRowSelected({
            data,
            rowIndex: j,
            node: { data, selected: false, rowIndex: j },
            context: this.gridOptions.context,
          });
        }

        return data;
      });
    }

    if (this.isCheckboxSelection) {
      this.rowData[i].checkboxChecked = !isChecked;
      const data = this.rowData[i];

      this.onRowSelected({
        data,
        rowIndex: i,
        node: { data, selected: !isChecked, rowIndex: i },
        context: this.gridOptions.context,
      });
    }
  }

  onExportToExcel() {
    if (this.gridApi) {
      this.gridApi.exportDataAsExcel();
    }
  }

  onFirstDataRendered(params: any) {
    this.fitColumns();

    const model = this.gridApi.getFilterModel();

    // Sets the filter model via the grid API
    this.gridApi.setFilterModel(model);

    this.firstDataRendered.emit(params);
  }

  changeFloatFilter(floatingFilter: boolean) {
    let cols: ColDef[] = this.gridApi.getColumnDefs();
    this.defaultColDef.floatingFilter = floatingFilter;

    if (floatingFilter) {
      this.defaultColDef.filter = 'agTextColumnFilter';
    } else {
      this.defaultColDef.filter = true;
    }

    for (let i = 0; i < cols.length; i++) {
      if (i == 0) {
        cols[i].rowDrag = true;
      }
      if (cols[i].filter) {
        cols[i].filter = 'agTextColumnFilter';
        cols[i].floatingFilter = floatingFilter;
      }
    }

    this.columnDefs = cols;

    this.gridApi.setColumnDefs(cols);
  }

  onApplyConfig(colDefs: any[]) {
    this.columnDefs = colDefs;

    const newColDefs = [];

    for (let i = 0; i < colDefs.length; i++) {
      if (colDefs[i].showOnGrid) {
        newColDefs.push(colDefs[i]);
      }
    }

    this.gridApi.setColumnDefs(newColDefs);

    this.fitColumns();
  }

  fitColumns() {
    if (this.viewport === 'web' && this.gridApi && !this.supressAutoFit) {
      this.gridApi.sizeColumnsToFit();
    } else {
      this.autoSizeAll(false);
    }
  }

  autoSizeAll(skipHeader: boolean = false) {
    if (this.gridColumnApi) {
      const allColumnIds: string[] = [];

      this.gridColumnApi.getAllColumns()!.forEach((column: any) => {
        allColumnIds.push(column.getId());
      });

      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    }
  }

  onFilter(filterValue: string) {
    this.gridApi.setQuickFilter(filterValue);
  }

  changePageSize(pgSize) {
    if (this.gridApi) {
      this.pageSize = pgSize;
      this.gridApi.paginationSetPageSize(this.pageSize);
      // this.setPages();
    }
  }

  getData(data: any) {
    return Object.keys(data);
  }

  /*setPages() {
    let pages = [];

    const noOfPages = Math.ceil(this.numberOfRecords / this.pageSize);

    for (let i = 0; i < noOfPages; i++) {
      pages.push({ pageNo: i + 1 });
    }

    this.pages = pages;
  }*/

  /*goToPageNumber(pageNumber: number) {
    this.currentPage = pageNumber;
    this.gridApi.paginationGoToPage(pageNumber);
  }

  goToFirstPage() {
    this.gridApi.paginationGoToFirstPage();
    this.currentPage = 0;
  }

  goToLastPage() {
    this.gridApi.paginationGoToLastPage();
    this.currentPage = this.pages.length - 1;
  }*/

  /*goToPrevious() {
    if (this.currentPage !== 0) {
      this.gridApi.paginationGoToPreviousPage();
      this.currentPage -= 1;
    }
  }*/

  /*goToNext() {
    if (this.currentPage !== this.pages.length - 1) {
      this.gridApi.paginationGoToNextPage();
      this.currentPage += 1;
    }
  }*/
}

function createFakeServer(fakeServerData: any, groupKey: string) {
  function FakeServer(allData: any) {
    this.data = allData;
  }

  FakeServer.prototype.getData = function (request: any) {
    function extractRowsFromData(groupKeys: any[], data: any) {
      if (groupKeys.length === 0) {
        return data.map((d: any) => {
          return {
            group: !!d.children,
            ...d,
          };
        });
      }

      const key = groupKeys[0];

      for (let i = 0; i < data.length; i++) {
        if (data[i][groupKey] === key) {
          return extractRowsFromData(
            groupKeys.slice(1),
            data[i].children ? data[i].children.slice() : [],
          );
        }
      }
    }

    return extractRowsFromData(request.groupKeys, this.data);
  };

  return new FakeServer(fakeServerData);
}

function createServerSideDataSource(fakeServer: any) {
  function ServerSideDataSource(fakeServer: any) {
    this.fakeServer = fakeServer;
  }

  ServerSideDataSource.prototype.getRows = function (params: any) {
    const allRows = this.fakeServer.getData(params.request);

    const request = params.request;

    const doingInfinite = request.startRow != null && request.endRow != null;

    const result = doingInfinite
      ? {
          rowData: allRows ? allRows.slice(request.startRow, request.endRow) : [],
          rowCount: allRows ? allRows.length : 0,
        }
      : { rowData: allRows ? allRows : [] };

    setTimeout(() => {
      params.success(result);
    }, 200);
  };

  return new ServerSideDataSource(fakeServer);
}
