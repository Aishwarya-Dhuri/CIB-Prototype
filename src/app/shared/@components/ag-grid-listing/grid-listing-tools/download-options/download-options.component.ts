import { Component, Input, OnInit } from '@angular/core';
import { AgGridListingComponent } from '../../ag-grid-listing.component';

@Component({
  selector: 'app-download-options',
  templateUrl: './download-options.component.html',
  styleUrls: ['./download-options.component.scss'],
})
export class DownloadOptionsComponent implements OnInit {
  @Input('gridRef') gridRef: AgGridListingComponent;

  constructor() {}

  ngOnInit(): void {}
}
