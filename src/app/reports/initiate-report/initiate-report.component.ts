import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import {
  FilterCondition,
  Report,
  ReportField,
  ReportScreenConfig,
  REPORT_URL_CONSTANT,
  ScheduleReport,
  SortCondition,
} from '../@models/report.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/@services/user.service';
import { ReportService } from '../@services/report.service';
import { SaveCriterialModalComponent } from '../../shared/@components/dynamic-search/@components/save-criterial-modal/save-criterial-modal.component';
import { Subject } from 'rxjs';
import { Criteria } from '../../shared/@components/dynamic-search/@models/criteria.model';
import { ViewService } from '../../shared/services/view-service/view-service';

@Component({
  selector: 'app-initiate-report',
  templateUrl: './initiate-report.component.html',
  styleUrls: ['./initiate-report.component.scss'],
})
export class InitiateReportComponent implements OnInit {
  @ViewChild('saveCriteria') saveCriteria: SaveCriterialModalComponent;
  @Output() isCancelClick = new EventEmitter<boolean>();

  formData: Report = new Report();
  screenConfig: ReportScreenConfig = new ReportScreenConfig();

  categoryList: Select[] = [];
  subCategoryList: Select[] = [];
  reportList: Select[] = [];
  filterOperatorList: Select[] = [];
  private filterConditions: Select[] = [];
  private sortConditions: Select[] = [];

  channelList: Select[] = [];
  reportFrequencyList: Select[] = [];
  generatedAtList: Select[] = [];
  activationDayList: Select[] = [];
  reportFormatList: Select[] = [];
  downloadFormatList: Select[] = [];

  isShowSaveSearchCriteriaModal: boolean;
  isUpdateCriteria: boolean;
  criteriaData: any;
  criteriaDataList: Subject<any> = new Subject<any>();
  criteriaType: string;
  usingCriteria = false;
  private applingCriteria: { reportFields: any; usingCriteria: boolean } = {
    reportFields: {},
    usingCriteria: false,
  };

  selectedFrequentReport;
  recentReports: any;

  constructor(
    private httpService: HttpService,
    protected router: Router,
    private userService: UserService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    protected viewService: ViewService,
    private reportService: ReportService,
  ) {
    this.getParams();
    /* Call below Methods based on URL start */
    // this.onProductChange({ id: 'setup', displayName: 'Setup', enrichments: { productId: '1' } });
    // this.onCategoryChange({ id: 'Generic', displayName: 'Generic' });
    /* Call below Methods based on URL end */
    this.getFilterOperatorList();
    this.getScheduleReportDropdowns();
  }

  ngOnInit(): void {
    this.getRecentReports();
  }

