import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppConstants} from "../../app.module";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";
import {Job} from "../shared/model/job";
import {Conference} from "../shared/model/conference";
import {firstValueFrom, map} from "rxjs";
import {User} from "../shared/model/user";

@Component({
  selector: 'app-conference-jobs',
  templateUrl: './conference-jobs.component.html',
  styleUrls: ['./conference-jobs.component.css']
})
export class ConferenceJobsComponent implements OnInit, AfterViewInit {

  jobs: Job[] = [];

  currentConference!: Conference;
  currentConferenceId!: string
  countUsers: number = 0;

  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;
  statusMap: Map<string, string> = AppConstants.conferenceStatusMap;

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    )
  }

  httpOptionsFile = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    )
  }

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private route: ActivatedRoute) {
  }

  checkLogin(): boolean {
    let json: string | null = sessionStorage.getItem("user");
    let obj: LoginResponse | null = json != null ? JSON.parse(json) : null;

    if (obj != null) {
      this.loggedUser = obj;
      return true;
    } else {
      this.loggedUser = new LoginResponse();
      this.loggedUser.email = '';
      return false;
    }
  }

  ngAfterViewInit() {
    this.loadAllData()
  }

  ngOnInit(): void {
    if (!this.checkLogin() || !this.isAdminAbsolute()) {
      this.router.navigate(['']);
    }

    this.loadAllData()
  }

  loadAllData() {
    this.route.params.pipe(map(p => p['id'])).subscribe(e => this.currentConferenceId = e);

    this.getConference(this.currentConferenceId).then((data) => {
      this.currentConference = data;
      if (!this.isAdminConference()) {
        this.router.navigate(['']);
      }
    });

    this.getConferenceUsers(this.currentConferenceId).then((data) => {
      this.countUsers = data
    });

    this.getConferenceJobs(this.currentConferenceId).then((data) => {
      this.jobs = data;
    });
  }

  async getConferenceUsers(id: string): Promise<number> {
    return await firstValueFrom(this.http.get<number>(`${this.baseUrl}/api/v1/admin/conference/${id}/users`, this.httpOptions));
  }

  async getConference(id: string): Promise<Conference> {
    return await firstValueFrom(this.http.get<Conference>(`${this.baseUrl}/api/v1/member/conference/${id}`, this.httpOptions));
  }

  async getConferenceJobs(id: string): Promise<Job[]> {
    return await firstValueFrom(this.http.get<Job[]>(`${this.baseUrl}/api/v1/admin/jobs/${id}`, this.httpOptions));
  }

  isAdminAbsolute(): boolean {
    return this.loggedUser.role == 'ADMIN' || this.loggedUser.role == 'SUPER_ADMIN';
  }

  isAdminConference(): boolean {
    let user_info: string | null = sessionStorage.getItem("user_info");
    let currentUser: User = user_info != null ? JSON.parse(user_info) : new User();

    return (this.loggedUser.role == 'ADMIN' && currentUser.id == this.currentConference.adminId) || this.loggedUser.role == 'SUPER_ADMIN';
  }

  isSuperAdmin(): boolean {
    return this.loggedUser.role == 'SUPER_ADMIN';
  }

  downloadOneJob(job: Job) {
    this.http.get(`${this.baseUrl}/api/v1/files/downloadFile/${job.fileName}`, {
      observe: 'response',
      responseType: 'blob'
    })
      .subscribe(response => {
        let fileName = response.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        let blob: Blob = response.body as Blob;
        let a = document.createElement('a');
        if (fileName) {
          a.download = fileName;
          a.href = window.URL.createObjectURL(blob);
          a.click();
        }
      });
  }

  downloadJobs() {
    this.http.get(`${this.baseUrl}/api/v1/files/downloadFiles/${this.currentConferenceId}`, {
      observe: 'response', responseType: 'blob'
    }).subscribe(response => {
      let fileName = response.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let blob: Blob = response.body as Blob;
      let a = document.createElement('a');
      if (fileName) {
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      }
    });
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }

}
