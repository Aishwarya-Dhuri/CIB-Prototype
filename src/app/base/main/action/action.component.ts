import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';
import { Actions } from '../../@models/actions';
import { ActionService } from '../@services/action.service';
import { QuickLinksComponent } from '../right-sidebar/quick-links/quick-links.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  relationshipManager: boolean = false;
  showActionContainer: boolean = true;
  showQuickLinks: boolean = false;
  isFavourite: boolean = false;
  favouriteName: string = '';
  actions: Actions;
  activeAction: any;
  constructor(
    private sidebarService: SidebarService,
    private actionService: ActionService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.actionService.getShowActionContainer().subscribe((showActionContainer: boolean) => {
      this.showActionContainer = showActionContainer;
    });

    this.actionService.getActions().subscribe((actions: Actions) => {
      this.actions = actions;
    });
  }

  openQuickLinksSidebar() {
    this.sidebarService.showSidebar(QuickLinksComponent);
  }

  back() {
    if (this.actions?.componentRef?.back) {
      this.actions.componentRef.back();
    } else {
      this.location.back();
    }
  }

  onLinkClick() {
    if (this.actions.subHeading && this.actions.subHeadingLink) {
      this.router.navigate([this.actions.subHeadingLink], { relativeTo: this.route });
    }
  }

  saveFavourite() {
    this.isFavourite = true;
    this.showQuickLinks = false;
  }

  removeFavourite() {
    this.isFavourite = false;
  }
}
