import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from '../../../../shared/@components/stepper/@model/stepper.model';
import { Select } from '../../../../shared/@models/select.model';
import { ActionService } from '../../../../base/main/@services/action.service';
import { BreadcrumbService } from '../../../../base/main/@services/breadcrumb.service';
import { HttpService } from '../../../../shared/@services/http.service';
import { Router } from '@angular/router';
import { ViewService } from '../../../../shared/services/view-service/view-service';
import { Actions } from '../../../../base/@models/actions';
import { Breadcrumb } from '../../../../base/main/@models/breadcrumb.model';
import { UserService } from '../../../../shared/@services/user.service';
import { NgForm } from '@angular/forms';
import { AgGridListingComponent } from '../../../../shared/@components/ag-grid-listing/ag-grid-listing.component';
import { MenuService } from '../../../../base/main/@services/menu.service';
import { ViewportService } from '../../../../shared/@services/viewport.service';
import { VaIssuanceSummaryService } from '../@services/va-issuance-summary.service';
import { SubEntityInitiateComponent } from '../sub-entity-initiate/sub-entity-initiate.component';

@Component({
  selector: 'app-va-issuance-initiate',
  templateUrl: './va-issuance-initiate.component.html',
  styleUrls: ['./va-issuance-initiate.component.scss'],
})
export class VaIssuanceInitiateComponent implements OnInit {
  @ViewChild('accountDetailsForm') accountDetailsForm: NgForm;
  @ViewChild('formDataForm') formDataForm: NgForm;
  @ViewChild('virtualAccountDetailsForm') virtualAccountDetailsForm: NgForm;
  @ViewChild('vaCorporateClientDetailsForm') vaCorporateClientDetailsForm: NgForm;
  @ViewChild('confimForm') confimForm: NgForm;

  @ViewChild('stepperHeader') stepperHeader!: any;
  @ViewChild('contactDetailsTable') contactDetailsTable: AgGridListingComponent;
  @ViewChild('vaContactDetailsTable') vaContactDetailsTable: AgGridListingComponent;
  @ViewChild('virtualAccountTable') virtualAccountTable: AgGridListingComponent;
  @ViewChild('subEntityInitiateComponent') subEntityInitiateComponent: SubEntityInitiateComponent;

  stepperDetails: Stepper = {
    masterName: 'Corporate Virtual Account Issuance',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: [
      'Account Details',
      'Sub Entity Details',
      'Virtual Account Details',
      'Review and Submit',
    ],
    // isOnlyFooter: true
  };

  URL_CONST = {
    GET_ACCOUNT_LIST: 'setup/corporateOnboarding/corporateMain/private/accountList',
    GET_CORPORATEVASTRUCTURELIST: 'vam/vamSetup/corporateVAStructure/private/getAuthorizedList',
    GET_CORPORATEVASTRUCTURE_VIEW: 'vam/vamSetup/corporateVAStructure/private/view',
    VIEW: 'vam/vamSetup/virtualAccountIssuance/private/view',
    SUB_ENTITY_CREATE: 'vam/vamSetup/subEntity/private/create',
    SEARCH_SUB_ENTITY_CREATE: 'vam/vamSetup/subEntity/private/getPendingList',
    SUB_ENTITY_COL_DEF_URL: 'vam/vamSetup/subEntity/private/searchSubEntityColDef',
    SUB_ENTITY_VIEW: 'vam/vamSetup/subEntity/private/view',
  };

  formData: any = {
    corporateAccountId: '',
    corporateAccount: '',
    structureCreationFor: '',
    subEntityCode: '',
    subEntityName: '',
    subEntityAliasName: '',
    subEntityUniqueID: '',
    subEntityLimitType: '',
    subEntityContactDetList: [],
    subEntityLimitApplicable: false,
    subEntityLimitResetPeriodId: '',
    subEntityLimitResetPeriod: '',
    subEntityLimitResetOnId: '',
    subEntityLimitResetOn: '',
    subEntityAllowOverrideLimit: false,
    vAIssuanceAccountDetList: [],
  };

  /*get formData() {
    return this._formData;
  }*/
  subEntityContactObj: any = {};
  vaContactObj: any = {};

  accountNoList: Select[] = [];
  corporateStructureList: Select[] = [];
  corporateVAStructureData: any;

  contactColDef: any[] = [];

  virtualAccountColDef: any[] = [
    { headerName: 'Sr. No ', field: 'srNo' },
    { headerName: 'Virtual Account', field: 'virtualAccountNo' },
    { headerName: 'Currency', field: 'vaCurrency' },
    { headerName: 'Virtual Account Description', field: 'vaDescription' },
    { headerName: 'Virtual Account Alias Name', field: 'vaAliasName' },
    { headerName: 'Account Number', field: 'corporateAccount' },
    { cellRenderer: 'actionCellRenderer', field: 'actions', headerName: 'Actions' },
  ];

