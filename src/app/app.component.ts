import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sailpoint-task-client';
  selectedCity: string = '';
  setSelectedCity($event: string): void {
    this.selectedCity = $event;
  }
}
