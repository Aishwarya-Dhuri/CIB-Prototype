import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ScrollService } from 'src/app/shared/@services/scroll.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { StatutoryPaymentService } from './@services/statutory-payment.service';

@Component({
  selector: 'app-statutory-payment',
  templateUrl: './statutory-payment.component.html',
  styleUrls: ['./statutory-payment.component.scss'],
})
export class StatutoryPaymentComponent implements OnInit {
  @ViewChild('draftsContainer', { read: ElementRef })
  public draftsContainer: ElementRef<any>;

  @ViewChild('recentsContainer', { read: ElementRef })
  public recentsContainer: ElementRef<any>;

  statutoryPayment: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private scrollService: ScrollService,
    private statutoryPaymentService: StatutoryPaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Statutory Payment',
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
      { label: 'Payments' },
      { label: 'Transactions' },
      { label: 'Statutory Payment' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const mode = this.viewService.getMode();

    if (mode == 'EDIT' || mode == 'VIEW') {
      this.router.navigate(['./initiate'], { relativeTo: this.route });
      return;
    }

    this.httpService
      .httpPost('payments/transactions/statutoryPayment/statutoryPayment')
      .subscribe((statutoryPayment: any) => {
        this.statutoryPayment = statutoryPayment;
      });
  }

  onInitiate(institution: any) {
    this.statutoryPaymentService.institution = institution;

    this.router.navigate(['./initiate'], { relativeTo: this.route });
  }

  draftsContainerScrollLeft() {
    this.scrollService.scrollRight(this.draftsContainer, 150);
  }

  draftsContainerScrollRight() {
    this.scrollService.scrollLeft(this.draftsContainer, 150);
  }

  getNoOfDraftVisibleOnScreen(): number {
    return this.scrollService.getNoOfItemsVisibleOnScreen(
      300,
      this.statutoryPayment.drafts ? this.statutoryPayment.drafts.length : 0,
    );
  }
  getNoOfRecentVisibleOnScreen(): number {
    return this.scrollService.getNoOfItemsVisibleOnScreen(
      300,
      this.statutoryPayment.recents ? this.statutoryPayment.recents.length : 0,
    );
  }

  recentsContainerScrollLeft() {
    this.scrollService.scrollRight(this.recentsContainer, 150);
  }

  recentsContainerScrollRight() {
    this.scrollService.scrollLeft(this.recentsContainer, 150);
  }
}
