import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-help-options',
  templateUrl: './help-options.component.html',
  styleUrls: ['./help-options.component.scss'],
})
export class HelpOptionsComponent implements OnInit {
  @Output('onShowFeedback') onShowFeedback: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {}
  routeTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}
