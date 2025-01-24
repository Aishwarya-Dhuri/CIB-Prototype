import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cheque-image-renderer',
  templateUrl: './cheque-image-renderer.component.html',
  styleUrls: ['./cheque-image-renderer.component.scss'],
})
export class ChequeImageRendererComponent implements OnInit {
  imageUrl: string = '';

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.imageUrl = environment.serverUrl + '/' + this.params.data.chequeImageUrl;
  }

  onSnippetClick() {
    this.params.context.componentParent.onChequeSnippetClick(true, this.params.data.chequeImageUrl);
  }
}
