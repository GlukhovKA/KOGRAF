import { Conference } from "./conference";
import { Job } from "./job";
import { Section } from "./section";

export class User {

    private _id!: bigint;
    private _fullName!: string;
    private _phone!: string;
    private _email!: string;
    private _organization!: string;
    private _academicDegree!: string;
    private _academicTitle!: string;
    private _orcId!: string;
    private _rincId!: string;
    private _conferences!: Conference[];
    private _sections!: Section[];
    private _jobs!: Job[];
    private _profilePicture!: string;
    private _role!: string;
    private _status!: string;

  constructor(fullName: string, phone: string) {
    this._fullName = fullName;
    this._phone = phone;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get profilePicture(): string {
    return this._profilePicture;
  }

  set profilePicture(value: string) {
    this._profilePicture = value;
  }

  get jobs(): Job[] {
    return this._jobs;
  }

  set jobs(value: Job[]) {
    this._jobs = value;
  }

  get sections(): Section[] {
    return this._sections;
  }

  set sections(value: Section[]) {
    this._sections = value;
  }

  get conferences(): Conference[] {
    return this._conferences;
  }

  set conferences(value: Conference[]) {
    this._conferences = value;
  }

  get rincId(): string {
    return this._rincId;
  }

  set rincId(value: string) {
    this._rincId = value;
  }

  get orcId(): string {
    return this._orcId;
  }

  set orcId(value: string) {
    this._orcId = value;
  }

  get academicTitle(): string {
    return this._academicTitle;
  }

  set academicTitle(value: string) {
    this._academicTitle = value;
  }

  get academicDegree(): string {
    return this._academicDegree;
  }

  set academicDegree(value: string) {
    this._academicDegree = value;
  }

  get organization(): string {
    return this._organization;
  }

  set organization(value: string) {
    this._organization = value;
  }

  get id(): bigint {
    return this._id;
  }

  set id(value: bigint) {
    this._id = value;
  }

  get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }
  
}
