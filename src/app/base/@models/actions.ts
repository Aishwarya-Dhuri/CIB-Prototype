import { TemplateRef } from '@angular/core';

export interface Actions {
  heading?: string;
  subHeading?: string;
  refresh?: boolean;
  download?: boolean;
  print?: boolean;
  relationshipManager?: boolean;
  quickLinks?: boolean;
  backBtn?: boolean;
  subHeadingLink?: string;
  favourite?: boolean;
  help?: boolean;
  componentRef?: any;
  extraActionTemplateRef?: TemplateRef<any>;
}
