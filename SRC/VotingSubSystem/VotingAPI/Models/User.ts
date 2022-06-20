export class UserDTO {
  email: string;
  role: string;
  ci: string;

  constructor(email: string, ci: string, role: string) {
    this.email = email;
    this.role = role;
    this.ci = ci;
  }
}
