import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LinkRendererComponent } from './link-renderer/link-renderer.component';

@Component({
  selector: 'app-grid-details',
  templateUrl: './grid-details.component.html',
  styleUrls: ['./grid-details.component.scss'],
})
export class GridDetailsComponent implements OnInit {
  @Input('colDefUrl') colDefUrl!: string;
  @Input('rowDefUrl') rowDefUrl!: string;

  @Output() linkClicked = new EventEmitter<any>();

  frameworkComponents = {
    linkRenderer: LinkRendererComponent,
  };

  context = {
    componentParent: this,
  };

  gridOptions = {
    paginationPageSize: 6,
  };

  constructor() {}

  ngOnInit(): void {
    // console.log(this.colDefUrl);
  }

  onLinkClick(link: string) {
    this.linkClicked.emit(link);
  }
}
