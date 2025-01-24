import { Component, OnInit } from '@angular/core';
import { LinkDetail } from 'src/app/base/@models/screen-content';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerData: {
    socialMedias: { icon: string; link: string }[];
    copyRight: string;
    links: LinkDetail[];
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.httpPost('footer').subscribe((footerData: any) => {
      this.footerData = footerData;
    });
  }

  onLinkClick(link: any) {
    if (link.linkType == 'LINK') {
      window.open(link.link, '_blank');
    } else if (link.linkType == 'USERACTIVATIONLINK') {
      const userActivationLink =
        this.httpService.getProtocol() +
        '//' +
        this.httpService.getHostName() +
        ':4201/userActivation?key=26711417bea7fa6247e1875ede383ec07574bf14180b273381401c515f22a5484f6e7139152115d1daffeebd3bd4bb46';

      window.open(userActivationLink, '_blank');
    }
  }
}
