import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../app.module";
import {Section} from "../shared/model/section";
import {firstValueFrom, map} from "rxjs";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";

@Component({
  selector: 'app-one-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.css']
})
export class ConferenceComponent implements OnInit, AfterViewInit {

  sections: Section[] = []

  currentConference: Conference = new Conference();
  currentConferenceId!: string;
  currentConferenceAdmin: User = new User();
  countUsers: number = 0;
  admins!: User[];

  formAddJob!: FormGroup;
  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;
  statusMap: Map<string, string> = AppConstants.conferenceStatusMap;

  addingJob: boolean = false;

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        // @ts-ignore
        //'Authorization': sessionStorage.getItem('user') != null ? JSON.parse(sessionStorage.getItem('user')).token : ''
      }
    )
  }

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private route: ActivatedRoute) {
  }

  checkLogin() {
    let json: string | null = sessionStorage.getItem("user");
    let obj: LoginResponse | null = json != null ? JSON.parse(json) : null;
    if (obj) {
      this.loggedUser = obj;
    }
    return obj != null;
  }

  ngAfterViewInit() {
    this.loadAllData()
  }

  ngOnInit() {
    if (!this.checkLogin()) {
      this.router.navigate(['']);
    }

    this.loadAllData()
  }

  loadAllData() {
    this.route.params.pipe(map(p => p['id'])).subscribe(e => this.currentConferenceId = e);

    this.getConference(this.currentConferenceId).then((data) => {
      this.currentConference = data;
      if (this.isSuperAdmin()) {
        this.getAdmins().then((data) => {
          this.admins = data;
          let optionalAdmin = this.admins.find((e) => this.currentConference.adminId == e.id)
          if (optionalAdmin != undefined) {
            this.currentConferenceAdmin = optionalAdmin
          }
        })
      }

      if (this.isAdminAbsolute()) {
        this.getConferenceUsers(this.currentConferenceId).then((data) => {
          this.countUsers = data
        });
      }
      this.getSections(this.currentConferenceId).then((data) => {
        this.sections = data
      })
    });
  }

  async getAdmins(): Promise<User[]> {
    return await firstValueFrom(this.http.get<User[]>(`${this.baseUrl}/api/v1/admin/user/getAdmins`, this.httpOptions));
  }

  async getConferenceUsers(id: string): Promise<number> {
    return await firstValueFrom(this.http.get<number>(`${this.baseUrl}/api/v1/admin/conference/${id}/users`, this.httpOptions));
  }

  async getConference(id: string): Promise<Conference> {
    return await firstValueFrom(this.http.get<Conference>(`${this.baseUrl}/api/v1/member/conference/${id}`, this.httpOptions));
  }

  async getSections(id: string): Promise<Section[]> {
    return await firstValueFrom(this.http.get<Section[]>(`${this.baseUrl}/api/v1/member/conference/${id}/sections`, this.httpOptions));
  }

  isAdminAbsolute(): boolean {
    return this.loggedUser.role == 'ADMIN' || this.loggedUser.role == 'SUPER_ADMIN';
  }

  isAdminConference(): boolean {
    let user_info: string | null = sessionStorage.getItem("user_info");
    let currentUser: User = user_info != null ? JSON.parse(user_info) : new User();
    if (this.loggedUser.role == 'ADMIN' && currentUser.id == this.currentConference.adminId) {
      this.currentConferenceAdmin = currentUser;
    }
    return (this.loggedUser.role == 'ADMIN' && currentUser.id == this.currentConference.adminId) || this.loggedUser.role == 'SUPER_ADMIN';
  }

  isSuperAdmin(): boolean {
    return this.loggedUser.role == 'SUPER_ADMIN';
  }

  checkUsers() {
    this.toPage(`/conference/${this.currentConferenceId}/jobs`);
  }

  editConference() {
    this.toPage(`/conference/${this.currentConferenceId}/edit`);
  }

  addJob() {
    this.addingJob = true;
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }
}
