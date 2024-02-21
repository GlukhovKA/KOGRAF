import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginResponse} from "../shared/model/login.response";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form!: FormGroup;
  loggedUser!: LoginResponse;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.checkLogin();
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

  isAdmin(): boolean {
    return this.loggedUser.role == 'ADMIN' || this.loggedUser.role == 'SUPER_ADMIN';
  }

  isSuperAdmin(): boolean {
    return this.loggedUser.role == 'SUPER_ADMIN';
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }
}
