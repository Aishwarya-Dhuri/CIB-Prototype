export interface StepStatus {
  displayLabel?: string;
  completed?: boolean;
  stepStatus?: 'error' | 'progress' | 'success' | 'repair' | 'amend';
  completePercentage?: number;
  active?: boolean;
  visited?: boolean;
  subSteps?: StepStatus[];
}

export interface Stepper {
  masterName: string;
  stepperType?: 'horizontal' | 'vertical';
  currentStep?: number;
  currentSubStep?: number;
  isOnlyFooter?: boolean;
  isHideStepFooter?: boolean;
  isDynamicFormApplicable?: boolean;
  isSaveDraftApplicable?: boolean;
  isUpdateDraft?: boolean;
  saveAsDraftTemplateRef?: any;
  isSaveAsTemplateApplicable?: boolean;
  isUpdateTemplate?: boolean;
  saveAsTemplateRef?: any;
  isSecondLastStepLabelAsReview?: boolean;
  isAuthMatrixMaster?: boolean;
  isCancelOnRight?: boolean;
  isHideLastStep?: boolean;
  disableStepClick?: boolean;
  lastStepTitle?: string;
  secondLastStepTitle?: string;
  headings: string[];
  steps?: StepStatus[];
}
