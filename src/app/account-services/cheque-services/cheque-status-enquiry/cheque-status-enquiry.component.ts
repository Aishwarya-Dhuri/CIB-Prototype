import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ChequeStatusEnquiryService } from './@services/cheque-status-enquiry.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cheque-status-enquiry',
  templateUrl: './cheque-status-enquiry.component.html',
  styleUrls: ['./cheque-status-enquiry.component.scss'],
})
export class ChequeStatusEnquiryComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  inquiryType: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private chequeStatusEnquiryService: ChequeStatusEnquiryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Cheque Status Enquiry - Listing',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account-Services' },
      { label: 'Cheque Service' },
      { label: 'Cheque Status Enquiry' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.inquiryType = this.chequeStatusEnquiryService.inquiryType;
  }

  onDynamicFiltersReady(): void {
    this.chequeStatusEnquiryService.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  getSearchResults(filters: Filter[]): void {
    this.chequeStatusEnquiryService.inquiryType = this.inquiryType;
    this.chequeStatusEnquiryService.selectedFilters = filters;
    this.router.navigate(['./viewResult'], { relativeTo: this.route });
  }
}
