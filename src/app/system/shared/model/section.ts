
export class Section {
    private _id!: bigint;
    private _title!: string;
    private _leaderName!: string;
    private _conferenceId!: bigint;

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

    get leaderName(): string {
        return this._leaderName;
    }
    
    set leaderName(value: string) {
        this._leaderName = value;
    }

    get conferenceId(): bigint {
        return this._conferenceId;
    }
    
    set conferenceId(value: bigint) {
        this._conferenceId = value;
    }
}