import { Job } from "./job";
import { User } from "./user";

export class Commentary {
    private _id!: bigint;
    private _job!: Job;
    private _user!: User;
    private message!: string;;
    private dateTime!: string;;
}