  getParams(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.httpService.httpPost(REPORT_URL_CONSTANT.PRODUCT_LIST).subscribe((response) => {
        const productList = response.dataList;
        let selectedProduct = productList.find(
          (product) => product.enrichments.product === params['product'],
        );

        if (this.viewService.getId()) {
          this.selectedFrequentReport = this.viewService.getExtraData().reportDetails;
          selectedProduct = productList.find(
            (product) => product.id === this.selectedFrequentReport.productId,
          );
          this.viewService.clearAll();
        }

        this.onProductChange(selectedProduct);
      });
    });
  }

  getFilterOperatorList(): void {
    this.httpService.httpPost(REPORT_URL_CONSTANT.FILTER_OPERATOR_LIST).subscribe((res) => {
      this.filterOperatorList = res.dataList;
    });
  }

  getScheduleReportDropdowns(): void {
    this.httpService.httpPost(REPORT_URL_CONSTANT.SCHEDULE_REPORT_DROPDOWNS).subscribe((res) => {
      this.channelList = res.channelList;
      this.reportFrequencyList = res.reportFrequencyList;
      this.generatedAtList = res.generatedAtList;
      this.activationDayList = res.activationDayList;
      this.reportFormatList = res.reportFormatList;
      this.downloadFormatList = res.downloadFormatList;
    });
  }

  toggleMainCard(card: 'isSearchExpand' | 'isReportExpand', isExpand: boolean): void {
    this.screenConfig.isSearchExpand = false;
    this.screenConfig.isReportExpand = false;
    this.screenConfig[card] = isExpand;
  }

  onProductChange(product: Select): void {
    if (product) {
      this.formData.product = product.id;
      this.formData.productId = product.enrichments?.productId;
      this.formData.productName = product.displayName;
      this.resetCategory();
      this.getCategoryList();
    }
  }

  getCategoryList(): void {
    const reqData = { dataMap: { productId: this.formData.productId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.CATEGORY_LIST, reqData).subscribe((response) => {
      this.categoryList = response.dataList;
      let categoryId = this.activatedRoute.params['value'].category;
      let convertedCategoryId = categoryId[0].toUpperCase() + categoryId.slice(1);
      let selectedCategory = this.categoryList.find((res) => res.id === convertedCategoryId);
      if (this.selectedFrequentReport) {
        selectedCategory = this.categoryList.find(
          (res) => res.id === this.selectedFrequentReport.categoryId,
        );
      }
      this.onCategoryChange(selectedCategory);
    });
  }

  onCategoryChange(category: Select): void {
    this.formData.categoryId = category.id;
    this.formData.categoryName = category.displayName;
    this.resetSubCategory();
    if (this.formData.categoryId == 'Generic') {
      this.getSubCategoryList();
      this.screenConfig.isScheduleApplicable = false;
    } else {
      this.getReportList();
      this.screenConfig.isScheduleApplicable = true;
      this.getCriteria();
      this.getRecentReports();
    }
  }

  resetCategory(): void {
    this.formData.categoryId = '';
    this.formData.categoryName = '';
    this.resetSubCategory();
  }

  getSubCategoryList(): void {
    const reqData = {
      dataMap: { productId: this.formData.productId, categoryId: this.formData.categoryId },
    };
    this.httpService.httpPost(REPORT_URL_CONSTANT.SUB_CATEGORY_LIST, reqData).subscribe((res) => {
      this.subCategoryList = res.dataList;
      if (this.selectedFrequentReport) {
        const subCategory = this.subCategoryList.find(
          (res) => res.id === this.selectedFrequentReport.subCategoryId,
        );
        this.onSubCategoryChange(subCategory);
      }
    });
  }

  onSubCategoryChange(subCategory: Select): void {
    this.formData.subCategoryId = subCategory.id;
    this.formData.subCategoryName = subCategory.displayName;
    this.getReportList();
    this.getCriteria();
    this.getRecentReports();
  }

  resetSubCategory(): void {
    this.formData.subCategoryId = '';
    this.formData.subCategoryName = '';
    this.resetReportList();
  }

  getReportList(): void {
    const reqData = {
      dataMap: {
        productId: +this.formData.productId,
        categoryId: this.formData.categoryId,
        subCategoryId: this.formData.subCategoryId,
      },
    };
    this.httpService.httpPost(REPORT_URL_CONSTANT.REPORT_LIST, reqData).subscribe((res) => {
      this.toggleMainCard('isSearchExpand', false);
      this.toggleMainCard('isReportExpand', true);
      this.reportList = res.dataList;
      if (this.selectedFrequentReport) {
        const report = this.reportList.find(
          (res) => res.id === this.selectedFrequentReport.reportId,
        );
        this.getSelectedReportData(report);
        //
      }
    });
  }
  getSelectedReportData(report) {
    const reqData = {
      dataMap: {
        id: this.selectedFrequentReport.id,
      },
    };
    this.httpService.httpPost(REPORT_URL_CONSTANT.VIEW, reqData).subscribe((res) => {
      console.log('report view', res);
      this.selectedFrequentReport = res;
      this.onReportClick(report);
    });
  }
  resetReportList(): void {
    this.reportList = [];
    this.resetReportFieldData();
  }

  onReportClick(report: Select): void {
    this.resetReportFieldData();
    this.formData.reportId = report.id;
    this.formData.reportName = report.displayName;
    this.formData.reportEntityKey = report.enrichments && report.enrichments.reportEntityKey;
    const reqData = { dataMap: { reportId: this.formData.reportId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.REPORT_FIELD_LIST, reqData).subscribe((res) => {
      this.generateReportFields(res.dataList);

      if (this.applingCriteria && this.applingCriteria.usingCriteria) {
        // this.formData.reportFields = {...this.formData.reportFields, ...this.applingCriteria.reportFields};
        this.applingCriteria.usingCriteria = false;
      }
      this.selectedFrequentReport = null; //resetting after setting field values

      this.toggleMainCard('isReportExpand', true);
      this.screenConfig.isFilterExpand = false;
      this.screenConfig.isSortExpand = false;
    });
  }

  generateReportFields(dataList: any): void {
    this.formData.reportFields = [..._.sortBy(dataList, ['fieldSequence'])];
    this.formData.reportFields.forEach((reportField: ReportField) => {
      if (reportField.defaultValue) {
        reportField.value = _.cloneDeep(reportField.defaultValue);
      }
      if (this.applingCriteria.usingCriteria) {
        const field = this.applingCriteria.reportFields.find((r) => r.id === reportField.id).value;
        reportField.value = (field && field.value) || '';
      }
      if (this.selectedFrequentReport) {
        const field = this.selectedFrequentReport.reportFields.find(
          (r) => r.propertyName === reportField.propertyName,
        );
        reportField.value = (field && field.value) || '';
      } else {
        reportField.columnName != 'RADIO' ? (reportField.value = '') : reportField.value;
      }
      if (!reportField.dataUrl && reportField.fieldValueList) {
        reportField.selectData = this.getSelectOptions(reportField.fieldValueList);
      }
    });

    if (this.formData.categoryId == 'Master' || this.formData.categoryId == 'Audit') {
      this.getFilterConditions();
      this.getSortConditions();
    } else {
      this.filterConditions = this.sortConditions = [];
    }
  }

  resetReportFieldData(): void {
    this.formData.reportFields = [];
    this.formData.delimiterType = '';
    this.formData.fromDate = '';
    this.formData.toDate = '';
    this.formData.reportFileType = '';
    this.formData.filterConditionList = [];
    this.formData.sortConditionList = [];
  }

  getFilterConditions(): void {
    this.filterConditions = [];
    const reqData = { dataMap: { reportId: this.formData.reportId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.FILTER_CONDITIONS, reqData).subscribe((res) => {
      this.filterConditions = res.dataList;
      this.formData.filterConditionList.push(new FilterCondition());
      this.formData.filterConditionList[0].filterList = _.cloneDeep(this.filterConditions);
    });
  }

  getSortConditions(): void {
    this.sortConditions = [];
    const reqData = { dataMap: { reportId: this.formData.reportId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.SORT_CONDITIONS, reqData).subscribe((res) => {
      this.sortConditions = res.dataList;
      this.formData.sortConditionList.push(new SortCondition());
      this.formData.sortConditionList[0].sortList = _.cloneDeep(this.sortConditions);
    });
  }

  getSelectOptions(fieldValueList: string): Select[] {
    if (!fieldValueList) return [];
    let options: Select[] = [];
    let optionsStrList = fieldValueList.split(',');
    optionsStrList.forEach((optionStr: string) => {
      let option = optionStr.split(':');
      options.push({ id: option[0], displayName: option[1] });
    });
    return options;
  }

  showSearchModal(field: ReportField): void {
    /* add your search logic here */
  }

  onAddMoreFilter(): void {
    this.formData.filterConditionList.push(new FilterCondition());
    this.formData.filterConditionList[this.formData.filterConditionList.length - 1].filterList =
      _.cloneDeep(this.filterConditions);
  }

  onDeleteFilter(index: number): void {
    if (index == 0) {
      this.formData.filterConditionList[0] = new FilterCondition();
      this.formData.filterConditionList[0].filterList = _.cloneDeep(this.filterConditions);
    } else {
      this.formData.filterConditionList.splice(index, 1);
    }
  }

  isLastFilterInvalid(): boolean {
    const lastFilter: FilterCondition =
      this.formData.filterConditionList[this.formData.filterConditionList.length - 1];
    return !lastFilter.filterId || !lastFilter.operatorId || !lastFilter.filterValue;
  }

  onAddMoreSortCondition(): void {
    this.formData.sortConditionList.push(new SortCondition());
    this.formData.sortConditionList[this.formData.sortConditionList.length - 1].sortList =
      _.cloneDeep(this.sortConditions);
  }

  onDeleteSortCondition(index: number): void {
    if (index == 0) {
      this.formData.sortConditionList[0] = new SortCondition();
      this.formData.sortConditionList[0].sortList = _.cloneDeep(this.sortConditions);
    } else {
      this.formData.sortConditionList.splice(index, 1);
    }
  }

  isLastSortConditionInvalid(): boolean {
    return (
      this.formData.sortConditionList.length == 0 ||
      !this.formData.sortConditionList[this.formData.sortConditionList.length - 1].sortConditionId
    );
  }

  onIsScheduleReportChanged(isScheduleReport: any): void {
    this.formData.scheduleReportList = [];
    this.toggleMainCard('isReportExpand', !isScheduleReport.checked);
    if (isScheduleReport.checked) {
      this.formData.scheduleReportList.push(new ScheduleReport());
    }
  }

  onSubmitClick(): void {
    let reqData = _.cloneDeep(this.formData);
    /* Removing unwanted Filters */
    if (
      reqData.filterConditionList &&
      reqData.filterConditionList.length > 0 &&
      !reqData.filterConditionList[reqData.filterConditionList.length - 1].filterValue
    ) {
      reqData.filterConditionList.splice(reqData.filterConditionList.length - 1, 1);
    }
    /* Removing unwanted Sort Conditions */
    if (
      reqData.sortConditionList &&
      reqData.sortConditionList.length > 0 &&
      !reqData.sortConditionList[reqData.sortConditionList.length - 1].sortConditionId
    ) {
      reqData.sortConditionList.splice(reqData.sortConditionList.length - 1, 1);
    }
    /* Removing unwanted Report Fields data */
    reqData.reportFields.forEach((field: ReportField) => {
      delete field.selectData;
    });
    /* Removing unwanted Filters Fields */
    reqData.filterConditionList.forEach((filter: FilterCondition) => {
      delete filter.filterList;
    });
    /* Removing unwanted Sort Condition Fields */
    reqData.sortConditionList.forEach((sortCondition: SortCondition) => {
      delete sortCondition.sortList;
    });
    /* Removing unwanted ScheduleReport Fields */
    if (reqData.scheduleReportList.length > 0) {
      reqData.scheduleReportList[0].channel = reqData.scheduleReportList[0].channelList
        ? reqData.scheduleReportList[0].channelList.join(',')
        : '';
      reqData.scheduleReportList[0].emailIdType = reqData.scheduleReportList[0].emailIdTypeList
        ? reqData.scheduleReportList[0].emailIdTypeList.join(',')
        : '';
      delete reqData.scheduleReportList[0].channelList;
      delete reqData.scheduleReportList[0].emailIdTypeList;
    }
    reqData.generatedDate = this.userService.getApplicationDate();
    try {
      reqData.fromDate = reqData.reportFields
        .find((d) => d.propertyName == 'fromDate')
        .value.toString();
      reqData.toDate = reqData.reportFields
        .find((d) => d.propertyName == 'toDate')
        .value.toString();
      reqData.delimiterType = reqData.reportFields
        .find((d) => d.propertyName == 'delimiterType')
        .value.toString();
      reqData.reportCategory = reqData.categoryName;
      reqData.reportFileType = reqData.reportFields
        .find((d) => d.propertyName == 'reportFileType')
        .value.toString();
    } catch (e) {
      console.warn(e);
    }

    /* Submit Data to Server */
    this.httpService.httpPost(REPORT_URL_CONSTANT.CREATE, reqData).subscribe((res) => {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Report generated successfully.',
      });
      this.navigateToListing();
    });
  }

  navigateToListing(): void {
    //Use same url just replace last
    // reports/payments/generic
    let product = this.activatedRoute.params['value'].product;
    let reportType = this.activatedRoute.params['value'].category;
    this.router.navigateByUrl('/reports/' + product + '/' + reportType);
  }

  navigateToDashboard(): void {
    //User user service to get default dashboard url then navigate
    this.router.navigateByUrl(this.userService.dashboardRouteUrl);
    this.isCancelClick.emit(true);
  }

  showSaveSearchCriteriaModal(): void {
    // console.log('reportFields', this.formData.reportFields);
    const criteriaData = {
      reportFields: this.formData.reportFields,
      reportId: this.formData.reportId,
      extraData: `${this.formData.productName} | ${this.formData.categoryName} | ${
        this.formData.subCategoryName ? this.formData.subCategoryName + ' | ' : ''
      }${this.formData.reportName}`,
    };
    this.criteriaData = JSON.stringify(criteriaData);
    this.isShowSaveSearchCriteriaModal = true;
  }

  getCriteria() {
    this.criteriaType =
      this.formData.productId + '|' + this.formData.categoryId + '|' + this.formData.subCategoryId;
    const data = {
      dataMap: { entityName: 'REPORT', criteriaType: this.criteriaType }, //, criteriaType: this.criteriaData.criteriaType
    };
    this.httpService
      .httpPost('commons/searchCriteria/private/getCriterias', data)
      .subscribe((response: any) => {
        const list = this.getCriteriaList(response.dataMap.SearchCriteria);
        this.criteriaDataList.next(list);
        this.isUpdateCriteria = false;
      });
    /*setTimeout(()=>{
      // this.saveCriteria.criteriaType = this.criteriaType;
      this.saveCriteria.getCriterias(false);
      this.isUpdateCriteria = false;
    },500)*/
  }

  getCriteriaList(data) {
    return data.map((d) => {
      let criteria = JSON.parse(d.criteria);
      let name = criteria.extraData.split(' | ');
      let productName = name[0];
      let reportDetails = criteria.extraData.replace(productName + ' | ', '');
      return { ...d, criteria, productName, reportDetails };
    });
  }
  onSavedCriteria() {
    if (this.saveCriteria.criteriaList) {
      const list = this.getCriteriaList(this.saveCriteria.criteriaList);
      console.log('onSavedCriteria', list);
      this.criteriaDataList.next(list);
    }
  }

  applyCriteria(criteria: any): void {
    console.log('Apply criteria', criteria);
    let report = this.reportList.find((report) => report.id === criteria.criteria.reportId); //get report obj and call report click
    console.log('selected report', report);
    this.applingCriteria = { usingCriteria: true, reportFields: criteria.criteria.reportFields };
    this.onReportClick(report);
    this.isUpdateCriteria = true;
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    //const data = { "id": criteria.id, "type": "SearchCriteria", "version": criteria.version };
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteria();
    });
  }

  getRecentReports() {
    const filterModel = {
      productId: { filterType: 'text', type: 'equals', filter: this.formData.productId },
      categoryId: { filterType: 'text', type: 'equals', filter: this.formData.categoryId },
    };
    this.reportService.getMostFrequentReports(filterModel).subscribe((reports) => {
      console.log('getRecentReports', reports);
      this.recentReports = reports;
    });
  }

  reuseReport(report: any): void {
    // this.getSelectedReportData
    this.selectedFrequentReport = report;
    this.getReportList();
  }
}
