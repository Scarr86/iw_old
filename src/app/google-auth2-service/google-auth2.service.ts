/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.auth2/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.client/index.d.ts" />
import { Injectable } from '@angular/core';
import { Observable, from, of, observable, forkJoin, concat } from 'rxjs';
import { map, catchError, delay, tap, mergeMap } from 'rxjs/operators';

const API_KEY: string = 'AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o';
const CLIENT_ID: string = '843806706192-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
// const CLIENT_ID: string = '-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
const DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// const SCOPES: string = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const SCOPES: string = 'https://www.googleapis.com/auth/drive';

import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;

@Injectable()
export class GoogleAuth2Service {
  googleAuth: GoogleAuth;
  private user: GoogleUser = undefined;

  token;

  constructor() {
    console.log("Auth2 service");
  }


  onLoad(): Observable<any> {

    return new Observable(obs => {
      gapi.load('client:auth2', () => {
        obs.next("onLoad");
        obs.complete();
      })
    })
  }

  onInit(): Observable<any> {
    return new Observable(obs => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        this.googleAuth = gapi.auth2.getAuthInstance();
        obs.next("onInit");
        obs.complete()
      }).catch(
        (err) => obs.error(err))
    })
  }

  initClient(): Observable<any> {
    return concat(this.onLoad(), this.onInit())
  }

  isSignedIn() {
    if (this.user)
      return this.user.isSignedIn();
    else return false;
  }

  signIn(): Observable<any> {

    return new Observable(obs => {
      this.googleAuth.signIn({
        // prompt: 'consent'
        prompt: 'login'
      })
      .then((user: GoogleUser) => {
        this.user = user;
        this.token = this.user.getAuthResponse().access_token;
        obs.next();
        obs.complete();
      })
      .catch((err)=> obs.error(new Error("signIn Fail " + err)))
    })
  }

  signOut(): Observable<any> {
    return of(this.googleAuth.signOut()).pipe(delay(10));
  }
}
