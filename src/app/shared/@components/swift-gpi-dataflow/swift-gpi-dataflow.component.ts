import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from '../../@services/http.service';
import { ViewService } from '../../services/view-service/view-service';

@Component({
  selector: 'app-swift-gpi-dataflow',
  templateUrl: './swift-gpi-dataflow.component.html',
  styleUrls: ['./swift-gpi-dataflow.component.scss'],
})
export class SwiftGpiDataflowComponent implements OnInit {
  data: any[] = [];
  constructor(
    private viewService: ViewService,
    private menuService: MenuService,
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
    const id = this.viewService.getId();
    this.viewService.clearAll();

    const url = this.menuService.getSelectedServiceUrl() + '/private/swiftGpiData';
    this.httpService.httpPost(url).subscribe((response) => {
      this.data = response;
    });
  }
}
