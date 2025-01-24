import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoansRoutingModule } from './loans-routing.module';
import { RequestForLoansComponent } from './request-for-loans/request-for-loans.component';


@NgModule({
  declarations: [

    RequestForLoansComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoansRoutingModule
  ]
})
export class LoansModule { }
