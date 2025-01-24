import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../shared/@services/http.service';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss'],
})
export class ServerErrorComponent implements OnInit {
  loading: boolean = true;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.checkServerConnectivity();
  }

  checkServerConnectivity() {
    this.loading = true;
    this.httpService.httpGet('checkConnection').subscribe(
      (response: any) => {
        this.router.navigate(['/login'], { relativeTo: this.route });
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        // this.getServerConnectivity();
      },
    );
  }
}
