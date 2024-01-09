import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../app.module";
import {Section} from "../shared/model/section";
import {map} from "rxjs";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";

@Component({
  selector: 'app-one-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.css']
})
export class ConferenceComponent implements OnInit {

  sections: Section[] = []

  currentConference!: Conference;
  currentConferenceId!: string;

  admins!: User[];

  formAddJob!: FormGroup;
  loggedUser!: LoginResponse;
  private baseUrl = AppConstants.baseURL;
  statusMap: Map<string, string> = AppConstants.conferenceStatusMap;

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

  ngOnInit() {
    if (!this.checkLogin()) {
      this.router.navigate(['']);
    }

    this.route.params.pipe(map(p => p['id'])).subscribe(e => this.currentConferenceId = e);

    if (this.isAdminAbsolute()) {
      this.http.get<Conference>(`${this.baseUrl}/api/v1/admin/conference/${this.currentConferenceId}`, this.httpOptions).subscribe((data: Conference) => {
        this.currentConference = data;
      });
    } else {
      this.http.get<Conference>(`${this.baseUrl}/api/v1/member/conference/${this.currentConferenceId}`, this.httpOptions).subscribe((data: Conference) => {
        this.currentConference = data;
      });
    }

    if (this.isSuperAdmin()) {
      this.http.get<User[]>(`${this.baseUrl}/api/v1/admin/user/getAdmins`, this.httpOptions).subscribe((data: User[]) => {
        this.admins = data;
      });
    }

    this.http.get<Section[]>(`${this.baseUrl}/api/v1/member/conference/${this.currentConferenceId}/sections`, this.httpOptions).subscribe((data: Section[]) => {
      this.sections = data;
    });

    this.formAddJob = this.formBuilder.group({
      // email: new FormControl('', [Validators.required, Validators.email]),
      // name: new FormControl('', [Validators.required]),
      // carwash: new FormControl('', [Validators.required]),
      // phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      // password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
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

  updateConference() {
    // обновление полей + добавление секций
    let request = {}
    this.http.post<Conference>(`${this.baseUrl}/api/v1/admin/conference/${this.currentConferenceId}/update`, JSON.stringify(request), this.httpOptions).subscribe((data: Conference) => {
      this.currentConference = data;
      console.log(data)
    });
  }

  /*downloadJobs() {
    this.http.get<Response>(`${this.baseUrl}/api/v1/files/downloadFiles/${this.currentConferenceId}`, this.httpOptions).subscribe((data: Response) => {
    });
  }*/

  checkUsers() {
    this.router.navigate([`/conference/${this.currentConferenceId}/jobs`]);
  }

  getStatsEmployee(location: string, event: Event) {
    // let carwash: string = location.substring(0, location.indexOf('_'));
    // let name: string = (event.target as HTMLOptionElement).value;
    // if (name == 'Выберите') {
    //   return;
    // }
    // this.http.get<number>(`${this.baseUrl}/api/admin/getNumberEmployeeOrders?employeeName=${name}&carWashLocation=${carwash}&start=01-01-2022&end=31-12-2022`, this.httpOptions).subscribe((data: number) => {
    //   this.numberOrders = data;
    // });
  }

  saveCarWash() {
    // const {name, phone, address} = this.formCarWash.value;
    // const carwash: Carwash = new Carwash()
    //
    // carwash.phone = '7' + phone;
    // carwash.name = name;
    // carwash.location = address;
    //
    // let request = {"name": name, "phone": '7' + phone, "location": address, "employees": [], "services": []};
    // this.formCarWash.reset();
    // this.http.post<boolean>(`${this.baseUrl}/api/admin/createCarWash`, JSON.stringify(request), this.httpOptions).subscribe((data: boolean) => {
    //   if (data) {
    //     this.carWashes.push(carwash);
    //   }
    // });
  }

  toPage(link: string) {
    this.router.navigate([link]);
  }
}
