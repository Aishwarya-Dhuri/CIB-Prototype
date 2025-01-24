import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-priting-reconcile-dropdown-renderer',
  templateUrl: './priting-reconcile-dropdown-renderer.component.html',
  styleUrls: ['./priting-reconcile-dropdown-renderer.component.scss']
})
export class PritingReconcileDropdownRendererComponent implements OnInit {
  params: any;
  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  instrumentStatusList = [
    { id: 'Select', displayName: 'Select' },
    { id: 'Printed', displayName: 'Printed' },
    { id: 'Unused', displayName: 'Unused' },
    { id: 'Spoil', displayName: 'Spoil' },
  ]

}
