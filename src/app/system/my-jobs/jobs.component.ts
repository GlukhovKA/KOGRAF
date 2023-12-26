import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../app.module";
import {Job} from "../shared/model/job";
import {LoginResponse} from "../shared/model/login.response";
import {User} from "../shared/model/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  jobs: Job[] = [];

  currentUser!: User;
  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;

  constructor(private router: Router,
              private http: HttpClient) {
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

  ngOnInit(): void {
    if (!this.checkLogin()) {
      this.router.navigate(['']);
    }

    let user_info: string | null = sessionStorage.getItem("user_info");
    this.currentUser = user_info != null ? JSON.parse(user_info) : new User();

    this.http.get<Job[]>(`${this.baseUrl}/api/v1/member/jobs/${this.currentUser.id}`).subscribe((data: Job[]) => {
      this.jobs = data;
    });
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }
}
