import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./system/home/home.component";
import {ConferencesComponent} from "./system/all-conferences/conferences.component";
import {ConferenceComponent} from "./system/one-conference/conference.component";
import {JobsComponent} from "./system/my-jobs/jobs.component";
import {ConferenceJobsComponent} from "./system/conference-jobs/conference-jobs.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'conferences',
    component: ConferencesComponent
  },
  {
    path: 'conference/:id/jobs',
    component: ConferenceJobsComponent
  },
  {
    path: 'conference/:id',
    component: ConferenceComponent,
  },
  {
    path: 'my-jobs',
    component: JobsComponent
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

export class AppRoutingModule {
}
