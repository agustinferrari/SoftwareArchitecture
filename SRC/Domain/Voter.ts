import {Person} from './Person'
export interface Voter extends Person {
  residency: string;
  circuitId: number;
  phone: string;
  email: string;
}
