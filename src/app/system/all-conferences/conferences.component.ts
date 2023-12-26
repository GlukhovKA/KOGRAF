import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";
import {AppConstants} from "../../app.module";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";

@Component({
  selector: 'app-conferences',
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.css']
})
export class ConferencesComponent implements OnInit {

  conferences: Conference[] = [];
  // static currentConference: Conference;

  formAddConf!: FormGroup;
  currentUser!: User;
  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;

  statuses: string[] = ['Открыта', 'Временно приостановлена', 'Закрыта'];
  statusMap: Map<string, string> = AppConstants.statusMap;

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

  ngOnInit(): void {
    if (!this.checkLogin()) {
      this.router.navigate(['']);
    }

    //this.httpOptions.headers.set('Authorization', this.loggedUser != null ? this.loggedUser.token : '')
    this.http.get<User>(`${this.baseUrl}/api/v1/member/getUser?email=${this.loggedUser.email}`, this.httpOptions).subscribe((data: User) => {
      this.currentUser = data;
      sessionStorage.setItem("user_info", JSON.stringify(data));
    })

    if (this.loggedUser.role == 'ADMIN') {
      this.http.get<Conference[]>(`${this.baseUrl}/api/v1/admin/conferences`, this.httpOptions).subscribe((data: Conference[]) => {
        this.conferences = data;
      });
    } else {
      this.http.get<Conference[]>(`${this.baseUrl}/api/v1/member/conferences`, this.httpOptions).subscribe((data: Conference[]) => {
        this.conferences = data;
      });
    }

    this.formAddConf = this.formBuilder.group({
      confName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      organization: new FormControl('', [Validators.required, Validators.minLength(4)]),
      description: new FormControl('', []),
      date_start: new FormControl('', [Validators.required]),
      date_end: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
  }

  addConf(): void {
    let dateStart: string = this.formAddConf.value.date_start.replace('T', ' ') + ':00';
    let dateEnd: string = this.formAddConf.value.date_end.replace('T', ' ') + ':00';
    let request = {
      "title": this.formAddConf.value.confName,
      "organization": this.formAddConf.value.organization,
      "description": this.formAddConf.value.description,
      "startDate": dateStart,
      "endDate": dateEnd,
      "status": this.statusMap.get(this.formAddConf.value.status)
    };
    this.http.post<Conference>(`${this.baseUrl}/api/v1/admin/conference/create`, JSON.stringify(request), this.httpOptions).subscribe((data: Conference) => {
      this.conferences.push(data);
    })
  }

  updateStatus(event: Event): void {

  }

  isAdmin(): boolean {
    return this.loggedUser.role == 'ADMIN';
  }

  openConf(id: bigint): void {
    this.router.navigate([`/conference/${id}`]);
  }

  /* saveReview() {
    const text: string = this.formReview.controls['text'].value;

    this.orders.forEach((e) => {
      if (e.id == this.currentOrder.id) {
        e.grade = this.grade;
        e.text = text;
      }
    })
    this.http.put<boolean>(`${this.baseUrl}/api/customer/gradeOrder?id=${this.currentOrder.id}&grade=${this.grade}&text=${text}`, this.httpOptions).subscribe(() => {
    });
    this.grade = 1;
  }
*/
  toPage(link: string) {
    this.router.navigate([link]);
  }

}
