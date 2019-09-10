/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.auth2/index.d.ts" />
/// <reference path="../../../node_modules/@types/gapi.client/index.d.ts" />
import { Injectable } from '@angular/core';
import { Observable, from, of, observable, forkJoin } from 'rxjs';
import { map, catchError, delay, tap, mergeMap } from 'rxjs/operators';

const API_KEY: string = 'AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o';
const CLIENT_ID: string = '843806706192-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
// const CLIENT_ID: string = '-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
const DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// const SCOPES: string = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const SCOPES: string = 'https://www.googleapis.com/auth/drive';

import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuth2Service {
  googleAuth: GoogleAuth;
  private user: GoogleUser = undefined;

  token;

  constructor() { }
  

  onLoad():Observable<any>{
    
   return  new Observable( obs=>{
      gapi.load('client:auth2', () => {
        obs.next("onLoad");
        obs.complete();
      });
    })
      
    //gapi.load('client:auth2', () => obs = of("onLoad") );
    //return obs;
  }
    
  onInit():Observable<any>{
    return from(gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })).pipe(tap(()=>{
        this.googleAuth = gapi.auth2.getAuthInstance();
      }));
  }

  initClient(): Observable<any> {

    return this.onLoad().pipe(mergeMap(res=>{
      console.log(res);
      return this.onInit();
    }))
  }

  isSignedIn() {
    if(this.user)
     return this.user.isSignedIn();
    else return false;
  }

  signIn(): Observable<any> {
    let promise: Promise<any> = this.googleAuth.signIn({
      // prompt: 'consent'
      prompt: 'login'
    });
    return from(promise).pipe( tap((user: GoogleUser) => {
      this.user = user;
      this.token = this.user.getAuthResponse().access_token;
      // console.log(this.user.getAuthResponse().access_token);
      // console.log(this.user.isSignedIn());
      
    }));
  }

  signOut(): Observable<any> {
    
    return of(this.googleAuth.signOut()).pipe(delay(10));
  }
}
