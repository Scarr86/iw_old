/// <reference path="../../../node_modules/@types/gapi.auth2/index.d.ts" />

import { Injectable, NgZone } from '@angular/core';


const API_KEY: string = 'AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o';
const CLIENT_ID: string = '843806706192-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
// const CLIENT_ID: string = '-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com';
const DISCOVERY_DOCS: string[] = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// const SCOPES: string = 'https://www.googleapis.com/auth/drive.metadata.readonly';
const SCOPES: string = 'https://www.googleapis.com/auth/drive';

import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import { of, from } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class Auth2Service {
    googleAuth: GoogleAuth;
    user: GoogleUser;
    authToken;

    constructor(private zone: NgZone) {
    }

    initClient() {

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
              gapi.load("client:auth2", () => {
                return gapi.client
                  .init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES
                  })
                  .then(() => {
                    this.googleAuth = gapi.auth2.getAuthInstance();
                    console.log("Gapi READY");
                    resolve();
                  })
                  .catch(err => {
                    console.error(" Gapi FAIL", err);
                    reject(err);
                  });
              });
            });




        });
    }
    get isSignedIn(): boolean {
        return this.googleAuth.isSignedIn.get();
    }
    signIn() {
        // return of(1);

        let promise = this.googleAuth.signIn({
            prompt: 'login'
        }).then((googleUser: gapi.auth2.GoogleUser) => {
            this.user = googleUser;
            this.authToken = googleUser.getAuthResponse().access_token;
            console.log(this.authToken);

            // this.appRepository.User.add(googleUser.getBasicProfile());
        });
        return from(promise);
    }
    signOut() {
        // return of(1);
        return from(this.googleAuth.signOut()).pipe(delay(10));
    }

}