import { AfterViewChecked, Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, AfterViewChecked {
  status = 0;
  constructor() {}

  onClick(status: number) {
    this.status = status;
  }


  ngAfterViewChecked(): void {}

  ngOnInit(): void {}
}
