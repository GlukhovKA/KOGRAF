import { Conference } from "./conference";
import { Section } from "./section";
import { User } from "./user";
import { Commentary } from "./commentary";

export class Job {
    private _id!: bigint;
    private _title!: string;
    private _description!: string;
    private _coAuthors!: string;
    private _user!: User;
    private _conference!: Conference;
    private _section!: Section;
    private _comments!: Commentary[];
    private _dateTime!: string;
    private _sourceFile!: string;

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

    get description(): string {
        return this._description;
    }
    
    set description(value: string) {
        this._description = value;
    }

    get coAuthors(): string {
        return this._coAuthors;
    }
    
    set coAuthors(value: string) {
        this._coAuthors = value;
    }

    get user(): User {
        return this._user;
    }
    
    set user(value: User) {
        this._user = value;
    }

    get conference(): Conference {
        return this._conference;
    }
    
    set conference(value: Conference) {
        this._conference = value;
    }

    get section(): Section {
        return this._section;
    }
    
    set section(value: Section) {
        this._section = value;
    }

    get comments(): Commentary[] {
        return this._comments;
    }
    
    set comments(value: Commentary[]) {
        this._comments = value;
    }

    get dateTime(): string {
        return this._dateTime;
    }
    
    set dateTime(value: string) {
        this._dateTime = value;
    }

    get sourceFile(): string {
        return this._sourceFile;
    }
    
    set sourceFile(value: string) {
        this._sourceFile = value;
    }
}