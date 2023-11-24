export class Comment {
    constructor(
        public id?: number,
        public job: string, // model Job
        public user: string, // model User
        public comment: string,
        public dateTime: string
    ) {}
}