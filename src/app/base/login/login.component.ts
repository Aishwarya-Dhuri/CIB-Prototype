import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { LoginDetails } from '../@models/screen-content';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isMobileScreenLogin = false;
  loginDetails: LoginDetails;

  backgroundImageIndex: number;
  screenDetails: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.httpPost('screenDetails').subscribe((screenDetails: any) => {
      this.screenDetails = screenDetails;
      // this.setStyle();

      let i = 0;
      const bgImagesMaxIndex = screenDetails.backgroundImages.length - 1;

      this.setBackgroundImage(i);

      setInterval(() => {
        i++;
        this.setBackgroundImage(i);
        if (i === bgImagesMaxIndex) {
          i = -1;
        }
      }, 3000);
    });
  }

  setBackgroundImage(i: number) {
    this.backgroundImageIndex = i;
    this.setStyle(
      this.httpService.getAssetUrl(
        'assets/images/login-background/' + this.screenDetails.backgroundImages[i].link,
      ),
    );
  }

  setStyle(image: string) {
    document.documentElement.style.setProperty('--login-background-image', `url('${image}')`);
  }
}
