import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DataFormComponent } from "./data-form/data-form.component";
import { HistoryComponent } from "./history/history.component";
import { GoogleDriveComponent } from "./google-drive/google-drive.component";
import { SigninComponent } from "./components/signin/signin.component";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoggedInGuard } from './service/google/LoggedInGuard';


const iw:Routes=[
  { path: "sale", component: DataFormComponent },
  { path: "history", component: HistoryComponent },
  { path: "analysis", redirectTo: "/dashboard/sale" },
  { path: "repository", component: GoogleDriveComponent },
];

const routes: Routes = [
  { path:"dashboard", component:DashboardComponent, children: iw, canActivate:[LoggedInGuard] },
  { path: "signin", component: SigninComponent },
  // { path: "sale", component: DataFormComponent },
  // { path: "history", component: HistoryComponent },
  // { path: "analysis", redirectTo: "/sale" },
  // { path: "repository", component: GoogleDriveComponent },
  { path: "", redirectTo: "/dashboard", pathMatch: "full"  },
  // { path: "**", redirectTo: "/sale" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[LoggedInGuard]
})
export class AppRoutingModule {}
