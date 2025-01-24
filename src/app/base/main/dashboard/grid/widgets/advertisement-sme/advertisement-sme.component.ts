import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-advertisement-sme',
  templateUrl: './advertisement-sme.component.html',
  styleUrls: ['./advertisement-sme.component.scss'],
})
export class AdvertisementSmeComponent implements OnInit {
  serverUrl: string;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.serverUrl = this.httpService.getAssetUrl('assets/images/advertisement/');
  }
}
