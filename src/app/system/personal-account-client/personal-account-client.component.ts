import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, RadioControlValueAccessor, Validators} from "@angular/forms";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";
import {AppConstants} from "../../app.module";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";

@Component({
  selector: 'app-personal-account-client',
  templateUrl: './personal-account-client.component.html',
  styleUrls: ['./personal-account-client.component.css']
})
export class PersonalAccountClientComponent implements OnInit {

  conferences: Conference[] = [];
  currentConference!: Conference;
  formAddConf!: FormGroup;
  currentUser!: User;
  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;

  statuses: string[] = ['Класс A', 'Класс B', 'Класс C', 'Класс D', 'Класс E', 'Класс F', 'Класс G', 'Класс H'];

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


  checkLogin() {
    let json: string | null = sessionStorage.getItem("user");
    let obj: LoginResponse | null = json != null ? JSON.parse(json) : null;

    if (obj != null) {
      this.loggedUser = obj;
    } else {
      this.loggedUser = new LoginResponse();
      this.loggedUser.email = '';
    }
  }

  ngOnInit(): void {
    this.checkLogin();

    //this.httpOptions.headers.set('Authorization', this.loggedUser != null ? this.loggedUser.token : '')
    this.http.get<User>(`${this.baseUrl}/api/v1/member/getUser?email=${this.loggedUser.email}`, this.httpOptions).subscribe((data: User) => {
      this.currentUser = data;
      sessionStorage.setItem("user_info", JSON.stringify(data));
    })

    this.http.get<Conference[]>(`${this.baseUrl}/api/v1/member/conferences`, this.httpOptions).subscribe((data: Conference[]) => {
      this.conferences = data;
    });

    this.formAddConf = this.formBuilder.group({
      confName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      organization: new FormControl('', [Validators.required, Validators.minLength(4)]),
      description: new FormControl('', []),
      date_start: new FormControl('', [Validators.required]),
      date_end: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
  }

  addConf() {

  }

  updateStatus(event: Event) {
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

  updateCurrentOrder(id: bigint) {
    let order: Order | undefined = this.orders.find((e) => e.id == id);
    if (order) {
      this.currentOrder = order;
    }
  } */

  logout() {
    sessionStorage.clear();
  }

}
