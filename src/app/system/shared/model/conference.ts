import { ConferenceStatus } from "./conferenceStatus";
import { Section } from "./section";
import { User } from "./user";

export class Conference {
    private _id!: bigint;
    private _title!: string;
    private _organization!: string;
    private _sections!: Section[];
    private _status!: ConferenceStatus;
    private _users!: User[];
    private _startDate!: string;
    private _endDate!: string;
    
}

