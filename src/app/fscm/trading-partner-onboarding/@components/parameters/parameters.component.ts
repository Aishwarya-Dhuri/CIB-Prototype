import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TradePartnerOnboardingParameters } from '../../@model/seller-buyer-onboarding.model';
import { SellerBuyerService } from '../../@service/seller-buyer-onboarding.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit, OnDestroy {
  @ViewChild('ipMappedGrid') ipMappedGrid: any;
  @ViewChild('parameterForm') parameterForm: any;

  @Input('parameters') parameters: TradePartnerOnboardingParameters;

  ipMapping = {
    startRange1: '',
    startRange2: '',
    startRange3: '',
    startRange4: '',
    endRange1: '',
    endRange2: '',
    endRange3: '',
    endRange4: '',
  };

  gridOptions: any;

  editingIndex: number = -1;

  editing = false;
  constructor(private tradingPartnerOnboardingService: SellerBuyerService) {}

  ngOnInit(): void {
    this.gridOptions = {
      columnDefs: this.tradingPartnerOnboardingService.ipMappingColDefs,
      rowData: this.parameters.ipMapping,
      rowModelType: 'clientSide',
      pagination: false,
      context: {
        componentParent: this,
      },
    };
  }

  onSubmitIpMapped(form: NgForm) {
    if (form.valid) {
      const startRange =
        this.ipMapping.startRange1 +
        '.' +
        this.ipMapping.startRange2 +
        '.' +
        this.ipMapping.startRange3 +
        '.' +
        this.ipMapping.startRange4;

      const endRange =
        this.ipMapping.endRange1 +
        '.' +
        this.ipMapping.endRange2 +
        '.' +
        this.ipMapping.endRange3 +
        '.' +
        this.ipMapping.endRange4;

      const ipMapping = {
        srNo: this.editing
          ? this.parameters.ipMapping[this.editingIndex].srNo
          : this.parameters.ipMapping.length + 1,
        startRange: startRange,
        endRange: endRange,
        actions: [
          {
            index: 0,
            methodName: 'edit',
            type: 'ICON',
            displayName: 'Edit',
            icon: 'pi pi-pencil',
            paramList: 'srNo, startRange, endRange',
          },
          {
            index: 1,
            methodName: 'delete',
            type: 'ICON',
            displayName: 'Delete',
            icon: 'pi pi-trash',
            paramList: 'srNo, startRange, endRange',
          },
        ],
      };

      form.reset();

      if (this.editingIndex >= 0) {
        this.parameters.ipMapping[this.editingIndex] = ipMapping;
        this.editingIndex = -1;
        this.editing = false;
      } else {
        this.parameters.ipMapping.push(ipMapping);
      }

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.parameters.ipMapping);
      }
    }
  }

  edit(srNo: string, startRange: string, endRange: string) {
    this.editIpMapped({ srNo, startRange, endRange });
  }

  delete(srNo: string, startRange: string, endRange: string) {
    this.deleteIpMapped({ srNo, startRange, endRange });
  }

  editIpMapped(data: any) {
    this.editingIndex = this.parameters.ipMapping.findIndex(
      (parameters: any) => parameters.srNo === data.srNo,
    );

    this.editing = true;

    const startRange = data.startRange.split('.');
    const endRange = data.endRange.split('.');

    this.ipMapping = {
      startRange1: startRange[0],
      startRange2: startRange[1],
      startRange3: startRange[2],
      startRange4: startRange[3],
      endRange1: endRange[0],
      endRange2: endRange[1],
      endRange3: endRange[2],
      endRange4: endRange[3],
    };
  }

  deleteIpMapped(data: any) {
    const i = this.parameters.ipMapping.findIndex(
      (parameters: any) => parameters.srNo === data.srNo,
    );
    if (i >= 0) {
      if (this.editing && i === this.editingIndex) {
        this.editing = false;
        this.editingIndex = -1;
      }

      this.parameters.ipMapping.splice(i, 1);

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.parameters.ipMapping);
      }
    }
  }

  ngOnDestroy() {}
}