  limitPeriodData: Select[] = [
    { id: 'Daily', displayName: 'Daily' },
    { id: 'Weekly', displayName: 'Weekly' },
    { id: 'Monthly', displayName: 'Monthly' },
  ];

  limitPeriodDateData: Select[] = [];
  limitPeriodDayData: Select[] = [];
  overrideInData: Select[] = [];
  showVAAddPage = false;
  virtualAccountData: any = {};
  uploadedFiles: any = [];

  contactDetails = {
    contactDetName: '',
    contactDetEmail: '',
    contactDetDesignation: '',
    contactDetMobile: '',
  };
  viewport: string;
  showRunTimeSubEntityForm = false;
  showSearchSubEntityModal = false;
  sunEntityFromSearchModal = false;
  mode: string;
  viewMode = false;

  //Daily, Weekly and Monthly

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
    private menuService: MenuService,
    private userService: UserService,
    private viewportService: ViewportService,
    private vaIssuanceSummaryService: VaIssuanceSummaryService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Corporate VA Structure',
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
      { label: 'VAM Setup' },
      { label: 'Corporate Virtual Account Issuance' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.menuService.setSelectedServiceUrl('vam/vamSetup/virtualAccountIssuance');

    /* remove below : ends */
    this.getViewData();
    this.viewportService.getViewport().subscribe((viewport: any) => {
      this.viewport = viewport;
    });
    // this.getAccountNoList();
    this.getCorporateStructureList();
    this.subEntityContactObj = { ...this.contactDetails };
    this.vaContactObj = { ...this.contactDetails };
    this.getLimitPeriodDate();
    this.getLimitPeriodDay();
    this.getOverrideInData();
    this.getContactColDef();
    this.getLimitPeriodData();
  }

  getLimitPeriodDate() {
    this.vaIssuanceSummaryService.getLimitPeriodDate();
  }

  getLimitPeriodDay() {
    this.vaIssuanceSummaryService
      .getLimitPeriodDayData()
      .subscribe((data) => (this.limitPeriodDayData = data));
  }

