import { Job } from "./job";
import { User } from "./user";

export class Commentary {
    private _id!: bigint;
    private _job!: Job;
    private _user!: User;
    private _message!: string;
    private _dateTime!: string;

    constructor() {
      }

      get id(): bigint {
        return this._id;
      }
    
      set id(value: bigint) {
        this._id = value;
      }

      get job(): Job {
        return this._job;
      }
    
      set job(value: Job) {
        this._job = value;
      }

      get user(): User {
        return this._user;
      }
    
      set user(value: User) {
        this._user = value;
      }

      get message(): string {
        return this._message;
      }
    
      set message(value: string) {
        this._message = value;
      }
    
      get dateTime(): string {
        return this._dateTime;
      }
    
      set dateTime(value: string) {
        this._dateTime = value;
      }
}