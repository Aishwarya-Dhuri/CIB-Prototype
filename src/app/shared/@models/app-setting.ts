export class AppSetting {
  id!: string | number;
  version!: string | number;
  bankLogoFileName: string;
  menuType: 'sidebar' | 'static' | 'slim' | 'overlay' | 'horizontal' | 'mobile';
  pinnedMenu: boolean;
  themeId: string | number;
  islamicThemeId: string | number;
  isDarkTheme: boolean;
  formCardBorderRadius: string;
  formControlStyle: 'style1' | 'style2' | 'style3' | 'style4';
  iconStyle: 'far' | 'fal' | 'fas' | 'fad';
  buttonBorderRadius: string;
  is3dButton: boolean;
  toasterPosition:
    | 'top-center'
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'center';
  toasterTimeInMiliSec:
    | 1
    | 3000
    | 5000
    | 7000
    | 10000
    | 15000
    | 20000
    | 25000
    | 30000
    | 45000
    | 60000;
  fontId: string | number;
  fontSize: number;

  constructor() {
    this.bankLogoFileName = 'default-bank-logo.png';
    this.menuType = 'sidebar';
    this.pinnedMenu = false;
    this.themeId = 'default';
    this.islamicThemeId = 'defaultIslamic';
    this.isDarkTheme = false;
    this.formCardBorderRadius = '6px';
    this.formControlStyle = 'style1';
    this.iconStyle = 'fal';
    this.buttonBorderRadius = '4px';
    this.is3dButton = false;
    this.toasterPosition = 'top-center';
    this.toasterTimeInMiliSec = 5000;
    this.fontId = '';
    this.fontSize = 16;
  }
}

export class ExtraSetting {
  isHeaderExpanded: boolean;
  direction: 'ltr' | 'rtl';

  constructor() {
    this.isHeaderExpanded = false;
    this.direction = 'ltr';
  }
}

export class Theme {
  id!: string | number;
  version!: string | number;
  name: string;
  themeVariables: ThemeVariable[];

  constructor() {
    this.name = '';
    this.themeVariables = [];
  }
}

export class ThemeVariable {
  id!: string | number;
  version!: string | number;
  variableName: string;
  displayName: string;
  value: string;
  type: string;
  isConfigurable: boolean;
  isAdvanced: boolean;
  category: string;
  drivedFrom?: string;
  rDiff: number;
  gDiff: number;
  bDiff: number;
  tValue?: string | number;

  constructor() {
    this.variableName = '';
    this.displayName = '';
    this.value = '';
    this.type = '';
    this.isConfigurable = false;
    this.isAdvanced = false;
    this.category = '';
    this.rDiff = 0;
    this.gDiff = 0;
    this.bDiff = 0;
  }
}

export class Font {
  id!: string | number;
  version!: string | number;
  name: string;
  fontFileName: string;
  regularFontFileList: any[];
  lightFontFileList: any[];
  semiBoldFontFileList: any[];
  boldFontFileList: any[];
  isLightAsRegular: boolean;
  isSemiBoldAsRegular: boolean;
  isBoldAsRegular: boolean;

  constructor() {
    this.name = '';
    this.fontFileName = '';
    this.regularFontFileList = [];
    this.lightFontFileList = [];
    this.semiBoldFontFileList = [];
    this.boldFontFileList = [];
    this.isLightAsRegular = false;
    this.isSemiBoldAsRegular = false;
    this.isBoldAsRegular = false;
  }
}
