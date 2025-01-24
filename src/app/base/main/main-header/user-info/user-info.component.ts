import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SidebarService } from 'src/app/shared/@services/sidebar.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { environment } from '../../../../../environments/environment';
import { ConfigComponent } from '../../right-sidebar/config/config.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Input('userDetails') userDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private sidebarService: SidebarService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {}

  routeTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  openConfigSidebar() {
    this.sidebarService.showSidebar(ConfigComponent);
  }

  logout() {
    this.httpService.httpPost('login/private/logout').subscribe(() => {
      this.userService.resetLoginDetails();
      sessionStorage.removeItem('securityId');
      this.router.navigate(['/logout'], { relativeTo: this.route });
      console.log(environment.langData);
      // this.widgetService.setDashboard([]);
    });
  }
}
