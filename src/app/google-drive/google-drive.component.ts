import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GoogleAuth2Service } from '../google-auth2.service';
import { GoogleAuthService, GoogleApiService } from 'ng-gapi';
import { NgGapiAuth2Service } from '../ng-gapi-auth2.service';

import GoogleUser = gapi.auth2.GoogleUser;

@Component({
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
})
export class GoogleDriveComponent implements OnInit {

  isSigned: boolean = false;
  constructor(
    private auth2: GoogleAuth2Service, // my realizacia
    private cdr: ChangeDetectorRef, // ChangeDetectorRef проверяет все переменные для компонента и его дитей и перересовывает страницу
    private authService: GoogleAuthService,
    private gapiService: GoogleApiService,
    private ngGapiAuth2: NgGapiAuth2Service // my with ng-gapi

  ) {
    console.log('GoogleDriveComponent');

    // this.gapiService.onLoad().subscribe((value) => {
    //   console.log('onLoad', value);
    // });
  }

  ngOnInit() {
    this.auth2.initClient.subscribe(
      (isSigned: boolean) => {
        this.isSigned = isSigned;
        this.cdr.detectChanges();
        console.log('isSigned ', this.isSigned);
      }
    );
  }
  signIn() {
    this.auth2.signIn();
    // this.ngGapiAuth2.signIn();
  }

  signOut() {
    this.auth2.signOut();
    // this.ngGapiAuth2.signOut();
  }
  isLoggedIn(): boolean {
    //console.log('isSigned ', this.auth2.isSigned());
    return this.auth2.isSigned();

    return this.ngGapiAuth2.isUserSignedIn();
  }

  getUser() {
    let User:GoogleUser = this.ngGapiAuth2.getCurrentUser();
    console.log(JSON.stringify(User, null, 2));
  }


  /******************************************************* */

  getFileList() {

  }



}
