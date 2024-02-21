import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoginResponse} from "../shared/model/login.response";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../app.module";
import {Section} from "../shared/model/section";
import {map} from "rxjs";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";
import {HttpService} from "../shared/services/http.service";

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
  statusMap: Map<string, string> = AppConstants.conferenceStatusMap;

  addingJob: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private httpService: HttpService) {
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
    this.route.params.pipe(map(p => p['id'])).subscribe(e => {
      this.currentConferenceId = e;

      this.httpService.getConference(this.currentConferenceId).then((data) => {
        this.currentConference = data;
        if (this.isSuperAdmin()) {
          this.httpService.getAdmins().then((data) => {
            this.admins = data;
            let optionalAdmin = this.admins.find((e) => this.currentConference.adminId == e.id)
            if (optionalAdmin != undefined) {
              this.currentConferenceAdmin = optionalAdmin
            }
          })
        }

        if (this.isAdminAbsolute()) {
          this.httpService.getConferenceUsers(this.currentConferenceId).then((data) => {
            this.countUsers = data
          });
        }
        this.httpService.getSections(this.currentConferenceId).then((data) => {
          this.sections = data
        })
      });
    });
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

  files: File[] = [];

  onSelectedFiles(event: Event) {
    this.files = []
    let files = (event.target as HTMLInputElement).files;
    const formData: FormData = new FormData();
    // this.files.forEach((file) => {
    //   formData.append("file", file);
    // })

    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        let file = files.item(i);
        if (file != null) {
          this.files.push(file);
        }
      }
    }

    console.log(this.files.reduce((prev, cur, ind) => `${prev} ${cur.name}`, ''))
  }

  saveFiles() {
    const formData: FormData = new FormData();
    this.files.forEach((file) => {
      formData.append("files", file);
    })

    this.httpService.uploadFiles(formData);
    this.addingJob = false;
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }
}
