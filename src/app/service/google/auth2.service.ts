/// <reference path="../../../../node_modules/@types/gapi.auth2/index.d.ts" />
import { Injectable, NgZone } from "@angular/core";
import { GapiSession } from "./gapi.session";
import { from, Observable, of } from "rxjs";

import GoogleUser = gapi.auth2.GoogleUser;
import { delay, finalize, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class Auth2Service {
  googleUser: GoogleUser;
  authToken: string;
  constructor(private gapiSession: GapiSession, private zone: NgZone) {}

  get isSignedIn(): boolean {
    return this.gapiSession.googleAuth.isSignedIn.get();
  }

  signIn() {
    let signInObj = {
      prompt: "login"
    };
    
    let promise = this.gapiSession.googleAuth
      .signIn(signInObj)
      .then((googleUser: gapi.auth2.GoogleUser) => {
        this.googleUser = googleUser;
        this.authToken = googleUser.getAuthResponse().access_token;
        console.log(this.authToken);
      });
    return from(promise);
  }

  signOut() {
    return from(this.gapiSession.googleAuth.signOut()).pipe(delay(10));
  }
}
