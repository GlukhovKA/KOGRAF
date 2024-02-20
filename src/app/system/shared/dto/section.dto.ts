import {Section} from "../model/section";

export class SectionDto {
  private id!: bigint;
  private title!: string;
  private leaderName!: string;
  private conferenceId!: bigint;

  constructor(section: Section) {
    this.id = section.id
    this.title = section.title
    this.leaderName = section.leaderName
    this.conferenceId = section.conferenceId
  }

  getId(): bigint {
    return this.id;
  }

  setId(value: bigint) {
    this.id = value;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(value: string) {
    this.title = value;
  }

  getLeaderName(): string {
    return this.leaderName;
  }

  setLeaderName(value: string) {
    this.leaderName = value;
  }

  getConferenceId(): bigint {
    return this.conferenceId;
  }

  setConferenceId(value: bigint) {
    this.conferenceId = value;
  }
}
