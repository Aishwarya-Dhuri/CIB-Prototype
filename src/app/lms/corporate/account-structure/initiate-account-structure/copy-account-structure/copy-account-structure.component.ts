import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-copy-account-structure',
  templateUrl: './copy-account-structure.component.html',
  styleUrls: ['./copy-account-structure.component.scss'],
})
export class CopyAccountStructureComponent implements OnInit {
  @Input('parentRef') parentRef: any;

  selectedStrictureId: string = '';

  colDefUrl: string = 'lms/corporate/accountStructure/private/copyStructureColDef';
  rowDefUrl: string = 'lms/corporate/accountStructure/private/getAllList';

  gridOptions: any = {
    rowSelection: 'single',
  };

  constructor() {}

  ngOnInit(): void {}

  gridRowSelected(rowData: any) {
    if (rowData.node.selected) {
      this.selectedStrictureId = rowData.data.id;
    }
  }
}
