import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/@services/http.service';
import { Stepper } from '../../../shared/@components/stepper/@model/stepper.model';
import { Actions } from '../../../base/@models/actions';
import { Breadcrumb } from '../../../base/main/@models/breadcrumb.model';
import { ActionService } from '../../../base/main/@services/action.service';
import { BreadcrumbService } from '../../../base/main/@services/breadcrumb.service';
import { MenuService } from '../../../base/main/@services/menu.service';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { VaIssuanceSummaryService } from '../va-issuance/@services/va-issuance-summary.service';

@Component({
  selector: 'app-va-limit-enhancement',
  templateUrl: './va-limit-enhancement.component.html',
  styleUrls: ['./va-limit-enhancement.component.scss'],
})
export class VaLimitEnhancementComponent implements OnInit, OnDestroy {
  showSearch = true;
  URL_CONST = {
    ISSUANCE_VIEW: 'vam/vamSetup/virtualAccountIssuance/private/view',
    GET_VAACCOUNT_DATA: 'vam/vamSetup/vaLimitEnhancement/private/getVaAccountData',
  };
  vaIssuanceData: any = {};
  vaAccountData: any = {};

  stepperDetails: Stepper = {
    masterName: 'Virtual Account Limit Enhancement',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Virtual Account Details', 'Review and Submit'],
    isOnlyFooter: true,
  };

  formData = {
    vAIssuanceid: '',
    vAIssuanceAccountId: '',
    vaAllocatedLimit: '',
    vaAdhocLimit: '',
    vaDescription: '',
    vaExpiryDate: '',
    virtualAccountNo: '',
    subEntityName: '',
    corporateAccount: '',
  };

  mode: string;
  searchAction = '';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private menuService: MenuService,
    private viewService: ViewService,
    private vaIssuanceSummaryService: VaIssuanceSummaryService,
    private httpService: HttpService,
  ) {}

  ngOnDestroy(): void {
    this.vaIssuanceSummaryService.selectedVA = undefined;
  }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Va Limit Enhancement',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    //VAM - > POBO->Corporate Virtual Account Issuance->Initiate
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'pi pi-home' },
      { label: 'VAM' },
      { label: 'POBO' },
      { label: 'Va Limit Enhancement ' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.menuService.setSelectedServiceUrl('vam/vamSetup/vaLimitEnhancement');
    /* remove below : ends */
    this.getViewData();
    //vaIssuanceSummaryService.selectedVA
    if (this.vaIssuanceSummaryService.selectedVA) {
      this.actionClick({ id: this.vaIssuanceSummaryService.selectedVA.id, action: 'SEARCH_INIT' });
    }
  }

  actionClick(data) {
    this.showSearch = false;
    console.log(data);
    this.searchAction = data.action;
    this.idViewMode();
    this.getVaAccountData(data.id);
  }

  idViewMode() {
    if (this.mode === 'VIEW' || this.searchAction === 'SEARCH_VIEW') {
      this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      this.mode = 'VIEW';
    } else {
      this.stepperDetails.currentStep = 1;
    }
  }

  validateForm(stepNo: number): boolean {
    return true;
  }

  private getViewData() {
    const id = this.viewService.getId();
    this.mode = this.viewService.getMode();
    if (this.mode) {
      this.showSearch = false;
      this.idViewMode();
    }
    this.viewService.clearAll();
    if (id) {
      this.httpService
        .httpPost(this.menuService.getSelectedServiceUrl() + '/private/view', { dataMap: { id } })
        .subscribe((data) => {
          this.formData = data;
          this.getVaAccountData(data.vAIssuanceAccountId);
        });
    } else console.log('Id not found');
  }

  private getVaAccountData(id) {
    if (id) {
      this.httpService
        .httpPost(this.URL_CONST.GET_VAACCOUNT_DATA, { dataMap: { id } })
        .subscribe((res) => {
          this.vaAccountData = res;
          if (this.searchAction.includes('SEARCH')) {
            this.formData.vAIssuanceid = res.mstId;
            this.formData.vAIssuanceAccountId = res.id;
            this.formData.vaAllocatedLimit = res.vaAllocatedLimit;
            this.formData.vaAdhocLimit = res.vaAdhocLimit;
            this.formData.vaExpiryDate = res.vaExpiryDate;
            this.formData.virtualAccountNo = res.virtualAccountNo;
            this.formData.vaDescription = res.vaDescription;
          }

          console.log('mstId', res.mstId); // vaIssuanceId
          this.getVaIssuanceData(res.mstId);
        });
    } else console.log('Id not found');
  }

  private getVaIssuanceData(id) {
    this.httpService
      .httpPost(this.URL_CONST.ISSUANCE_VIEW, { dataMap: { id } })
      .subscribe((res) => {
        this.vaIssuanceData = res;
        // if (this.mode === "VIEW") {
        this.formData.subEntityName = res.subEntityName;
        this.formData.corporateAccount = res.corporateAccount;
        // }
      });
  }
}
