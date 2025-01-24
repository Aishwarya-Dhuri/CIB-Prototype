import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { VaIssuanceSummaryService } from '../@services/va-issuance-summary.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgGridListingComponent } from '../../../../shared/@components/ag-grid-listing/ag-grid-listing.component';
import { ToasterService } from '../../../../shared/@services/toaster.service';

@Component({
  selector: 'app-sub-entity-initiate',
  templateUrl: './sub-entity-initiate.component.html',
  styleUrls: ['./sub-entity-initiate.component.scss'],
})
export class SubEntityInitiateComponent implements OnInit {
  @ViewChild('subEntityDetailsForm') subEntityDetailsForm: NgForm;
  @ViewChild('subEntityContactForm') subEntityContactForm: NgForm;
  @ViewChild('subEntityLimitForm') subEntityLimitForm: NgForm;
  @ViewChild('contactDetailsTable') contactDetailsTable: AgGridListingComponent;

  @Input('refreshSubEntityContactGrid') refreshContactGrid: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(null);
  @Input('subEntityDetails') subEntityDetails = {
    subEntityCode: '',
    subEntityName: '',
    subEntityAliasName: '',
    subEntityUniqueID: '',
    subEntityContactDetList: [],
    subEntityLimitApplicable: false,
    subEntityLimitResetPeriodId: '',
    subEntityLimitResetPeriod: '',
    subEntityAllocatedLimit: '',
    subEntityLimitType: '',
    subEntityLimitResetOn: '',
    subEntityLimitResetOnId: '',
    subEntityAllowOverrideLimit: '',
    subEntityAllowOverrideInId: '',
    subEntityAllowOverrideIn: '',
    subEntityAdhocLimit: '',
  };
  subEntityContactObj: any = {};

  contactDetails = {
    contactDetName: '',
    contactDetEmail: '',
    contactDetDesignation: '',
    contactDetMobile: '',
  };
  contactColDef: any;
  limitPeriodData: any;
  limitPeriodDayData: any[];
  limitPeriodDateData: any;
  overrideInData: any[];

  constructor(
    private vaISummaryService: VaIssuanceSummaryService,
    public toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.subEntityContactObj = { ...this.contactDetails };
    this.getContactColDef();
    this.getLimitPeriodData();
    this.getLimitPeriodDay();
    this.getLimitPeriodDate();
    this.getOverrideInData();
  }

  addSubEntityContact() {
    if (
      this.vaISummaryService.validateContact(
        this.subEntityDetails.subEntityContactDetList,
        this.subEntityContactObj,
      )
    ) {
      this.vaISummaryService.addContact(
        this.contactDetailsTable,
        this.subEntityDetails.subEntityContactDetList,
        'EntityContact',
        this.subEntityContactObj,
      );
      this.subEntityContactObj = { ...this.contactDetails };
    }

    /*
     this.contactDetailsTable.setRowData(this.subEntityDetails.subEntityContactDetList);
     this.contactDetailsTable.refreshGridList();*/
    // this.refreshContactGrid.next(true);
  }

  deleteEntityContact(srNo) {
    this.vaISummaryService.modifyDataObj(
      this.subEntityDetails.subEntityContactDetList,
      srNo,
      this.contactDetailsTable,
    );
  }

  editEntityContact(srNo) {
    const data = this.vaISummaryService.modifyDataObj(
      this.subEntityDetails.subEntityContactDetList,
      srNo,
      this.contactDetailsTable,
    );
    this.subEntityContactObj = data[0];
  }

  getContactColDef() {
    this.vaISummaryService.getContactColDef().subscribe((data) => (this.contactColDef = data));
  }

  resetForm(form: NgForm, exceptionsFields) {
    this.vaISummaryService.resetForm(form, exceptionsFields);
  }

  onChangeLimitReplenishPeriod(data: any) {
    this.subEntityDetails.subEntityLimitResetPeriod = data.displayName;
  }

  onChangeLimitResetOn(data: any) {
    this.subEntityDetails.subEntityLimitResetOn = data.displayName;
  }

  getLimitPeriodDay() {
    this.vaISummaryService
      .getLimitPeriodDayData()
      .subscribe((data) => (this.limitPeriodDayData = data));
  }

  getLimitPeriodDate() {
    this.vaISummaryService
      .getLimitPeriodDate()
      .subscribe((data) => (this.limitPeriodDateData = data));
  }

  getOverrideInData() {
    this.vaISummaryService.getOverrideInData().subscribe((data) => (this.overrideInData = data));
  }

  getLimitPeriodData() {
    this.vaISummaryService.getLimitPeriodData().subscribe((data) => (this.limitPeriodData = data));
  }

  onChangeSubEntityAllowOverrideIn(data: any) {
    this.subEntityDetails.subEntityAllowOverrideIn = data.displayName;
  }

  resetSubEnityForm() {
    this.subEntityDetailsForm.reset();
  }

  resetContactDetailsTable() {
    if (
      this.subEntityDetails.subEntityContactDetList &&
      this.subEntityDetails.subEntityContactDetList.length != 0
    ) {
      this.subEntityDetails.subEntityContactDetList = [];
      this.vaISummaryService.clearGridData(this.contactDetailsTable);
    }
  }

  resetAllSubEnityForms() {
    this.resetSubEnityForm();
    this.subEntityContactForm.reset();
    this.subEntityLimitForm.reset();
    this.resetContactDetailsTable();
  }
}
