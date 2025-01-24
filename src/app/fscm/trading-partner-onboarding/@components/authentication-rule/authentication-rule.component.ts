import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TradePartnerOnboardingAuthenticationRule } from '../../@model/seller-buyer-onboarding.model';
import { SellerBuyerService } from '../../@service/seller-buyer-onboarding.service';

@Component({
  selector: 'app-authentication-rule',
  templateUrl: './authentication-rule.component.html',
  styleUrls: ['./authentication-rule.component.scss'],
})
export class AuthenticationRuleComponent implements OnInit, OnDestroy {
  @ViewChild('authorizationRulesGrid') authorizationRulesGrid: any;

  @Input('authenticationRules') authenticationRules: TradePartnerOnboardingAuthenticationRule[];

  authenticationRule = {
    moduleName: '',
    transactionName: '',
    authorizationRule: '',
  };

  gridOptions: any;

  editingIndex: number;

  editing = false;
  constructor(private tradingPartnerOnboardingService: SellerBuyerService) {}

  ngOnInit(): void {
    this.gridOptions = {
      columnDefs: this.tradingPartnerOnboardingService.authorizationRuleColDefs,
      rowData: this.authenticationRules,
      rowModelType: 'clientSide',
      pagination: false,
      context: {
        componentParent: this,
      },
    };
  }

  onSubmitAuthenticationRule(form: NgForm) {
    if (form.valid) {
      const contactDetails = {
        srNo: this.editing
          ? this.authenticationRules[this.editingIndex].srNo
          : this.authenticationRules.length + 1,
        ...form.value,
        actions: [
          {
            index: 0,
            methodName: 'edit',
            type: 'ICON',
            displayName: 'Edit',
            icon: 'pi pi-pencil',
            paramList: 'srNo, moduleName, transactionName, authorizationRule',
          },
          {
            index: 1,
            methodName: 'delete',
            type: 'ICON',
            displayName: 'Delete',
            icon: 'pi pi-trash',
            paramList: 'srNo, moduleName, transactionName, authorizationRule',
          },
        ],
      };

      form.reset();

      if (this.editingIndex >= 0) {
        this.authenticationRules[this.editingIndex] = contactDetails;
        this.editingIndex = null;
        this.editing = false;
      } else {
        this.authenticationRules.push(contactDetails);
      }

      if (this.authorizationRulesGrid) {
        this.authorizationRulesGrid.setRowData(this.authenticationRules);
      }
    }
  }

  edit(srNo: string, moduleName: string, transactionName: string, authorizationRule: string) {
    this.editContactDetails({ srNo, moduleName, transactionName, authorizationRule });
  }

  delete(srNo: string, moduleName: string, transactionName: string, authorizationRule: string) {
    this.deleteContactDetails({ srNo, moduleName, transactionName, authorizationRule });
  }

  editContactDetails(data: any) {
    this.editingIndex = this.authenticationRules.findIndex(
      (authenticationRule: any) => authenticationRule.srNo === data.srNo,
    );

    this.editing = true;

    this.authenticationRule = {
      moduleName: data.moduleName,
      authorizationRule: data.authorizationRule,
      transactionName: data.transactionName,
    };
  }

  deleteContactDetails(data: any) {
    const i = this.authenticationRules.findIndex(
      (authenticationRule: any) => authenticationRule.srNo === data.srNo,
    );
    if (i >= 0) {
      if (this.editing && i === this.editingIndex) {
        this.editing = false;
        this.editingIndex = null;
      }

      this.authenticationRules.splice(i, 1);

      if (this.authorizationRulesGrid) {
        this.authorizationRulesGrid.setRowData(this.authenticationRules);
      }
    }
  }

  ngOnDestroy() {}
}
