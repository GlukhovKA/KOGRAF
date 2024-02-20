import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";
import {AppConstants} from "../../app.module";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";
import {Job} from "../shared/model/job";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  users: User[] = [];

  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;

  userStatuses: string[] = ['Активен', 'Заблокирован'];
  userRoles: string[] = ['Участник', 'Админ конференции'];
  userStatusMap: Map<string, string> = AppConstants.userStatusMap;
  userRoleMap: Map<string, string> = AppConstants.userRoleMap;

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    )
  }

  constructor(private router: Router,
              private formBuilder: FormBuilder,
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

  ngAfterViewInit() {
    this.loadAllData()
  }

  ngOnInit(): void {
    if (!this.checkLogin() || !this.isSuperAdmin()) {
      this.router.navigate(['']);
    }

    this.loadAllData()
  }

  loadAllData() {
    this.getUsers().then((data) => {
      this.users = data
    });
  }

  async getUsers(): Promise<User[]> {
    return await firstValueFrom(this.http.get<User[]>(`${this.baseUrl}/api/v1/admin/getAllUsers`, this.httpOptions));
  }

  updateStatus(event: Event): void {

  }

  changeRole(user: User, role: string) {
    this.http.post<boolean>(`${this.baseUrl}/api/v1/admin/user/appointrole?userId=${user.id}&role=${role}`, this.httpOptions).subscribe((data: boolean) => {
      if (data) {
        this.users.forEach(e=> {
          if (e.id == user.id) {
            user.role = role;
          }
        })
      }
    });
  }

  changeStatus(user: User, status: string) {
    this.http.post<boolean>(`${this.baseUrl}/api/v1/admin/user/changestatus?userId=${user.id}&status=${status}`, this.httpOptions).subscribe((data: boolean) => {
      if (data) {
        this.users.forEach(e=> {
          if (e.id == user.id) {
            user.status = status;
          }
        })
      }
    });
  }

  isSuperAdmin(): boolean {
    return this.loggedUser.role == 'SUPER_ADMIN';
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }

}
