import { Section } from "./section";
import { User } from "./user";

export class Conference {
    private _id!: bigint;
    private _title!: string;
    private _organization!: string;
    private _sections!: Section[];
    private _status!: string;
    private _users!: User[];
    private _countUsers!: number;
    private _startDate!: string;
    private _endDate!: string;
    
    constructor() {
    }

    get id(): bigint {
        return this._id;
    }
    
    set id(value: bigint) {
        this._id = value;
    }

    get title(): string {
        return this._title;
    }
    
    set title(value: string) {
        this._title = value;
    }

    get organization(): string {
        return this._organization;
    }
    
    set organization(value: string) {
        this._organization = value;
    }

    get sections(): Section[] {
        return this._sections;
    }
    
    set sections(value: Section[]) {
        this._sections = value;
    }

    get status(): string {
        return this._status;
    }
    
    set status(value: string) {
        this._status = value;
    }

    get users(): User[] {
        return this._users;
    }
    
    set users(value: User[]) {
        this._users = value;
    }

    get countUsers(): number {
        return this._countUsers;
    }

    set countUsers(value: number) {
        this._countUsers = value;
    }

    get startDate(): string {
        return this._startDate;
    }
    
    set startDate(value: string) {
        this._startDate = value;
    }

    get endDate(): string {
        return this._endDate;
    }
    
    set endDate(value: string) {
        this._endDate = value;
    }
    
    
}

