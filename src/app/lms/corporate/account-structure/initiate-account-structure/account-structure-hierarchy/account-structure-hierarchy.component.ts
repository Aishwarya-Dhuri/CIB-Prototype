import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-account-structure-hierarchy',
  templateUrl: './account-structure-hierarchy.component.html',
  styleUrls: ['./account-structure-hierarchy.component.scss'],
})
export class AccountStructureHierarchyComponent implements OnInit {
  @ViewChild('structureHierarchy') structureHierarchyGrid: any;

  @Input('parentRef') parentRef: any;

  colDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Bank',
      field: 'bank',
    },
    {
      headerName: 'Country',
      field: 'country',
    },
    {
      headerName: 'Currency',
      field: 'currency',
    },
    {
      headerName: 'Type',
      field: 'accType',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
    { headerName: 'Actions', field: 'actions', cellRenderer: 'actionCellRenderer' },
  ];

  treeNode: any;

  treeType: string = 'grid';

  gridOptions: any;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.gridOptions = {
      rowModelType: 'clientSide',
      treeData: true,
      pagination: false,
      // rowDragManaged: true,
      animateRows: true,
      groupDefaultExpanded: -1,
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
      autoGroupColumnDef: {
        rowDrag: true,
        headerName: 'Account Number',
        minWidth: 400,
        cellRendererParams: {
          suppressCount: true,
        },
      },
      getDataPath: (data: any) => {
        return data.accountNo;
      },
      isGroupOpenByDefault: (params: any) => {
        return true;
      },
    };
  }

  selectedTreeNode(node: any) {
    this.treeNode = node;
  }

  refreshStructureHierarchyGrid() {
    if (this.structureHierarchyGrid) {
      this.structureHierarchyGrid.setRowData(this.parentRef.rowData);
    }
  }
}
