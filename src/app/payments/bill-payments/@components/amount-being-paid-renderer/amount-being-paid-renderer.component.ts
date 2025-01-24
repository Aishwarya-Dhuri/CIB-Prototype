import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-amount-being-paid-renderer',
  templateUrl: './amount-being-paid-renderer.component.html',
  styleUrls: ['./amount-being-paid-renderer.component.scss'],
})
export class AmountBeingPaidRendererComponent implements OnInit {
  cellValue!: any;

  currency: string;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  public params: ICellRendererParams | any;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.cellValue = this.data[this.field];
    }
    this.currencyService.getCurrencyName().subscribe((currency: string) => {
      this.currency = currency;
    });
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  amountChange() {
    this.params.context.componentParent.amountBeingPaidChanged(this.cellValue, this.params.data.id);
  }
}
