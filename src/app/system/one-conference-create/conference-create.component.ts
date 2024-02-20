import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginResponse} from "../shared/model/login.response";
import {ActivatedRoute, Router} from "@angular/router";
import {AppConstants} from "../../app.module";
import {Section} from "../shared/model/section";
import {firstValueFrom, map} from "rxjs";
import {Conference} from "../shared/model/conference";
import {User} from "../shared/model/user";
import {SectionDto} from "../shared/dto/section.dto";

@Component({
  selector: 'app-one-conference-create',
  templateUrl: './conference-create.component.html',
  styleUrls: ['./conference-create.component.css']
})
export class ConferenceCreateComponent implements OnInit, AfterViewInit {

  loadingConference!: Promise<Conference>

  sectionsMap: Map<string, Section> = new Map;
  sections: Section[] = [];

  currentConference!: Conference;
  currentConferenceId!: string;

  admins!: User[];
  currentAdmin!: User | undefined;

  formCreateConference!: FormGroup;
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

  ngAfterViewInit() {
    this.loadAllData()
  }

  ngOnInit() {
    if (!this.checkLogin() || !this.isAdminAbsolute()) {
      this.router.navigate(['']);
    }

    this.formCreateConference = this.formBuilder.group({
      adminName: new FormControl('',),
      confName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      organization: new FormControl('', [Validators.required, Validators.minLength(4)]),
      description: new FormControl('', []),
      date_start: new FormControl('', [Validators.required]),
      date_end: new FormControl('', [Validators.required]),
    })

    this.loadAllData()
  }

  loadAllData() {
    this.route.params.pipe(map(p => p['id'])).subscribe(e => this.currentConferenceId = e);

    if (this.isSuperAdmin()) {
      this.getAdmins().then((data) => {
        this.admins = data;

        if (this.currentConferenceId != null) {
          this.getConference(this.currentConferenceId).then((data) => {

            this.currentConference = data;
            if (this.isSuperAdmin()) {
              let findAdmin = this.admins.find((e) => this.currentConference.adminId == e.id);
              this.currentAdmin = findAdmin
              this.formCreateConference.controls['adminName'].setValue(findAdmin != undefined ? findAdmin.fullName : undefined);
            }

            this.formCreateConference.controls['confName'].setValue(this.currentConference.title)
            this.formCreateConference.controls['organization'].setValue(this.currentConference.organization)
            this.formCreateConference.controls['description'].setValue(this.currentConference.description)
            this.sections = this.currentConference.sections.sort((a, b) => a.id > b.id ? 1 : 0)
            this.sections.forEach((e) => this.sectionsMap.set(e.title, e))
          });
        }
      })
    }
  }

  async getAdmins(): Promise<User[]> {
    return await firstValueFrom(this.http.get<User[]>(`${this.baseUrl}/api/v1/admin/user/getAdmins`, this.httpOptions));
  }

  async getConference(id: string): Promise<Conference> {
    return await firstValueFrom(this.http.get<Conference>(`${this.baseUrl}/api/v1/member/conference/${id}`, this.httpOptions));
  }

  createConference() {
    // обновление полей + добавление секций
    let sectionsDto: SectionDto[] = []
    this.sections.forEach((e) => {
      sectionsDto.push(new SectionDto(e))
    })
    let dateStart: string = this.formCreateConference.value.date_start.replace('T', ' ') + ':00';
    let dateEnd: string = this.formCreateConference.value.date_end.replace('T', ' ') + ':00';
    let request = {
      "title": this.formCreateConference.value.confName,
      "organization": this.formCreateConference.value.organization,
      "description": this.formCreateConference.value.description,
      "startDate": dateStart,
      "endDate": dateEnd,
      "status": 'ON_HOLD',
      "sections": sectionsDto
    };

    this.http.post<Conference>(`${this.baseUrl}/api/v1/admin/conference/create`, JSON.stringify(request), this.httpOptions).subscribe((data: Conference) => {
      if (this.currentAdmin != undefined) {
        this.http.post<void>(`${this.baseUrl}/api/v1/admin/conference/${data.id}/appointadmin?userId=${this.currentAdmin.id}`, this.httpOptions).subscribe()
      }
      this.toPage(`/conference/${data.id}`)
    });
  }

  updateConference() {
    // обновление полей + добавление секций
    let sectionsDto: SectionDto[] = []
    this.sections.forEach((e) => {
      sectionsDto.push(new SectionDto(e))
    })
    let dateStart: string = this.formCreateConference.value.date_start.replace('T', ' ') + ':00';
    let dateEnd: string = this.formCreateConference.value.date_end.replace('T', ' ') + ':00';
    let request = {
      "id": this.currentConferenceId,
      "title": this.formCreateConference.value.confName,
      "organization": this.formCreateConference.value.organization,
      "description": this.formCreateConference.value.description,
      "startDate": dateStart,
      "endDate": dateEnd,
      "status": 'ON_HOLD',
      "sections": sectionsDto
    };

    this.http.put<Conference>(`${this.baseUrl}/api/v1/admin/conference/${this.currentConferenceId}/update`, JSON.stringify(request), this.httpOptions).subscribe((data: Conference) => {
      if (this.currentAdmin != undefined && this.currentAdmin.id != data.adminId) {
        this.http.post<void>(`${this.baseUrl}/api/v1/admin/conference/${data.id}/appointadmin?userId=${this.currentAdmin.id}`, this.httpOptions).subscribe()
      } else if (this.currentAdmin == undefined) {
        this.http.post<void>(`${this.baseUrl}/api/v1/admin/conference/${data.id}/disappointadmin`, this.httpOptions).subscribe()
      }
      this.toPage(`/conference/${data.id}`)
    });
  }

  updateSections(event: Event, name: string, section: Section) {
    this.sectionsMap.delete(section.title)
    this.sectionsMap.delete(' ')
    let org: string = '';
    let user: string = '';
    if (name == 'user') {
      user = (event.target as HTMLInputElement).value;
      section.leaderName = user;
    }
    if (name == 'org') {
      org = (event.target as HTMLInputElement).value;
      section.title = org
    }
    this.sectionsMap.set(section.title, section)
    this.sections = []
    for (let value of this.sectionsMap.values()) {
      this.sections.push(value)
    }
    this.sections = this.sections.sort((a, b) => a.id > b.id ? 1 : 0)
  }

  updateAdmin(event: Event) {
    let adminName: string = (event.target as HTMLOptionElement).value;
    this.currentAdmin = this.admins.find((e) => e.fullName === adminName);
  }

  addRowForSection() {
    let section: Section = new Section();
    section.title = '';
    section.leaderName = '';
    this.sectionsMap.set(' ', section)
    this.sections = []
    for (let value of this.sectionsMap.values()) {
      this.sections.push(value)
    }
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

  toPage(link: string) {
    this.router.navigate([link]);
  }
}
