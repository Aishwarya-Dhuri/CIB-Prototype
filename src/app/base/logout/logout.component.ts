import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  showFeedback: boolean = true;
  feedbackInitiate: boolean = false;

  rating: number = 0;
  remark: string = '';

  selectedFeedbackOptions: any[];

  moreFeedbackOptions = [
    { displayName: 'Ease of navigation', id: '1', checked: false },
    { displayName: 'Responsiveness of pages ', id: '2', checked: false },
    { displayName: 'Fulfills my requirement', id: '3', checked: false },
    { displayName: 'Others', id: '4', checked: false },
  ];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.setStyle(this.httpService.getAssetUrl('assets/images/logout-background/logout-image.jpg'));
    try{
      window['$_REVECHAT_API'] = undefined;
      var ebot = document.getElementById("reve-chat-container-div")
      ebot.remove()
    }catch (e){
      console.error('error while removing bot ', e);
    }
  }

  setStyle(image: string) {
    document.documentElement.style.setProperty('--logout-background-image', `url('${image}')`);
  }
}
