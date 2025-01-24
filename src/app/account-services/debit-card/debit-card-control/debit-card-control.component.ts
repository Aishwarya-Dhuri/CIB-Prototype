import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { DebitCardControl } from './@models/debit-card-control.model';
import { cloneDeep } from 'lodash';
import { ToasterService } from 'src/app/shared/@services/toaster.service';

@Component({
  selector: 'app-debit-card-control',
  templateUrl: './debit-card-control.component.html',
  styleUrls: ['./debit-card-control.component.scss'],
})
export class DebitCardControlComponent implements OnInit {
  formData: DebitCardControl = new DebitCardControl();
  oldFormData: DebitCardControl = new DebitCardControl();
  mode: string;
  listType: string;
  isBlockCardModal: boolean = false;

  treeData: any[] = [
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Initiation',
          subHeader: '',
          active: true,
          partiallyActive: false,
          disabled: false,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: false,
          header: 'Authorization',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
    {
      type: 'single',
      nodes: [
        {
          isLeafNode: true,
          header: 'Update',
          subHeader: '',
          active: false,
          partiallyActive: false,
          disabled: true,
        },
      ],
    },
  ];

  changePinTreeData: any[] = this.treeData;
  switchPrimaryAccountTreeData: any[] = this.treeData;
  blockCardTreeData: any[] = [this.treeData[0], this.treeData[2]];
  cardLimitControlTreeData: any[] = this.treeData;
  merchantCardControlTreeData: any[] = this.treeData;

