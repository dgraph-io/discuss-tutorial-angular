import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'message-board-app';
  modal: boolean = false;

  openModal() {
    this.modal = true;
  }
}
