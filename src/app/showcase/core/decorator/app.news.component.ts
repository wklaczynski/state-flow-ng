import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './app.news.component.html',
  styleUrls: ['./styles/decorator.scss'],
})
export class AppNewsComponent {

  @Input() active: boolean;

  //@Output() onNewsHide: EventEmitter<any> = new EventEmitter();

  hideNews(event: Event) {
    //this.onNewsHide.emit();
    event.preventDefault();
  }

}