  stepperDetails: Stepper = {
    masterName: 'Manage Card',
    stepperType: 'vertical',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Card Details',
      'Change Pin',
      'Switch Primary Account',
      'Block Card / Report Fraud / Dispute',
      'Debit Card Active / Inactive',
      'Card / Limit Control',
      'Merchant Card Control Group Setting',
      'Review and Submit',
    ],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private viewService: ViewService,
    private httpService: HttpService,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Debit Card Control - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Debit Card' },
      { label: 'Card Control' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    const extraData = this.viewService.getExtraData().link;
    this.listType = this.viewService.getExtraData().displayName;
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      console.log(this.viewService.getId());

      let url = 'accountServices/debitCard/debitCardControl/private/view';
      if (this.listType == 'Card List') {
        url = 'accountServices/debitCard/private/view';
      }

      this.httpService.httpPost(url, data).subscribe((formData: DebitCardControl) => {
        delete formData['groupId'];
        delete formData['corporateId'];

        if (this.listType != 'Card List') {
          this.stepperDetails.headings = [
            'Card Details',
            'Change Pin',
            formData['requestFor'],
            'Review and Submit',
          ];
        }

        this.viewService.clearAll();

        this.formData.changePin[0] = {
          ...this.formData.changePin[0],
          // ...formData.changePin[0],
        };
        if (formData?.switchPrimaryAccount) {
          this.formData.switchPrimaryAccount[0] = {
            ...this.formData.switchPrimaryAccount[0],
            ...formData.switchPrimaryAccount[0],
          };
        }
        if (formData?.blockCard) {
          this.formData.blockCard[0] = {
            ...this.formData.blockCard[0],
            ...formData.blockCard[0],
          };
        }
        if (formData?.cardActiveInactive) {
          this.formData.cardActiveInactive[0] = {
            ...this.formData.cardActiveInactive[0],
            ...formData.cardActiveInactive[0],
          };
        }
        if (formData?.limitControl) {
          this.formData.limitControl[0] = {
            ...this.formData.limitControl[0],
            ...formData.limitControl[0],
          };
        }
        if (formData?.merchantCardControlGroupSetting) {
          this.formData.merchantCardControlGroupSetting[0] = {
            ...this.formData.merchantCardControlGroupSetting[0],
            ...formData.merchantCardControlGroupSetting[0],
          };
        }

        delete formData.changePin;
        delete formData.switchPrimaryAccount;
        delete formData.blockCard;
        delete formData.cardActiveInactive;
        delete formData.limitControl;
        delete formData.merchantCardControlGroupSetting;

        this.formData = {
          ...this.formData,
          ...formData,
        };

        if (formData.changeInfo) {
          this.oldFormData = cloneDeep(JSON.parse(formData.changeInfo));
        } else {
          this.oldFormData = cloneDeep(this.formData);
        }

        if (this.mode == 'VIEW') {
          this.stepperDetails.currentStep = this.stepperDetails.headings.length;
        } else if (this.mode != 'VIEW' && extraData) {
          if (extraData === 'viewCardDetails') {
            this.stepperDetails.currentStep = 1;
          } else if (extraData === 'changePin') {
            this.stepperDetails.currentStep = 2;
          } else if (extraData === 'switchPrimaryAccount') {
            this.stepperDetails.currentStep = 3;
          } else if (extraData === 'blockCard') {
            this.stepperDetails.currentStep = 4;
          } else if (extraData === 'activeInactive') {
            this.stepperDetails.currentStep = 5;
          } else if (extraData === 'cardLimitControl') {
            this.stepperDetails.currentStep = 6;
          } else if (extraData === 'merchantCardControl') {
            this.stepperDetails.currentStep = 7;
          }
        }
      });
    }
  }

  onStepChange(stepNo: number) {
    if (stepNo == 3) {
      const formKeys = Object.keys(this.formData.changePin[0]);
      formKeys.forEach((key: string) => {
        if (
          key != 'isChanged' &&
          this.formData.changePin[0][key] != this.oldFormData.changePin[0][key]
        ) {
          this.formData.changePin[0].isChanged = true;
        }
      });
      if (this.formData.changePin[0].isChanged) {
        this.formData.changedTabs.push('changePin');
      }
    } else if (stepNo == 4) {
      const formKeys = Object.keys(this.formData.switchPrimaryAccount[0]);
      formKeys.forEach((key: string) => {
        if (
          key != 'isChanged' &&
          this.formData.switchPrimaryAccount[0][key] !=
            this.oldFormData.switchPrimaryAccount[0][key]
        ) {
          this.formData.switchPrimaryAccount[0].isChanged = true;
        }
      });
      if (this.formData.switchPrimaryAccount[0].isChanged) {
        this.formData.changedTabs.push('switchPrimaryAccount');
      }
    } else if (stepNo == 5) {
      const formKeys = Object.keys(this.formData.blockCard[0]);
      formKeys.forEach((key: string) => {
        if (
          key != 'isChanged' &&
          this.formData.blockCard[0][key] != this.oldFormData.blockCard[0][key]
        ) {
          this.formData.blockCard[0].isChanged = true;
        }
      });
      if (this.formData.blockCard[0].isChanged) {
        this.formData.changedTabs.push('blockCard');
      }
    } else if (stepNo == 6) {
      const formKeys = Object.keys(this.formData.cardActiveInactive[0]);
      formKeys.forEach((key: string) => {
        if (
          key != 'isChanged' &&
          this.formData.cardActiveInactive[0][key] != this.oldFormData.cardActiveInactive[0][key]
        ) {
          this.formData.cardActiveInactive[0].isChanged = true;
        }
      });
      if (this.formData.cardActiveInactive[0].isChanged) {
        this.formData.changedTabs.push('cardActiveInactive');
      }
    } else if (stepNo == 7) {
      const formKeys = Object.keys(this.formData.limitControl[0]);
      formKeys.forEach((key: string) => {
        if (
          key != 'isChanged' &&
          this.formData.limitControl[0][key] != this.oldFormData.limitControl[0][key]
        ) {
          this.formData.limitControl[0].isChanged = true;
        }
      });
      if (this.formData.limitControl[0].isChanged) {
        this.formData.changedTabs.push('limitControl');
      }
    } else if (stepNo == 8) {
      const formKeys = Object.keys(this.formData.merchantCardControlGroupSetting[0]);
      formKeys.forEach((key: string) => {
        if (
          key != 'isChanged' &&
          this.formData.merchantCardControlGroupSetting[0][key] !=
            this.oldFormData.merchantCardControlGroupSetting[0][key]
        ) {
          this.formData.merchantCardControlGroupSetting[0].isChanged = true;
        }
      });
      if (this.formData.merchantCardControlGroupSetting[0].isChanged) {
        this.formData.changedTabs.push('merchantCardControlGroupSetting');
      }
    }

    return true;
  }

  onAccountSelectionChange(selectedAccountId: any) {
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList')
      .subscribe((res) => {
        this.formData.switchPrimaryAccount[0].primaryAccountDisplayName = res.dataList.find(
          (account) => account.id === selectedAccountId,
        ).displayName;
        this.formData.primaryAccountDisplayName =
          this.formData.switchPrimaryAccount[0].primaryAccountDisplayName;
      });
  }

  beforeSubmit(): boolean {
    this.formData.changeInfo = JSON.stringify(this.oldFormData);
    this.formData.isBlockCard = this.formData.blockCard[0].isBlockCard;
    this.formData['listingType'] = this.listType;
    return true;
  }

  afterSubmit(response): boolean {
    if (response.responseStatus.message === 'MSG_KEY_EXISTING_RECORD') {
      this.toasterService.showToaster({
        severity: 'warn',
        detail: 'Request is already Exist',
      });
      return false;
    } else {
      return true;
    }
  }
  unblockCard(id): void {
    this.isBlockCardModal = true;
  }
  accept() {}
  cancel() {}

  // validateForm(stepNo: number): boolean {
  //   if (stepNo == 1 && this.step1Form) {
  //     return this.step1Form.valid;
  //   } else if (stepNo == 2 && this.step2Form) {
  //     return this.step2Form.valid;
  //   }
  //   return true;
  // }
}
