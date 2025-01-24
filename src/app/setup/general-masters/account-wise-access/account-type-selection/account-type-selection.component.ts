import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { AccountWiseAccessService } from '../@services/account-wise-access.service';
import { AccountWiseAccessComponent } from '../account-wise-access.component';

@Component({
  selector: 'app-account-type-selection',
  templateUrl: './account-type-selection.component.html',
  styleUrls: ['./account-type-selection.component.scss'],
})
export class AccountTypeSelectionComponent implements OnInit, OnDestroy {
  @ViewChild('selectedData') selectedData: any;
  @ViewChild('allData') allData: any;

  @Input('parentRef') parentRef: AccountWiseAccessComponent;

  loading: boolean;

  selectedProducts: any[] = [];

  showMoreProducts: boolean;

  gridHeader: string;

  customModalStyle: any = {};

  allDataGridColumnDefsUrl: string = '';
  allDataGridRowData: any[] = [];
  allDataGridOptions: any;

  selectedDataGridColumnDefsUrl: string = '';
  selectedDataGridRowData: any[] = [];
  selectedDataGridOptions: any;

  constructor(
    private accountWiseAccessService: AccountWiseAccessService,
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.setGridData();
  }

  setGridData() {
    this.loading = true;

    this.selectedProducts = [];
    this.selectedDataGridRowData = [];

    let dataUrl = '';

    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id) {
        this.selectedProducts = this.accountWiseAccessService.getSelectedProducts();
      }

      this.gridHeader = 'Users';

      this.allDataGridColumnDefsUrl = this.accountWiseAccessService.userHeaderSelectionColDefUrl;

      this.selectedDataGridColumnDefsUrl = this.accountWiseAccessService.userColDefUrl;

      dataUrl = this.accountWiseAccessService.usersRowDataUrl;
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      this.gridHeader = 'Accounts / IBAN / Cards';

      this.allDataGridColumnDefsUrl = this.accountWiseAccessService.accountHeaderSelectionColDefUrl;

      this.selectedDataGridColumnDefsUrl = this.accountWiseAccessService.accountColDefUrl;

      dataUrl = this.accountWiseAccessService.accountsRowDataUrl;
    }

    this.allDataGridOptions = {
      pagination: false,
      rowModelType: 'clientSide',
      rowSelection: 'multiple',
    };

    this.selectedDataGridOptions = {
      pagination: false,
      rowModelType: 'clientSide',
    };
    const data = { dataMap: { corporateId: this.userService.userDetails.corporateId } };

    this.httpService.httpPost(dataUrl, data).subscribe((response: any) => {
      this.allDataGridRowData = response.data;

      this.loading = false;
    });
  }

  allDataGridReady() {
    let selectedDataGridRowData = [];

    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      selectedDataGridRowData = this.accountWiseAccessService.getSelectedUsers();
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      selectedDataGridRowData = this.accountWiseAccessService.getSelectedAccounts();
    }

    if (selectedDataGridRowData.length > 0) {
      selectedDataGridRowData.forEach((data: any) => {
        this.allData.selectRow(data, 'uaid');
      });
    }
  }

  rowSelected(rowData: any) {
    if (rowData.node.selected) {
      this.selectedDataGridRowData.push(rowData.data);
    } else {
      const index = this.selectedDataGridRowData.findIndex(
        (data: any) => data.userId === rowData.data.userId,
      );

      if (index >= 0) {
        this.selectedDataGridRowData.splice(index, 1);
      }
    }

    this.selectedData.setRowData(this.selectedDataGridRowData);
  }

  showMoreOptions(e: MouseEvent): void {
    this.showMoreProducts = true;

    let transform = 'translate(-' + e.offsetX + 'px, ' + -Math.abs(e.offsetY) + 'px)';
    this.customModalStyle = {
      position: 'absolute',
      top: e.pageY + 'px',
      left: e.pageX + 'px',
      transform: transform,
      'box-shadow': '0px 0px 10px #ebebeb !important',
      width: 'auto',
      'z-index': '1',
      padding: '0.75rem',
    };
  }

  ngOnDestroy() {
    if (
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[0].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[2].id ||
      this.parentRef.selectedAccessType === this.parentRef.accessTypeList[3].id
    ) {
      this.accountWiseAccessService.setSelectedUsers(this.selectedDataGridRowData);
    } else if (this.parentRef.selectedAccessType === this.parentRef.accessTypeList[1].id) {
      this.accountWiseAccessService.setSelectedAccounts(this.selectedDataGridRowData);
    }

    this.selectedDataGridRowData = [];
  }
}
