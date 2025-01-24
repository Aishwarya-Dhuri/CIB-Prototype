import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { CreditCardControlsService } from './@services/credit-card-controls.service';
import { ViewService } from '../../../shared/services/view-service/view-service';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';

@Component({
  selector: 'app-credit-card-controls',
  templateUrl: './credit-card-controls.component.html',
  styleUrls: ['./credit-card-controls.component.scss'],
  providers: [CreditCardControlsService],
})
export class CreditCardControlsComponent implements OnInit, OnDestroy {
  review = false;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private cardControlsService: CreditCardControlsService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Letter Of Credit - Initiate',
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
      { label: 'Account Services' },
      { label: 'Credit Card' },
      { label: 'Set Card Controls / Usage Limits' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.cardControlsService.getViewData();

    this.cardControlsService.viewMode = this.viewService.getMode() === 'VIEW';

    this.review = this.cardControlsService.viewMode;
  }

  ngOnDestroy() {
    this.cardControlsService.activeStepIndex = 0;
    this.cardControlsService.viewMode = false;
    this.cardControlsService.resetData();
  }
}
