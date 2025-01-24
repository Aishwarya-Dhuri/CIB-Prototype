export interface PersonalizationTab {
  name: string;
  displayName: string;
  icon?: string;
  dataObjs?: string[];
  isActive: boolean;
  isHover: boolean;
  subTabs: PersonalizationSubTab[];
}

export interface PersonalizationSubTab {
  name: string;
  isEdit: boolean;
  isExpand: boolean;
  templateName: string;
}
