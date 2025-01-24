import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-external-links',
  templateUrl: './external-links.component.html',
  styleUrls: ['./external-links.component.scss']
})
export class ExternalLinksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }
  closeSidebar() {
    this.close.emit();
  }

  links = [
    {
      id: 1,
      name: 'Reserve Bank Of India',
      url: './../../../../assets/images/country/rbiLogo.png',
    },
    {
      id: 2,
      name: 'Securities and Exchange Board of India',
      url: './../../../../assets/images/country/sebiLogo.png',
    },
    {
      id: 3,
      name: 'Regulatory and Development Authority of India',
      url: './../../../../assets/images/country/irdaLogo.jpg',
    },
    {
      id: 4,
      name: 'Standup Mitra',
      url: './../../../../assets/images/country/sebiLogo.png',
    },
    {
      id: 5,
      name: 'Agri Weather Forecast',
      url: './../../../../assets/images/country/agriWeatherLogo.jpg',
    },
    {
      id: 6,
      name: 'MKisan Portal',
      url: './../../../../assets/images/country/mkisanLogo.jpg',
    },
    {
      id: 7,
      name: 'Agri Mandi Price',
      url: './../../../../assets/images/country/agriMandiLogo.jpg',
    },
    {
      id: 8,
      name: 'MSME Global Mart',
      url: './../../../../assets/images/country/msmeLogo.jpg',
    },
    {
      id: 9,
      name: 'GeM-Government e Marketplace',
      url: './../../../../assets/images/country/agriMandiLogo.jpg',
    }
  ]

  onClick(value) {
    if (value.id == 1) {
      window.open('https://www.rbi.org.in/', '_blank');
    } else if (value.id == 2) {
      window.open('https://www.sebi.gov.in/', '_blank');
    } else if (value.id == 3) {
      window.open('https://irdai.gov.in/', '_blank');
    } else if (value.id == 4) {
      window.open('https://www.standupmitra.in/', '_blank');
    } else if (value.id == 5) {
      window.open('https://enam.gov.in/web/weather_forecast', '_blank');
    } else if (value.id == 6) {
      window.open('https://mkisan.gov.in/', '_blank');
    } else if (value.id == 7) {
      window.open('https://agmarknet.gov.in/', '_blank');
    } else if (value.id == 8) {
      window.open('https://www.msmemart.com/', '_blank');
    } else if (value.id == 9) {
      window.open('https://gem.gov.in/', '_blank');
    }
  }

}
