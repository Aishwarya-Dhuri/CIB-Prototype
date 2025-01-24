import { CorporateUser } from 'src/app/setup/security/corporate-user/@models/user.model';

export interface Personalization {
  userDetails?: CorporateUser;
  defaultLanguageDetails?: DefaultLanguage;
  widgetMappingDetails?: WidgetMapping[];
  themeSelectionDetails?: ThemeSelection;
  alertsAndNotificationsDetails?: AlertsAndNotifications[];
  makerCheckerLimitDetails?: MakerCheckerLimits[];
  authMatrixInfoDetails?: ProductWiseAuthMatrix[];
  accountWiseAccessInfoDetails?: AccountWiseAccessInfo;
}

export interface Address {
  id?: string;
  contactNo?: string;
  faxNo?: string;
  emailId?: string;
  address1?: string;
  address2?: string;
  address3?: string;
}

export interface UserAddress extends Address {
  isEdit?: boolean;
  isExpand?: boolean;
}

export interface GridHeader {
  headerName?: string;
  field?: string;
  headerClass?: string;
  cellRenderer?: string;
  width?: number;
  children?: GridHeader[];
}

export interface LoginRestrictionData {
  id?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
}

export interface LoginRestrictions {
  isEdit?: boolean;
  isExpand?: boolean;
  headers?: GridHeader[];
  data?: LoginRestrictionData[];
}

export interface SecurityCriteria {
  isEdit?: boolean;
  isExpand?: boolean;
  ipMappingRestriction?: string;
  userTypeHeader?: string;
}

export interface CorporateMain {
  isExpand?: boolean;
  isEdit?: boolean;
  groupName?: string;
  corporateCode?: string;
  corporateName?: string;
  CID?: string;
  holdingCompany?: string;
  parentName?: string;
}

export interface RegisteredOfficeLocation extends Address {
  registeredOfficeLocation?: string;
  corporateBranch?: string;
}

export interface CorporateOfficeLocation extends Address {
  corporateOfficeLocation?: string;
}

export interface Office {
  isExpand?: boolean;
  isEdit?: boolean;
  registeredOfficeLocationDetails?: RegisteredOfficeLocation;
  corporateOfficeLocationDetails?: CorporateOfficeLocation;
}

export interface AntiPhishing {
  isExpand?: boolean;
  isEdit?: boolean;
  image?: string;
  message?: string;
}

export interface DefaultLanguage {
  isExpand?: boolean;
  isEdit?: boolean;
  defaultLanguage?: string;
}

export interface Widget {
  name?: string;
  description?: string;
  isSelected?: boolean;
  type?: string;
}

export interface WidgetDetails {
  [key: string]: any;
}

export interface WidgetMapping {
  name?: string;
  isExpand?: boolean;
  widgets?: WidgetDetails[];
}

export interface ThemeSelection {
  isExpand?: boolean;
  isEdit?: boolean;
  isLightMode?: boolean;
  theme?: string;
}

export interface Alert {
  id?: string;
  corporateId: string;
  alertCode: string;
  alertName: string;
  moduleId: string;
  moduleName: string;
  categoryId: string;
  categoryCode: string;
  category: string;
  eventId: string;
  eventName: string;
  email: boolean;
  channelType: string[];
  sms: boolean;
  online: boolean;
  sendAlertTo: string[];
  bank: boolean;
  sponsor: boolean;
  nonSponsor: boolean;
  corporate: boolean;
  frequency: string;
  alertTime: string;
  status: string;
  alertText: string;
  smsText: string;
  onlineText: string;
  actions?: any;
}

export interface AlertsAndNotifications {
  moduleId?: string;
  moduleName?: string;
  isExpand?: boolean;
  alerts: Alert[];
}

export interface MakerCheckerLimits {
  id?: string;
  product?: string[];
  makerAllottedLimit?: string;
  makerAvailableLimit?: string;
  checkerAllottedLimit?: string;
  checkerAvailableLimit?: string;
}

export interface ProductWiseAuthMatrix {
  productId: number;
  productName: string;
  authMatrixData: AuthMatrix[];
}

export interface AuthMatrix {
  id: number;
  product: string;
  accounts: string[];
  slab: string;
  authType: string;
  additionalInfo: string;
}

export interface AccountToggle {
  no?: string;
  isExpand?: boolean;
}

export interface ProductAccountAccess {
  id?: string;
  subProduct?: string[];
  accounts?: string;
  rights?: string;
}

export interface ProductWiseAccountAccess {
  label: string;
  count: number;
  id: string;
  isExpand: boolean;
  subProducts: SubProductWiseAccountAccess[];
}

export interface SubProductWiseAccountAccess {
  id: string;
  subProduct: string[];
  accounts: string;
  rights: string;
}

export interface AccountWiseAccountAccess {
  label: string;
  count: number;
  products: AccountProductWiseAccountAccess[];
  id: string;
  isExpand: boolean;
}

export interface AccountProductWiseAccountAccess {
  id: string;
  product: string[];
  subProduct: string;
  rights: string;
}

export interface AccountWiseAccessInfo {
  productWiseAccountAccessDetails?: ProductWiseAccountAccess[];
  accountWiseAccountAccessDetails?: AccountWiseAccountAccess[];
}
