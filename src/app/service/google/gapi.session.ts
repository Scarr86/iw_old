/// <reference path="../../../../node_modules/@types/gapi.auth2/index.d.ts" />

import { Injectable } from "@angular/core";

const API_KEY: string = "AIzaSyCofOM8sRo0bZRPxjnZxabuOtjuK6xN48o";

const CLIENT_ID: string =
  "843806706192-trsuvvlpi50vohsul3imgjl20o7fnbuo.apps.googleusercontent.com";

const DISCOVERY_DOCS: string[] = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

const SCOPES: string = "https://www.googleapis.com/auth/drive";

import GoogleAuth = gapi.auth2.GoogleAuth;

@Injectable({ providedIn: "root" })
export class GapiSession {
  googleAuth: GoogleAuth;

  initClient() {
    let initObj = {
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    };

    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", () => {
        return gapi.client
          .init(initObj)
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
  }
}
