import { Component, OnInit, ViewChild } from '@angular/core';
import { VaIssuanceSummaryService } from '../@services/va-issuance-summary.service';
import { AgGridListingComponent } from '../../../../shared/@components/ag-grid-listing/ag-grid-listing.component';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sub-entity-details',
  templateUrl: './sub-entity-details.component.html',
  styleUrls: ['./sub-entity-details.component.scss'],
})
export class SubEntityDetailsComponent implements OnInit {
  @ViewChild('virtualAccountTable') virtualAccountTable: AgGridListingComponent;
  @ViewChild('actions') actions: any;

  selectedSubEntity: any;
  selectedAccount: any;
  subEntityList: any[];
  selectedSubEntityId: any;
  virtualAccountColDef: any[] = [
    { headerName: 'Sr. No ', field: 'srNo' },
    { headerName: 'Virtual Account', field: 'virtualAccountNo' },
    { headerName: 'Currency', field: 'vaCurrency' },
    { headerName: 'Virtual Account Description', field: 'vaDescription' },
    { headerName: 'Virtual Account Alias Name', field: 'vaAliasName' },
    { headerName: 'Account Number', field: 'corporateAccount' },
    { cellRenderer: 'actionCellRenderer', field: 'actions', headerName: 'Actions' },
  ];
  vaAccountList$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  vaAccountList: any[];
  selectedVAid: string;

  constructor(
    private vaIssuanceSummaryService: VaIssuanceSummaryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedSubEntity = this.vaIssuanceSummaryService.selectedSubEntity;
    this.selectedSubEntityId = this.selectedSubEntity.id;
    this.selectedAccount = this.vaIssuanceSummaryService.selectedAccount;
    this.subEntityList = this.selectedAccount.subEnitiesData.map((a) => {
      a.displayName = a.subEntityName;
      return a;
    });
    this.onSubEntityChange(this.selectedSubEntity);
    console.log('selectedSubEntity', this.selectedSubEntity);

    const actions = [
      {
        color: 'primary',
        displayName: 'More Options',
        icon: 'pi pi-ellipsis-v',
        index: 2,
        methodName: 'viewOverlay',
        paramList: 'id',
        type: 'ICON',
        url: '',
      },
    ];
    this.vaAccountList$.subscribe((accounts: any[]) => {
      accounts.map((a) => {
        a.actions = actions;
        return a;
      });
      this.vaAccountList = undefined;
      setTimeout(() => (this.vaAccountList = JSON.parse(JSON.stringify(accounts))), 1000);
    });
  }

  onSubEntityChange(subEntitiesData) {
    this.selectedSubEntity = subEntitiesData;
    this.vaAccountList$.next(subEntitiesData.vAIssuanceAccountDetList);
  }

  viewOverlay(id, $event) {
    this.actions.toggle($event);
    this.selectedVAid = id;
    this.vaIssuanceSummaryService.selectedVA = this.vaAccountList.find((acc) => acc.id == id);
  }

  viewMoreDetails() {
    this.router.navigate(['./virtualAccountDetails'], { relativeTo: this.route });
  }

  limitEnhancement() {
    this.router.navigate(['../../vaLimitEnhancement'], { relativeTo: this.route });
  }
}
