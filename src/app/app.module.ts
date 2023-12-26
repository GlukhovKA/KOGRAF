import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {HomeComponent} from "./system/home/home.component";
import {NotFoundComponent} from "./system/not-found/not-found.component";
import {ConferencesComponent} from "./system/all-conferences/conferences.component";
import {ConferenceComponent} from "./system/one-conference/conference.component";
import {HeaderComponent} from "./system/shared/header/header.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { JobsComponent } from './system/my-jobs/jobs.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {IConfig, NgxMaskModule} from "ngx-mask";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ConferenceJobsComponent} from "./system/conference-jobs/conference-jobs.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    ConferencesComponent,
    ConferenceComponent,
    ConferenceJobsComponent,
    HeaderComponent,
    JobsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export class AppConstants {

  public static get baseURL(): string { return "http://localhost:8080"; }

  public static get statusMap(): Map<string, string> {
    let statusMap: Map<string, string> = new Map<string, string>();
    statusMap.set('ACTIVE', 'Открыта');
    statusMap.set('ON_HOLD', 'Временно закрыта');
    statusMap.set('CLOSED', 'Закрыта');
    statusMap.set('Открыта', 'ACTIVE');
    statusMap.set('Временно закрыта', 'ON_HOLD');
    statusMap.set('Закрыта', 'CLOSED');
    return statusMap;
  }
}
