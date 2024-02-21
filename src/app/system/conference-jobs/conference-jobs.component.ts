import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AppConstants} from "../../app.module";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";
import {Job} from "../shared/model/job";
import {Conference} from "../shared/model/conference";
import {map} from "rxjs";
import {User} from "../shared/model/user";
import {HttpService} from "../shared/services/http.service";

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
  statusMap: Map<string, string> = AppConstants.conferenceStatusMap;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private httpService: HttpService) {
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
    this.route.params.pipe(map(p => p['id'])).subscribe(e => {
      this.currentConferenceId = e;

      this.httpService.getConference(this.currentConferenceId).then((data) => {
        this.currentConference = data;
        if (!this.isAdminConference()) {
          this.router.navigate(['']);
        }
      });

      this.httpService.getConferenceUsers(this.currentConferenceId).then((data) => {
        this.countUsers = data
      });

      this.httpService.getConferenceJobs(this.currentConferenceId).then((data) => {
        this.jobs = data;
      });
    });
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
    this.httpService.downloadFile(job.fileName).then(response => this.processDownloadFile(response));
  }

  downloadJobs() {
    this.httpService.downloadFiles(this.currentConferenceId).then(response => this.processDownloadFile(response));
  }

  processDownloadFile(response: HttpResponse<any>) {
    let fileName = response.headers.get('content-disposition')?.split(';')[1].split('=')[1];
    let blob: Blob = response.body as Blob;
    let a = document.createElement('a');
    if (fileName) {
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    }
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }

}
