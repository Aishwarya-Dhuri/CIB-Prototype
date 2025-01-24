import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-clauses-modal',
  templateUrl: './clauses-modal.component.html',
  styleUrls: ['./clauses-modal.component.scss'],
})
export class ClausesModalComponent implements OnInit {
  @ViewChild('form') form: any;
  @Input('parentRef') parentRef: any;
  @Input('clause') clause: any;
  @Input('index') index: any;

  constructor() {}

  ngOnInit(): void {}

  cancel() {
    if (this.parentRef.isEdit) {
      this.parentRef.selectedClauseIndex = -1;
      this.parentRef.isEdit = false;
    } else {
      this.clause.documeMappingTAG.forEach((field: any) => {
        field.value = '';
      });
      this.clause.isClausesCheck = false;
    }
  }
}
