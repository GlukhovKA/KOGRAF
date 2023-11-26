import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./system/home/home.component";
import {PersonalAccountClientComponent} from "./system/personal-account-client/personal-account-client.component";
import {PersonalAccountAdminComponent} from "./system/personal-account-admin/personal-account-admin.component";
import {AboutCarwashComponent} from "./system/about-carwash/about-carwash.component";
import { ConferenceClientComponent } from "./system/client-acc-conference/client-acc-conference";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'personal-account-client',
    component: PersonalAccountClientComponent
  },
  {
    path: 'client-account-conference',
    component: ConferenceClientComponent
  },
  {
    path: 'personal-account-admin',
    component: PersonalAccountAdminComponent
  },
  {
    path: 'about-carwash',
    component: AboutCarwashComponent
  },
  {
    path: '**',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
