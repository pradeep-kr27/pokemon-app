import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokemon-app';
  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
