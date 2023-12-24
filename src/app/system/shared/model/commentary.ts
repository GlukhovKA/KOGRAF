
export class Commentary {
    private _id!: bigint;
    private _jobId!: bigint;
    private _userId!: bigint;
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

      get jobId(): bigint {
        return this._jobId;
      }
    
      set jobId(value: bigint) {
        this._jobId = value;
      }

      get userId(): bigint {
        return this._userId;
      }
    
      set userId(value: bigint) {
        this._userId = value;
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