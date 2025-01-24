import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-raise-dispute',
  templateUrl: './raise-dispute.component.html',
  styleUrls: ['./raise-dispute.component.scss']
})
export class RaiseDisputeComponent implements OnInit {

  loading: boolean = true;
  disputeReasonList: any[];
  selectedAccessType: string;
  selectedAccessTypeName: string;
  files: any;

  isSubmit: boolean = false;

  editMode = false;
  //@Output() onReview = new EventEmitter<void>();

  ngOnInit(): void {
    // this.loading = true;

    this.disputeReasonList = [
      { id: 'AMOUNT_DEBITED_BUT_NOT_CREDITED_TO_BENEFICIARY', displayName: 'Amount debited but not credited to beneficiary' },
      { id: 'SUSPICIOUS_CREDIT_TRANSFER', displayName: 'Suspicious credit transfer' },
      { id: 'CASH_NOT_DISPENSED_FOR_THE_DEBIT_AMOUNT', displayName: 'Cash not dispensed for the debit amount' },
      { id: 'CASH_WAS_DISPENSED_PARTIALLY_BUT_FULL_AMOUNT_DEBITED', displayName: ' Cash was dispensed partially, but full amount debited' },
      { id: 'OTHERS', displayName: 'Others' },
    ];

    // this.accessTypeChanged(this.accessTypeList[0]);
  }

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  transactionDate = "01 June 2023";
  valueDate = "01 June 2023";
  referenceNumber = "CBF874345643500";
  amount = "INR  726,578.95";

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.status = 'Uploading';
      item.fileName = item.name;
      item.fileSize = item.size;
      this.files.push(item);
    }
    // this.uploadFilesSimulator(0);
    //  this.onSelected.emit(this.files);
  }

  onFileDropoverAndLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.prepareFilesList(files);
    }
  }

  cancel() {
    this.router.navigate(['/accountServices/services/accountSummary'], { relativeTo: this.route });
  }

}
