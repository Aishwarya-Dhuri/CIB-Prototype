import { Component, OnInit } from '@angular/core';
import { collectionSummaryInitaite } from './@model/collection-summary-initiate.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { BreadcrumbService } from '../../main/@services/breadcrumb.service';

@Component({
  selector: 'app-collection-summary-initiate',
  templateUrl: './collection-summary-initiate.component.html',
  styleUrls: ['./collection-summary-initiate.component.scss']
})
export class CollectionSummaryInitiateComponent implements OnInit {
  selectedPattern: any;
  noOfTime: any = 1;

  constructor(private breadcrumbService: BreadcrumbService,) { }
  formData: collectionSummaryInitaite = new collectionSummaryInitaite();
  stepperDetails: Stepper = {
    masterName: 'Biller Registration',
    currentStep: 1,
    isOnlyFooter: true,
    isSaveDraftApplicable: false,
    isSaveAsTemplateApplicable: false,
    isSecondLastStepLabelAsReview: true,
    headings: ['', ''],
  };

  patternList: any = [{ displayName: 'Daily', value: 'daily' },
  { displayName: 'Weekly', value: 'weekly' },
  { displayName: 'Monthly', value: 'monthly' },
  { displayName: 'Quarterly', value: 'quarterly' },
  { displayName: 'Yearly', value: 'yearly' },
  ]

  weekList: any = [{ displayName: 'Mon', value: 'Mon' },
  { displayName: 'Tue', value: 'Tue' },
  { displayName: 'Wed', value: 'Wed' },
  { displayName: 'Thu', value: 'Thu' },
  { displayName: 'Fri', value: 'Fri' },
  { displayName: 'Sat', value: 'Sat' },
  { displayName: 'Sun', value: 'Sun' },
  ]

  ngOnInit(): void {
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Collections' },
      { label: 'Collection Summary' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    this.selectedPattern = this.patternList[0];
  }

  getExistingSubscribers() {
  }

  changePattern(data: any) {
    this.selectedPattern = data;
  }

  addTime() {
    if (this.noOfTime === 3) {
      return;
    }
    this.noOfTime++;
  }

}
