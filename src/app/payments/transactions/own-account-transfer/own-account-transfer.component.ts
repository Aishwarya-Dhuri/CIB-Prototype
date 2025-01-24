import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';

@Component({
  selector: 'app-own-account-transfer',
  templateUrl: './own-account-transfer.component.html',
  styleUrls: ['./own-account-transfer.component.scss'],
})
export class OwnAccountTransferComponent implements OnInit {
  corporateType: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private menuService: MenuService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.corporateType = this.userService.userDetails.corporateType;
    const mode = this.viewService.getMode();
    if (mode === 'EDIT' || mode === 'VIEW') {
      this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/initiate');
    }
  }
}
