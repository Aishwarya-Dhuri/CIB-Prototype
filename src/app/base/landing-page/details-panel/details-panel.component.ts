import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.scss'],
})
export class DetailsPanelComponent implements OnInit {
  userDetails: any = {};
  profileImageUrl: string;

  constructor(private userService: UserService, private httpService: HttpService) {
    this.profileImageUrl = this.httpService.getAssetUrl(
      'assets/header-images/dummy-user-profile-image.png',
    );
  }

  ngOnInit(): void {
    this.userDetails = this.userService.userDetails;
  }
}
