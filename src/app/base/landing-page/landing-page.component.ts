import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  constructor(private httpService: HttpService) {
    const imageUrl = this.httpService.getAssetUrl('assets/images/login-background/bg1.jpg');
    document.documentElement.style.setProperty('--landing-background-image', `url('${imageUrl}')`);
  }

  ngOnInit(): void {}
}
