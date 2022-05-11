import {Voter} from './Voter';
import {Candidate} from './Candidate';
import {Party} from './Party';
import {Circuit} from './Circuit';

export interface Election {
      id: number;
      description: string;
      startDate: string;
      endDate: string;
      mode: Enumerator;
      voters: Voter[];
      candidates: Candidate[];
      parties: Party[];
      circuits: Circuit[];
}