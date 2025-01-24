import { ResponseStatus } from 'src/app/shared/@models/response-status';

export interface Menu_response {
  responseStatus?: ResponseStatus;
  currentDate?: Date;
  modules?: Module[];
  entityIdentifier?: string;
  loggable?: boolean;
}

export class Module {
  index?: number;
  moduleId?: string;
  moduleName?: string;
  menusLink?: string;
  menus?: Menu[];
  icon?: string;
  isLock?: boolean;
  isFullMenu?: boolean;
  isShortMenu?: boolean;
  isDirectLink?: boolean;
  directMenuLink?: string;
  advertisement?: Advertisement[];
  frequentlyUsedMenus?: FrequentlyUsedMenus[];
}

export class Menu {
  //1st level
  id?: string;
  displayName!: string;
  url?: string;
  entityName?: string;
  faIcon?: string;
  menuCategory?: string;
  allowCorporateVsGroup?: string;
  reportServicesOnly?: string;
  access?: string[];
  menus?: Menu[];

  //2rd level
  serviceUrl?: string;
  entityId?: string;
  originalEntity?: string;
  showAccountServicesOnly?: string;
  showInOtherServices?: string;
  belongsTo?: string;
  isCorporateEnable?: string;
  defaultURL?: string;
  menuLinksDetail?: { link?: Link[] };
  isShowLinks?: boolean;
  isUpgraded?: boolean;
  parentName?: string;
  moduleId?: string;
  moduleName?: string;

  icon?: string;
  serviceUrl1?: string;
  dynamicFormId?: string | number;
}

export class Link {
  displayName?: string;
  url?: string;
  access?: string;
  key?: string;
  hide?: string;
  icon?: string;
  serviceUrl?: string;
  entityName?: string;
  id: string;
}

export class Advertisement {
  id!: string;
  advertisement!: string;
  moduleId!: string;
  moduleName!: string;
}

export class FrequentlyUsedMenus {
  id!: string;
  displayName!: string;
  link!: string;
  linkId!: string;
  linkName!: string;
  menuCategoryId!: string;
  menuCategoryName!: string;
  menuId!: string;
  menuName!: string;
  moduleId!: string;
  moduleName!: string;
}