  resetContactDetails(tempObj) {
    const data = {
      contactDetName: '',
      contactDetEmail: '',
      contactDetDesignation: '',
      contactDetMobile: '',
    };
    tempObj = data;
    this.contactDetailsTable?.fitColumns();
    this.vaContactDetailsTable?.fitColumns();
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return (
        this.formData.corporateStructure + ' | ' + this.corporateVAStructureData?.vaCreationLogic
      );
    } else if (stepNo == 2) {
      return this.formData.subEntityCode + ' | ' + this.formData.subEntityLimitType;
    } else if (stepNo == 3) {
      return 'Total Virtual Accounts - ' + this.formData.vAIssuanceAccountDetList?.length;
    }
    return 'Step' + stepNo + ' Details';
  }

  getAccountNoList(): void {
    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    this.httpService.httpPost(this.URL_CONST.GET_ACCOUNT_LIST, data).subscribe((response: any) => {
      this.accountNoList = response.dataList;
    });
  }

  getCorporateStructureList(): void {
    const filterModel = { corporateId: {} };
    filterModel.corporateId = {
      filterType: 'text',
      type: 'equals',
      filter: this.userService.getCorporateId(),
    };
    const data = {
      startRow: 0,
      endRow: 100,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel,
      sortModel: [],
      entityName: '',
    };
    this.httpService
      .httpPost(this.URL_CONST.GET_CORPORATEVASTRUCTURELIST, data)
      .subscribe((response: any) => {
        this.corporateStructureList = response.data.map((a) => {
          a.displayName = a.corporateStructureName;
          return a;
        });
      });
  }

  showAddNewAccBtn() {
    return true;
    // return (Number(this.corporateVAStructureData?.unIssuedVirtualAccount) || 0) - this.formData.vAIssuanceAccountDetList.length > 0;
  }

  validateForm(stepNo: number): boolean {
    return true;
    if (stepNo == 1) {
      return this.accountDetailsForm?.valid;
    } else if (stepNo == 2) {
      return this.formData.subEntityContactDetList.length > 0 && this.formDataForm?.valid;
    } else if (stepNo == 3) {
      return this.formData.vAIssuanceAccountDetList.length > 0;
    }
    return true;
  }

  beforeSubmit() {
    this.formData.subEntityContactDetList.map((d) => {
      delete d.actions;
      return d;
    });
    this.formData.vAIssuanceAccountDetList.map((va) => {
      va.vaContactDetList.map((c) => {
        delete c.actions;
        return c;
      });
      return va;
    });
    this.formData.noOfVA = this.formData.vAIssuanceAccountDetList?.length;

    this.createSubEntity(); //TODO:Remove while integration As this will get called Internally @ service Layer
    return true;
  }

  //TODO:Remove while integration
  /*@deprecated*/
  createSubEntity() {
    if (this.sunEntityFromSearchModal) {
      return; // It Means Sub Enity is already created
    }
    let subEntityDataForCreate: any = {};
    subEntityDataForCreate.subEntityCode = this.formData.subEntityCode;
    subEntityDataForCreate.subEntityName = this.formData.subEntityName;
    subEntityDataForCreate.subEntityAliasName = this.formData.subEntityAliasName;
    subEntityDataForCreate.subEntityUniqueID = this.formData.subEntityUniqueID;
    subEntityDataForCreate.subEntityContactDetList = this.formData.subEntityContactDetList;
    subEntityDataForCreate.subEntityLimitApplicable = this.formData.subEntityLimitApplicable;
    subEntityDataForCreate.subEntityLimitResetPeriodId = this.formData.subEntityLimitResetPeriodId;
    subEntityDataForCreate.subEntityLimitResetPeriod = this.formData.subEntityLimitResetPeriod;
    subEntityDataForCreate.subEntityAllocatedLimit = this.formData.subEntityAllocatedLimit;
    subEntityDataForCreate.subEntityLimitType = this.formData.subEntityLimitType;
    subEntityDataForCreate.subEntityLimitResetOn = this.formData.subEntityLimitResetOn;
    subEntityDataForCreate.subEntityLimitResetOnId = this.formData.subEntityLimitResetOnId;
    subEntityDataForCreate.subEntityAllowOverrideLimit = this.formData.subEntityAllowOverrideLimit;
    subEntityDataForCreate.subEntityAllowOverrideInId = this.formData.subEntityAllowOverrideInId;
    subEntityDataForCreate.subEntityAllowOverrideIn = this.formData.subEntityAllowOverrideIn;
    subEntityDataForCreate.subEntityAdhocLimit = this.formData.subEntityAdhocLimit;

    this.httpService
      .httpPost(this.URL_CONST.SUB_ENTITY_CREATE, subEntityDataForCreate)
      .subscribe((response: any) => {
        console.log('subEntityDataForCreate ', response);
      });
  }

  /*onAccountSelection(account: any) {
    const filters = [
      {corporateId: this.userService.getCorporateId()},
      {corporateAccountId: this.formData.corporateAccountId},
    ];
    this.formData.corporateAccount = account.displayName;

    const data = {dataMap: filters};
    this.httpService.httpPost(this.URL_CONST.GET_CORPORATEVASTRUCTURELIST, data).subscribe((response: any) => {
      this.corporateVAStructureData = response;
    });
  }*/

  onCorporateStructure(corporateStructure: any) {
    const filters = [
      // {corporateId: this.userService.getCorporateId()},
      { id: this.formData.corporateStructureId },
    ];
    this.formData.corporateStructure = corporateStructure.displayName;
    const data = { dataMap: { id: this.formData.corporateStructureId } };
    this.httpService
      .httpPost(this.URL_CONST.GET_CORPORATEVASTRUCTURE_VIEW, data)
      .subscribe((response: any) => {
        this.corporateVAStructureData = response;
        this.formData.corporateAccountId = this.corporateVAStructureData.corporateAccountId;
        this.formData.corporateAccount = this.corporateVAStructureData.corporateAccount;
        this.formData.structureCreationFor = this.corporateVAStructureData.structureCreationFor;
        this.formData.lenOfVA = this.corporateVAStructureData.lenOfVA;
        this.formData.countOfVA = this.corporateVAStructureData.countOfVA;
        this.formData.prefixValue = this.corporateVAStructureData.prefixValue;
        this.formData.unIssuedVirtualAccount = this.corporateVAStructureData.unIssuedVirtualAccount;
        this.formData.vaCreationLogic = this.corporateVAStructureData.vaCreationLogic;
        this.formData.corporateAccount = this.corporateVAStructureData.corporateAccount;
        this.setStepperHeadings();
      });
  }

  private setStepperHeadings() {
    if (this.formData.structureCreationFor == 'COBO') {
      this.stepperDetails.headings = [
        'Account Details',
        'Virtual Account Details',
        'Review and Submit',
      ];
    } else {
      this.stepperDetails.headings = [
        'Account Details',
        'Sub Entity Details',
        'Virtual Account Details',
        'Review and Submit',
      ];
    }

    this.stepperHeader?.ngOnInit();
  }

  addVAContact() {
    if (
      this.vaIssuanceSummaryService.validateContact(
        this.virtualAccountData.vaContactDetList,
        this.vaContactObj,
      )
    ) {
      this.addContact(
        this.vaContactDetailsTable,
        this.virtualAccountData.vaContactDetList,
        'VAContact',
        this.vaContactObj,
      );
      this.vaContactObj = { ...this.contactDetails };
    }
  }

  addSubEntityContact() {
    this.addContact(
      this.contactDetailsTable,
      this.formData.subEntityContactDetList,
      'EntityContact',
      this.subEntityContactObj,
    );
    this.subEntityContactObj = { ...this.contactDetails };
  }

  addContact(gridRef: AgGridListingComponent, dataObj: any[], type, tempObj) {
    const actions = [
      {
        color: 'primary',
        displayName: 'Edit',
        icon: 'pi pi-pencil',
        index: 2,
        methodName: 'edit' + type,
        paramList: 'srNo',
        type: 'ICON',
        url: '',
      },
      {
        color: 'warn',
        displayName: 'Delete',
        icon: 'pi pi-trash',
        index: 2,
        methodName: 'delete' + type,
        paramList: 'srNo',
        type: 'ICON',
        url: '',
      },
    ];
    tempObj.srNo = dataObj.length + 1;
    tempObj.actions = actions;
    dataObj.push(tempObj);
    gridRef.refreshGridList();
    // this.resetContactDetails(tempObj);
  }

  deleteEntityContact(srNo) {
    this.modifyDataObj(this.formData.subEntityContactDetList, srNo, this.contactDetailsTable);
  }

  editEntityContact(srNo) {
    const data = this.modifyDataObj(
      this.formData.subEntityContactDetList,
      srNo,
      this.contactDetailsTable,
    );
    this.subEntityContactObj = data[0];
  }

  modifyDataObj(obj: any[], srNo, gridRef) {
    const data = obj.splice(srNo - 1, 1);
    obj.map((val, index) => (val.srNo = index + 1));
    // this.contactDetailsTable?.refreshGridList();
    // this.vaContactDetailsTable?.refreshGridList();
    // this.vaContactDetailsTable?.refreshGridList();
    gridRef.refreshGridList();
    return data;
  }

  deleteVAContact(srNo) {
    this.modifyDataObj(this.virtualAccountData.vaContactDetList, srNo, this.vaContactDetailsTable);
  }

  editVAContact(srNo) {
    const data = this.modifyDataObj(
      this.virtualAccountData.vaContactDetList,
      srNo,
      this.vaContactDetailsTable,
    );
    this.vaContactObj = data[0];
  }

  getOverrideInData() {
    this.vaIssuanceSummaryService
      .getOverrideInData()
      .subscribe((data) => (this.overrideInData = data));
  }

  getContactColDef() {
    this.vaIssuanceSummaryService
      .getContactColDef()
      .subscribe((data) => (this.contactColDef = data));
  }

  getLimitPeriodData() {
    this.vaIssuanceSummaryService
      .getLimitPeriodData()
      .subscribe((data) => (this.limitPeriodData = data));
  }

  resetForm(form: NgForm, exceptionsFields) {
    this.vaIssuanceSummaryService.resetForm(form, exceptionsFields);
  }

  addVirtualAccount() {
    const accNo = this.corporateVAStructureData?.corporateAccount.trim();
    const ccy = accNo.substring(accNo.indexOf('-') + 1);

    this.virtualAccountData = {
      corporateClientCode: '',
      corporateClientName: '',
      clientAliasName: '',
      clientTrnNo: '',
      clientUniqueIdNo: '',
      address1: '',
      address2: '',
      address3: '',
      accountNo: '',
      bankName: '',
      branchName: '',
      virtualAccountNo: this.corporateVAStructureData.vaStructurePreview,
      vaCurrency: ccy,
      vaDescription: '',
      vaAliasName: '',
      vaExpiryDate: '',
      enrichment1: '',
      enrichment2: '',
      vaContactDetList: [],
      vaAllocatedLimit: '',
      corporateAccount: this.corporateVAStructureData.corporateAccount,
      vaLimitResetPeriodId: this.formData.subEntityLimitResetPeriodId,
      vaLimitResetPeriod: this.formData.subEntityLimitResetPeriod,
      vaLimitResetOnId: this.formData.subEntityLimitResetOnId,
      vaLimitResetOn: this.formData.subEntityLimitResetOn,
      vaStatus: this.corporateVAStructureData.vaStatus.toLowerCase(),
    };
    this.showVAAddPage = true;
  }

  cancelVirtualAccount() {
    this.showVAAddPage = false;
  }

  saveVirtualAccount() {
    console.log('saveVirtualAccount ', this.virtualAccountData);
    this.addContact(
      this.virtualAccountTable,
      this.formData.vAIssuanceAccountDetList,
      'VA',
      this.virtualAccountData,
    );
    this.addVirtualAccount();
    this.showVAAddPage = false;
  }

  deleteVA(srNo) {
    this.modifyDataObj(this.formData.vAIssuanceAccountDetList, srNo, this.virtualAccountTable);
  }

  editVA(srNo) {
    this.showVAAddPage = true;
    const data = this.modifyDataObj(
      this.formData.vAIssuanceAccountDetList,
      srNo,
      this.virtualAccountTable,
    );
    this.virtualAccountData = data[0];
  }

  onFileUploaded(event: any) {
    console.log(event);
  }

  onChangeVAAllowOverrideIn(data: any) {
    this.virtualAccountData.vaAllowOverrideIn = data.displayName;
  }

  onChangeLimitReplenishPeriod(data: any) {
    this.formData.subEntityLimitResetPeriod = data.displayName;
  }

  onSubEntitySelection(subEntity: any) {
    this.httpService
      .httpPost(this.URL_CONST.SUB_ENTITY_VIEW, { dataMap: { id: subEntity.id } })
      .subscribe((data) => {
        console.log(data);
        this.formData.subEntityCode = data.subEntityCode;
        this.formData.subEntityName = data.subEntityName;
        this.formData.subEntityAliasName = data.subEntityAliasName;
        this.formData.subEntityUniqueID = data.subEntityUniqueID;
        this.formData.subEntityContactDetList = data.subEntityContactDetList;
        this.formData.subEntityLimitApplicable = data.subEntityLimitApplicable;
        this.formData.subEntityLimitResetPeriodId = data.subEntityLimitResetPeriodId;
        this.formData.subEntityLimitResetPeriod = data.subEntityLimitResetPeriod;
        this.formData.subEntityAllocatedLimit = data.subEntityAllocatedLimit;
        this.formData.subEntityLimitType = data.subEntityLimitType;
        this.formData.subEntityLimitResetOn = data.subEntityLimitResetOn;
        this.formData.subEntityLimitResetOnId = data.subEntityLimitResetOnId;
        this.formData.subEntityAllowOverrideLimit = data.subEntityAllowOverrideLimit;
        this.formData.subEntityAllowOverrideInId = data.subEntityAllowOverrideInId;
        this.formData.subEntityAllowOverrideIn = data.subEntityAllowOverrideIn;
        this.formData.subEntityAdhocLimit = data.subEntityAdhocLimit;
        this.formData.subEntityId = data.id;
      });
    const filters = [
      { name: 'corporateId', value: this.userService.userDetails.corporateId, type: 'String' },
      { name: 'subEntityCode', value: subEntity.subEntityCode, type: 'String' },
      { name: 'corporateStructureId', value: this.formData.corporateStructureId, type: 'String' },
    ];
    this.httpService.httpPost(this.URL_CONST.VIEW, { dataMap: { filters } }).subscribe((data) => {
      console.log(data);
      if (data?.vAIssuanceAccountDetList) {
        this.formData = data;
        this.mode = 'EDIT'; // Submit Record as Edit
      } else {
        this.mode = undefined; // Create new Record
      }
    });
    this.sunEntityFromSearchModal = true; // Show View SUB ENTITY
    this.showRunTimeSubEntityForm = false; // Hide NEW SUB ENTITY FORM
  }

  showRunTimeSubEntity() {
    this.mode = undefined; // Create new Record
    this.showRunTimeSubEntityForm = true; // Show NEW SUB ENTITY FORM
    this.sunEntityFromSearchModal = false; // Hide View SUB ENTITY
    this.subEntityInitiateComponent.resetAllSubEnityForms();
  }

  private getViewData() {
    try {
      const id = this.viewService.getId();
      this.viewMode = this.viewService.getMode() === 'VIEW';
      this.viewService.clearAll();
      if (id) {
        this.httpService.httpPost(this.URL_CONST.VIEW, { dataMap: { id } }).subscribe((data) => {
          this.formData = data;
          this.setStepperHeadings();
          this.sunEntityFromSearchModal = true;
          this.showRunTimeSubEntityForm = false;
        });
      } else {
        console.log('Id not found');
      }
    } catch (e) {
      console.log('error', e);
    }
  }
}
