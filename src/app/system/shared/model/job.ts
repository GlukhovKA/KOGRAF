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
}