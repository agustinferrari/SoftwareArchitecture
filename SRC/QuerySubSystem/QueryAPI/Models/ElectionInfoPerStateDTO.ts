export class ElectionInfoPerStateDTO {
  electionId: number;
  stateInfo: StateRangeInfoDTO[];

  constructor(electionId: number, rangeSpace: number, stateInfo: StateInfoDTO[]) {
    this.electionId = electionId;
    this.stateInfo = this.convertToRange(rangeSpace, stateInfo);
  }

  private convertToRange(rangeSpace: number, stateInfo: StateInfoDTO[]): StateRangeInfoDTO[] {
    let stateRangeInfo: StateRangeInfoDTO[] = [];
    if (stateInfo.length > 0) {
      let actualStateInfo = stateInfo[0];
      let minAge = actualStateInfo.age;
      let maxAge = minAge + rangeSpace - 1;
      console.log(actualStateInfo);
      let stateRange = new StateRangeInfoDTO(actualStateInfo.stateName, []);
      stateRangeInfo.push(stateRange);
      let ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
      let male = new GenderInfoDTO("Male", 0, 0);
      let female = new GenderInfoDTO("Female", 0, 0);
      for (let element of stateInfo) {
        let maleVoters = 0;
        let maleVotes = 0;
        let femaleVoters = 0;
        let femaleVotes = 0;
        if (element.age <= maxAge && element.age >= minAge && element.stateName == actualStateInfo.stateName) {
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
          if (element.stateName == actualStateInfo.stateName) {
            ageInfo.genderInfo.push(male);
            ageInfo.genderInfo.push(female);
            let stateRange = stateRangeInfo[stateRangeInfo.length - 1];
            stateRange.ageInfo.push(ageInfo);

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
            let stateRange = stateRangeInfo[stateRangeInfo.length - 1];
            stateRange.ageInfo.push(ageInfo);

            minAge = element.age;
            maxAge = minAge + rangeSpace - 1;

            stateRange = new StateRangeInfoDTO(element.stateName, []);
            ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
            male = new GenderInfoDTO("Male", maleVoters, maleVotes);
            female = new GenderInfoDTO("Female", femaleVoters, femaleVotes);
            ageInfo = new AgeInfoDTO(`${minAge}-${maxAge}`, []);
            stateRangeInfo.push(stateRange);
            actualStateInfo = element;
          }
        }
      }
      ageInfo.genderInfo.push(male);
      ageInfo.genderInfo.push(female);
      let finalCircuitRange = stateRangeInfo[stateRangeInfo.length - 1];
      finalCircuitRange.ageInfo.push(ageInfo);
    }
    return stateRangeInfo;
  }
}

export class StateRangeInfoDTO {
  stateName: string;
  ageInfo: AgeInfoDTO[];

  constructor(stateName: string, ageInfo: AgeInfoDTO[]) {
    this.stateName = stateName;
    this.ageInfo = ageInfo;
  }
}

export class StateInfoDTO {
  stateName: string;
  voters: number;
  votes: number;
  age: number;
  gender: string;

  constructor(stateName: string, voters: number, votes: number, age: number, gender: string) {
    this.stateName = stateName;
    this.voters = voters;
    this.votes = votes;
    this.age = age;
    this.gender = gender;
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
