import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { Auth2Service } from "src/app/service/google/auth2.service";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private auth2: Auth2Service,
    private router: Router
  ) {}

  ngOnInit() {}
  singIn() {
    this.auth2.signIn().subscribe(
      () => {
        // if (this.auth2.isSignedIn)
          // this.zone.run(() => this.router.navigate(["/dashboard/sale"])).then();
      },
      console.log,
      () => console.log("Complite")
    );
  }
  singOut() {
    this.auth2
      .signOut()
      .subscribe(console.log, console.log, () => console.log("Complite"));
  }

  get isSignedIn() {
    return this.auth2.isSignedIn;
  }
}
