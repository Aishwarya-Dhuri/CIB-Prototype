import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import * as _ from 'lodash';
import { ClausesService } from './@services/clauses.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-clauses',
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.scss'],
})
export class ClausesComponent implements OnInit {
  @Input('productType') productType: string;
  @Input('parentRef') parentRef: any;

  clausesDataList: any[] = [];
  selectedClauseIndex: number = -1;
  isEdit: boolean = false;

  constructor(private httpService: HttpService, private clausesService: ClausesService) {}

  ngOnInit(): void {
    this.getClausesData();
  }

  getClausesData() {
    if (
      this.parentRef.parentRef.mode == 'EDIT' ||
      this.parentRef.parentRef.mode == 'VIEW' ||
      this.parentRef.parentRef.stepperDetails.currentStep ==
        this.parentRef.parentRef.stepperDetails.headings.length
    ) {
      this.clausesDataList = this.parentRef.parentRef.formData.clauses[0].documentMappingList;
    } else {
      const reqData = {
        productType: this.productType,
      };
      this.httpService
        .httpPost('trade/clauses/private/getClausesDataList', reqData)
        .subscribe((response: any) => {
          this.clausesDataList = response.dataList;
          this.getDocumentMapptingTagDataForClauses();
        });
    }
  }

  getDocumentMapptingTagDataForClauses(): void {
    this.clausesDataList = this.clausesDataList.map((clause: any) => {
      clause['isClausesCheck'] = clause.isClausesCheck ? clause.isClausesCheck : false;
      clause.documeMappingTAG.forEach((res) => {
        res['value'] = '';
      });
      clause.documeMappingTAG = _.sortBy(clause.documeMappingTAG, ['SRNO']);
      return clause;
    });
  }

  onClauseClick(i: number): void {
    this.selectedClauseIndex = i;
    if (!this.clausesDataList[i].isClausesCheck) {
      this.clausesDataList[this.selectedClauseIndex].documeMappingTAG.forEach((field: any) => {
        this.clausesDataList[this.selectedClauseIndex].DOCUMENTMAPPINGCLAUSETEXT =
          this.clausesDataList[
            this.selectedClauseIndex
          ].DOCUMENTMAPPINGCLAUSETEXT.toString().replaceAll(field.value, '<<' + field.LABEL + '>>');
        field.value = '';
      });
      this.selectedClauseIndex = -1;
    }
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.clausesDataList[this.selectedClauseIndex].documeMappingTAG.forEach((field: any) => {
        this.clausesDataList[this.selectedClauseIndex].DOCUMENTMAPPINGCLAUSETEXT =
          this.clausesDataList[
            this.selectedClauseIndex
          ].DOCUMENTMAPPINGCLAUSETEXT.toString().replaceAll(field.oldValue, field.value);
      });
      this.isEdit = false;
    } else {
      this.clausesDataList[this.selectedClauseIndex].documeMappingTAG.forEach((field: any) => {
        this.clausesDataList[this.selectedClauseIndex].DOCUMENTMAPPINGCLAUSETEXT =
          this.clausesDataList[
            this.selectedClauseIndex
          ].DOCUMENTMAPPINGCLAUSETEXT.toString().replaceAll('<<' + field.LABEL + '>>', field.value);
      });
    }
    this.clausesService.clausesDataList = this.clausesDataList;
    this.selectedClauseIndex = -1;
  }

  onClauseEdit(i: number): void {
    this.isEdit = true;
    this.selectedClauseIndex = i;
    this.clausesDataList[i].documeMappingTAG = this.clausesDataList[i].documeMappingTAG.map(
      (field: any) => {
        field['oldValue'] = field.value;
        return field;
      },
    );
  }
}
