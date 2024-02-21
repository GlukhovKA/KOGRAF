import {User} from "../model/user";
import {firstValueFrom} from "rxjs";
import {Conference} from "../model/conference";
import {Section} from "../model/section";
import {AppConstants} from "../../../app.module";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Job} from "../model/job";

@Injectable({providedIn: 'root'})
export class HttpService {

  private baseUrl: string = AppConstants.baseURL;

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        // @ts-ignore
        //'Authorization': sessionStorage.getItem('user') != null ? JSON.parse(sessionStorage.getItem('user')).token : ''
      }
    )
  }

  //this.httpOptions.headers.set('Authorization', this.loggedUser != null ? this.loggedUser.token : '')

  constructor(private http: HttpClient) {
  }

  async getAdmins(): Promise<User[]> {
    return await firstValueFrom(this.http.get<User[]>(`${this.baseUrl}/api/v1/admin/user/getAdmins`, this.httpOptions));
  }

  async getUsers(): Promise<User[]> {
    return await firstValueFrom(this.http.get<User[]>(`${this.baseUrl}/api/v1/admin/getAllUsers`, this.httpOptions));
  }

  async getUserInfo(email: string): Promise<User> {
    return await firstValueFrom(this.http.get<User>(`${this.baseUrl}/api/v1/member/getUser?email=${email}`, this.httpOptions));
  }

  async changeUserRole(id: string, role: string): Promise<boolean> {
    return await firstValueFrom(this.http.post<boolean>(`${this.baseUrl}/api/v1/admin/user/appointrole?userId=${id}&role=${role}`, this.httpOptions));
  }

  async changeUserStatus(id: string, status: string): Promise<boolean> {
    return await firstValueFrom(this.http.post<boolean>(`${this.baseUrl}/api/v1/admin/user/changestatus?userId=${id}&status=${status}`, this.httpOptions));
  }

  async getConferenceUsers(id: string): Promise<number> {
    return await firstValueFrom(this.http.get<number>(`${this.baseUrl}/api/v1/admin/conference/${id}/users`, this.httpOptions));
  }

  async getConferenceJobs(id: string): Promise<Job[]> {
    return await firstValueFrom(this.http.get<Job[]>(`${this.baseUrl}/api/v1/admin/jobs/${id}`, this.httpOptions));
  }

  async getUserJobs(id: string): Promise<Job[]> {
    return await firstValueFrom(this.http.get<Job[]>(`${this.baseUrl}/api/v1/member/jobs/${id}`, this.httpOptions));
  }

  async getConferences(): Promise<Conference[]> {
    return await firstValueFrom(this.http.get<Conference[]>(`${this.baseUrl}/api/v1/member/conferences`, this.httpOptions));
  }

  async getConference(id: string): Promise<Conference> {
    return await firstValueFrom(this.http.get<Conference>(`${this.baseUrl}/api/v1/member/conference/${id}`, this.httpOptions));
  }

  async getSections(id: string): Promise<Section[]> {
    return await firstValueFrom(this.http.get<Section[]>(`${this.baseUrl}/api/v1/member/conference/${id}/sections`, this.httpOptions));
  }

  async createConference(request: object): Promise<Conference> {
    return await firstValueFrom(this.http.post<Conference>(`${this.baseUrl}/api/v1/admin/conference/create`, JSON.stringify(request), this.httpOptions));
  }

  async updateConference(id: string, request: object): Promise<Conference> {
    return await firstValueFrom(this.http.put<Conference>(`${this.baseUrl}/api/v1/admin/conference/${id}/update`, JSON.stringify(request), this.httpOptions));
  }

  async appointAdminToConference(id: string, adminId: string): Promise<void> {
    return await firstValueFrom(this.http.post<void>(`${this.baseUrl}/api/v1/admin/conference/${id}/appointadmin?userId=${adminId}`, this.httpOptions));
  }

  async disAppointAdminFromConference(id: string): Promise<void> {
    return await firstValueFrom(this.http.post<void>(`${this.baseUrl}/api/v1/admin/conference/${id}/disappointadmin`, this.httpOptions));
  }

  async uploadFile(formData: FormData): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/v1/files/uploadFile`, formData));
  }

  async uploadFiles(formData: FormData): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/v1/files/uploadMultipleFiles`, formData));
  }

  async downloadFile(fileName: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.baseUrl}/api/v1/files/downloadFile/${fileName}`, {
      observe: 'response',
      responseType: 'blob'
    }));
  }

  async downloadFiles(id: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.baseUrl}/api/v1/files/downloadFiles/${id}`, {
      observe: 'response',
      responseType: 'blob'
    }));
  }
}
