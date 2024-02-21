import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";
import {AppConstants} from "../../app.module";
import {Router} from "@angular/router";
import {LoginResponse} from "../shared/model/login.response";
import {HttpService} from "../shared/services/http.service";

@Component({
  selector: 'app-conferences',
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.css']
})
export class ConferencesComponent implements OnInit, AfterViewInit {

  conferences: Conference[] = [];

  currentUser!: User;
  loggedUser!: LoginResponse;

  statusMap: Map<string, string> = AppConstants.conferenceStatusMap;

  constructor(private router: Router,
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
    if (!this.checkLogin()) {
      this.router.navigate(['']);
    }

    this.loadAllData()
  }

  loadAllData() {
    this.httpService.getUserInfo(this.loggedUser.email).then((data) => {
      this.currentUser = data;
      sessionStorage.setItem("user_info", JSON.stringify(data));
    });

    this.httpService.getConferences().then((data) => {
      this.conferences = data;
    });
  }

  isAdmin(): boolean {
    return this.loggedUser.role == 'ADMIN' || this.loggedUser.role == 'SUPER_ADMIN';
  }

  isSuperAdmin(): boolean {
    return this.loggedUser.role == 'SUPER_ADMIN';
  }

  openConf(id: bigint): void {
    this.router.navigate([`/conference/${id}`]);
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }

}
