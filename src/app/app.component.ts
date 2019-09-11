import { Component, OnInit } from '@angular/core';
import { GoogleAuth2Service } from './google-auth2-service/google-auth2.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'irksweekend';
  constructor(private auth2: GoogleAuth2Service) {
  }

  ngOnInit() {
   this.auth2.initClient().subscribe(
     console.log,
     console.error,
     ()=> console.log("Google Ready"))
  }
}
