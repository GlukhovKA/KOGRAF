import { Conference } from "./conference";
import { User } from "./user";

export class Section {
    private _id!: bigint;
    private _title!: string;
    private _users!: User[];
    private _conference!: Conference[];
}