import { Conference } from "./conference";
import { User } from "./user";

export class Section {
    private _id!: bigint;
    private _title!: string;
    private _users!: User[];
    private _conference!: Conference[];

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

    get users(): User[] {
        return this._users;
    }
    
    set users(value: User[]) {
        this._users = value;
    }

    get conference(): Conference[] {
        return this._conference;
    }
    
    set conference(value: Conference[]) {
        this._conference = value;
    }
}