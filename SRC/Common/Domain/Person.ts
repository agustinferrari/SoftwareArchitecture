export class Person {
  constructor(personJSON: any) {
    this.ci = personJSON.ci;
    this.name = personJSON.name;
    this.lastName = personJSON.lastName;
    this.gender = personJSON.gender;
    this.birthday = personJSON.birthday;
  }
  ci: string;
  name: string;
  lastName: string;
  gender: string;
  birthday: Date;
}
