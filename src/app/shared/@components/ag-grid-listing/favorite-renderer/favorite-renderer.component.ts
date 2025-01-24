import { SyncAsync } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-favorite-renderer',
  template: `<span>
    <app-icon
      *ngIf="cellValue == 'N'"
      class="pointer text-color-primary"
      icon="fa-star"
      (click)="updateFavorite('Y')"
    ></app-icon>
    <i
      *ngIf="cellValue == 'Y'"
      class="pointer text-color-primary fas fa-star"
      (click)="updateFavorite('N')"
    ></i>
  </span>`,
})
export class FavoriteRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  currencyName: string;
  node: any;
  parentContext: any;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor(private httpService: HttpService, private userService: UserService) {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.parentContext = this.params.context.componentParent;
      this.cellValue = this.params.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.parentContext = params.context.componentParent;
    this.node = params.node;
    this.cellValue = params.value;
  }

  updateFavorite(newValue: string) {
    this.cellValue = newValue;
    const url =
      this.parentContext.rowDefUrl.substring(0, this.parentContext.rowDefUrl.lastIndexOf('/') + 1) +
      'updateFavorite';
    const data = {
      dataMap: {
        id: this.node.data.id,
        userId: this.userService.userName,
        isFavorite: this.cellValue,
      },
    };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.parentContext.refreshGridList();
    });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
