import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/@services/user.service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { Menu } from '../../@models/menus';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { MenuService } from '../../@services/menu.service';

@Component({
  selector: 'app-short-menus',
  templateUrl: './short-menus.component.html',
  styleUrls: ['./short-menus.component.scss'],
})
export class ShortMenusComponent implements OnInit {
  @Input('menus') menus?: Menu[];

  constructor(
    private menuService: MenuService,
    private userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  onMenuClick(menu: string) {
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Dashboard' },
      { label: menu },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const dashboardType: string = menu
      .toLowerCase()
      .split(' ')
      .map((m: string, i: number) => {
        if (i !== 0) {
          return m
            .split('')
            .map((w: string, j: number) => {
              if (j == 0) return w.toUpperCase();
              return w;
            })
            .join('');
        }
        return m;
      })
      .join('');

    this.menuService.setSelectedMenu(null);
    this.menuService.setSelectedLink(null);

    this.userService.setDashboardType(dashboardType);
    this.router.navigate(['/dashboard', dashboardType], { relativeTo: this.route });
  }
}
