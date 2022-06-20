export class ElectionInfoPerCircuitDTO {
  electionId: number;
  circuitInfo: CircuitRangeInfoDTO[];

  constructor(electionId: number, rangeSpace: number, circuitInfo: CircuitInfoDTO[]) {
    this.electionId = electionId;
    this.circuitInfo = this.convertToRange(rangeSpace, circuitInfo);
  }

  private convertToRange(rangeSpace: number, circuitInfo: CircuitInfoDTO[]): CircuitRangeInfoDTO[] {
    let circuitRangeInfo: CircuitRangeInfoDTO[] = [];
    if (circuitInfo.length > 0) {
      let actualCircuitInfo = circuitInfo[0];
      let minAge = actualCircuitInfo.age;
      let maxAge = minAge + rangeSpace - 1;
      let circuitRange = new CircuitRangeInfoDTO(actualCircuitInfo.circuitId, []);
      circuitRangeInfo.push(circuitRange);
      let ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
      let male = new GenderInfoDTO("Male", 0, 0);
      let female = new GenderInfoDTO("Female", 0, 0);
      for (let element of circuitInfo) {
        let maleVoters = 0;
        let maleVotes = 0;
        let femaleVoters = 0;
        let femaleVotes = 0;
        if (element.age <= maxAge && element.age >= minAge && element.circuitId == actualCircuitInfo.circuitId) {
          if (element.gender == "Male") {
            maleVoters = element.voters;
            maleVotes = element.votes;
            male.voters += element.voters;
            male.votes += element.votes;
          } else {
            femaleVoters = element.voters;
            femaleVotes = element.votes;
            female.voters += element.voters;
            female.votes += element.votes;
          }
        } else {
          if (element.circuitId == actualCircuitInfo.circuitId) {
            ageInfo.genderInfo.push(male);
            ageInfo.genderInfo.push(female);
            let circuitRange = circuitRangeInfo[circuitRangeInfo.length - 1];
            circuitRange.ageInfo.push(ageInfo);

            male = new GenderInfoDTO("Male", 0, 0);
            female = new GenderInfoDTO("Female", 0, 0);
            minAge = element.age;
            maxAge = minAge + rangeSpace - 1;
            ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
          } else {
            female.voters -= femaleVoters;
            female.votes -= femaleVotes;
            male.voters -= maleVoters;
            male.votes -= maleVotes;
            ageInfo.genderInfo.push(male);
            ageInfo.genderInfo.push(female);
            let circuitRange = circuitRangeInfo[circuitRangeInfo.length - 1];
            circuitRange.ageInfo.push(ageInfo);

            minAge = element.age;
            maxAge = minAge + rangeSpace - 1;

            circuitRange = new CircuitRangeInfoDTO(element.circuitId, []);
            ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
            male = new GenderInfoDTO("Male", maleVoters, maleVotes);
            female = new GenderInfoDTO("Female", femaleVoters, femaleVotes);
            ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
            circuitRangeInfo.push(circuitRange);
            actualCircuitInfo = element;
          }
        }
      }
      ageInfo.genderInfo.push(male);
      ageInfo.genderInfo.push(female);
      let finalCircuitRange = circuitRangeInfo[circuitRangeInfo.length - 1];
      finalCircuitRange.ageInfo.push(ageInfo);
    }
    return circuitRangeInfo;
  }
}

export class CircuitInfoDTO {
  circuitId: number;
  voters: number;
  votes: number;
  age: number;
  gender: string;

  constructor(circuitId: number, voters: number, votes: number, age: number, gender: string) {
    this.circuitId = circuitId;
    this.voters = voters;
    this.votes = votes;
    this.age = age;
    this.gender = gender;
  }
}

export class CircuitRangeInfoDTO {
  circuitId: number;
  ageInfo: AgeInfoDTO[];

  constructor(circuitId: number, ageInfo: AgeInfoDTO[]) {
    this.circuitId = circuitId;
    this.ageInfo = ageInfo;
  }
}

export class AgeInfoDTO {
  age: string;
  genderInfo: GenderInfoDTO[];

  constructor(age: string, genderInfo: GenderInfoDTO[]) {
    this.age = age;
    this.genderInfo = genderInfo;
  }
}

export class GenderInfoDTO {
  gender: string;
  voters: number;
  votes: number;

  constructor(gender: string, voters: number, votes: number) {
    this.gender = gender;
    this.voters = voters;
    this.votes = votes;
  }
}
