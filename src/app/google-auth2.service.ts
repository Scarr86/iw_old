/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../node_modules/@types/gapi.auth2/index.d.ts" />
/// <reference path="../../node_modules/@types/gapi.client/index.d.ts" />
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_KEY: string = 'AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o';
const CLIENT_ID: string = '843806706192-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
const DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// const SCOPES: string = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const SCOPES: string = 'https://www.googleapis.com/auth/drive';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuth2Service {
  googleAuth: gapi.auth2.GoogleAuth;

  constructor() {
    // this.googleAuth = gapi.auth2.init(this.googleAuth);
  }

  initClient = new Observable(sub =>{
    gapi.load('client:auth2', () => {
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
          }).then(() => {
            console.log('initClient');
            this.googleAuth = gapi.auth2.getAuthInstance();
            sub.next( this.googleAuth.isSignedIn.get());
            this.googleAuth.isSignedIn.listen((isSigned:boolean)=>{
              sub.next(isSigned);
            });
          });
        });
  });

  isSigned(){
    return this.googleAuth.isSignedIn.get();
  }

  signIn() {
    return this.googleAuth.signIn({
      // prompt: 'consent'
      prompt: 'login'
    }).then((googleUser: gapi.auth2.GoogleUser) => {
      let prof = googleUser.getBasicProfile();
      // console.log('id', prof.getId());
      // console.log('name', prof.getName());
      // console.log('email', prof.getEmail());
    });
  }

  signOut(): void {
    this.googleAuth.signOut();
    console.log('signOut');
  }
}
