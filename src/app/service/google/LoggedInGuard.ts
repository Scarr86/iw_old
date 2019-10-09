import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { Auth2Service } from "./auth2.service";

export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private auth2: Auth2Service) {}

  canActivate(): Observable<boolean> | boolean {
    if (!this.auth2.isSignedIn) {
      this.router.navigate(["/signin"]);
    }
    return true;
  }
}
