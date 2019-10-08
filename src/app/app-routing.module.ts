import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { DataFormComponent } from './data-form/data-form.component';
import { HistoryComponent } from './history/history.component';
import { GoogleDriveComponent } from './google-drive/google-drive.component';




const routes: Routes = [
  { path: "sale", component: DataFormComponent },
  { path: "history", component: HistoryComponent },
  { path: "analysis", redirectTo: '/sale' },
  { path: "repository", component: GoogleDriveComponent },
  { path: "", redirectTo: '/sale' ,  pathMatch: 'full' },
  { path: "**", redirectTo: '/sale' },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
