import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { environment } from 'src/environments/environment';
import { ChequeImageRendererComponent } from '../@components/cheque-image-renderer/cheque-image-renderer.component';
import { ChequeStatusEnquiryService } from '../@services/cheque-status-enquiry.service';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.scss'],
})
export class ViewResultComponent implements OnInit {
  loading: boolean = false;
  isChequeImage: boolean = false;
  chequeImageUrl: string = '';
  filters: any[] = [];
  viewPort: string;
  colDefUrl: string;
  dataUrl: string;

  gridOptions = {
    context: { componentParent: this },
    frameworkComponents: {
      chequeImageCellRenderer: ChequeImageRendererComponent,
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewPortService: ViewportService,
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private chequeStatusEnquiryService: ChequeStatusEnquiryService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.viewPortService.getViewport().subscribe((viewPort: any) => {
      this.viewPort = viewPort;
    });

    const actions: Actions = {
      heading: 'Cheque Status Enquiry - Search Result',
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
      { label: 'Account Service' },
      { label: 'Cheque Service' },
      { label: 'Cheque Status Enquiry' },
      { label: 'Search Result' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const inquiryType = this.chequeStatusEnquiryService.inquiryType;

    this.colDefUrl = `accountServices/chequeServices/chequeStatusEnquiry/private/${
      inquiryType == 'Cheque Issued'
        ? 'chequeIssuedStatusEnquiryColDefs'
        : 'chequeCollectedStatusEnquiryColDefs'
    }`;
    this.dataUrl = 'accountServices/chequeServices/chequeDataService/private/getAllList';

    this.filters = this.chequeStatusEnquiryService.selectedFilters;
    this.loading = false;
  }

  onChequeSnippetClick(isChequeImage: any, imageUrl: string): void {
    this.isChequeImage = isChequeImage;
    this.chequeImageUrl = environment.serverUrl + '/' + imageUrl;
  }

  onClearSearchClick(): void {
    this.chequeStatusEnquiryService.selectedFilters = [];
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onModifyClick() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
