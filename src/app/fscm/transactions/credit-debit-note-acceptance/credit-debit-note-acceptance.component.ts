import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CreditDebitNote } from '../credit-debit-note-entry/@model/credit-debit-note.model';

@Component({
  selector: 'app-credit-debit-note-acceptance',
  templateUrl: './credit-debit-note-acceptance.component.html',
  styleUrls: ['./credit-debit-note-acceptance.component.scss'],
})
export class CreditDebitNoteAcceptanceComponent implements OnInit {
  @ViewChild('listing') listing: AgGridListingComponent;

  loading: boolean;
  loadingGrid: boolean;
  mode: string = '';

  searchFilters: any[] = [];

  dataForAction: any[] = [];
  singleDataForAction: any[] = [];

  remarkInput: string = '';

  isShowSearch: boolean = false;
  isShowInputRemark: boolean = false;
  isApprove: boolean = false;
  context: any = { componentParent: this };

  rowData: any[] = [];
  tabs: any[] = [
    {
      label: 'Recent Credit Debit Notes',
      colDefsUrl: 'fscm/transactions/creditDebitNoteAcceptance/private/colDefs',
      rowDefsUrl: 'fscm/transactions/creditDebitNoteAcceptance/private/getRecentCreditDebitNotes',
      count: '0',
    },
    {
      label: 'Near Dues',
      colDefsUrl: 'fscm/transactions/creditDebitNoteAcceptance/private/colDefs',
      rowDefsUrl: 'fscm/transactions/creditDebitNoteAcceptance/private/getNearDueCreditDebitNotes',
      count: '0',
    },
  ];

  activeTab: any;

  viewCreditDebitNoteData: CreditDebitNote = new CreditDebitNote();
  isViewCreditDebitNote: boolean = false;

  gridOptions: any = {
    rowSelection: 'multiple',
    rowModelType: 'clientSide',
  };

  entityName: string = 'SPONSOR_CREDIT_DEBIT_NOTE';
  // entityName: string = 'NON_SPONSOR_CREDIT_DEBIT_NOTE';

  constructor(
    private httpService: HttpService,
    private actionService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'CreditDebitNote Acceptance - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'FSCM' },
      { label: 'Transactions' },
      { label: ' CreditDebitNote Acceptance' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getData(this.tabs[0]);

    this.loadingGrid = false;
  }

  getRecords(filters: any) {
    this.searchFilters = filters;
    this.getSearchResults();
  }

  clearSearch() {
    this.searchFilters = [];
    this.getData(this.tabs[0]);
  }

  onDynamicFiltersReady() {}

  getCriteriaList() {}

  getSearchResults() {
    this.loadingGrid = true;
    this.activeTab = {
      label: 'Search Results',
      colDefsUrl: 'fscm/transactions/creditDebitNoteAcceptance/private/colDefs',
      rowDefsUrl: 'fscm/transactions/creditDebitNoteAcceptance/private/getSearchedCreditDebitNotes',
      count: '0',
    };

    const data = { dataMap: { filters: this.searchFilters } };

    this.httpService.httpPost(this.activeTab.rowDefsUrl, data).subscribe((response: any) => {
      this.rowData = response.data;

      this.loadingGrid = false;
    });
  }

  getData(activeTab: any) {
    this.loadingGrid = true;

    this.activeTab = activeTab;
    const data = { dataMap: { filters: [] } };
    this.httpService.httpPost(activeTab.rowDefsUrl, data).subscribe((response: any) => {
      this.rowData = response.data;

      this.loadingGrid = false;
      this.loading = false;
    });
  }

  onRowSelected(rowData: any) {
    if (rowData.node.selected) {
      this.dataForAction.push(rowData.data);
    } else {
      const index = this.dataForAction.findIndex((data: any) => data.id === rowData.data.id);

      if (index >= 0) {
        this.dataForAction.splice(index, 1);
      }
    }
  }

  onAccept() {
    this.httpService
      .httpPost('fscm/transactions/creditDebitNoteAcceptance/private/acceptCreditDebitNotes', {
        dataMap: {
          data: this.singleDataForAction.length > 0 ? this.singleDataForAction : this.dataForAction,
          remark: this.remarkInput,
        },
      })
      .subscribe((response: any) => {
        this.dataForAction = [];
        this.singleDataForAction = [];
        this.remarkInput = '';
        this.isShowInputRemark = false;

        this.getData(this.activeTab);
      });
  }

  onReject() {
    this.httpService
      .httpPost('fscm/transactions/creditDebitNoteAcceptance/private/rejectCreditDebitNotes', {
        dataMap: {
          data: this.singleDataForAction.length > 0 ? this.singleDataForAction : this.dataForAction,
          remark: this.remarkInput,
        },
      })
      .subscribe((response: any) => {
        this.dataForAction = [];
        this.singleDataForAction = [];
        this.remarkInput = '';
        this.isShowInputRemark = false;
        this.getData(this.activeTab);
      });
  }

  onView(id: string) {
    this.httpService
      .httpPost('fscm/transactions/creditDebitNoteAcceptance/private/getCreditDebitNoteData', {
        dataMap: { id },
      })
      .subscribe((data: any) => {
        this.viewCreditDebitNoteData = data;
        this.isViewCreditDebitNote = true;
      });
  }

  resetViewCreditDebitNote() {
    this.viewCreditDebitNoteData = new CreditDebitNote();
    this.isViewCreditDebitNote = false;
  }

  onAcceptCreditDebitNote(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);
    if (data) {
      this.singleDataForAction.push(data);
      this.isApprove = true;
      this.isShowInputRemark = true;
    }
  }

  onRejectCreditDebitNote(id: string) {
    const data = this.rowData.find((d: any) => d.id == id);
    if (data) {
      this.singleDataForAction.push(data);
      this.isApprove = false;
      this.isShowInputRemark = true;
    }
  }
}
