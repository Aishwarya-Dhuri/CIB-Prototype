import { Select } from 'src/app/shared/@models/select.model';

export const REPORT_URL_CONSTANT = {
  FILTER_OPERATOR_LIST: 'reports/dummyJsonFiles/getFilterOperatorList',
  SCHEDULE_REPORT_DROPDOWNS: 'reports/dummyJsonFiles/getScheduleReportDropdowns',
  PRODUCT_LIST: 'commons/commonService/private/getProductList',
  CATEGORY_LIST: 'reports/private/getCategoryList',
  SUB_CATEGORY_LIST: 'reports/private/getSubCategoryList',
  REPORT_LIST: 'reports/private/getReportsList',
  REPORT_FIELD_LIST: 'reports/private/getAsGenericFieldData',
  // FILTER_CONDITIONS: 'reports/dummyJsonFiles/getFilterConditions',
  FILTER_CONDITIONS: 'reports/private/getFilterDataList',
  // SORT_CONDITIONS: 'reports/dummyJsonFiles/getSortConditions',
  SORT_CONDITIONS: 'reports/private/getOperatorDataList',
  CREATE: 'reports/private/create',
  VIEW: 'reports/private/view',
  DELETE: 'reports/private/delete',
  ONLINEGRIDCOLDEF: 'reports/private/getOnlineGridColDef',
  ONLINEGRIDDATA: 'reports/private/getOnlineGridData',
};

export class Report {
  id?: string | number;
  version?: string | number;
  product: string | number;
  productId: string | number;
  productName: string | number;
  categoryId: string | number;
  categoryName: string | number;
  subCategoryId: string | number;
  subCategoryName: string | number;
  reportId: string | number;
  reportName: string | number;
  generatedDate: string;

  toDate: string;
  fromDate: string;
  reportFileType: string;
  delimiterType?: string;
  userId: string;
  corporateId: string;

  reportFields: ReportField[];
  filterConditionList: FilterCondition[];
  sortConditionList: SortCondition[];

  isScheduleReport: boolean;
  scheduleReportList: ScheduleReport[];
  reportCategory: string | number;
  reportEntityKey: string;

  constructor() {
    this.product = '';
    this.productId = '';
    this.productName = '';
    this.categoryId = '';
    this.categoryName = '';
    this.subCategoryId = '';
    this.subCategoryName = '';
    this.reportId = '';
    this.reportName = '';
    this.reportEntityKey = '';
    this.generatedDate = '';
    this.toDate = '';
    this.fromDate = '';
    this.reportFileType = '';
    this.delimiterType = '';
    this.userId = '';
    this.corporateId = '';
    this.reportFields = [];
    this.filterConditionList = [];
    this.sortConditionList = [];

    this.isScheduleReport = false;
    this.scheduleReportList = [];
  }
}

export class ReportField {
  id?: string | number;
  version?: string | number;
  mstId?: string | number;
  fieldSequence: number;
  isDependent: boolean;
  isMandatory: boolean;
  propertyName: string;
  columnName: string;
  defaultValue: string;
  labelName: string;
  radioCheckLabel: string;
  value: string | number;
  fieldValueList?: string;
  columnValue?: string | number;
  dataUrl?: string;
  searchColDefUrl?: string;
  searchRowDefUrl?: string;
  selectData?: Select[];

  constructor() {
    this.id = '';
    this.version = '';
    this.mstId = '';
    this.fieldSequence = 1;
    this.isDependent = false;
    this.isMandatory = false;
    this.columnName = '';
    this.radioCheckLabel = '';
    this.defaultValue = '';
    this.propertyName = '';
    this.labelName = '';
    this.value = '';
    this.fieldValueList = '';
    this.columnValue = '';
    this.dataUrl = '';
    this.searchColDefUrl = '';
    this.searchRowDefUrl = '';
    this.selectData = [];
  }
}

export class FilterCondition {
  id?: string | number;
  version?: string | number;
  mstId: string | number;
  filterId: string;
  filterName: string;
  operatorId: string;
  operatorName: string;
  filterValue: string;

  filterList?: Select[];

  constructor() {
    this.id = '';
    this.version = '';
    this.mstId = '';
    this.filterId = '';
    this.filterName = '';
    this.operatorId = '';
    this.operatorName = '';
    this.filterValue = '';
    this.filterList = [];
  }
}

export class SortCondition {
  id?: string | number;
  version?: string | number;
  mstId: string | number;
  order: string;
  sortConditionId: string;
  sortConditionName: string;

  sortList?: Select[];

  constructor() {
    this.id = '';
    this.version = '';
    this.mstId = '';
    this.order = 'ASC';
    this.sortConditionName = '';
    this.sortConditionId = '';

    this.sortList = [];
  }
}

export class ScheduleReport {
  id?: string | number;
  version?: string | number;
  mstId: string | number;

  channelList?: string[];
  channel: string;
  reportFrequencyId: string | number;
  reportFrequencyName: string;
  generatedAtId: string | number;
  generatedAtName: string;
  activationDayId: string | number;
  activationDayName: string;
  reportFormatId: string | number;
  reportFormatName: string;
  startTime: string;
  endTime: string;
  repeatEvery: string;
  scheduleFromDate: string;
  scheduleToDate: string;
  emailIdTypeList?: string[];
  emailIdType: string;
  additionalEmailIds: string;
  downloadFormat: string;

  constructor() {
    this.id = '';
    this.version = '';
    this.mstId = '';
    this.channelList = ['EMAIL'];
    this.channel = '';
    this.reportFrequencyId = '';
    this.reportFrequencyName = '';
    this.generatedAtId = '';
    this.generatedAtName = '';
    this.activationDayId = '';
    this.activationDayName = '';
    this.reportFormatId = '';
    this.reportFormatName = '';
    this.startTime = '10:00';
    this.endTime = '18:00';
    this.repeatEvery = '04:00';
    this.scheduleFromDate = '';
    this.scheduleToDate = '';
    this.emailIdTypeList = ['REGISTERED'];
    this.emailIdType = '';
    this.additionalEmailIds = '';
    this.downloadFormat = 'EXCEL';
  }
}

export class ReportScreenConfig {
  isSidePanelExpand: boolean;
  isSearchExpand: boolean;
  isReportExpand: boolean;
  isFilterExpand: boolean;
  isSortExpand: boolean;
  isScheduleApplicable: boolean;

  constructor() {
    this.isSidePanelExpand = true;
    this.isSearchExpand = true;
    this.isReportExpand = false;
    this.isFilterExpand = false;
    this.isSortExpand = false;
    this.isScheduleApplicable = false;
  }
}
